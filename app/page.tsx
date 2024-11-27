import { Card } from "@/components/ui/card";
import {
  Mail,
  KeyRound,
  FileText,
  CheckSquare,
  Snowflake,
  Twitter,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";

export default function Home() {
  const features = [
    {
      icon: Mail,
      title: "Email Templates",
      description: "Store and manage your cold email templates",
      href: "/emails",
      color: "text-sky-500",
    },
    {
      icon: KeyRound,
      title: "Credentials",
      description: "Securely store your important credentials",
      href: "/credentials",
      color: "text-violet-500",
    },
    {
      icon: FileText,
      title: "Descriptions",
      description: "Save your professional descriptions and bios",
      href: "/descriptions",
      color: "text-pink-700",
    },
    {
      icon: CheckSquare,
      title: "Tasks",
      description: "Manage your tasks and stay organized",
      href: "/tasks",
      color: "text-orange-700",
    },
    {
      icon: Snowflake,
      title: "Cold Email",
      description: "Generate and send cold emails",
      href: "/cold-emails",
      color: "text-blue-500",
    },
    {
      icon: Twitter,
      title: "Twitter Bangers",
      description: "Save your twitter bangers",
      href: "/twitter-bangers",
      color: "text-blue-500",
    },
  ];
  const noadminroutes = [
    {
      icon: Mail,
      title: "Email Templates",
      description: "Store and manage your cold email templates",
      href: "/emails",
      color: "text-sky-500",
    },
    {
      icon: KeyRound,
      title: "Credentials",
      description: "Securely store your important credentials",
      href: "/credentials",
      color: "text-violet-500",
    },
    {
      icon: FileText,
      title: "Descriptions",
      description: "Save your professional descriptions and bios",
      href: "/descriptions",
      color: "text-pink-700",
    },
    {
      icon: CheckSquare,
      title: "Tasks",
      description: "Manage your tasks and stay organized",
      href: "/tasks",
      color: "text-orange-700",
    },
    {
      icon: Snowflake,
      title: "Cold Email",
      description: "Generate and send cold emails",
      href: "/cold-emails",
      color: "text-blue-500",
    },
  ];
  const [IsAdmin, SetIsAdmin] = useState(false);

  useEffect(() => {
    const getAdmin = async () => {
      const res = await axios.get("/api/isadmin");
      SetIsAdmin(res.data.isAdmin);
    };
    getAdmin();
  }, []);

  return (
    <div className="h-full p-8">
      <div className="absolute top-4 right-4">
        <UserButton />
      </div>
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center">
          Welcome to Your Personal Hub
        </h2>
        <p className="text-muted-foreground font-light text-sm md:text-lg text-center">
          Your all-in-one workspace for managing professional content and tasks
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {IsAdmin
          ? features.map((feature) => (
              <Link key={feature.href} href={feature.href}>
                <Card className="p-4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer">
                  <div className="flex items-center gap-x-4">
                    <div className={cn("p-2 w-fit rounded-md", feature.color)}>
                      <feature.icon className={cn("w-8 h-8", feature.color)} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))
          : noadminroutes.map((feature) => (
              <Link key={feature.href} href={feature.href}>
                <Card className="p-4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer">
                  <div className="flex items-center gap-x-4">
                    <div className={cn("p-2 w-fit rounded-md", feature.color)}>
                      <feature.icon className={cn("w-8 h-8", feature.color)} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
      </div>
    </div>
  );
}
