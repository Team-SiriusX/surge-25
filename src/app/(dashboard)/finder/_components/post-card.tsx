"use client"

import { Eye, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface PostCardProps {
  post: any
  categoryColor: string
  formatType: (type: string) => string
}

export function PostCard({ post, categoryColor, formatType }: PostCardProps) {
  const router = useRouter()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800"
      case "DRAFT":
        return "bg-yellow-100 text-yellow-800"
      case "CLOSED":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push(`/finder/posts/${post.id}`)}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="line-clamp-2">{post.title}</CardTitle>
            <Badge className={`mt-2 ${categoryColor}`}>{formatType(post.type)}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{post.description}</p>

        {post.location && (
          <div className="text-sm">
            <span className="font-semibold">Location:</span>
            <span className="ml-2 text-muted-foreground">{post.location}</span>
          </div>
        )}

        <div className="flex items-center gap-4 py-2">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">{post.views || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">{post._count?.applications || 0}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <Badge className={getStatusColor(post.status)}>
            {post.status === "DRAFT" ? "Draft" : post.status === "ACTIVE" ? "Active" : "Closed"}
          </Badge>
          <Button
            size="sm"
            className="bg-polynesian_blue hover:bg-polynesian_blue/90"
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/finder/posts/${post.id}`)
            }}
          >
            View Post
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
