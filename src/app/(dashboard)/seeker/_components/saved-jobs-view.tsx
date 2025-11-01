"use client";

import { JobCard } from "./job-card";
import { Skeleton } from "@/components/ui/skeleton";

interface SavedJobsViewProps {
  savedJobs: any[];
  isLoading?: boolean;
  onUnsave?: (jobId: string) => void;
  onViewDetails?: (jobId: string) => void;
}

export function SavedJobsView({
  savedJobs,
  isLoading,
  onUnsave,
  onViewDetails,
}: SavedJobsViewProps) {
  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-foreground">Saved Jobs</h1>
        <p className="text-muted-foreground">
          Jobs you've bookmarked for later
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full" />
            </div>
          ))}
        </div>
      ) : savedJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-12">
          <p className="text-lg font-semibold text-foreground">
            No saved jobs yet
          </p>
          <p className="text-sm text-muted-foreground">
            Bookmark jobs to save them for later viewing
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {savedJobs.map((saved) => (
            <JobCard
              key={saved.jobPostId}
              job={saved.jobPost}
              isSaved={true}
              onSave={(jobId) => onUnsave?.(jobId)}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
}
