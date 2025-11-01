"use client";

import { useParams } from "next/navigation";
import { PostDetailView } from "../../_components/views/post-detail-view";

export default function PostPage() {
  const params = useParams();
  const postId = params.id as string;

  return <PostDetailView postId={postId} />;
}
