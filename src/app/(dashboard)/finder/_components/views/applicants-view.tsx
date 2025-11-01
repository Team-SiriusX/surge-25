"use client"

import { ArrowLeft, Mail, Phone, MapPin, Briefcase } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { mockPosts } from "@/lib/mock-data"

interface ApplicantsViewProps {
  postId: string
}

// Mock applicants data - in real app would come from database
const mockApplicants = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah.chen@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    role: "Senior Frontend Developer",
    avatar: "/diverse-avatars.png",
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
    avatar: "/diverse-avatars.png",
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
    avatar: "/diverse-avatars.png",
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
    avatar: "/diverse-avatars.png",
    experience: 2,
    status: "REJECTED",
    appliedAt: "2024-11-19",
    matchScore: 65,
  },
]

export function ApplicantsView({ postId }: ApplicantsViewProps) {
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
      case "SHORTLISTED":
        return "bg-green-100 text-green-800"
      case "REVIEWING":
        return "bg-blue-100 text-blue-800"
      case "REJECTED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const applicants = mockApplicants.filter(() => Math.random() > 0.2) // Simulate varying applicant counts

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
            <p className="text-3xl font-bold">{post.applicationsCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Shortlisted</p>
            <p className="text-3xl font-bold text-green-600">{Math.ceil(post.applicationsCount * 0.25)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">In Review</p>
            <p className="text-3xl font-bold text-blue-600">{Math.ceil(post.applicationsCount * 0.5)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Rejected</p>
            <p className="text-3xl font-bold text-red-600">{Math.ceil(post.applicationsCount * 0.25)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Applicants List */}
      <div className="space-y-3">
        {applicants.map((applicant) => (
          <Card
            key={applicant.id}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push(`/posts/${postId}/applicants/${applicant.id}`)}
          >
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-polynesian_blue/10 rounded-full flex items-center justify-center">
                      <span className="font-semibold text-polynesian_blue">{applicant.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{applicant.name}</h3>
                      <p className="text-sm text-muted-foreground">{applicant.role}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 ml-16">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground truncate">{applicant.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{applicant.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{applicant.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{applicant.experience} yrs</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-semibold text-polynesian_blue">{applicant.matchScore}%</div>
                    <p className="text-xs text-muted-foreground">Match</p>
                  </div>
                  <Badge className={getStatusColor(applicant.status)}>
                    {applicant.status === "SHORTLISTED"
                      ? "Shortlisted"
                      : applicant.status === "REVIEWING"
                        ? "Reviewing"
                        : "Rejected"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {applicants.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No applicants yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
