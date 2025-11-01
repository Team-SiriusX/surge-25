"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SavedJobsView } from "../_components/saved-jobs-view"
import { mockSavedJobs } from "@/lib/mock-data"

export default function SavedPage() {
  const router = useRouter()
  const [savedJobs, setSavedJobs] = useState(
    new Set(mockSavedJobs.map((j: { jobPostId: string }) => j.jobPostId))
  )

  const handleSaveJob = (jobId: string) => {
    setSavedJobs((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(jobId)) {
        newSet.delete(jobId)
      } else {
        newSet.add(jobId)
      }
      return newSet
    })
  }

  const handleViewDetails = (jobId: string) => {
    router.push(`/seeker/jobs/${jobId}`)
  }

  return <SavedJobsView savedJobIds={savedJobs} onSave={handleSaveJob} onViewDetails={handleViewDetails} />
}
