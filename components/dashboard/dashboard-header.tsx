"use client";

import * as React from "react";
import { Plus, Sun } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function DashboardHeader() {
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <div className="flex h-16 items-center gap-4 border-b px-4">
      <SidebarTrigger />
      <div className="flex-1">
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <Button variant="outline" size="icon">
        <span className="sr-only">Toggle theme</span>
        <Sun className="h-5 w-5" />
      </Button>
      <Button variant="outline" size="icon">
        <Plus className="h-5 w-5" />
        <span className="sr-only">Add new</span>
      </Button>
      <Avatar>
        <AvatarImage src="/placeholder.svg" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  );
}
