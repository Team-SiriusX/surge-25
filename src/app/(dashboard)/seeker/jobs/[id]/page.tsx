"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin, Clock, DollarSign, BookmarkPlus, BookmarkCheck, ArrowLeft, Users } from "lucide-react"
import { JobType } from "@/types/models"
import { ApplyForm } from "../../_components/apply-form"
import { useGetJob, useSaveJob, useUnsaveJob } from "../../_api"

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
  const [jobId, setJobId] = useState<string>("")

  const { data, isLoading } = useGetJob(jobId)
  const { mutate: saveJob } = useSaveJob()
  const { mutate: unsaveJob } = useUnsaveJob()

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params
      setJobId(resolvedParams.id)
    }
    resolveParams()
  }, [params])

  const job = data?.data

  const handleSave = () => {
    if (!job) return
    if (job.hasSaved) {
      unsaveJob(job.id)
    } else {
      saveJob(job.id)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <Skeleton className="mb-8 h-10 w-32" />
          <div className="space-y-6">
            <Skeleton className="h-16 w-full" />
            <div className="grid gap-4 md:grid-cols-3">
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </div>
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <Button onClick={() => router.push("/seeker")} variant="outline" className="mb-8 gap-2">
            <ArrowLeft size={18} />
            Back to Browse
          </Button>
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-12">
            <p className="text-lg font-semibold text-foreground">Job not found</p>
            <Button onClick={() => router.push("/seeker")} className="mt-4">
              Return to Browse
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Back Button */}
        <Button onClick={() => router.push("/seeker")} variant="outline" className="mb-8 gap-2">
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
              onSuccess={() => router.push("/seeker/applications")}
            />
          </Card>
        ) : (
          <>
            {/* Job Header */}
            <div className="mb-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge className={jobTypeColors[job.type]}>{jobTypeLabels[job.type]}</Badge>
                    {job.matchScore !== undefined && (
                      <Badge variant="outline" className="text-sm">
                        {job.matchScore}% Match
                      </Badge>
                    )}
                  </div>
                  <h1 className="mt-3 text-4xl font-bold text-foreground">{job.title}</h1>
                  {job._count && (
                    <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users size={16} />
                        {job._count.applications} applicants
                      </span>
                    </div>
                  )}
                </div>
                <button onClick={handleSave} className="transition-transform hover:scale-110">
                  {job.hasSaved ? (
                    <BookmarkCheck size={28} className="text-primary" />
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
                  {job.requirements.map((req: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="font-semibold text-primary">•</span>
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
                disabled={job.hasApplied}
                className="flex-1 disabled:opacity-50"
              >
                {job.hasApplied ? "Already Applied" : "Apply Now"}
              </Button>
              <Button onClick={() => router.push("/seeker")} variant="outline" className="flex-1">
                Back to Browse
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
