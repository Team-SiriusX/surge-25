"use client"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { JobType } from "@/types/models"
import { Filter, RotateCcw, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

interface FilterSidebarProps {
  selectedTypes: JobType[]
  onTypeChange: (type: JobType, checked: boolean) => void
  onReset: () => void
}

const jobTypes = [
  { 
    value: JobType.ACADEMIC_PROJECT, 
    label: "Academic Projects",
    gradient: "from-blue-500/10 to-blue-500/5",
    color: "text-blue-600 dark:text-blue-400",
    border: "border-blue-500/20"
  },
  { 
    value: JobType.STARTUP_COLLABORATION, 
    label: "Startups",
    gradient: "from-purple-500/10 to-purple-500/5",
    color: "text-purple-600 dark:text-purple-400",
    border: "border-purple-500/20"
  },
  { 
    value: JobType.PART_TIME_JOB, 
    label: "Part-Time",
    gradient: "from-green-500/10 to-green-500/5",
    color: "text-green-600 dark:text-green-400",
    border: "border-green-500/20"
  },
  { 
    value: JobType.COMPETITION_HACKATHON, 
    label: "Hackathons",
    gradient: "from-orange-500/10 to-orange-500/5",
    color: "text-orange-600 dark:text-orange-400",
    border: "border-orange-500/20"
  },
  { 
    value: JobType.INTERNSHIP, 
    label: "Internship",
    gradient: "from-pink-500/10 to-pink-500/5",
    color: "text-pink-600 dark:text-pink-400",
    border: "border-pink-500/20"
  },
  { 
    value: JobType.FREELANCE, 
    label: "Freelance",
    gradient: "from-amber-500/10 to-amber-500/5",
    color: "text-amber-600 dark:text-amber-400",
    border: "border-amber-500/20"
  },
]

export function FilterSidebar({ selectedTypes, onTypeChange, onReset }: FilterSidebarProps) {
  return (
    <Card className="sticky top-6 overflow-hidden border-border/50 bg-gradient-to-br from-card via-card to-card/95 backdrop-blur-sm shadow-lg">
      {/* Decorative gradient */}
      <div className="absolute right-0 top-0 h-32 w-32 bg-gradient-to-br from-primary/5 to-transparent blur-2xl" />
      
      <div className="relative p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-sm">
              <Filter className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Filters</h2>
              <p className="text-xs text-muted-foreground">Refine your search</p>
            </div>
          </div>
          {selectedTypes.length > 0 && (
            <Badge variant="secondary" className="bg-primary/10 text-primary font-semibold">
              {selectedTypes.length}
            </Badge>
          )}
        </div>

        {/* Divider */}
        <div className="mb-6 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Job Type Section */}
        <div className="mb-6">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Job Type</h3>
          </div>
          
          <div className="space-y-2">
            {jobTypes.map((type, index) => {
              const isSelected = selectedTypes.includes(type.value);
              
              return (
                <motion.div
                  key={type.value}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`group relative overflow-hidden rounded-xl border transition-all duration-300 ${
                    isSelected 
                      ? `${type.border} bg-gradient-to-r ${type.gradient} shadow-sm` 
                      : 'border-border/40 bg-muted/20 hover:border-border hover:bg-muted/40'
                  }`}
                >
                  {/* Subtle shimmer effect on selected */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
                  )}
                  
                  <label
                    htmlFor={type.value}
                    className="flex cursor-pointer items-center gap-3.5 p-3.5 transition-all"
                  >
                    <Checkbox
                      id={type.value}
                      checked={isSelected}
                      onCheckedChange={(checked) => onTypeChange(type.value, checked as boolean)}
                      className={isSelected ? type.color : ''}
                    />
                    <span className={`flex-1 text-sm font-semibold leading-none transition-colors ${
                      isSelected ? type.color : 'text-foreground'
                    }`}>
                      {type.label}
                    </span>
                  </label>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="mb-6 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Reset Button */}
        <Button 
          onClick={onReset} 
          variant="outline" 
          size="sm"
          className="w-full gap-2.5 border-border/50 bg-muted/30 font-semibold hover:bg-destructive hover:text-destructive-foreground hover:border-destructive/50 transition-all duration-300"
          disabled={selectedTypes.length === 0}
        >
          <RotateCcw className="h-4 w-4" />
          Reset all filters
        </Button>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
      `}</style>
    </Card>
  )
}
