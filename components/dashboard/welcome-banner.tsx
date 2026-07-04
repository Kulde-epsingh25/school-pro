"use client";

import React from "react";
import { useAuthStore } from "@/store/authStore";
import { useSchoolStore } from "@/store/schoolStore";
import { Sparkles } from "lucide-react";

export function WelcomeBanner() {
  const user = useAuthStore((state) => state.user);
  const school = useSchoolStore((state) => state.school);

  if (!user) return null;

  return (
    <div className="relative overflow-hidden rounded-xl bg-[#2563EB] p-8 text-white shadow-sm mb-6 flex items-center gap-4">
      {/* Avatar Icon */}
      <div className="flex-shrink-0 w-16 h-16 bg-white rounded-full flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </div>
      
      <div className="relative z-10 flex flex-col justify-center">
        <h1 className="text-3xl font-bold tracking-tight mb-1">
          Welcome back, {user?.name || "Timothy Okiring"}!
        </h1>
        <p className="text-blue-100 text-sm font-medium tracking-wide uppercase">
          {user?.roles?.[0] ? user.roles[0].replace('_', ' ').toUpperCase() : "ADMIN"} at {school?.name || "Hillside Primary School"}
        </p>
      </div>
    </div>
  );
}
