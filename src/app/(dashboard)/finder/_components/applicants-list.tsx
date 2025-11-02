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
  status: "SHORTLISTED" | "PENDING" | "REJECTED" | "ACCEPTED"
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

  return (
    <div className="space-y-3">
      {applicants.map((applicant) => (
        <Card
          key={applicant.id}
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => router.push(`/finder/posts/${postId}/applicants/${applicant.id}`)}
        >
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-3 sm:gap-4">
              <div className="flex-1 w-full">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <span className="font-semibold text-primary text-sm sm:text-base">{applicant.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base sm:text-lg truncate">{applicant.name}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">{applicant.role}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-3 sm:mt-4 sm:ml-16">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm min-w-0">
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground truncate">{applicant.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                    <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground truncate">{applicant.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground truncate">{applicant.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                    <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground">{applicant.experience} yrs</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-row sm:flex-col items-center gap-3 w-full sm:w-auto justify-between sm:justify-start sm:text-right">
                <div>
                  <div className="text-sm font-semibold text-primary">{applicant.matchScore}%</div>
                  <p className="text-xs text-muted-foreground">Match</p>
                </div>
                <Badge className={`${getStatusColor(applicant.status)} text-xs`}>
                  {applicant.status === "SHORTLISTED"
                    ? "Shortlisted"
                    : applicant.status === "PENDING"
                      ? "Pending"
                      : applicant.status === "ACCEPTED"
                        ? "Accepted"
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
