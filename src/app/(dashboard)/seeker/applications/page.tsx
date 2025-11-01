"use client"

import { useRouter } from "next/navigation"
import { ApplicationsView } from "../_components/applications-view"

export default function ApplicationsPage() {
  const router = useRouter()

  const handleViewDetails = (jobId: string) => {
    router.push(`/seeker/jobs/${jobId}`)
  }

  return <ApplicationsView onViewDetails={handleViewDetails} />
}
