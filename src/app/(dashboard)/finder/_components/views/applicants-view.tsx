"use client"

import { ArrowLeft, Mail, Phone, MapPin, Briefcase } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useGetJob, useGetApplications } from "../../_api"
import { MessageApplicantButton } from "@/components/chat/message-applicant-button"

interface ApplicantsViewProps {
  postId: string
}

export function ApplicantsView({ postId }: ApplicantsViewProps) {
  const router = useRouter()
  const { data: jobData, isLoading: jobLoading } = useGetJob(postId)
  const { data: applicationsData, isLoading: applicationsLoading } = useGetApplications({ jobPostId: postId })

  const post = jobData?.data
  const applications = applicationsData?.data || []

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SHORTLISTED":
        return "bg-green-100 text-green-800"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "ACCEPTED":
        return "bg-blue-100 text-blue-800"
      case "REJECTED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Calculate status counts
  const totalApplications = applications.length
  const shortlisted = applications.filter((app) => app.status === "SHORTLISTED").length
  const pending = applications.filter((app) => app.status === "PENDING").length
  const rejected = applications.filter((app) => app.status === "REJECTED").length

  if (jobLoading) {
    return (
      <div className="p-8 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Post not found</p>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Applicants</h1>
          <p className="text-muted-foreground">{post.title}</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Total Applications</p>
            <p className="text-3xl font-bold">{totalApplications}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Shortlisted</p>
            <p className="text-3xl font-bold text-green-600">{shortlisted}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">In Review</p>
            <p className="text-3xl font-bold text-blue-600">{pending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Rejected</p>
            <p className="text-3xl font-bold text-red-600">{rejected}</p>
          </CardContent>
        </Card>
      </div>

      {/* Applicants List */}
      {applicationsLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="h-32 animate-pulse">
              <CardContent className="h-full bg-muted/50" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((application) => (
            <Card
              key={application.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(`/finder/posts/${postId}/applicants/${application.id}`)}
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="font-semibold text-primary">
                          {application.applicant?.name?.charAt(0) || "?"}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{application.applicant?.name || "Unknown"}</h3>
                        <p className="text-sm text-muted-foreground">{application.applicant?.major || "N/A"}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 ml-16">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground truncate">
                          {application.applicant?.email || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">N/A</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{application.applicant?.university || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">N/A</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-semibold text-polynesian_blue">
                        {application.matchScore || 0}%
                      </div>
                      <p className="text-xs text-muted-foreground">Match</p>
                    </div>
                  <Badge className={getStatusColor(application.status)}>
                    {application.status === "SHORTLISTED"
                      ? "Shortlisted"
                      : application.status === "PENDING"
                        ? "Pending"
                        : application.status === "ACCEPTED"
                          ? "Accepted"
                          : "Rejected"}
                  </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!applicationsLoading && applications.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No applicants yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
