"use client"

import { useRouter } from "next/navigation"
import { ApplicationsView } from "../_components/applications-view"
import { useGetApplications } from "../_api"

export default function ApplicationsPage() {
  const router = useRouter()
  const { data, isLoading } = useGetApplications()

  const handleViewDetails = (jobId: string) => {
    router.push(`/seeker/jobs/${jobId}`)
  }

  return (
    <ApplicationsView 
      applications={data?.data || []} 
      isLoading={isLoading}
      onViewDetails={handleViewDetails} 
    />
  )
}
