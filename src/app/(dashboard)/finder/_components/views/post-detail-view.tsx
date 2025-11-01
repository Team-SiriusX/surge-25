"use client"

import { ArrowLeft, Eye, Users, Share2, Edit2, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { mockPosts } from "@/lib/mock-data"
import { ApplicantsList, type Applicant } from "../applicants-list"

const mockApplicants: Applicant[] = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah.chen@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    role: "Senior Frontend Developer",
    experience: 4,
    status: "REVIEWING",
    appliedAt: "2024-11-22",
    matchScore: 92,
  },
  {
    id: "2",
    name: "James Wilson",
    email: "james.w@email.com",
    phone: "+1 (555) 234-5678",
    location: "New York, NY",
    role: "Full Stack Developer",
    experience: 6,
    status: "SHORTLISTED",
    appliedAt: "2024-11-21",
    matchScore: 88,
  },
  {
    id: "3",
    name: "Maya Patel",
    email: "maya.patel@email.com",
    phone: "+1 (555) 345-6789",
    location: "Austin, TX",
    role: "React Specialist",
    experience: 3,
    status: "REVIEWING",
    appliedAt: "2024-11-20",
    matchScore: 85,
  },
  {
    id: "4",
    name: "Alex Rodriguez",
    email: "alex.r@email.com",
    phone: "+1 (555) 456-7890",
    location: "Remote",
    role: "JavaScript Developer",
    experience: 2,
    status: "REJECTED",
    appliedAt: "2024-11-19",
    matchScore: 65,
  },
]

interface PostDetailViewProps {
  postId: string
}

export function PostDetailView({ postId }: PostDetailViewProps) {
  const router = useRouter()
  const post = mockPosts.find((p) => p.id === postId)

  if (!post) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Post not found</p>
      </div>
    )
  }

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

  const applicants = mockApplicants.filter(() => Math.random() > 0.2)

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
                  <p className="font-semibold">{post.location}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-semibold">{post.duration}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Compensation</p>
                  <p className="font-semibold">{post.compensation}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={`mt-1 ${getStatusColor(post.status)}`}>
                    {post.status === "DRAFT" ? "Draft" : post.status === "ACTIVE" ? "Active" : "Closed"}
                  </Badge>
                </div>
              </div>

              {/* Requirements */}
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
            </CardContent>
          </Card>

          <div>
            <h2 className="text-2xl font-bold mb-4">Applicants ({applicants.length})</h2>
            <ApplicantsList postId={postId} applicants={applicants} />
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
                <p className="text-2xl font-bold">{post.views}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-polynesian_blue" />
                  <span className="text-sm text-muted-foreground">Applications</span>
                </div>
                <p className="text-2xl font-bold">{post.applicationsCount}</p>
              </div>
              {post.interestRate && (
                <div>
                  <span className="text-sm text-muted-foreground">Interest Rate</span>
                  <p className="text-2xl font-bold">{(post.interestRate * 100).toFixed(1)}%</p>
                </div>
              )}
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
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
