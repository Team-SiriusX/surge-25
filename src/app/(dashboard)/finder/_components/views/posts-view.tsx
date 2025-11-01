"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PostCard } from "../post-card";
import { useGetJobs } from "../../_api";
import { $Enums } from "@/generated/prisma";
import { Zap } from "lucide-react";

export function PostsView({ onCreatePost }: { onCreatePost: () => void }) {
  const [activeFilter, setActiveFilter] = useState<"all" | $Enums.PostStatus>(
    "all"
  );

  const { data, isLoading } = useGetJobs({
    status: activeFilter === "all" ? undefined : activeFilter,
  });

  const posts = data?.data || [];

  const getCategoryColor = (type: string) => {
    const colors: Record<string, string> = {
      ACADEMIC_PROJECT: "bg-blue-100 text-blue-800",
      STARTUP_COLLABORATION: "bg-purple-100 text-purple-800",
      PART_TIME_JOB: "bg-green-100 text-green-800",
      COMPETITION_HACKATHON: "bg-amber-100 text-amber-800",
      TEAM_SEARCH: "bg-pink-100 text-pink-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const formatType = (type: string) => {
    return type
      .replace(/_/g, " ")
      .replace(/([A-Z])/g, " $1")
      .trim();
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Posts</h1>
          <p className="text-muted-foreground mt-1">
            Manage your job and project posts
          </p>
        </div>
        <Button onClick={onCreatePost} size="lg" className="gap-2">
          <Zap className="w-4 h-4" />
          Create Post
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(["all", "ACTIVE", "DRAFT", "CLOSED"] as const).map((filter) => (
          <Button
            key={filter}
            variant={activeFilter === filter ? "default" : "outline"}
            onClick={() => setActiveFilter(filter)}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1).toLowerCase()}
          </Button>
        ))}
      </div>

      {/* Posts Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="h-64 animate-pulse">
              <CardContent className="h-full bg-muted/50" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              categoryColor={getCategoryColor(post.type)}
              formatType={formatType}
            />
          ))}
        </div>
      )}

      {!isLoading && posts.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">No posts found</h3>
              <p className="text-muted-foreground mb-4">
                Start by creating your first post
              </p>
              <Button onClick={onCreatePost}>Create Post</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
