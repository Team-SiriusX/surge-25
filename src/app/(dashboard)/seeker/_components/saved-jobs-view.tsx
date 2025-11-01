"use client";

import { JobCard } from "./job-card";
import { mockJobPosts } from "@/lib/mock-data";

interface SavedJobsViewProps {
  savedJobIds: Set<string>;
  onSave?: (jobId: string) => void;
  onViewDetails?: (jobId: string) => void;
}

export function SavedJobsView({
  savedJobIds,
  onSave,
  onViewDetails,
}: SavedJobsViewProps) {
  const savedJobs = mockJobPosts.filter((job) => savedJobIds.has(job.id));

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-foreground">Saved Jobs</h1>
        <p className="text-muted-foreground">
          Jobs you've bookmarked for later
        </p>
      </div>

      {savedJobs.length === 0 ? (
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
          {/* {savedJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isSaved={true}
              onSave={onSave}
              onViewDetails={onViewDetails}
            />
          ))} */}
        </div>
      )}
    </div>
  );
}
