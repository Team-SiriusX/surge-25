"use client"

import { useParams } from "next/navigation"
import { ApplicantDetailView } from "@/app/(dashboard)/finder/_components/views/applicant-detail-view"

export default function ApplicantDetailPage() {
  const params = useParams()
  const postId = params.id as string
  const applicantId = params.applicantId as string

  return <ApplicantDetailView postId={postId} applicantId={applicantId} />
}
