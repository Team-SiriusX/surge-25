"use client"

import { useRouter } from "next/navigation"
import { SavedJobsView } from "../_components/saved-jobs-view"
import { useGetSavedJobs, useUnsaveJob } from "../_api"

export default function SavedPage() {
  const router = useRouter()
  const { data, isLoading } = useGetSavedJobs()
  const { mutate: unsaveJob } = useUnsaveJob()

  const handleUnsaveJob = (jobId: string) => {
    unsaveJob(jobId)
  }

  const handleViewDetails = (jobId: string) => {
    router.push(`/seeker/jobs/${jobId}`)
  }

  return (
    <SavedJobsView 
      savedJobs={data?.data || []} 
      isLoading={isLoading}
      onUnsave={handleUnsaveJob} 
      onViewDetails={handleViewDetails} 
    />
  )
}
