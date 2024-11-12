"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Image } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useData } from "@/contexts/DataContext";
import { useToast } from "@/hooks/use-toast";
import { TwitterBanger } from "@prisma/client";
import EditTwitterBangerDialog from "./edit-twitter-banger-dialog";

export function TwitterBangerList() {
  const { twitterBangers, loading, deleteData, refreshData } = useData();
  const { toast } = useToast();
  const [editBanger, setEditBanger] = useState<TwitterBanger | null>(null);

  useEffect(() => {
    refreshData("twitterBangers");
  }, [refreshData]);

  const handleDelete = async (id: string) => {
    try {
      await deleteData("twitterBangers", id);
      toast({
        title: "Success",
        description: "Twitter banger deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete twitter banger",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      {twitterBangers?.map((banger: TwitterBanger) => (
        <Card key={banger.id} className="p-4">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Badge>{banger.category}</Badge>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(banger.createdAt), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm whitespace-pre-wrap">{banger.content}</p>
              {banger.imageUrl && (
                <div className="mt-2">
                  <img 
                    src={banger.imageUrl} 
                    alt="Tweet media" 
                    className="rounded-md max-h-48 object-cover"
                  />
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditBanger(banger)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(banger.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
      
      {editBanger && (
        <EditTwitterBangerDialog
          banger={editBanger}
          open={!!editBanger}
          onOpenChange={(open) => !open && setEditBanger(null)}
        />
      )}
    </div>
  );
} 