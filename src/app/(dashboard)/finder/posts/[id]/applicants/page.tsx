"use client"

import { useParams } from "next/navigation"
import { ApplicantsView } from "../../../_components/views/applicants-view"

export default function ApplicantsPage() {
  const params = useParams()
  const postId = params.id as string

  return <ApplicantsView postId={postId} />
}
