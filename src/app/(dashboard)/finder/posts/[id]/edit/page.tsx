"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetJob, useUpdateJob } from "@/app/(dashboard)/finder/_api";
import { EditPostForm } from "@/app/(dashboard)/finder/_components/edit-post-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { data, isLoading } = useGetJob(id);
  const { mutate: updateJob, isPending } = useUpdateJob(id);

  const handleUpdate = (formData: any) => {
    updateJob(formData, {
      onSuccess: () => {
        router.push("/finder/posts");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="p-8">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Post Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The post you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.push("/finder/posts")}>
            Go Back to My Posts
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/finder/posts")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to My Posts
        </Button>
        <h1 className="text-3xl font-bold">Edit Post</h1>
        <p className="text-muted-foreground mt-1">
          Update your job or project post
        </p>
      </div>

      <EditPostForm
        post={data.data}
        onSubmit={handleUpdate}
        isPending={isPending}
        onCancel={() => router.push("/finder/posts")}
      />
    </div>
  );
}
