"use client";

import React from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const childrenData = [
  {
    id: "cm5eum37c00085",
    name: "Gemma Fernandez",
    registration: "BU/PS/2025/0004",
    class: "S1",
    stream: "1A",
    age: 14,
    avatar: "/avatars/gemma.jpg", // You can update this path
    initials: "GF"
  }
];

export default function MyChildrenPage() {
  return (
    <div className="p-8 space-y-6 max-w-6xl mx-auto min-h-screen">
      
      <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-8">Your Children</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {childrenData.map((child) => (
          <div key={child.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col items-start hover:shadow-md transition-shadow">
            
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-14 w-14 border border-gray-100">
                <AvatarImage src={child.avatar} alt={child.name} />
                <AvatarFallback className="bg-emerald-100 text-emerald-700 font-bold">{child.initials}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-bold text-gray-900">{child.name}</h2>
                <p className="text-sm text-gray-500">{child.registration}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full mb-6 text-sm">
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900">Class: <span className="font-normal text-gray-600">{child.class}</span></span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900">Stream: <span className="font-normal text-gray-600">{child.stream}</span></span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900">Age: <span className="font-normal text-gray-600">{child.age}</span></span>
              </div>
            </div>

            <Link href={`/portal/parent/student/${child.id}`} className="w-full inline-flex items-center justify-center font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 h-10 rounded-md">
              View Details
            </Link>
            
          </div>
        ))}
      </div>

    </div>
  );
}
