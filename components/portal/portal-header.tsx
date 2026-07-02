"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function PortalHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-100 bg-white px-4 shadow-sm md:px-6">
      <div className="flex flex-1 items-center gap-4 md:gap-6 lg:gap-8">
        <form className="flex-1 w-full sm:w-[300px] md:w-[400px] lg:w-[500px] relative">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full appearance-none bg-white border border-gray-200 pl-9 shadow-none h-9 rounded-md focus-visible:ring-blue-500"
            />
          </div>
        </form>
      </div>
      <div className="flex items-center gap-4">
        <Avatar className="h-9 w-9 border border-gray-200 cursor-pointer transition-transform hover:scale-105">
          <AvatarImage src="/avatars/teacher.jpg" alt="User" />
          <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">KA</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
