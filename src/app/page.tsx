import Link from "next/link";

import { LatestPost } from "~/app/_components/post";
import { getServerAuthSession } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

const isDevelopment = process.env.NODE_ENV === "development";

export default async function Home() {
  const session = await getServerAuthSession();

  void api.post.getLatest.prefetch();

  const devSession = isDevelopment
    ? { user: { name: "Dev User", email: "dev@example.com" } }
    : null;

  // 実際のセッションまたは開発モードのデフォルトセッションを使用
  const effectiveSession = session ?? devSession;

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-col items-center justify-center gap-4">
              <p className="text-center text-2xl text-white">
                {effectiveSession && (
                  <span>Logged in as {effectiveSession.user?.name}</span>
                )}
              </p>
              <Link
                href={
                  effectiveSession ? "/api/auth/signout" : "/api/auth/signin"
                }
                className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
              >
                {effectiveSession ? "Sign out" : "Sign in"}
              </Link>
            </div>
          </div>
          {isDevelopment && !session && (
            <p className="text-sm text-yellow-300">
              Auto-signed in for development. Sign in/out disabled.
            </p>
          )}

          {effectiveSession?.user && <LatestPost />}
        </div>
      </main>
    </HydrateClient>
  );
}
