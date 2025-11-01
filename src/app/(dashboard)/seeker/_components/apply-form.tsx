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
  const [resumeFileName, setResumeFileName] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
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
                <div className="flex flex-col items-center justify-center py-8">
          <CheckCircle className="mb-4 size-12 text-primary" />
          <h3 className="mb-2 text-xl font-semibold">Application Submitted!</h3>
          <p className="mb-6 text-muted-foreground">
            Your application for <span className="font-semibold">{jobTitle}</span> has been successfully submitted.
          </p>
          <p className="text-sm text-muted-foreground">Redirecting you back...</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6 pb-4">
      <div className="space-y-2 border-b pb-4">
        <h2 className="text-2xl font-bold text-foreground">Apply for this Position</h2>
        <p className="text-sm text-muted-foreground">
          Fill out the form below to submit your application for <span className="font-semibold text-foreground">{jobTitle}</span>
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Resume Upload */}
          <div className="space-y-3">
            <FormLabel className="text-base font-semibold">
              Resume (Optional)
              {resumeUrl && <span className="ml-2 text-xs font-normal text-green-600">✓ Uploaded</span>}
            </FormLabel>
            {isUploading ? (
              <div className="rounded-lg border-2 border-primary/50 bg-primary/5 p-6">
                <div className="flex flex-col items-center justify-center gap-3 text-center">
                  <div className="animate-spin rounded-full border-4 border-primary/20 border-t-primary p-4">
                    <Upload className="size-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">Uploading Resume...</p>
                    <p className="text-xs text-muted-foreground">Please wait</p>
                  </div>
                </div>
              </div>
            ) : resumeUrl ? (
              <div className="rounded-lg border-2 border-green-500/50 bg-green-50 dark:bg-green-950/20 p-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-green-500/10 p-2">
                    <CheckCircle className="size-5 text-green-600 dark:text-green-500" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-semibold text-green-900 dark:text-green-100">
                      {resumeFileName || "Resume uploaded successfully"}
                    </p>
                    <a
                      href={resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-green-700 hover:underline dark:text-green-400"
                    >
                      View File →
                    </a>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setResumeUrl(null)
                      setResumeFileName(null)
                      form.setValue("resumeUrl", "")
                    }}
                    className="hover:bg-green-100 dark:hover:bg-green-900/30"
                  >
                    <X className="size-4 text-green-700 dark:text-green-400" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="rounded-lg border-2 border-dashed border-border bg-muted/30 p-6 transition-colors hover:border-primary/50 hover:bg-muted/50">
                  <div className="flex flex-col items-center justify-center gap-3 text-center">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Upload className="size-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">Upload Resume</p>
                      <p className="text-xs text-muted-foreground">PDF file up to 8MB</p>
                    </div>
                    <UploadButton
                      endpoint="resumeUploader"
                      onBeforeUploadBegin={(files) => {
                        setIsUploading(true)
                        return files
                      }}
                      onClientUploadComplete={(res) => {
                        setIsUploading(false)
                        if (res && res[0]) {
                          const fileName = res[0].name || "Resume.pdf"
                          setResumeUrl(res[0].url)
                          setResumeFileName(fileName)
                          form.setValue("resumeUrl", res[0].url)
                          toast.success("Resume uploaded successfully!")
                        }
                      }}
                      onUploadError={(error: Error) => {
                        setIsUploading(false)
                        toast.error(`Upload failed: ${error.message}`)
                      }}
                      appearance={{
                        button:
                          "px-4 py-2 rounded-md text-sm font-medium transition-colors ut-uploading:cursor-not-allowed ut-uploading:opacity-50",
                        container: "w-full flex justify-center",
                        allowedContent: "hidden",
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Cover Letter */}
          <FormField
            control={form.control}
            name="coverLetter"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">Cover Letter</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us why you're interested in this opportunity and what makes you a great fit for the role..."
                    className="min-h-40 resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-xs">{(field.value?.length || 0)}/2000 characters</FormDescription>
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
                <FormLabel className="text-base font-semibold">Additional Message (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any additional information you'd like to share..."
                    className="min-h-24 resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-xs">{(field.value?.length || 0)}/1000 characters</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col-reverse gap-3 pt-6 sm:flex-row">
            <Button type="button" onClick={onCancel} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-primary text-white hover:bg-primary/90"
              size="lg"
            >
              {isPending ? (
                <>
                  <span className="mr-2">Submitting...</span>
                  <span className="animate-spin">⏳</span>
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
