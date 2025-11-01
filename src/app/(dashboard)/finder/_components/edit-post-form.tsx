"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { $Enums } from "@/generated/prisma";
import { useEffect } from "react";

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
  status: z.nativeEnum($Enums.PostStatus).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditPostFormProps {
  post: any;
  onSubmit: (data: any) => void;
  isPending: boolean;
  onCancel: () => void;
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

// Status options
const STATUS_OPTIONS = [
  { value: $Enums.PostStatus.ACTIVE, label: "Active" },
  { value: $Enums.PostStatus.DRAFT, label: "Draft" },
  { value: $Enums.PostStatus.CLOSED, label: "Closed" },
];

export function EditPostForm({ post, onSubmit, isPending, onCancel }: EditPostFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post.title || "",
      description: post.description || "",
      type: post.type,
      category: post.category,
      location: post.location || "",
      duration: post.duration || "",
      compensation: post.compensation || "",
      requirements: Array.isArray(post.requirements) ? post.requirements : [],
      tags: Array.isArray(post.tags) ? post.tags : [],
      status: post.status || "ACTIVE",
    },
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit({
      title: values.title,
      description: values.description,
      type: values.type,
      category: values.category,
      location: values.location || undefined,
      duration: values.duration || undefined,
      compensation: values.compensation || undefined,
      requirements: values.requirements,
      tags: values.tags,
      status: values.status,
    });
  };

  return (
    <Card>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="p-6 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Post Type *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {JOB_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {JOB_CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Senior React Developer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the job or project in detail..."
                    rows={6}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Minimum 10 characters
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Remote, New York" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 3 months, Full-time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="compensation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Compensation</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., $50/hour, Equity" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

            <FormField
              control={form.control}
              name="requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Requirements</FormLabel>
                  <FormControl>
                    <TagInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Press Enter or comma to add requirements"
                    />
                  </FormControl>
                  <FormDescription>
                    Press Enter or comma to add each requirement
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <TagInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Press Enter or comma to add tags"
                    />
                  </FormControl>
                  <FormDescription>
                    Press Enter or comma to add each tag
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Set to "Closed" if position is filled
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Updating..." : "Update Post"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
