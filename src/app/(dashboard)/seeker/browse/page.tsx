"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { JobCard } from "../_components/job-card"
import { FilterSidebar } from "../_components/filter-sidebar"
import { SearchBar } from "../_components/search-bar"
import { mockJobPosts, mockSavedJobs } from "@/lib/mock-data"
import type { JobType } from "@/types/models"

export default function BrowsePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTypes, setSelectedTypes] = useState<JobType[]>([])
  const [savedJobs, setSavedJobs] = useState(
    new Set(mockSavedJobs.map((j: { jobPostId: string }) => j.jobPostId))
  )

  const filteredJobs = useMemo(() => {
    return mockJobPosts.filter((job: any) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(job.type)

      return matchesSearch && matchesType
    })
  }, [searchQuery, selectedTypes])

  const handleSaveJob = (jobId: string) => {
    setSavedJobs((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(jobId)) {
        newSet.delete(jobId)
      } else {
        newSet.add(jobId)
      }
      return newSet
    })
  }

  const handleTypeChange = (type: JobType, checked: boolean) => {
    setSelectedTypes((prev) => (checked ? [...prev, type] : prev.filter((t) => t !== type)))
  }

  const handleReset = () => {
    setSelectedTypes([])
    setSearchQuery("")
  }

  const handleViewDetails = (jobId: string) => {
    router.push(`/seeker/jobs/${jobId}`)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-foreground">Find Your Next Opportunity</h1>
        <p className="text-muted-foreground">Browse exciting projects, startups, and competitions</p>
      </div>

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search jobs by title, keywords, or skills..."
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-4">
        <div>
          <FilterSidebar selectedTypes={selectedTypes} onTypeChange={handleTypeChange} onReset={handleReset} />
        </div>

        <div className="lg:col-span-3">
          {filteredJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-12">
              <p className="text-lg font-semibold text-foreground">No jobs match your filters</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
              <button onClick={handleReset} className="mt-4 text-polynesian_blue hover:underline">
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredJobs.map((job: any) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isSaved={savedJobs.has(job.id)}
                  onSave={handleSaveJob}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
