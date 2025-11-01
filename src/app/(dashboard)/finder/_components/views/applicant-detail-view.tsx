"use client"

import { ArrowLeft, Mail, Phone, MapPin, MessageSquare, CheckCircle, XCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useGetApplication, useUpdateApplicationStatus } from "../../_api"

interface ApplicantDetailViewProps {
  postId: string
  applicantId: string
}

export function ApplicantDetailView({ postId, applicantId }: ApplicantDetailViewProps) {
  const router = useRouter()
  const { data, isLoading } = useGetApplication(applicantId)
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateApplicationStatus(applicantId)

  const application = data?.data

  const handleShortlist = () => {
    updateStatus({ status: "SHORTLISTED" })
  }

  const handleReject = () => {
    updateStatus({ status: "REJECTED" })
  }

  const handleAccept = () => {
    updateStatus({ status: "ACCEPTED" })
  }

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

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded" />
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Application not found</p>
      </div>
    )
  }

  const applicant = application.applicant

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{applicant?.name || "Unknown"}</h1>
            <p className="text-muted-foreground">{applicant?.major || "N/A"}</p>
          </div>
        </div>
        <Badge className={`text-base py-2 px-3 ${getStatusColor(application.status)}`}>
          {application.status === "SHORTLISTED"
            ? "Shortlisted"
            : application.status === "PENDING"
              ? "Pending"
              : application.status === "ACCEPTED"
                ? "Accepted"
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
                  <a
                    href={`mailto:${applicant?.email || ""}`}
                    className="text-polynesian_blue hover:underline"
                  >
                    {applicant?.email || "N/A"}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-polynesian_blue" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">N/A</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-polynesian_blue" />
                <div>
                  <p className="text-sm text-muted-foreground">University</p>
                  <p className="font-medium">{applicant?.university || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bio */}
          {applicant?.bio && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{applicant.bio}</p>
              </CardContent>
            </Card>
          )}

          {/* Skills */}
          {applicant?.skills && applicant.skills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {applicant.skills.map((skill) => (
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
          )}

          {/* Cover Letter */}
          {application.coverLetter && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Cover Letter</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{application.coverLetter}</p>
              </CardContent>
            </Card>
          )}

          {/* Portfolio */}
          {applicant?.portfolio && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Portfolio</CardTitle>
              </CardHeader>
              <CardContent>
                <a
                  href={applicant.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-polynesian_blue hover:underline"
                >
                  {applicant.portfolio}
                </a>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Match Score */}
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-2">Match Score</p>
              <div className="flex items-end gap-2">
                <div className="text-4xl font-bold text-polynesian_blue">{application.matchScore || 0}%</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                <div
                  className="bg-polynesian_blue h-2 rounded-full"
                  style={{ width: `${application.matchScore || 0}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Applied Date */}
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">Applied</p>
              <p className="font-semibold">{application.updatedAt ? new Date(application.updatedAt).toLocaleDateString() : "N/A"}</p>
            </CardContent>
          </Card>

          {/* University & Major */}
          {applicant?.university && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-1">University</p>
                <p className="font-semibold">{applicant.university}</p>
                {applicant.major && (
                  <>
                    <p className="text-sm text-muted-foreground mt-2 mb-1">Major</p>
                    <p className="font-semibold">{applicant.major}</p>
                  </>
                )}
              </CardContent>
            </Card>
          )}

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
                className="w-full justify-center gap-2 border-green-200 text-green-700 hover:bg-green-50 hover:text-green-700 bg-transparent"
                disabled={application.status === "SHORTLISTED" || isUpdating}
                onClick={handleShortlist}
              >
                <CheckCircle className="w-4 h-4" />
                {application.status === "SHORTLISTED" ? "Shortlisted" : "Shortlist"}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-center gap-2 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-700bg-transparent"
                disabled={application.status === "REJECTED" || isUpdating}
                onClick={handleReject}
              >
                <XCircle className="w-4 h-4" />
                {application.status === "REJECTED" ? "Rejected" : "Reject"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
