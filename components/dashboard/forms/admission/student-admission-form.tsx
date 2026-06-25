"use client";

import React, { useState } from "react";
import { UserPlus, Users, ChevronLeft, EyeOff, Plus, ChevronRight, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function StudentAdmissionForm() {
  const [activeTab, setActiveTab] = useState<"single" | "bulk">("single");
  const [showBanner, setShowBanner] = useState(true);

  return (
    <div className="w-full max-w-[1400px] mx-auto p-4 space-y-6">
      {/* Top Tabs */}
      <div className="flex mb-4">
        <div className="bg-gray-50/80 p-1.5 rounded-lg flex w-full border border-gray-100 shadow-sm">
          <button
            onClick={() => setActiveTab("single")}
            className={`flex-1 py-3 px-4 text-sm font-semibold flex items-center justify-center gap-2 rounded-md transition-all ${activeTab === "single"
              ? "bg-[#2A52EE] text-white shadow-sm"
              : "text-gray-500 hover:text-gray-700"
              }`}
          >
            <UserPlus className="w-5 h-5" />
            Single Student Admission
          </button>
          <button
            onClick={() => setActiveTab("bulk")}
            className={`flex-1 py-3 px-4 text-sm font-semibold flex items-center justify-center gap-2 rounded-md transition-all ${activeTab === "bulk"
              ? "bg-transparent text-gray-500 hover:text-gray-700"
              : "text-gray-500 hover:text-gray-700"
              }`}
          >
            <Users className="w-5 h-5" />
            Bulk Student Admission
          </button>
        </div>
      </div>

      {activeTab === "single" && (
        <div className="bg-white rounded-xl shadow-sm border border-[#2A52EE] p-6">
          {showBanner && (
            <div className="bg-[#EBF1FF] text-[#2A52EE] border border-[#2A52EE]/20 rounded-lg p-3 flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                <span className="font-medium text-sm">Please first Create the Parent, Class and Stream</span>
              </div>
              <button onClick={() => setShowBanner(false)}>
                <X className="h-5 w-5 opacity-70 hover:opacity-100" />
              </button>
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" className="h-10 w-10 border-gray-200 bg-white">
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </Button>
              <h2 className="text-xl font-bold text-gray-900">Create Student</h2>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="border-gray-200 text-gray-700 font-medium">Close</Button>
              <Button className="bg-[#4438CA] hover:bg-[#3730A3] text-white shadow-sm font-medium">+ Save Student</Button>
            </div>
          </div>

          {/* Form Content - 3 Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Row 1 */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Student First Name</label>
              <Input placeholder="Student First Name" className="bg-white border-gray-200 h-11 focus-visible:ring-[#2A52EE]" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Student Last Name</label>
              <Input placeholder="Student Last Name" className="bg-white border-gray-200 h-11 focus-visible:ring-[#2A52EE]" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Email</label>
              <Input placeholder="Email" type="email" className="bg-white border-gray-200 h-11 focus-visible:ring-[#2A52EE]" />
            </div>

            {/* Row 2 */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Select Parent</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input placeholder="Parent" className="bg-white border-gray-200 h-11 pr-10 focus-visible:ring-[#2A52EE] cursor-pointer" readOnly />
                  <ChevronRight className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                </div>
                <Link href="/dashboard/users/parents/new" target="_blank" rel="noopener noreferrer">
                  <Button type="button" variant="outline" className="h-11 w-11 shrink-0 p-0 border-gray-200 bg-white text-gray-500 hover:bg-gray-50">
                    <Plus className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Select Class</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input placeholder="Class" className="bg-white border-gray-200 h-11 pr-10 focus-visible:ring-[#2A52EE] cursor-pointer" readOnly />
                  <ChevronRight className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                </div>
                <Button variant="outline" className="h-11 w-11 shrink-0 p-0 border-gray-200 bg-white text-gray-500 hover:bg-gray-50">
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Select Stream</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input placeholder="Stream" className="bg-white border-gray-200 h-11 pr-10 focus-visible:ring-[#2A52EE] cursor-pointer" readOnly />
                  <ChevronRight className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                </div>
                <Button variant="outline" className="h-11 w-11 shrink-0 p-0 border-gray-200 bg-white text-gray-500 hover:bg-gray-50">
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Row 3 */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Phone</label>
              <Input placeholder="Phone" type="tel" className="bg-white border-gray-200 h-11 focus-visible:ring-[#2A52EE]" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Select Nationality</label>
              <div className="relative">
                <Input placeholder="Uganda" className="bg-white border-gray-200 h-11 pr-10 focus-visible:ring-[#2A52EE] cursor-pointer" readOnly />
                <ChevronRight className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700">Student Password</label>
                <Info className="h-4 w-4 text-gray-400" />
              </div>
              <div className="relative">
                <Input placeholder="Student Password" type="password" className="bg-white border-gray-200 h-11 pr-10 focus-visible:ring-[#2A52EE]" />
                <EyeOff className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Row 4 */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">State/Village</label>
              <Input placeholder="State/Village" className="bg-white border-gray-200 h-11 focus-visible:ring-[#2A52EE]" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Birth Certificate No.</label>
              <Input placeholder="Birth Certificate No." className="bg-white border-gray-200 h-11 focus-visible:ring-[#2A52EE]" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Select Religion</label>
              <div className="relative">
                <Input placeholder="Religion" className="bg-white border-gray-200 h-11 pr-10 focus-visible:ring-[#2A52EE] cursor-pointer" readOnly />
                <ChevronRight className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              </div>
            </div>

          </div>

        </div>
      )}

      {activeTab === "bulk" && (
        <div className="bg-white rounded-xl shadow-sm border border-[#2A52EE] p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-[#2A52EE] mb-4">Bulk Student Admission</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Form for admitting multiple students would go here.
          </p>
        </div>
      )}
    </div>
  );
}
