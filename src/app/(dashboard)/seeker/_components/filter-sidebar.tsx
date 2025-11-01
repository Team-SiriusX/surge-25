"use client"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { JobType } from "@/types/models"

interface FilterSidebarProps {
  selectedTypes: JobType[]
  onTypeChange: (type: JobType, checked: boolean) => void
  onReset: () => void
}

const jobTypes = [
  { value: JobType.ACADEMIC_PROJECT, label: "Academic Projects" },
  { value: JobType.STARTUP_COLLABORATION, label: "Startups" },
  { value: JobType.PART_TIME_JOB, label: "Part-Time" },
  { value: JobType.COMPETITION_HACKATHON, label: "Hackathons" },
  { value: JobType.INTERNSHIP, label: "Internship" },
  { value: JobType.FREELANCE, label: "Freelance" },
]

export function FilterSidebar({ selectedTypes, onTypeChange, onReset }: FilterSidebarProps) {
  return (
    <Card className="h-fit p-6">
      <h2 className="mb-4 text-lg font-semibold">Filters</h2>

      <div className="mb-6">
        <h3 className="mb-3 text-sm font-medium">Job Type</h3>
        <div className="space-y-3">
          {jobTypes.map((type) => (
            <div key={type.value} className="flex items-center">
              <Checkbox
                id={type.value}
                checked={selectedTypes.includes(type.value)}
                onCheckedChange={(checked) => onTypeChange(type.value, checked as boolean)}
              />
              <label
                htmlFor={type.value}
                className="ml-2 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {type.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Button onClick={onReset} variant="outline" className="w-full bg-transparent">
        Reset Filters
      </Button>
    </Card>
  )
}
