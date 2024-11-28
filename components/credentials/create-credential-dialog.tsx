"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useData } from "@/contexts/DataContext"
import { useToast } from "@/hooks/use-toast"
import { SecretKeyModal } from "./secret-key-modal"
import { encryptPassword } from "@/lib/encryption"

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  url: z.string().url("Must be a valid URL").or(z.string().length(0)),
  notes: z.string(),
})

type FormData = z.infer<typeof formSchema>

export function CreateCredentialDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { addData } = useData()
  const { toast } = useToast()
  const [showSecretKeyModal, setShowSecretKeyModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      username: "",
      password: "",
      url: "",
      notes: "",
    },
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false)
      }
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        form.handleSubmit(onSubmit)()
      }
      if (e.key === "ArrowDown") {
        e.preventDefault()
        const inputs = document.querySelectorAll('input, textarea')
        const currentElement = document.activeElement
        const currentIndex = Array.from(inputs).indexOf(currentElement as Element)
        const nextElement = inputs[currentIndex + 1]
        if (nextElement) {
          (nextElement as HTMLElement).focus()
        }
      }
      if (e.key === "ArrowUp") {
        e.preventDefault()
        const inputs = document.querySelectorAll('input, textarea')
        const currentElement = document.activeElement
        const currentIndex = Array.from(inputs).indexOf(currentElement as Element)
        const prevElement = inputs[currentIndex - 1]
        if (prevElement) {
          (prevElement as HTMLElement).focus()
        }
      }
    }

    if (open) {
      window.addEventListener("keydown", handleKeyDown)
    }

    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, onOpenChange, form])

  const onSubmit = async (data: FormData) => {
    setShowSecretKeyModal(true)
  }

  const handleEncrypt = async (secretKey: string) => {
    setLoading(true)
    try {
      const formData = form.getValues()
      const encryptedPassword = await encryptPassword(formData.password, secretKey)
      const dataWithEncryptedPassword = {
        ...formData,
        password: encryptedPassword,
      }
      
      await addData("credentials", dataWithEncryptedPassword)
      setShowSecretKeyModal(false)
      onOpenChange(false)
      form.reset()
      toast({
        title: "Success",
        description: "Credential created successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create credential",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Create New Credential</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  {...form.register("title")}
                  placeholder="Enter credential title"
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  {...form.register("username")}
                  placeholder="Enter username"
                />
                {form.formState.errors.username && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.username.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...form.register("password")}
                  placeholder="Enter password"
                />
                {form.formState.errors.password && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">URL (optional)</Label>
                <Input
                  id="url"
                  {...form.register("url")}
                  placeholder="Enter URL"
                />
                {form.formState.errors.url && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.url.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  {...form.register("notes")}
                  placeholder="Enter additional notes"
                />
                {form.formState.errors.notes && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.notes.message}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Credential"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <SecretKeyModal
        open={showSecretKeyModal}
        onOpenChange={setShowSecretKeyModal}
        onSubmit={handleEncrypt}
        action="encrypt"
      />
    </>
  )
}