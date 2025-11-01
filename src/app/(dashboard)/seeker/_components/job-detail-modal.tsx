"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, DollarSign, BookmarkPlus, BookmarkCheck } from "lucide-react"
import { type JobPost, JobType } from "@/types/models"
import { ApplyForm } from "./apply-form"

interface JobDetailModalProps {
  job: JobPost | null
  isOpen: boolean
  onClose: () => void
  isSaved?: boolean
  onSave?: (jobId: string) => void
  onApply?: (jobId: string) => void
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

export function JobDetailModal({ job, isOpen, onClose, isSaved = false, onSave, onApply }: JobDetailModalProps) {
  const [showApplyForm, setShowApplyForm] = useState(false)

  if (!job) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto p-6">
        {showApplyForm ? (
          <ApplyForm jobTitle={job.title} jobId={job.id} onCancel={() => setShowApplyForm(false)} onSuccess={onClose} />
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <Badge className={jobTypeColors[job.type]}>{jobTypeLabels[job.type]}</Badge>
                  <DialogTitle className="mt-3 text-2xl">{job.title}</DialogTitle>
                </div>
                <button onClick={() => onSave?.(job.id)} className="transition-transform hover:scale-110">
                  {isSaved ? (
                    <BookmarkCheck size={24} className="text-primary" />
                  ) : (
                    <BookmarkPlus size={24} className="text-muted-foreground" />
                  )}
                </button>
              </div>
            </DialogHeader>

            <div className="mt-6 space-y-6">
              {/* Job Details */}
              <div className="grid gap-4 md:grid-cols-3">
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
              <div>
                <h3 className="mb-2 font-semibold">About This Opportunity</h3>
                <p className="text-muted-foreground leading-relaxed">{job.description}</p>
              </div>

              {/* Tags */}
              {job.tags.length > 0 && (
                <div>
                  <h3 className="mb-3 font-semibold">Skills & Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Requirements */}
              {job.requirements.length > 0 && (
                <div>
                  <h3 className="mb-3 font-semibold">Requirements</h3>
                  <ul className="space-y-2">
                    {job.requirements.map((req: string, idx: number) => (
                      <li key={idx} className="flex gap-3 text-muted-foreground">
                        <span className="font-semibold text-primary">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button onClick={() => setShowApplyForm(true)} className="flex-1 bg-primary hover:bg-primary/90">
                  Apply Now
                </Button>
                <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
                  Close
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
