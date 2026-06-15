import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkSession } from "./lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const authRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const cookieStore = await cookies();

  let accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const { pathname } = request.nextUrl;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  const response = NextResponse.next();

  if (!accessToken && refreshToken) {
    try {
      const sessionResponse = await checkSession();

      const setCookie = sessionResponse.headers["set-cookie"];

      if (setCookie) {
        response.headers.set("set-cookie", setCookie);

        accessToken = "new-token";
      }
    } catch {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  if (isPrivateRoute && !accessToken) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
