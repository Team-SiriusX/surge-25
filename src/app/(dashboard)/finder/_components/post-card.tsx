"use client"

import { Eye, Users, Edit, Trash2, CheckCircle, MoreVertical } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"
import { useDeleteJob, useUpdateJob } from "../_api"
import { useState } from "react"

interface PostCardProps {
  post: any
  categoryColor: string
  formatType: (type: string) => string
}

export function PostCard({ post, categoryColor, formatType }: PostCardProps) {
  const router = useRouter()
  const { mutate: deleteJob, isPending: isDeleting } = useDeleteJob()
  const { mutate: updateJob, isPending: isUpdating } = useUpdateJob(post.id)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400"
      case "DRAFT":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-400"
      case "CLOSED":
        return "bg-gray-100 text-gray-800 dark:bg-gray-950/30 dark:text-gray-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-950/30 dark:text-gray-400"
    }
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/finder/posts/${post.id}/edit`)
  }

  const handleDelete = () => {
    deleteJob(post.id)
    setShowDeleteDialog(false)
  }

  const handleMarkAsFilled = (e: React.MouseEvent) => {
    e.stopPropagation()
    updateJob({ status: "CLOSED" })
  }

  const handleMarkAsActive = (e: React.MouseEvent) => {
    e.stopPropagation()
    updateJob({ status: "ACTIVE" })
  }

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-start gap-3">
            <div className="flex-1 cursor-pointer" onClick={() => router.push(`/finder/posts/${post.id}`)}>
              <CardTitle className="line-clamp-2">{post.title}</CardTitle>
              <Badge className={`mt-2 ${categoryColor}`}>{formatType(post.type)}</Badge>
            </div>
            
            {/* Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Post
                </DropdownMenuItem>
                
                {post.status === "ACTIVE" ? (
                  <DropdownMenuItem onClick={handleMarkAsFilled}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark as Filled
                  </DropdownMenuItem>
                ) : post.status === "CLOSED" ? (
                  <DropdownMenuItem onClick={handleMarkAsActive}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Reopen Post
                  </DropdownMenuItem>
                ) : null}
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowDeleteDialog(true)
                  }}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="cursor-pointer" onClick={() => router.push(`/finder/posts/${post.id}`)}>
            <p className="text-sm text-muted-foreground line-clamp-2">{post.description}</p>

            {post.location && (
              <div className="text-sm mt-3">
                <span className="font-semibold">Location:</span>
                <span className="ml-2 text-muted-foreground">{post.location}</span>
              </div>
            )}

            <div className="flex items-center gap-4 py-2 mt-3">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{post.views || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{post._count?.applications || 0}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <Badge className={getStatusColor(post.status)}>
              {post.status === "DRAFT" ? "Draft" : post.status === "ACTIVE" ? "Active" : post.status === "CLOSED" ? "Filled" : "Closed"}
            </Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                router.push(`/finder/posts/${post.id}`)
              }}
            >
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your job post
              and all associated applications.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
