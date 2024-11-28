"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CredentialList } from "@/components/credentials/credential-list";
import { CreateCredentialDialog } from "@/components/credentials/create-credential-dialog";
import { useData } from "@/contexts/DataContext";
import { useHotkeys } from "@/hooks/use-keyboard-shortcuts";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function CredentialsPage() {
  const [open, setOpen] = useState(false);
  const { searchTerms, setSearchTerm } = useData();

  useHotkeys(() => setOpen(true));

  return (
    <div className="h-full p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold">Credentials</h2>
          <p className="text-muted-foreground">Securely store your login information</p>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={() => setOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Credential
                <span className="ml-2 text-xs text-muted-foreground">(Alt+N)</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Create new credential (Alt+N)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search credentials..."
          className="pl-10"
          value={searchTerms.credentials}
          onChange={(e) => setSearchTerm("credentials", e.target.value)}
        />
      </div>

      <CredentialList />
      <CreateCredentialDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
