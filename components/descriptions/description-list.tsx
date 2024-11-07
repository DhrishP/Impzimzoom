"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useData } from "@/contexts/DataContext"
import { useToast } from "@/hooks/use-toast"
import { Description } from "@prisma/client"
import EditDescriptionDialog from "./edit-description-dialog"

export function DescriptionList() {
  const { descriptions, loading, refreshData, deleteData, searchTerms } = useData()
  const { toast } = useToast()
  const [editingDescription, setEditingDescription] = useState<Description | null>(null)

  useEffect(() => {
    refreshData('descriptions')
  }, [refreshData])

  const handleDelete = async (id: string) => {
    try {
      await deleteData("descriptions", id)
      toast({
        title: "Success",
        description: "Description deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete description",
        variant: "destructive",
      })
    }
  }

  const filteredDescriptions = descriptions.filter((description) =>
    description.title.toLowerCase().includes(searchTerms.descriptions.toLowerCase()) ||
    description.content.toLowerCase().includes(searchTerms.descriptions.toLowerCase()) ||
    description.category.toLowerCase().includes(searchTerms.descriptions.toLowerCase())
  )

  if (loading.descriptions) {
    return <div>Loading descriptions...</div>
  }

  return (
    <div className="space-y-4">
      {filteredDescriptions.map((description) => (
        <Card key={description.id} className="p-4 hover:shadow-md transition">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold mb-2">{description.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-3">{description.content}</p>
            </div>
            <div className="flex items-start gap-2 ml-4">
              <Badge>{description.category}</Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditingDescription(description)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(description.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            Updated {formatDistanceToNow(new Date(description.updatedAt))} ago
          </div>
        </Card>
      ))}
      
      {editingDescription && (
        <EditDescriptionDialog
          description={editingDescription}
          open={!!editingDescription}
          onOpenChange={() => setEditingDescription(null)}
        />
      )}
    </div>
  )
}