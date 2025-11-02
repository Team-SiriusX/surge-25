"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TagInput } from "@/components/ui/tag-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCreateJob } from "../_api";
import { $Enums } from "@/generated/prisma";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  type: z.nativeEnum($Enums.JobType, {
    error: "Please select a job type",
  }),
  category: z.nativeEnum($Enums.JobCategory, {
    error: "Please select a category",
  }),
  location: z.string().optional(),
  duration: z.string().optional(),
  compensation: z.string().optional(),
  requirements: z.array(z.string()),
  tags: z.array(z.string()),
});

type FormValues = z.infer<typeof formSchema>;

interface CreatePostModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

// Helper function to convert enum value to readable label
const formatEnumLabel = (value: string): string => {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

// Generate job types from enum
const JOB_TYPES = Object.values($Enums.JobType).map((type) => ({
  value: type,
  label: formatEnumLabel(type),
}));

// Generate job categories from enum
const JOB_CATEGORIES = Object.values($Enums.JobCategory).map((category) => ({
  value: category,
  label: formatEnumLabel(category),
}));

export function CreatePostModal({ onClose, onSuccess }: CreatePostModalProps) {
  const { mutate: createJob, isPending } = useCreateJob();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      duration: "",
      compensation: "",
      requirements: [],
      tags: [],
    },
  });

  const onSubmit = (values: FormValues) => {
    createJob(
      {
        title: values.title,
        description: values.description,
        type: values.type,
        category: values.category,
        location: values.location || undefined,
        duration: values.duration || undefined,
        compensation: values.compensation || undefined,
        requirements: values.requirements,
        tags: values.tags,
        status: "ACTIVE",
        isDraft: false,
      },
      {
        onSuccess: () => {
          form.reset();
          onSuccess();
          onClose();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4 backdrop-blur-sm">
      <Card className="w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] flex flex-col overflow-hidden">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-card px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex-1 min-w-0 pr-2">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold truncate">Create New Post</h2>
            <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Fill in the details to publish your opportunity</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0 h-8 w-8 sm:h-10 sm:w-10">
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="p-4 sm:p-6 space-y-4 sm:space-y-6"
            >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Post Type *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Select a job type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {JOB_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value} className="text-sm">
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Category *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {JOB_CATEGORIES.map((category) => (
                          <SelectItem key={category.value} value={category.value} className="text-sm">
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter post title" {...field} className="text-sm" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the opportunity in detail"
                      className="min-h-[100px] sm:min-h-[120px] resize-none text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., New York, NY" {...field} className="text-sm" />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Duration</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 3 months" {...field} className="text-sm" />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="compensation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Compensation</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., $500/month or Unpaid"
                      {...field}
                      className="text-sm"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Requirements</FormLabel>
                  <FormControl>
                    <TagInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Press Enter or comma to add requirements"
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Press Enter or comma to add each requirement
                  </FormDescription>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Tags</FormLabel>
                  <FormControl>
                    <TagInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Press Enter or comma to add tags"
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Press Enter or comma to add each tag
                  </FormDescription>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 justify-end pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending}
                className="w-full sm:w-auto text-sm"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="w-full sm:w-auto text-sm">
                {isPending ? "Creating..." : "Publish Post"}
              </Button>
            </div>
            </form>
          </Form>
        </div>
      </Card>
    </div>
  );
}
