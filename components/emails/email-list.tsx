"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

const mockEmails = [
  {
    id: "1",
    title: "Cold Outreach Template",
    content: "Hi {name},\n\nI noticed your work on...",
    category: "Outreach",
    createdAt: new Date("2024-03-20"),
  },
  {
    id: "2",
    title: "Follow-up Template",
    content: "Hi {name},\n\nJust following up on...",
    category: "Follow-up",
    createdAt: new Date("2024-03-19"),
  },
]

export function EmailList() {
  return (
    <div className="space-y-4">
      {mockEmails.map((email) => (
        <Card key={email.id} className="p-4 hover:shadow-md transition cursor-pointer">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold mb-2">{email.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{email.content}</p>
            </div>
            <Badge>{email.category}</Badge>
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            Created {formatDistanceToNow(email.createdAt)} ago
          </div>
        </Card>
      ))}
    </div>
  )
}