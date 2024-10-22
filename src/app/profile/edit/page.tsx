import Link from "next/link";
import { LatestPost } from "~/app/_components/post";

export default async function Profile() {
  return (
    <div className="bg-[#6f51a1]">
      <nav className="p-4 text-right">
        <Link href="/" className="text-center text-[#5c4390] underline">
          Home
        </Link>
      </nav>
      <div className="m-auto w-[340px] rounded bg-[#CFBDE4] p-10">
        <LatestPost />
      </div>
    </div>
  );
}
