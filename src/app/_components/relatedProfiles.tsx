"use client";

import { api } from "~/trpc/react";
import ProfileCard from "./profileCard";

export default function RelatedProfiles() {
  const { data: latestPost } = api.post.getLatest.useQuery();
  const { data: relatedProfiles } = api.post.getFilteredPosts.useQuery(
    {
      likeMusic1: latestPost?.likeMusic1 ?? "",
      likeMusic2: latestPost?.likeMusic2 ?? "",
      likeMusic3: latestPost?.likeMusic3 ?? "",
    },
    {
      // latestPostがない場合はクエリを無効化
      enabled: !!latestPost,
    },
  );

  if (!latestPost || !relatedProfiles) {
    return <div></div>;
  }
  return (
    <div className="flex gap-2">
      {relatedProfiles?.map((profile) => (
        <div key={profile.id} className="mb-4">
          <ProfileCard {...profile} />
        </div>
      ))}
    </div>
  );
}
