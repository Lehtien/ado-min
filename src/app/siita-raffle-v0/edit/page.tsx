"use client";

import React, { useState } from "react";
import Items, { type CheckboxItem } from "../../_components/Items";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RAFFLE_STATUSES } from "../../../constants/raffle";

export default function SiitaRaffleV0Edit() {
  const [xid, setXid] = useState("");
  const [status, setStatus] = useState("OPEN");
  const [giveItems, setGiveItems] = useState<CheckboxItem[][]>([]);
  const [wantItems, setWantItems] = useState<CheckboxItem[][]>([]);

  const router = useRouter();

  const createRaffleMutation = api.raffleV0.create.useMutation({
    onSuccess: () => {
      alert("保存に成功しました");
      router.push("/siita-raffle-v0");
    },
    onError: (error) => {
      console.error(error);
      alert("保存に失敗しました");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!xid.trim()) {
      alert("X(twitter)IDを入力してください");
      return;
    }

    const checkedGiveItems = giveItems
      .flat()
      .filter((item) => item.checked)
      .map((item) => item.label);

    const checkedWantItems = wantItems
      .flat()
      .filter((item) => item.checked)
      .map((item) => item.label);

    if (checkedGiveItems.length === 0 || checkedWantItems.length === 0) {
      alert("譲れるものと求めるものを少なくとも1つずつ選択してください");
      return;
    }

    createRaffleMutation.mutate({
      xid: xid.trim(),
      give: checkedGiveItems,
      want: checkedWantItems,
    });
  };

  const handleXidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // @を入力の先頭から削除
    const value = e.target.value.replace(/^@/, "");
    setXid(value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(e.target.value);
  };

  return (
    <div>
      <Link
        href="/siita-raffle-v0"
        className="my-4 block text-center text-2xl font-bold"
      >
        ファントムシータ Raffleくじ
      </Link>
      <form onSubmit={handleSubmit}>
        <div>
          <p className="mx-2">X(twitter)ID</p>
          <span className="ml-4">@</span>
          <input
            type="text"
            value={xid}
            onChange={handleXidChange}
            placeholder="X(twitter)ID"
            className="mx-1 w-1/3 rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            required
          />
        </div>
        <div className="ml-4 mt-6">
          {RAFFLE_STATUSES.map((item) => (
            <div key={item.value} className="flex items-center space-x-2">
              <input
                type="radio"
                id={item.value}
                value={item.value}
                checked={status === item.value}
                onChange={handleStatusChange}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor={item.value} className="text-sm font-medium">
                {item.label}
              </label>
            </div>
          ))}
        </div>
        <div className="md: mt-8 flex flex-wrap gap-2 md:justify-center">
          <div>
            <h1 className="text-xl font-bold">・譲れるもの</h1>
            <Items name="give" onChange={setGiveItems} />
          </div>
          <div className="mt-8 md:mt-0">
            <h1 className="text-xl font-bold">・求めるもの</h1>
            <Items name="want" onChange={setWantItems} />
          </div>
        </div>
        <div className="my-8 flex justify-center">
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            保存する
          </button>
        </div>
      </form>
    </div>
  );
}
