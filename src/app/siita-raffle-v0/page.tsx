import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";
import { getRaffleStatusLabel } from "../../constants/raffle";

import { api } from "~/trpc/server";

export default async function SiitaRaffleV0() {
  const session = await getServerAuthSession();

  const PagenatedRaffleV0 = await api.raffleV0
    .getPaginatedRaffleV0({
      cursor: 0,
    })
    .catch((error) => {
      console.error("Failed to fetch paginated raffle:", error);
      return null;
    });

  const LatestRaffleV0 = await api.raffleV0.getLatest().catch((error) => {
    console.error("Failed to fetch latest raffle:", error);
    return null;
  });

  let FilterRaffleV0 = null;
  if (LatestRaffleV0) {
    FilterRaffleV0 = await api.raffleV0
      .getFilteredRaffleV0({
        give: LatestRaffleV0.give,
        want: LatestRaffleV0.want,
      })
      .catch((error) => {
        console.error("Failed to fetch filtered raffle:", error);
        return null;
      });
  }

  return (
    <main className="min-h-screen min-w-[320px] bg-gradient-to-b from-[#2e026d] to-[#ad73ff] text-white">
      <div className="flex items-center justify-end">
        <div>
          {session && (
            <Link
              href="/siita-raffle-v0/edit"
              className="text-blue-300 underline"
            >
              保存・編集
            </Link>
          )}
        </div>
        <div>
          <div className="p-3">
            <Link
              href={session ? "/api/auth/signout" : "/api/auth/signin"}
              className="rounded-md bg-white px-4 py-2 font-semibold text-[#2e026d] no-underline transition hover:bg-white/20"
            >
              {session ? "Sign out" : "Sign in"}
            </Link>
          </div>
        </div>
      </div>
      {LatestRaffleV0 && (
        <div className="flex justify-center">
          <div className="w-[320px]">
            <h1 className="text-center text-2xl font-bold">
              交換できそうな投稿:
            </h1>
            {FilterRaffleV0?.map((raffleV0) => (
              <ul className="m-2 rounded-xl border p-4" key={raffleV0.id}>
                <div className="flex justify-between">
                  <Link
                    href={`https://x.com/${encodeURIComponent(raffleV0.xid)}`}
                    className="underline"
                    target="_blank"
                  >
                    @{raffleV0.xid}
                  </Link>
                  <p>{getRaffleStatusLabel(raffleV0.status)}</p>
                </div>
                <p className="mt-2 font-bold">譲)</p>
                <li>
                  {raffleV0.give.map((item) => (
                    <p key={item}>・{item}</p>
                  ))}
                </li>
                <p className="font-bold">求)</p>
                <li>
                  {raffleV0.want.map((item) => (
                    <p key={item}>・{item}</p>
                  ))}
                </li>
              </ul>
            ))}
          </div>
        </div>
      )}
      {PagenatedRaffleV0 && (
        <div className="flex justify-center">
          <div className="w-[320px]">
            <h1 className="text-center text-2xl font-bold">一覧:</h1>
            <div className="mt-4">
              <div>
                {PagenatedRaffleV0.items.map((raffleV0) => (
                  <ul className="m-2 rounded-xl border p-4" key={raffleV0.id}>
                    <div className="flex justify-between">
                      <Link
                        href={`https://x.com/${encodeURIComponent(raffleV0.xid)}`}
                        className="underline"
                        target="_blank"
                      >
                        @{raffleV0.xid}
                      </Link>
                      <p>{getRaffleStatusLabel(raffleV0.status)}</p>
                    </div>
                    <p className="mt-2 font-bold">譲)</p>
                    <li>
                      {raffleV0.give.map((item) => (
                        <p key={item}>・{item}</p>
                      ))}
                    </li>
                    <p className="font-bold">求)</p>
                    <li>
                      {raffleV0.want.map((item) => (
                        <p key={item}>・{item}</p>
                      ))}
                    </li>
                  </ul>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
