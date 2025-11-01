"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { CheckCircle, Upload, FileText, X } from "lucide-react"
import { useCreateApplication } from "../_api"
import { UploadButton } from "@/lib/uploadthing"
import { toast } from "sonner"

const applyFormSchema = z.object({
  coverLetter: z
    .string()
    .min(50, { message: "Cover letter must be at least 50 characters." })
    .max(2000, { message: "Cover letter must not exceed 2000 characters." })
    .optional()
    .or(z.literal("")),
  resumeUrl: z.string().url("Invalid resume URL").optional().or(z.literal("")),
  customMessage: z
    .string()
    .max(1000, { message: "Custom message must not exceed 1000 characters." })
    .optional()
    .or(z.literal("")),
})

type ApplyFormValues = z.infer<typeof applyFormSchema>

interface ApplyFormProps {
  jobTitle: string
  jobId: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function ApplyForm({ jobTitle, jobId, onSuccess, onCancel }: ApplyFormProps) {
  const [submitted, setSubmitted] = useState(false)
  const [resumeUrl, setResumeUrl] = useState<string | null>(null)
  const { mutate: createApplication, isPending } = useCreateApplication(jobId)

  const form = useForm<ApplyFormValues>({
    resolver: zodResolver(applyFormSchema),
    defaultValues: {
      coverLetter: "",
      resumeUrl: "",
      customMessage: "",
    },
  })

  async function onSubmit(values: ApplyFormValues) {
    const payload: {
      coverLetter?: string;
      resumeUrl?: string;
      customMessage?: string;
    } = {};

    if (values.coverLetter) payload.coverLetter = values.coverLetter;
    const finalResumeUrl = resumeUrl || values.resumeUrl;
    if (finalResumeUrl) payload.resumeUrl = finalResumeUrl;
    if (values.customMessage) payload.customMessage = values.customMessage;

    createApplication(payload as any, {
      onSuccess: () => {
        setSubmitted(true)
        setTimeout(() => {
          onSuccess?.()
        }, 3000)
      },
    })
  }

  if (submitted) {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-alice_blue to-alice_blue/50 p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <CheckCircle className="mb-4 size-12 text-polynesian_blue" />
          <h3 className="mb-2 text-xl font-semibold text-foreground">Application Submitted!</h3>
          <p className="mb-6 text-muted-foreground">
            Your application for <span className="font-semibold">{jobTitle}</span> has been successfully submitted.
          </p>
          <p className="text-sm text-muted-foreground">Redirecting you back...</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-foreground">Apply for this Position</h2>
        <p className="mt-1 text-muted-foreground">
          Fill out the form below to submit your application for <span className="font-semibold">{jobTitle}</span>
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Resume Upload */}
          <div className="space-y-3">
            <FormLabel>Resume (Optional)</FormLabel>
            {resumeUrl ? (
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-4">
                <div className="flex items-center gap-3">
                  <FileText className="size-5 text-polynesian_blue" />
                  <div>
                    <p className="text-sm font-medium">Resume uploaded</p>
                    <a
                      href={resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-polynesian_blue hover:underline"
                    >
                      View resume
                    </a>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setResumeUrl(null)
                    form.setValue("resumeUrl", "")
                  }}
                >
                  <X className="size-4" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <UploadButton
                  endpoint="resumeUploader"
                  onClientUploadComplete={(res) => {
                    if (res && res[0]) {
                      setResumeUrl(res[0].url)
                      form.setValue("resumeUrl", res[0].url)
                      toast.success("Resume uploaded successfully!")
                    }
                  }}
                  onUploadError={(error: Error) => {
                    toast.error(`Upload failed: ${error.message}`)
                  }}
                  appearance={{
                    button:
                      "ut-ready:bg-polynesian_blue ut-uploading:cursor-not-allowed ut-uploading:bg-polynesian_blue/50 bg-polynesian_blue text-white",
                    allowedContent: "text-xs text-muted-foreground",
                  }}
                />
                <p className="text-xs text-muted-foreground">Upload your resume (PDF, max 8MB)</p>
              </div>
            )}
          </div>

          {/* Cover Letter */}
          <FormField
            control={form.control}
            name="coverLetter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cover Letter (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us why you're interested in this opportunity and what makes you a great fit for the role..."
                    className="min-h-40 resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>{(field.value?.length || 0)}/2000 characters</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Custom Message */}
          <FormField
            control={form.control}
            name="customMessage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Message (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any additional information you'd like to share..."
                    className="min-h-24 resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>{(field.value?.length || 0)}/1000 characters</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-polynesian_blue hover:bg-polynesian_blue/90"
            >
              {isPending ? "Submitting..." : "Submit Application"}
            </Button>
            <Button type="button" onClick={onCancel} variant="outline" className="flex-1 bg-transparent">
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
