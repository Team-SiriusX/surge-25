"use client"

import { ArrowLeft, Mail, Phone, MapPin, MessageSquare, CheckCircle, XCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface ApplicantDetailViewProps {
  postId: string
  applicantId: string
}

// Mock applicant detail data
const mockApplicantDetail = {
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
  bio: "Passionate developer with expertise in React, TypeScript, and modern web technologies. I love building scalable and user-friendly applications.",
  skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "GraphQL", "Tailwind CSS"],
  portfolio: "https://sarahchen.dev",
  portfolio_description: "View my portfolio showcasing recent projects and contributions",
  experience_details: [
    {
      title: "Senior Frontend Developer",
      company: "Tech Corp",
      duration: "2022 - Present",
      description: "Led development of customer-facing web applications",
    },
    {
      title: "Frontend Developer",
      company: "StartupXYZ",
      duration: "2020 - 2022",
      description: "Developed React applications and managed team of 2 junior developers",
    },
  ],
}

export function ApplicantDetailView({ postId, applicantId }: ApplicantDetailViewProps) {
  const router = useRouter()

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

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{mockApplicantDetail.name}</h1>
            <p className="text-muted-foreground">{mockApplicantDetail.role}</p>
          </div>
        </div>
        <Badge className={`text-base py-2 px-3 ${getStatusColor(mockApplicantDetail.status)}`}>
          {mockApplicantDetail.status === "SHORTLISTED"
            ? "Shortlisted"
            : mockApplicantDetail.status === "REVIEWING"
              ? "Reviewing"
              : "Rejected"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-polynesian_blue" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <a href={`mailto:${mockApplicantDetail.email}`} className="text-polynesian_blue hover:underline">
                    {mockApplicantDetail.email}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-polynesian_blue" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{mockApplicantDetail.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-polynesian_blue" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{mockApplicantDetail.location}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bio */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{mockApplicantDetail.bio}</p>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {mockApplicantDetail.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="bg-polynesian_blue/5 text-polynesian_blue border-polynesian_blue/20"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Experience */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Experience</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockApplicantDetail.experience_details.map((exp, idx) => (
                <div key={idx} className="pb-4 border-b last:border-0 last:pb-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{exp.title}</h4>
                      <p className="text-sm text-muted-foreground">{exp.company}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">{exp.duration}</span>
                  </div>
                  <p className="text-sm mt-2">{exp.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Portfolio */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Portfolio</CardTitle>
            </CardHeader>
            <CardContent>
              <a
                href={mockApplicantDetail.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="text-polynesian_blue hover:underline"
              >
                {mockApplicantDetail.portfolio_description}
              </a>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Match Score */}
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-2">Match Score</p>
              <div className="flex items-end gap-2">
                <div className="text-4xl font-bold text-polynesian_blue">{mockApplicantDetail.matchScore}%</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                <div
                  className="bg-polynesian_blue h-2 rounded-full"
                  style={{ width: `${mockApplicantDetail.matchScore}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Applied Date */}
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">Applied</p>
              <p className="font-semibold">{mockApplicantDetail.appliedAt}</p>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full bg-polynesian_blue hover:bg-polynesian_blue/90 gap-2">
                <MessageSquare className="w-4 h-4" />
                Send Message
              </Button>
              <Button
                variant="outline"
                className="w-full justify-center gap-2 border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
              >
                <CheckCircle className="w-4 h-4" />
                Shortlist
              </Button>
              <Button
                variant="outline"
                className="w-full justify-center gap-2 border-red-200 text-red-700 hover:bg-red-50 bg-transparent"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
