 "use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useData } from "@/contexts/DataContext";
import { ColdEmailData } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import EditColdEmailDialog from "./edit-cold-email-dialog";

interface ExpandedState {
  [key: string]: boolean;
}

export function ColdEmailList() {
  const { coldEmails, loading, deleteData, refreshData, searchTerms } = useData();
  const { toast } = useToast();
  const [editingEmail, setEditingEmail] = useState<ColdEmailData | null>(null);
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Rest of your existing code remains the same until the return statement

  return (
    <div className="space-y-4">
      {coldEmails.map((email) => (
        <Card key={email.id} className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-semibold mb-2">{email.title}</h3>
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
                onClick={() => deleteData("coldEmails", email.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        </Card>
      ))}

      {editingEmail && (
        <EditColdEmailDialog
          email={editingEmail}
          open={!!editingEmail}
          onOpenChange={() => setEditingEmail(null)}
        />
      )}
    </div>
  );
}