"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ParentForm() {
  return (
      <div className="bg-white rounded-xl shadow-sm border border-blue-600/20 ring-1 ring-blue-600/10 p-6 sm:p-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-gray-100 pb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="h-10 w-10 border-gray-200">
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </Button>
            <h2 className="text-xl font-bold text-gray-900">Create Parent</h2>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-gray-200 text-gray-700">Close</Button>
            <Button className="bg-[#4438CA] hover:bg-[#3730A3] text-white shadow-sm font-medium">+ Save Parent</Button>
          </div>
        </div>

        {/* Main Grid: 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Row 1 */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Select Title</label>
            <div className="relative">
              <Input placeholder="Title" className="bg-white border-gray-200 h-11 pr-10 focus-visible:ring-[#2A52EE] cursor-pointer" readOnly />
              <ChevronRight className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">First Name</label>
            <Input placeholder="First Name" className="bg-white border-gray-200 h-11 focus-visible:ring-[#2A52EE]" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Last Name</label>
            <Input placeholder="Last Name" className="bg-white border-gray-200 h-11 focus-visible:ring-[#2A52EE]" />
          </div>

          {/* Row 2 */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Select Relationship</label>
            <div className="relative">
              <Input placeholder="Father" className="bg-white border-gray-200 h-11 pr-10 focus-visible:ring-[#2A52EE] cursor-pointer" readOnly />
              <ChevronRight className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">National ID /Passport</label>
            <Input placeholder="National ID /Passport" className="bg-white border-gray-200 h-11 focus-visible:ring-[#2A52EE]" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Select Gender</label>
            <div className="relative">
              <Input placeholder="Gender" className="bg-white border-gray-200 h-11 pr-10 focus-visible:ring-[#2A52EE] cursor-pointer" readOnly />
              <ChevronRight className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Row 3 */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Date of Birth</label>
            <Input placeholder="dd/mm/yyyy" type="date" className="bg-white border-gray-200 h-11 focus-visible:ring-[#2A52EE]" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Phone</label>
            <Input placeholder="Phone" className="bg-white border-gray-200 h-11 focus-visible:ring-[#2A52EE]" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Select Nationality</label>
            <div className="relative">
              <Input placeholder="Uganda" className="bg-white border-gray-200 h-11 pr-10 focus-visible:ring-[#2A52EE] cursor-pointer" readOnly />
              <ChevronRight className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Row 4 */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Phone</label>
            <Input placeholder="Phone" className="bg-white border-gray-200 h-11 focus-visible:ring-[#2A52EE]" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Email</label>
            <Input placeholder="Email" type="email" className="bg-white border-gray-200 h-11 focus-visible:ring-[#2A52EE]" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Whatsap No.</label>
            <Input placeholder="Whatsap No." className="bg-white border-gray-200 h-11 focus-visible:ring-[#2A52EE]" />
          </div>

          {/* Row 5 */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Select Preferred Contact Method</label>
            <div className="relative">
              <Input placeholder="Preferred Contact Method" className="bg-white border-gray-200 h-11 pr-10 focus-visible:ring-[#2A52EE] cursor-pointer" readOnly />
              <ChevronRight className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            {/* Empty space or additional fields */}
          </div>

          <div className="col-span-1 md:col-span-3 flex justify-end mt-4">
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col items-center w-full max-w-sm mt-4">
              <h3 className="font-semibold text-lg text-gray-900 w-full text-center mb-6">Parent Profile Image</h3>

              <div className="w-40 h-40 rounded-full bg-pink-100 flex items-center justify-center overflow-hidden mb-6 border-8 border-gray-50/80 relative group cursor-pointer transition-transform hover:scale-105">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Parent&backgroundColor=ffdfbf" alt="Avatar placeholder" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center transition-all">
                  <span className="text-white text-sm font-medium">Change Photo</span>
                </div>
              </div>

              <Button className="w-full bg-[#4438CA] hover:bg-[#3730A3] text-white font-medium h-11 rounded-lg">
                Choose File
              </Button>
              <p className="text-xs text-gray-400 mt-3 font-medium">Image (1MB)</p>
            </div>
          </div>

        </div>

      </div>
  );
}
