"use client";

import type React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { ApplicationStatus } from "@/types/models";
import { Calendar, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

interface ApplicationCardProps {
  id: string;
  jobTitle: string;
  jobType: string;
  jobId: string;
  appliedAt: Date | string;
  status: ApplicationStatus;
  onViewDetails?: (jobId: string) => void;
}

const statusConfig: Record<
  ApplicationStatus,
  { color: string; icon: React.ReactNode; label: string }
> = {
  [ApplicationStatus.PENDING]: {
    color: "bg-yellow-100 text-yellow-800",
    icon: <AlertCircle size={18} />,
    label: "Pending",
  },
  [ApplicationStatus.SHORTLISTED]: {
    color: "bg-blue-100 text-blue-800",
    icon: <CheckCircle size={18} />,
    label: "Shortlisted",
  },
  [ApplicationStatus.ACCEPTED]: {
    color: "bg-green-100 text-green-800",
    icon: <CheckCircle size={18} />,
    label: "Accepted",
  },
  [ApplicationStatus.REJECTED]: {
    color: "bg-red-100 text-red-800",
    icon: <XCircle size={18} />,
    label: "Rejected",
  },
};

export function ApplicationCard({
  id,
  jobTitle,
  jobType,
  jobId,
  appliedAt,
  status,
  onViewDetails,
}: ApplicationCardProps) {
  const config = statusConfig[status];

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {jobType}
            </Badge>
            <Badge className={`gap-1 ${config.color}`}>
              {config.icon}
              <span>{config.label}</span>
            </Badge>
          </div>

          <h3 className="mt-3 text-lg font-semibold text-foreground">
            {jobTitle}
          </h3>

          <div className="mt-3 flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar size={16} />
            <span>
              Applied on{" "}
              {new Date(appliedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        <Link
          href={`/seeker/jobs/${jobId}`}
          className={buttonVariants({
            variant: "outline",
            className: "whitespace-nowrap",
          })}
        >
          View Details
        </Link>
      </div>
    </Card>
  );
}
