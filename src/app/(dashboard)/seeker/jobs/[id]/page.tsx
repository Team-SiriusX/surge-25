"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MapPin, Clock, DollarSign, BookmarkPlus, BookmarkCheck, ArrowLeft } from "lucide-react"
import { mockJobPosts } from "@/lib/mock-data"
import { JobType } from "@/types/models"
import { ApplyForm } from "../../_components/apply-form"

interface PageProps {
  params: Promise<{ id: string }>
}

const jobTypeColors: Record<JobType, string> = {
  [JobType.ACADEMIC_PROJECT]: "bg-blue-100 text-blue-800",
  [JobType.STARTUP_COLLABORATION]: "bg-purple-100 text-purple-800",
  [JobType.PART_TIME_JOB]: "bg-green-100 text-green-800",
  [JobType.COMPETITION_HACKATHON]: "bg-orange-100 text-orange-800",
  [JobType.INTERNSHIP]: "bg-pink-100 text-pink-800",
  [JobType.FREELANCE]: "bg-yellow-100 text-yellow-800",
}

const jobTypeLabels: Record<JobType, string> = {
  [JobType.ACADEMIC_PROJECT]: "Academic Project",
  [JobType.STARTUP_COLLABORATION]: "Startup",
  [JobType.PART_TIME_JOB]: "Part-Time",
  [JobType.COMPETITION_HACKATHON]: "Hackathon",
  [JobType.INTERNSHIP]: "Internship",
  [JobType.FREELANCE]: "Freelance",
}

export default function JobDetailPage({ params }: PageProps) {
  const router = useRouter()
  const [showApplyForm, setShowApplyForm] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [jobId, setJobId] = useState<string>("")

  const resolveParams = async () => {
    const resolvedParams = await params
    setJobId(resolvedParams.id)
  }

  if (jobId === "") {
    resolveParams()
  }

  const job = mockJobPosts.find((j) => j.id === jobId)

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <Button onClick={() => router.push("/")} variant="outline" className="mb-8 gap-2">
            <ArrowLeft size={18} />
            Back to Browse
          </Button>
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-12">
            <p className="text-lg font-semibold text-foreground">Job not found</p>
            <Button onClick={() => router.push("/")} className="mt-4">
              Return to Browse
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Back Button */}
        <Button onClick={() => router.push("/")} variant="outline" className="mb-8 gap-2">
          <ArrowLeft size={18} />
          Back to Browse
        </Button>

        {showApplyForm ? (
          /* Show apply form in full page view */
          <Card className="p-8">
            <ApplyForm
              jobTitle={job.title}
              jobId={job.id}
              onCancel={() => setShowApplyForm(false)}
              onSuccess={() => router.push("/?view=applications")}
            />
          </Card>
        ) : (
          <>
            {/* Job Header */}
            <div className="mb-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <Badge className={jobTypeColors[job.type]}>{jobTypeLabels[job.type]}</Badge>
                  <h1 className="mt-3 text-4xl font-bold text-foreground">{job.title}</h1>
                </div>
                <button onClick={handleSave} className="transition-transform hover:scale-110">
                  {isSaved ? (
                    <BookmarkCheck size={28} className="text-polynesian_blue" />
                  ) : (
                    <BookmarkPlus size={28} className="text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>

            {/* Job Details Grid */}
            <div className="mb-8 grid gap-4 md:grid-cols-3">
              {job.location && (
                <Card className="p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin size={16} />
                    <span>Location</span>
                  </div>
                  <p className="mt-2 font-semibold">{job.location}</p>
                </Card>
              )}
              {job.duration && (
                <Card className="p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock size={16} />
                    <span>Duration</span>
                  </div>
                  <p className="mt-2 font-semibold">{job.duration}</p>
                </Card>
              )}
              {job.compensation && (
                <Card className="p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign size={16} />
                    <span>Compensation</span>
                  </div>
                  <p className="mt-2 font-semibold">{job.compensation}</p>
                </Card>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="mb-3 text-2xl font-semibold">About This Opportunity</h2>
              <p className="leading-relaxed text-muted-foreground">{job.description}</p>
            </div>

            {/* Tags */}
            {job.tags.length > 0 && (
              <div className="mb-8">
                <h2 className="mb-3 text-2xl font-semibold">Skills & Technologies</h2>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements */}
            {job.requirements.length > 0 && (
              <div className="mb-8">
                <h2 className="mb-3 text-2xl font-semibold">Requirements</h2>
                <ul className="space-y-2">
                  {job.requirements.map((req, idx) => (
                    <li key={idx} className="flex gap-3 text-muted-foreground">
                      <span className="font-semibold text-polynesian_blue">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 border-t pt-8">
              <Button
                onClick={() => setShowApplyForm(true)}
                className="flex-1 bg-polynesian_blue hover:bg-polynesian_blue/90"
              >
                Apply Now
              </Button>
              <Button onClick={() => router.push("/")} variant="outline" className="flex-1">
                Back to Browse
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
