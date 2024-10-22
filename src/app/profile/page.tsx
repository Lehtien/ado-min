"use client";

import { api } from "~/trpc/react";
import ProfileCard from "../_components/profileCard";
import Link from "next/link";

export default function Profile() {
  const { data: latestPost } = api.post.getLatest.useQuery();
  return (
    <>
      <nav className="p-4 text-right">
        <Link href="/" className="text-center text-[#5c4390] underline">
          Home
        </Link>
      </nav>
      {latestPost ? (
        <div className="flex justify-center">
          <ProfileCard {...latestPost} />
        </div>
      ) : (
        <div className="text-center">
          <p>プロフィールがありません</p>
          <p>以下より登録をお願いします</p>
        </div>
      )}
      <nav className="p-4 text-center">
        <Link
          href="/profile/edit"
          className="text-center text-[#5c4390] underline"
        >
          Edit Profile
        </Link>
      </nav>
    </>
  );
}
