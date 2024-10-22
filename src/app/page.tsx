import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import PagenatedPosts from "./_components/pagenatedPosts";
import RelatedProfiles from "./_components/relatedProfiles";
import { api } from "~/trpc/server";

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
      <main className="min-h-screen min-w-[320px] bg-gradient-to-b from-[#2e026d] to-[#ad73ff] text-white">
        <div className="flex items-center justify-end">
          <div>
            <Link href="/profile" className="text-blue-300 underline">
              Profile
            </Link>
          </div>
          <div>
            <div className="p-3">
              <Link
                href={
                  effectiveSession ? "/api/auth/signout" : "/api/auth/signin"
                }
                className="rounded-md bg-white px-4 py-2 font-semibold text-[#2e026d] no-underline transition hover:bg-white/20"
              >
                {effectiveSession ? "Sign out" : "Sign in"}
              </Link>
            </div>
          </div>
          {isDevelopment && !effectiveSession && (
            <p className="text-sm text-yellow-300">
              Auto-signed in for development. Sign in/out disabled.
            </p>
          )}
        </div>

        <div>
          <p className="mt-2 text-center">Adoのファンのための</p>
          <h1 className="mb-6 mt-2 text-center text-2xl font-bold">
            Ado民 プロフィール
          </h1>
        </div>

        <div className="min-h-[100px]">
          <h2 className="mb-2 ml-4 text-xl font-bold">
            関連のあるプロフィール
          </h2>
          <div>
            <div className="mx-4 overflow-y-scroll">
              <RelatedProfiles />
            </div>
          </div>
        </div>

        <div>
          <h2 className="mb-2 ml-4 text-xl font-bold">一覧</h2>
          <div className="mx-4">
            <PagenatedPosts />
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
