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
import { Loader2, Sparkles, TrendingUp, Award, Briefcase } from "lucide-react"
import type { JobType } from "@/types/models"
import { motion } from "framer-motion"

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
    <div className="min-h-screen">
      {/* Premium Hero Banner with Background Image */}
      <div className="relative mb-8 overflow-hidden bg-slate-900 dark:bg-slate-950">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2400&q=80&brightness=1.1&contrast=1.05" 
            alt="Team collaboration"
            className="h-full w-full object-cover scale-105"
            style={{ filter: 'brightness(1.15) contrast(1.05)' }}
          />
          {/* Subtle gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/75 via-slate-900/40 to-slate-900/75 dark:from-slate-950/80 dark:via-slate-950/50 dark:to-slate-950/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-slate-900/30 dark:from-slate-950/70 dark:to-slate-950/30" />
          {/* Premium vignette effect */}
          <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.3)]" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 px-6 py-20 md:px-8 md:py-24 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              {/* Text backdrop blur */}
              <div className="absolute inset-0 -z-10 backdrop-blur-[2px]" />
              
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/20 px-4 py-2 backdrop-blur-xl shadow-2xl shadow-black/20">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/60" />
                <span className="text-sm font-semibold text-white tracking-wide">Live Opportunities</span>
              </div>
              
              <h1 className="mb-5 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                Discover Your Next
                <br />
                <span className="bg-gradient-to-r from-blue-300 via-cyan-300 to-teal-300 bg-clip-text text-transparent drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                  Career Move
                </span>
              </h1>
              
              <p className="mb-10 text-lg leading-relaxed text-white/90 md:text-xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] font-medium max-w-2xl">
                Connect with innovative projects, startups, and opportunities that match your expertise and ambitions.
              </p>

              {/* Stats Bar */}
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/25 backdrop-blur-xl border border-white/40 shadow-2xl shadow-black/10">
                    <Briefcase className="h-5 w-5 text-white drop-shadow-lg" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg drop-shadow-md">{filteredJobs.length}+</p>
                    <p className="text-xs text-white/80 font-semibold tracking-wide">Active Listings</p>
                  </div>
                </div>
                
                <div className="h-12 w-px bg-white/40 shadow-sm" />
                
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/25 backdrop-blur-xl border border-white/40 shadow-2xl shadow-black/10">
                    <TrendingUp className="h-5 w-5 text-white drop-shadow-lg" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg drop-shadow-md">AI Powered</p>
                    <p className="text-xs text-white/80 font-semibold tracking-wide">Smart Matching</p>
                  </div>
                </div>
                
                <div className="h-12 w-px bg-white/40 shadow-sm" />
                
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/25 backdrop-blur-xl border border-white/40 shadow-2xl shadow-black/10">
                    <Award className="h-5 w-5 text-white drop-shadow-lg" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg drop-shadow-md">Verified</p>
                    <p className="text-xs text-white/80 font-semibold tracking-wide">Companies</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mx-auto mb-8 max-w-7xl px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by role, skills, or company..."
          />
        </motion.div>
      </div>

      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <FilterSidebar selectedTypes={selectedTypes} onTypeChange={handleTypeChange} onReset={handleReset} />
          </motion.div>

          {/* Main Content */}
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {!isLoading && (
                  <span className="font-medium text-foreground">
                    {filteredJobs.length} {filteredJobs.length === 1 ? "position" : "positions"}
                  </span>
                )}
              </div>
              <SortFilter value={sortBy} onChange={handleSortChange} hasSearchQuery={!!searchQuery} />
            </div>

            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-80 w-full rounded-xl" />
                ))}
              </div>
            ) : filteredJobs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-20"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Briefcase className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">No positions found</h3>
                <p className="mb-6 text-sm text-muted-foreground">Try adjusting your filters or search query</p>
                <Button onClick={handleReset} variant="outline" size="sm">
                  Clear all filters
                </Button>
              </motion.div>
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2">
                  {filteredJobs.map((job: any, index: number) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
                    >
                      <JobCard
                        job={job}
                        isSaved={job.hasSaved}
                        onSave={handleSaveJob}
                        onViewDetails={handleViewDetails}
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Infinite scroll trigger */}
                <div ref={loadMoreRef} className="mt-8 flex justify-center">
                  {isFetchingNextPage && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading more positions...</span>
                    </div>
                  )}
                  {!hasNextPage && filteredJobs.length > 0 && (
                    <p className="text-sm text-muted-foreground">End of results</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
