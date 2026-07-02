"use client";

import React from "react";
import { Plus, Users, BookOpen, Calendar, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const mockStats = [
  { title: "Total Students", value: "1234", icon: Users },
  { title: "Classes", value: "156", icon: BookOpen },
  { title: "Assessments", value: "42", icon: Calendar },
  { title: "Rating", value: "4.8", icon: Star },
];

export default function PortalDashboardPage() {
  return (
    <div className="p-8">
      
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        
        <div className="flex items-center gap-4 relative">
          <h1 className="text-3xl font-extrabold text-white bg-[#2563EB] px-2 py-1 leading-none tracking-tight rounded-sm">
            Welcome, TEACHER - Keith Anderson
          </h1>
          
          {/* Floating plus button */}
          <div className="absolute -bottom-5 right-10">
            <Button size="icon" className="h-10 w-10 rounded-full bg-[#2563EB] hover:bg-blue-700 text-white shadow-lg border-[3px] border-white">
              <Plus className="w-5 h-5" />
            </Button>
            {/* The decorative circle behind the plus button seen in the screenshot */}
            <div className="absolute top-1 left-2 -z-10 h-10 w-10 rounded-full bg-pink-500"></div>
          </div>
        </div>

        <div className="text-gray-700 font-semibold text-lg pb-1">
          Status
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockStats.map((stat, i) => (
          <Card key={i} className="shadow-sm border-gray-100 rounded-xl hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6">
              <CardTitle className="text-sm font-bold text-gray-800">{stat.title}</CardTitle>
              <stat.icon className="h-5 w-5 text-gray-400" strokeWidth={1.5} />
            </CardHeader>
            <CardContent className="pb-6">
              <div className="text-3xl font-extrabold text-gray-900 mb-4">{stat.value}</div>
              <Button variant="link" className="px-0 h-auto text-xs text-gray-400 hover:text-blue-600 font-medium p-0">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
}
