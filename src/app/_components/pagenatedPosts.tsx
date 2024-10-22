"use client";

import { api } from "~/trpc/react";
import ProfileCard from "./profileCard";

export default function PagenatedPosts() {
  const { data } = api.post.getPaginatedPosts.useQuery({
    cursor: 0,
  });

  return (
    <div className="flex flex-wrap gap-2">
      {data?.items.map((post) => (
        <div key={post.id} className="mb-4">
          <ProfileCard {...post} />
        </div>
      ))}
    </div>
  );
}
