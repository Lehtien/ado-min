"use client";

import { api } from "~/trpc/react";
import ProfileCard from "../_components/profileCard";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Profile() {
  const { data: latestPost } = api.post.getLatest.useQuery();
  const [imageData, setImageData] = useState<string | undefined>(undefined);
  const capture = api.screenshot.capture.useMutation({
    onSuccess: (data) => {
      setImageData(data.image);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return (
    <>
      <nav className="p-4 text-right">
        <Link href="/" className="text-center text-[#5c4390] underline">
          Home
        </Link>
      </nav>
      {latestPost ? (
        <div className="flex justify-center" id="profile">
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
          className="rounded bg-[#5c4390] px-4 py-2 text-center text-white"
        >
          Edit Profile
        </Link>
      </nav>

      {latestPost && (
        <>
          <button
            className="mx-auto flex rounded bg-[#5c4390] px-4 py-2 text-white"
            onClick={() => {
              capture.mutate({
                selector: "#profile",
              });
            }}
            disabled={capture.isPending}
          >
            {capture.isPending ? "キャプチャ中..." : "プロフィールを撮影"}
          </button>
          {imageData && (
            <Image
              src={imageData || ""}
              alt="Captured component"
              layout="responsive"
              width={500}
              height={300}
            />
          )}
        </>
      )}
    </>
  );
}
