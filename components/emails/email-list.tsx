"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { useData } from "@/contexts/DataContext";
import { EmailTemplate } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import EditEmailDialog from "@/components/emails/edit-email-dialog";

interface EmailListProps {
  searchTerm: string;
}

export function EmailList() {
  const { emails, loading, deleteData, refreshData, searchTerms } = useData();
  const { toast } = useToast();
  const [editingEmail, setEditingEmail] = useState<EmailTemplate | null>(null);

  useEffect(() => {
    refreshData("emails");
  }, [refreshData]);

  const filteredEmails = emails.filter(
    (email) =>
      email.title.toLowerCase().includes(searchTerms.emails.toLowerCase()) ||
      email.content.toLowerCase().includes(searchTerms.emails.toLowerCase()) ||
      email.category.toLowerCase().includes(searchTerms.emails.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      await deleteData("emails", id);
      toast({
        title: "Success",
        description: "Email template deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete email template",
        variant: "destructive",
      });
    }
  };

  if (loading.emails) {
    return (
      <div className="flex items-center justify-center h-32">
        <p className="text-muted-foreground">Loading email templates...</p>
      </div>
    );
  }

  if (emails.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-32">
        <p className="text-muted-foreground">No email templates found</p>
        <p className="text-sm text-muted-foreground">
          Create your first template to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredEmails.map((email) => (
        <Card key={email.id} className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-semibold mb-2">{email.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {email.content}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingEmail(email)}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(email.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        </Card>
      ))}

      {editingEmail && (
        <EditEmailDialog
          email={editingEmail}
          open={!!editingEmail}
          onOpenChange={() => setEditingEmail(null)}
        />
      )}
    </div>
  );
}
