import Link from "next/link";
import { LatestPost } from "~/app/_components/post";
import { getServerAuthSession } from "~/server/auth";

const isDevelopment = process.env.NODE_ENV === "development";

export default async function Profile() {
  const session = await getServerAuthSession();
  const devSession = isDevelopment
    ? { user: { name: "Dev User", email: "dev@example.com" } }
    : null;

  // 実際のセッションまたは開発モードのデフォルトセッションを使用
  const effectiveSession = session ?? devSession;

  return (
    <div className="bg-[#6f51a1]">
      <nav className="p-4 text-right">
        <Link href="/" className="text-center text-[#5c4390] underline">
          Home
        </Link>
      </nav>
      <div className="m-auto w-[340px] rounded bg-[#CFBDE4] p-10">
        {effectiveSession?.user && <LatestPost />}
      </div>
    </div>
  );
}
