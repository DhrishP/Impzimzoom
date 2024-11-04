"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const mockCredentials = [
  {
    id: "1",
    title: "GitHub Account",
    username: "johndoe",
    password: "********",
    url: "https://github.com",
  },
  {
    id: "2",
    title: "AWS Console",
    username: "admin",
    password: "********",
    url: "https://aws.amazon.com",
  },
]

export function CredentialList() {
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({})

  const togglePassword = (id: string) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  return (
    <div className="space-y-4">
      {mockCredentials.map((credential) => (
        <Card key={credential.id} className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold mb-2">{credential.title}</h3>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="text-muted-foreground">Username:</span> {credential.username}
                </p>
                <p className="text-sm flex items-center gap-2">
                  <span className="text-muted-foreground">Password:</span>
                  {visiblePasswords[credential.id] ? "actualpassword" : "********"}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4"
                    onClick={() => togglePassword(credential.id)}
                  >
                    {visiblePasswords[credential.id] ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </p>
              </div>
            </div>
            {credential.url && (
              <Button variant="ghost" size="icon" asChild>
                <a href={credential.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}