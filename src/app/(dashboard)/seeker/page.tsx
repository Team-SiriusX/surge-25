"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { JobCard } from "./_components/job-card"
import { FilterSidebar } from "./_components/filter-sidebar"
import { SearchBar } from "./_components/search-bar"
import { SortFilter } from "./_components/sort-filter"
import { useGetJobsInfinite, useSaveJob, useUnsaveJob } from "./_api"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import type { JobType } from "@/types/models"

type SortOption = "relevance" | "matchScore" | "createdAt" | "views"

export default function BrowsePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTypes, setSelectedTypes] = useState<JobType[]>([])
  const [sortBy, setSortBy] = useState<SortOption>("relevance")
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Use relevance only when there's a search query, otherwise use matchScore
  const effectiveSortBy = searchQuery && sortBy === "relevance" ? "relevance" : sortBy === "relevance" ? "matchScore" : sortBy

  // Fetch jobs with infinite loading
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useGetJobsInfinite({
    q: searchQuery || undefined,
    type: selectedTypes.length === 1 ? selectedTypes[0] : undefined,
    sortBy: effectiveSortBy,
    limit: "10",
  })

  const { mutate: saveJob } = useSaveJob()
  const { mutate: unsaveJob } = useUnsaveJob()

  // Flatten paginated data
  const jobs = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) || []
  }, [data])

  // Client-side filtering for multiple types (API only supports single type filter)
  const filteredJobs = useMemo(() => {
    if (selectedTypes.length <= 1) return jobs
    return jobs.filter((job: any) => selectedTypes.includes(job.type))
  }, [jobs, selectedTypes])

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 }
    )

    const currentRef = loadMoreRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const handleSaveJob = (jobId: string, isSaved: boolean) => {
    if (isSaved) {
      unsaveJob(jobId)
    } else {
      saveJob(jobId)
    }
  }

  const handleTypeChange = (type: JobType, checked: boolean) => {
    setSelectedTypes((prev) => (checked ? [...prev, type] : prev.filter((t) => t !== type)))
  }

  const handleReset = () => {
    setSelectedTypes([])
    setSearchQuery("")
    setSortBy("relevance")
  }

  const handleViewDetails = (jobId: string) => {
    router.push(`/seeker/jobs/${jobId}`)
  }

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort)
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
          <div className="mb-6 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {!isLoading && (
                <span>
                  {filteredJobs.length} {filteredJobs.length === 1 ? "opportunity" : "opportunities"} found
                </span>
              )}
            </div>
            <SortFilter value={sortBy} onChange={handleSortChange} hasSearchQuery={!!searchQuery} />
          </div>

          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-48 w-full" />
                </div>
              ))}
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-12">
              <p className="text-lg font-semibold text-foreground">No jobs match your filters</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
              <button onClick={handleReset} className="mt-4 text-primary hover:underline">
                Reset filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2">
                {filteredJobs.map((job: any) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isSaved={job.hasSaved}
                    onSave={handleSaveJob}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>

              {/* Infinite scroll trigger */}
              <div ref={loadMoreRef} className="mt-8 flex justify-center">
                {isFetchingNextPage && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" />
                    <span>Loading more jobs...</span>
                  </div>
                )}
                {!hasNextPage && filteredJobs.length > 0 && (
                  <p className="text-sm text-muted-foreground">You've reached the end of the list</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
