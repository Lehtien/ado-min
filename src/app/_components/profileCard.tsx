"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { type z } from "zod";
import { type postSchema } from "~/server/api/routers/post";
import Link from "next/link";

type PostSchemaType = z.infer<typeof postSchema>;

export default function ProfileCard(latestPost: PostSchemaType) {
  const [isClient, setIsClient] = useState(false);
  const [isOpened, setIsOpened] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // または loading indicator
  }

  return (
    <div className="relative w-[300px] rounded-lg bg-[#CFBDE4] p-4 shadow-lg">
      <div
        className={`${isOpened ? "h-auto" : "h-[200px]"} relative overflow-hidden rounded-lg p-4 text-center text-[#312448] transition-[height] duration-500`}
      >
        <Image
          src="/images/rose_blue.png"
          alt="Rose Blue"
          width={340}
          height={500}
          className="absolute -left-4 top-[230px] opacity-15"
        />

        <div className="mb-2 flex justify-evenly gap-4">
          <div className="text-center">
            <p className="font-bold">お名前</p>
            <p>{latestPost.name}</p>
          </div>
          <div className="text-center">
            <p className="font-bold">X(Twitter) アカウント</p>
            <p className="underline">
              <Link
                href={`https://x.com/${encodeURIComponent(latestPost.account.replace("@", ""))}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {latestPost.account}
              </Link>
            </p>
          </div>
        </div>
        <div className="mb-2 flex justify-evenly gap-4">
          <div className="text-center">
            <p className="font-bold">性別</p>
            <p>{latestPost.gender}</p>
          </div>
          <div className="text-center">
            <p className="font-bold">年齢</p>
            <p>{latestPost.age}</p>
          </div>
          <div>
            <p className="font-bold">居住地</p>
            <p>{latestPost.area}</p>
          </div>
        </div>
        <div className="mb-2">
          <p className="font-bold">好きな曲</p>
          <div>
            <p>
              <span>第1位: </span>
              <span> {latestPost.likeMusic1} </span>
            </p>
            <p>
              <span>第2位: </span>
              <span> {latestPost.likeMusic2} </span>
            </p>
            <p>
              <span>第3位: </span>
              <span> {latestPost.likeMusic3} </span>
            </p>
          </div>
        </div>
        <div className="mb-2">
          <p className="font-bold">Adoの好きなところ</p>
          <p>{latestPost.likeAdo}</p>
        </div>
        <div className="mb-2">
          <p className="font-bold">参加したライブ・参加予定のライブ</p>
          <p>{latestPost.live}</p>
        </div>
        <div className="mb-2">
          <p className="font-bold">自由記入欄</p>
          <p>{latestPost.freeSpace}</p>
        </div>
      </div>
      {/* グラデーションオーバーレイ */}
      <div
        className={`absolute inset-0 rounded bg-gradient-to-b from-transparent to-white transition-opacity duration-500 ${isOpened ? "pointer-events-none opacity-0" : "opacity-100"} `}
      />
      {/* 開閉ボタン */}
      <button
        onClick={() => setIsOpened(!isOpened)}
        className={`relative z-10 mx-6 mt-2 block w-[calc(100%-3rem)] rounded-lg bg-[#464A88] px-4 py-3 font-bold text-white shadow-[0_2px_0_2px_#aaa] transition-all duration-200 hover:bg-[#233B6C] active:translate-y-[2px] active:shadow-none`}
      >
        {isOpened ? "閉じる" : "開く"}
      </button>
    </div>
  );
}
