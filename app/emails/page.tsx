"use client"

import { useState } from "react"
import { Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { EmailList } from "@/components/emails/email-list"
import { CreateEmailDialog } from "@/components/emails/create-email-dialog"

export default function EmailsPage() {
  const [open, setOpen] = useState(false)
  
  return (
    <div className="h-full p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold">Email Templates</h2>
          <p className="text-muted-foreground">Manage your professional email templates</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Template
        </Button>
      </div>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search templates..." className="pl-10" />
      </div>
      
      <EmailList />
      <CreateEmailDialog open={open} onOpenChange={setOpen} />
    </div>
  )
}