"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

const mockDescriptions = [
  {
    id: "1",
    title: "Professional Bio",
    content: "Full-stack developer with 5 years of experience...",
    category: "Bio",
    createdAt: new Date("2024-03-20"),
  },
  {
    id: "2",
    title: "Project Description",
    content: "Led the development of a scalable e-commerce platform...",
    category: "Portfolio",
    createdAt: new Date("2024-03-19"),
  },
]

export function DescriptionList() {
  return (
    <div className="space-y-4">
      {mockDescriptions.map((description) => (
        <Card key={description.id} className="p-4 hover:shadow-md transition cursor-pointer">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold mb-2">{description.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-3">{description.content}</p>
            </div>
            <Badge>{description.category}</Badge>
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            Updated {formatDistanceToNow(description.createdAt)} ago
          </div>
        </Card>
      ))}
    </div>
  )
}