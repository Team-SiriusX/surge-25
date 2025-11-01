"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpDown } from "lucide-react"

type SortOption = "relevance" | "matchScore" | "createdAt" | "views"

interface SortFilterProps {
  value: SortOption
  onChange: (value: SortOption) => void
  hasSearchQuery?: boolean
}

export function SortFilter({ value, onChange, hasSearchQuery }: SortFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="size-4 text-muted-foreground" />
      <Select value={value} onValueChange={(val) => onChange(val as SortOption)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {hasSearchQuery && (
            <SelectItem value="relevance">
              <div className="flex items-center gap-2">
                <span>Relevance</span>
                {hasSearchQuery && <span className="text-xs text-muted-foreground">(Search)</span>}
              </div>
            </SelectItem>
          )}
          <SelectItem value="matchScore">
            <div className="flex items-center gap-2">
              <span>Best Match</span>
              <span className="text-xs text-muted-foreground">(Profile)</span>
            </div>
          </SelectItem>
          <SelectItem value="createdAt">Latest</SelectItem>
          <SelectItem value="views">Most Viewed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
