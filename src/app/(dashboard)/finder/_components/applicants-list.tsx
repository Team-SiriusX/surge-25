"use client"

import { Mail, Phone, MapPin, Briefcase } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

export interface Applicant {
  id: string
  name: string
  email: string
  phone: string
  location: string
  role: string
  experience: number
  status: "SHORTLISTED" | "REVIEWING" | "REJECTED"
  appliedAt: string
  matchScore: number
}

interface ApplicantsListProps {
  postId: string
  applicants: Applicant[]
}

export function ApplicantsList({ postId, applicants }: ApplicantsListProps) {
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
  )
}
