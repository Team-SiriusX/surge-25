"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

const applyFormSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  coverLetter: z
    .string()
    .min(50, { message: "Cover letter must be at least 50 characters." })
    .max(2000, { message: "Cover letter must not exceed 2000 characters." }),
  linkedinUrl: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  portfolio: z.string().url("Invalid portfolio URL").optional().or(z.literal("")),
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
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ApplyFormValues>({
    resolver: zodResolver(applyFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      coverLetter: "",
      linkedinUrl: "",
      portfolio: "",
    },
  })

  async function onSubmit(values: ApplyFormValues) {
    try {
      setIsLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSubmitted(true)
      // Auto-close after 3 seconds
      setTimeout(() => {
        onSuccess?.()
      }, 3000)
    } catch (error) {
      console.error("[v0] Form submission error:", error)
    } finally {
      setIsLoading(false)
    }
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
          {/* Full Name */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name *</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john@example.com" {...field} />
                </FormControl>
                <FormDescription>We'll use this to contact you about your application.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number *</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="+1 (555) 123-4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* LinkedIn URL */}
          <FormField
            control={form.control}
            name="linkedinUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn Profile (Optional)</FormLabel>
                <FormControl>
                  <Input type="url" placeholder="https://linkedin.com/in/johndoe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Portfolio */}
          <FormField
            control={form.control}
            name="portfolio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Portfolio / Website (Optional)</FormLabel>
                <FormControl>
                  <Input type="url" placeholder="https://johndoe.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Cover Letter */}
          <FormField
            control={form.control}
            name="coverLetter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cover Letter *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us why you're interested in this opportunity and what makes you a great fit for the role..."
                    className="min-h-40 resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>{field.value.length}/2000 characters</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading || !form.formState.isValid}
              className="flex-1 bg-polynesian_blue hover:bg-polynesian_blue/90"
            >
              {isLoading ? "Submitting..." : "Submit Application"}
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
