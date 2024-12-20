"use client";

import React, { use, useEffect, useState } from "react";
import Items, { type CheckboxItem } from "../../_components/Items";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RAFFLE_STATUSES, type RaffleStatus } from "../../../constants/raffle";
import ShareButton from "~/app/_components/XShare";

export default function SiitaRaffleV0Edit() {
  const [xid, setXid] = useState("");
  const [status, setStatus] = useState<RaffleStatus>("OPEN");
  const [giveItems, setGiveItems] = useState<CheckboxItem[][]>([]);
  const [wantItems, setWantItems] = useState<CheckboxItem[][]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const createRaffleMutation = api.raffleV0.create.useMutation({
    onSuccess: () => {
      setIsSubmitting(false);
      alert("保存に成功しました");
      router.push("/siita-raffle-v0");
      router.refresh(); // ページを強制的に再読み込み
    },
    onError: (error) => {
      setIsSubmitting(false);
      console.error(error);
      alert("保存に失敗しました");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

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

    createRaffleMutation.mutate({
      xid: xid.trim(),
      status: status,
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
    setStatus(e.target.value as "OPEN" | "CLOSED" | "ADJUSTING");
  };

  const giveItemsText = giveItems
    .flat()
    .filter((item) => item.checked)
    .map((item) => `・${item.label}`)
    .join("\n");
  const wantItemsText = wantItems
    .flat()
    .filter((item) => item.checked)
    .map((item) => `・${item.label}`)
    .join("\n");
  const xText = `ファントムシータ LARME fes vol.1 出演記念 ラッフル くじ RAFFLE
  譲)
  ${giveItemsText}
  求)
  ${wantItemsText}
  #ファントムシータ
  #LARMEfes
  `;

  const {
    data: LatestRaffleV0,
    isLoading,
    error,
    refetch,
  } = api.raffleV0.getLatest.useQuery(undefined, {
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    console.log("Effect triggered. LatestRaffleV0:", LatestRaffleV0);
    if (LatestRaffleV0) {
      setXid(LatestRaffleV0.xid);
      setStatus(LatestRaffleV0.status);

      setGiveItems(
        LatestRaffleV0.give.map((item, index) => [
          { id: `give-${index}`, label: item, checked: true },
        ]),
      );
      setWantItems(
        LatestRaffleV0.want.map((item, index) => [
          { id: `want-${index}`, label: item, checked: true },
        ]),
      );
    } else {
      setGiveItems([]);
      setWantItems([]);
    }
    return () => {
      console.log("Effect cleanup");
      setGiveItems([]);
      setWantItems([]);
    };
  }, [LatestRaffleV0]);

  useEffect(() => {
    return () => {
      // 必要に応じてデータをリフェッチ
      void refetch();
    };
  }, [refetch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.error("Failed to fetch latest raffle:", error);
    return <div>{error.message}</div>;
  }

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
            <Items name="give" onChange={setGiveItems} item={giveItems} />
          </div>
          <div className="mt-8 md:mt-0">
            <h1 className="text-xl font-bold">・求めるもの</h1>
            <Items name="want" onChange={setWantItems} item={wantItems} />
          </div>
        </div>
        <div className="mt-8 text-center">
          <ShareButton
            text={xText}
            url="https://ado-min.vercel.app/siita-raffle-v0"
          />
        </div>
        <div className="my-8 flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            保存する
          </button>
        </div>
      </form>
    </div>
  );
}
