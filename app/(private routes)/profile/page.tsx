"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import css from "./ProfilePage.module.css";
import { getMe } from "@/lib/api/clientApi";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const data = await getMe();
      setUser(data);
    };

    load();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1>Profile Page</h1>

        <Image src={user.avatar} alt="avatar" width={120} height={120} />

        <p>Username: {user.username}</p>
        <p>Email: {user.email}</p>
      </div>
    </main>
  );
}
