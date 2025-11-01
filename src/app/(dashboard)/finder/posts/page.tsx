"use client";

import { useState } from "react";
import { PostsView } from "../_components/views/posts-view";
import { CreatePostModal } from "../_components/create-post-modal";

export default function PostsPage() {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePostCreated = () => {
    setShowCreatePost(false);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <>
      <PostsView
        key={refreshKey}
        onCreatePost={() => setShowCreatePost(true)}
      />
      {showCreatePost && (
        <CreatePostModal
          onClose={() => setShowCreatePost(false)}
          onSuccess={handlePostCreated}
        />
      )}
    </>
  );
}
