"use client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Clock, DollarSign } from "lucide-react";
import { JobPost, JobType } from "@/generated/prisma";

interface JobCardProps {
  job: JobPost;
  isSaved?: boolean;
  onSave?: (jobId: string) => void;
  onViewDetails?: (jobId: string) => void;
}

const jobTypeColors: Record<JobType, string> = {
  [JobType.ACADEMIC_PROJECT]: "bg-blue-100 text-blue-800",
  [JobType.STARTUP_COLLABORATION]: "bg-purple-100 text-purple-800",
  [JobType.PART_TIME_JOB]: "bg-green-100 text-green-800",
  [JobType.COMPETITION_HACKATHON]: "bg-orange-100 text-orange-800",
  [JobType.INTERNSHIP]: "bg-pink-100 text-pink-800",
  [JobType.FREELANCE]: "bg-yellow-100 text-yellow-800",
};

const jobTypeLabels: Record<JobType, string> = {
  [JobType.ACADEMIC_PROJECT]: "Academic Project",
  [JobType.STARTUP_COLLABORATION]: "Startup",
  [JobType.PART_TIME_JOB]: "Part-Time",
  [JobType.COMPETITION_HACKATHON]: "Hackathon",
  [JobType.INTERNSHIP]: "Internship",
  [JobType.FREELANCE]: "Freelance",
};

export function JobCard({
  job,
  isSaved = false,
  onSave,
  onViewDetails,
}: JobCardProps) {
  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <Badge className={jobTypeColors[job.type]}>
              {jobTypeLabels[job.type]}
            </Badge>
            <h3 className="mt-3 text-xl font-semibold text-foreground line-clamp-2">
              {job.title}
            </h3>
          </div>
          <button
            onClick={() => onSave?.(job.id)}
            className="ml-2 transition-transform duration-200 hover:scale-110"
            aria-label={isSaved ? "Remove from saved" : "Save job"}
          >
            <Heart
              size={24}
              className={
                isSaved ? "fill-red-500 text-red-500" : "text-gray-400"
              }
            />
          </button>
        </div>

        <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
          {job.description}
        </p>

        <div className="mb-4 flex flex-wrap gap-2">
          {job.tags.slice(0, 3).map((tag: string) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {job.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{job.tags.length - 3}
            </Badge>
          )}
        </div>

        <div className="mb-4 space-y-2 text-sm">
          {job.location && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin size={16} />
              <span>{job.location}</span>
            </div>
          )}
          {job.duration && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock size={16} />
              <span>{job.duration}</span>
            </div>
          )}
          {job.compensation && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign size={16} />
              <span>{job.compensation}</span>
            </div>
          )}
        </div>

        <Button
          onClick={() => onViewDetails?.(job.id)}
          className="w-full bg-primary hover:bg-primary/90"
        >
          View Details
        </Button>
      </div>
    </Card>
  );
}
