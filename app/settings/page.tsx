"use client";

import { UserProfile } from "@clerk/nextjs";
import { Card } from "@/components/ui/card";
import { Settings } from "lucide-react";

const SettingsPage = () => {
  return (
    <div className="h-full p-8">
      <div className="mb-8 space-y-4">
        <div className="flex items-center gap-x-3">
          <Settings className="h-8 w-8 text-muted-foreground" />
          <h2 className="text-2xl md:text-4xl font-bold">Settings</h2>
        </div>
        <p className="text-muted-foreground font-light text-sm md:text-lg">
          Manage your account settings and preferences
        </p>
      </div>

      <Card className="p-4">
        <UserProfile
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-none",
            },
          }}
        />
      </Card>
    </div>
  );
};

export default SettingsPage;
