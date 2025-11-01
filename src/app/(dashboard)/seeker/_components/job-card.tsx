"use client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, MapPin, Clock, DollarSign, ArrowRight, TrendingUp, Sparkles } from "lucide-react";
import { JobPost, JobType } from "@/generated/prisma";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

interface JobCardProps {
  job: JobPost & { hasSaved?: boolean; matchScore?: number };
  isSaved?: boolean;
  onSave?: (jobId: string, isSaved: boolean) => void;
  onViewDetails?: (jobId: string) => void;
}

const jobTypeColors: Record<JobType, { gradient: string; text: string; border: string }> = {
  [JobType.ACADEMIC_PROJECT]: { 
    gradient: "from-blue-500/10 via-blue-500/5 to-transparent", 
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-500/20"
  },
  [JobType.STARTUP_COLLABORATION]: { 
    gradient: "from-purple-500/10 via-purple-500/5 to-transparent", 
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-500/20"
  },
  [JobType.PART_TIME_JOB]: { 
    gradient: "from-green-500/10 via-green-500/5 to-transparent", 
    text: "text-green-600 dark:text-green-400",
    border: "border-green-500/20"
  },
  [JobType.COMPETITION_HACKATHON]: { 
    gradient: "from-orange-500/10 via-orange-500/5 to-transparent", 
    text: "text-orange-600 dark:text-orange-400",
    border: "border-orange-500/20"
  },
  [JobType.INTERNSHIP]: { 
    gradient: "from-pink-500/10 via-pink-500/5 to-transparent", 
    text: "text-pink-600 dark:text-pink-400",
    border: "border-pink-500/20"
  },
  [JobType.FREELANCE]: { 
    gradient: "from-amber-500/10 via-amber-500/5 to-transparent", 
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-500/20"
  },
};

const jobTypeLabels: Record<JobType, string> = {
  [JobType.ACADEMIC_PROJECT]: "Academic Project",
  [JobType.STARTUP_COLLABORATION]: "Startup",
  [JobType.PART_TIME_JOB]: "Part-Time",
  [JobType.COMPETITION_HACKATHON]: "Hackathon",
  [JobType.INTERNSHIP]: "Internship",
  [JobType.FREELANCE]: "Freelance",
};

export function JobCard({
  job,
  isSaved = false,
  onSave,
  onViewDetails,
}: JobCardProps) {
  const saved = isSaved ?? job.hasSaved ?? false;
  const [isHovered, setIsHovered] = useState(false);
  const typeConfig = jobTypeColors[job.type];

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="group relative overflow-hidden border bg-gradient-to-br from-card via-card to-card/95 backdrop-blur-sm transition-all duration-500 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5">
        {/* Premium gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${typeConfig.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        
        {/* Accent line */}
        <div className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${typeConfig.gradient.replace('to-transparent', 'to-current')} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:20px_20px]" />
        </div>

        <div className="relative p-6">
          {/* Header */}
          <div className="mb-5 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="mb-3 flex items-center gap-2 flex-wrap">
                <Badge className={`${typeConfig.border} ${typeConfig.text} bg-gradient-to-r ${typeConfig.gradient} border backdrop-blur-sm px-3 py-1 text-xs font-semibold shadow-sm`}>
                  {jobTypeLabels[job.type]}
                </Badge>
                {job.matchScore !== undefined && job.matchScore > 0 && (
                  <Badge variant="outline" className="gap-1.5 border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent backdrop-blur-sm px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 shadow-sm">
                    <Sparkles className="h-3 w-3" />
                    {job.matchScore}% match
                  </Badge>
                )}
              </div>
              <h3 className="text-lg font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-tight mb-1">
                {job.title}
              </h3>
            </div>
            
            <button
              onClick={(e) => {
                e.preventDefault();
                onSave?.(job.id, saved);
              }}
              className="flex-shrink-0 rounded-xl p-2.5 text-muted-foreground transition-all duration-300 hover:bg-primary/10 hover:text-primary hover:scale-110 active:scale-95"
              aria-label={saved ? "Remove bookmark" : "Bookmark"}
            >
              <Bookmark
                size={20}
                className={`transition-all duration-300 ${
                  saved 
                    ? "fill-primary text-primary scale-110" 
                    : ""
                }`}
              />
            </button>
          </div>

          {/* Description */}
          <p className="mb-5 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {job.description}
          </p>

          {/* Job Details */}
          <div className="mb-5 grid grid-cols-3 gap-3">
            {job.location && (
              <div className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2 transition-colors group-hover:bg-muted/60">
                <MapPin size={15} className="text-primary shrink-0" />
                <span className="text-xs font-medium truncate">{job.location}</span>
              </div>
            )}
            {job.duration && (
              <div className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2 transition-colors group-hover:bg-muted/60">
                <Clock size={15} className="text-blue-500 shrink-0" />
                <span className="text-xs font-medium truncate">{job.duration}</span>
              </div>
            )}
            {job.compensation && (
              <div className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2 transition-colors group-hover:bg-muted/60">
                <DollarSign size={15} className="text-emerald-500 shrink-0" />
                <span className="text-xs font-semibold truncate">{job.compensation}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="mb-6 flex flex-wrap gap-2">
            {job.tags.slice(0, 4).map((tag: string) => (
              <span key={tag} className="rounded-lg bg-muted/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted">
                {tag}
              </span>
            ))}
            {job.tags.length > 4 && (
              <span className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                +{job.tags.length - 4} more
              </span>
            )}
          </div>

          {/* Action Button */}
          <Link href={`/seeker/jobs/${job.id}`} className="block">
            <Button 
              variant="ghost" 
              className="w-full justify-between bg-muted/30 hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-semibold group/btn"
            >
              <span>View details</span>
              <ArrowRight className={`h-4 w-4 transition-transform duration-300 ${isHovered ? 'translate-x-2' : ''} group-hover/btn:translate-x-2`} />
            </Button>
          </Link>
        </div>
      </Card>
    </motion.div>
  );
}
