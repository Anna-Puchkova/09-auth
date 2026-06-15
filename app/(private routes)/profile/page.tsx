import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import css from "./ProfilePage.module.css";
import { getMe } from "@/lib/api/serverApi";

export const metadata: Metadata = {
  title: "Profile",
  description: "User profile page",
};

export default async function ProfilePage() {
  const user = await getMe();

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1>Profile Page</h1>

        <Image src={user.avatar} alt="User avatar" width={120} height={120} />

        <p>Username: {user.username}</p>
        <p>Email: {user.email}</p>

        <Link href="/profile/edit">Edit profile</Link>
      </div>
    </main>
  );
}
