"use client";

import { api } from "~/trpc/react";
import ProfileCard from "./profileCard";

export default function RelatedProfiles() {
  const [latestPost] = api.post.getLatest.useSuspenseQuery();

  if (!latestPost) {
    return null;
  }
  const [relatedProfiles] = api.post.getFilteredPosts.useSuspenseQuery({
    likeMusic1: latestPost.likeMusic1,
    likeMusic2: latestPost.likeMusic2,
    likeMusic3: latestPost.likeMusic3,
  });

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
