"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useData } from "@/contexts/DataContext";
import { EmailTemplate } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import EditEmailDialog from "./edit-email-dialog";

interface ExpandedState {
  [key: string]: boolean;
}

export function EmailList() {
  const { emails, loading, searchTerms, refreshData, deleteData } = useData();
  const { toast } = useToast();
  const [editingEmail, setEditingEmail] = useState<EmailTemplate | null>(null);
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

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
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">{email.title}</h3>
                <Badge>{email.category}</Badge>
              </div>
              <div className={`whitespace-pre-wrap ${expanded[email.id] ? '' : 'line-clamp-3'}`}>
                {email.content}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleExpand(email.id)}
                className="mt-2"
              >
                {expanded[email.id] ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-2" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-2" />
                    Read More
                  </>
                )}
              </Button>
            </div>
            <div className="flex gap-2 ml-4">
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
