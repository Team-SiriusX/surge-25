"use client";

import { useState } from "react";
import { Dashboard } from "./_components/dashboard";
import { CreatePostModal } from "./_components/create-post-modal";

export default function Home() {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePostCreated = () => {
    setShowCreatePost(false);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <main className="min-h-screen bg-background">
      <Dashboard
        key={refreshKey}
        onCreatePost={() => setShowCreatePost(true)}
      />
      {showCreatePost && (
        <CreatePostModal
          onClose={() => setShowCreatePost(false)}
          onSuccess={handlePostCreated}
        />
      )}
    </main>
  );
}
