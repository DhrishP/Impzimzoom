"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TwitterBangerList } from "@/components/twitter-bangers/twitter-banger-list";
import { CreateTwitterBangerDialog } from "@/components/twitter-bangers/create-twitter-banger-dialog";
import { useData } from "@/contexts/DataContext";

export default function TwitterBangersPage() {
  const [open, setOpen] = useState(false);
  const { searchTerms, setSearchTerm } = useData();

  return (
    <div className="h-full p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold">Twitter Bangers</h2>
          <p className="text-muted-foreground">
            Store your tweet ideas with images
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Banger
        </Button>
      </div>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search bangers..." 
          className="pl-10"
          value={searchTerms.twitterBangers}
          onChange={(e) => setSearchTerm("twitterBangers", e.target.value)}
        />
      </div>
      
      <TwitterBangerList />
      <CreateTwitterBangerDialog open={open} onOpenChange={setOpen} />
    </div>
  );
} 