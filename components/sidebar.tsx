"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, KeyRound, FileText, CheckSquare, Settings, Snowflake } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const routes = [
  {
    label: "Email Templates",
    icon: Mail,
    href: "/emails",
    color: "text-sky-500",
  },
  {
    label: "Credentials",
    icon: KeyRound,
    href: "/credentials",
    color: "text-violet-500",
  },
  {
    label: "Descriptions",
    icon: FileText,
    href: "/descriptions",
    color: "text-pink-700",
  },
  {
    label: "Tasks",
    icon: CheckSquare,
    href: "/tasks",
    color: "text-orange-700",
  },
  {
    label: "Cold Emails",
    icon: Snowflake,
    href: "/cold-emails",
    color: "text-sky-500",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-gray-900 text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/" className="flex items-center pl-3 mb-14">
          <h1 className="text-2xl font-bold">Professional Hub</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href
                  ? "text-white bg-white/10"
                  : "text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="px-3 py-2">
        <Button
          variant="ghost"
          size="icon"
          className="w-full justify-start text-zinc-400 hover:text-white hover:bg-white/10"
        >
          <Settings className="h-5 w-5 mr-3" />
          Settings
        </Button>
      </div>
    </div>
  );
}
