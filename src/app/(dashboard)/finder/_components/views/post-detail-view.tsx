"use client"

import { ArrowLeft, Eye, Users, Share2, Edit2, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ApplicantsList } from "../applicants-list"
import { useGetJob, useGetApplications, useDeleteJob } from "../../_api"
import { toast } from "sonner"

interface PostDetailViewProps {
  postId: string
}

export function PostDetailView({ postId }: PostDetailViewProps) {
  const router = useRouter()
  const { data: jobData, isLoading: jobLoading } = useGetJob(postId)
  const { data: applicationsData, isLoading: applicationsLoading } = useGetApplications({ jobPostId: postId })
  const { mutate: deleteJob, isPending: isDeleting } = useDeleteJob()

  const post = jobData?.data
  const applications = applicationsData?.data || []

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this post?")) {
      deleteJob(postId, {
        onSuccess: () => {
          router.push("/finder")
        },
      })
    }
  }

  if (jobLoading) {
    return (
      <div className="p-8 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="h-64 bg-muted rounded" />
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

  // Transform applications to match ApplicantsList interface
  const applicants = applications.map((app) => ({
    id: app.id,
    name: app.applicant?.name || "Unknown",
    email: app.applicant?.email || "",
    phone: "N/A", // User model doesn't have phone
    location: app.applicant?.university || "N/A", // Use university as location fallback
    role: app.applicant?.major || "N/A", // Use major as role fallback
    experience: 0, // User model doesn't have experience
    status: app.status,
    appliedAt: app.updatedAt ? new Date(app.updatedAt).toLocaleDateString() : "N/A",
    matchScore: app.matchScore || 0,
  }))

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800"
      case "DRAFT":
        return "bg-yellow-100 text-yellow-800"
      case "CLOSED":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatType = (type: string) => {
    return type
      .replace(/_/g, " ")
      .replace(/([A-Z])/g, " $1")
      .trim()
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-3xl font-bold">Post Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Post Card */}
          <Card>
            <CardHeader>
              <div className="space-y-4">
                <div>
                  <CardTitle className="text-2xl mb-2">{post.title}</CardTitle>
                  <Badge>{formatType(post.type)}</Badge>
                </div>
                <p className="text-muted-foreground">{post.description}</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-semibold">{post.location || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-semibold">{post.duration || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Compensation</p>
                  <p className="font-semibold">{post.compensation || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={`mt-1 ${getStatusColor(post.status)}`}>
                    {post.status === "DRAFT" ? "Draft" : post.status === "ACTIVE" ? "Active" : "Closed"}
                  </Badge>
                </div>
              </div>

              {/* Requirements */}
              {post.requirements && post.requirements.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Requirements</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.requirements.map((req, idx) => (
                      <Badge key={idx} variant="outline">
                        {req}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div>
            <h2 className="text-2xl font-bold mb-4">
              Applicants ({applicationsLoading ? "..." : applicants.length})
            </h2>
            {applicationsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="h-32 animate-pulse">
                    <CardContent className="h-full bg-muted/50" />
                  </Card>
                ))}
              </div>
            ) : (
              <ApplicantsList postId={postId} applicants={applicants} />
            )}
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Post Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-4 h-4 text-polynesian_blue" />
                  <span className="text-sm text-muted-foreground">Views</span>
                </div>
                <p className="text-2xl font-bold">{post.views || 0}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-polynesian_blue" />
                  <span className="text-sm text-muted-foreground">Applications</span>
                </div>
                <p className="text-2xl font-bold">{applicants.length}</p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start gap-2 bg-transparent">
                <Edit2 className="w-4 h-4" />
                Edit Post
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start gap-2 bg-transparent">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 text-red-600 hover:text-red-700 bg-transparent"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="w-4 h-4" />
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
