"use client"

import { useState } from "react"
import { Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DescriptionList } from "@/components/descriptions/description-list"
import { CreateDescriptionDialog } from "@/components/descriptions/create-description-dialog"
import { useData } from "@/contexts/DataContext"
import { useHotkeys } from "@/hooks/use-keyboard-shortcuts"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function DescriptionsPage() {
  const [open, setOpen] = useState(false)
const {searchTerms,setSearchTerm} = useData()
  
  useHotkeys(() => setOpen(true))
  
  return (
    <div className="h-full p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold">Descriptions</h2>
          <p className="text-muted-foreground">Store your professional descriptions and bios</p>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={() => setOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Description
                <span className="ml-2 text-xs text-muted-foreground">(Alt+N)</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Create new description (Alt+N)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="relative mb-6">
  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
  <Input 
    placeholder="Search descriptions..." 
    className="pl-10"
    value={searchTerms.descriptions}
    onChange={(e) => setSearchTerm("descriptions", e.target.value)}
  />
</div>
      
      <DescriptionList />
      <CreateDescriptionDialog open={open} onOpenChange={setOpen} />
    </div>
  )
}