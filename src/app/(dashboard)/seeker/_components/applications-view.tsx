"use client";

import { useState } from "react";
import { ApplicationCard } from "./application-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockApplications } from "@/lib/mock-data";
import { ApplicationStatus } from "@/types/models";

interface ApplicationsViewProps {
  onViewDetails?: (jobId: string) => void;
}

export function ApplicationsView({ onViewDetails }: ApplicationsViewProps) {
  const [selectedStatus, setSelectedStatus] =
    useState<ApplicationStatus | null>(null);

  const filteredApplications = selectedStatus
    ? mockApplications.filter((app) => app.status === selectedStatus)
    : mockApplications;

  const statusCounts = {
    [ApplicationStatus.PENDING]: mockApplications.filter(
      (a) => (a.status as ApplicationStatus) === ApplicationStatus.PENDING
    ).length,
    [ApplicationStatus.SHORTLISTED]: mockApplications.filter(
      (a) => (a.status as ApplicationStatus) === ApplicationStatus.SHORTLISTED
    ).length,
    [ApplicationStatus.ACCEPTED]: mockApplications.filter(
      (a) => (a.status as ApplicationStatus) === ApplicationStatus.ACCEPTED
    ).length,
    [ApplicationStatus.REJECTED]: mockApplications.filter(
      (a) => (a.status as ApplicationStatus) === ApplicationStatus.REJECTED
    ).length,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-foreground">
          My Applications
        </h1>
        <p className="text-muted-foreground">
          Track your application status across all jobs
        </p>
      </div>

      {/* Status Filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Button
          onClick={() => setSelectedStatus(null)}
          variant={selectedStatus === null ? "default" : "outline"}
          className="gap-2"
        >
          All Applications
          <Badge variant="secondary" className="ml-auto">
            {mockApplications.length}
          </Badge>
        </Button>
        <Button
          onClick={() => setSelectedStatus(ApplicationStatus.PENDING)}
          variant={
            selectedStatus === ApplicationStatus.PENDING ? "default" : "outline"
          }
          className="gap-2"
        >
          Pending
          <Badge variant="secondary" className="ml-auto">
            {statusCounts[ApplicationStatus.PENDING]}
          </Badge>
        </Button>
        <Button
          onClick={() => setSelectedStatus(ApplicationStatus.SHORTLISTED)}
          variant={
            selectedStatus === ApplicationStatus.SHORTLISTED
              ? "default"
              : "outline"
          }
          className="gap-2"
        >
          Shortlisted
          <Badge variant="secondary" className="ml-auto">
            {statusCounts[ApplicationStatus.SHORTLISTED]}
          </Badge>
        </Button>
        <Button
          onClick={() => setSelectedStatus(ApplicationStatus.ACCEPTED)}
          variant={
            selectedStatus === ApplicationStatus.ACCEPTED
              ? "default"
              : "outline"
          }
          className="gap-2"
        >
          Accepted
          <Badge variant="secondary" className="ml-auto">
            {statusCounts[ApplicationStatus.ACCEPTED]}
          </Badge>
        </Button>
        <Button
          onClick={() => setSelectedStatus(ApplicationStatus.REJECTED)}
          variant={
            selectedStatus === ApplicationStatus.REJECTED
              ? "default"
              : "outline"
          }
          className="gap-2"
        >
          Rejected
          <Badge variant="secondary" className="ml-auto">
            {statusCounts[ApplicationStatus.REJECTED]}
          </Badge>
        </Button>
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-12">
          <p className="text-lg font-semibold text-foreground">
            No applications yet
          </p>
          <p className="text-sm text-muted-foreground">
            Start applying to opportunities to see them here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((app) => (
            <ApplicationCard
              key={app.id}
              id={app.id}
              jobTitle={app.jobPost?.title || "Unknown Job"}
              jobType={app.jobPost?.type || ""}
              jobId={app.jobPostId}
              appliedAt={app.appliedAt}
              status={app.status}
              onViewDetails={() => onViewDetails?.(app.jobPostId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
