"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"

const JOB_TYPES = ["ACADEMIC_PROJECT", "STARTUP_COLLABORATION", "PART_TIME_JOB", "COMPETITION_HACKATHON", "TEAM_SEARCH"]

interface CreatePostModalProps {
  onClose: () => void
  onSuccess: () => void
}

export function CreatePostModal({ onClose, onSuccess }: CreatePostModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    location: "",
    duration: "",
    compensation: "",
    requirements: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Save would happen here
    onSuccess()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Create New Post</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Post Type *</label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {JOB_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type
                      .replace(/_/g, " ")
                      .replace(/([A-Z])/g, " $1")
                      .trim()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter post title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description *</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the opportunity"
              rows={5}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., New York, NY"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Duration</label>
              <Input
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g., 3 months"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Compensation</label>
            <Input
              value={formData.compensation}
              onChange={(e) => setFormData({ ...formData, compensation: e.target.value })}
              placeholder="e.g., $500/month"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Requirements</label>
            <Textarea
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              placeholder="List requirements (comma-separated)"
              rows={3}
            />
          </div>

          <div className="flex gap-3 justify-end pt-6 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Publish Post</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
