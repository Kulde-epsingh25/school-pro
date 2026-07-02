"use client";

import React, { useState } from "react";
import { UserPlus, Users, ChevronLeft, EyeOff, Plus, ChevronRight, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";


type FormInputProps = {
  label: string;
  placeholder: string;
  type?: string;
  showIcon?: boolean;
};

function StudentFormInput({ label, placeholder, type = "text", showIcon = false }: FormInputProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        {showIcon && <Info className="h-4 w-4 text-gray-400" />}
      </div>
      <div className="relative">
        <Input
          placeholder={placeholder}
          type={type}
          className={`bg-white border-gray-200 h-11 focus-visible:ring-[#2A52EE] ${type === "password" ? "pr-10" : ""}`}
        />
        {type === "password" && (
          <EyeOff className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
        )}
      </div>
    </div>
  );
}

type FormSelectProps = {
  label: string;
  placeholder: string;
  actionHref?: string;
  onActionClick?: () => void;
};

function StudentFormSelect({ label, placeholder, actionHref, onActionClick }: FormSelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            placeholder={placeholder}
            className="bg-white border-gray-200 h-11 pr-10 focus-visible:ring-[#2A52EE] cursor-pointer"
            readOnly
          />
          <ChevronRight className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
        </div>
        {(actionHref || onActionClick) && (
          actionHref ? (
            <Link href={actionHref} target="_blank" rel="noopener noreferrer">
              <Button type="button" variant="outline" className="h-11 w-11 shrink-0 p-0 border-gray-200 bg-white text-gray-500 hover:bg-gray-50">
                <Plus className="h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <Button onClick={onActionClick} type="button" variant="outline" className="h-11 w-11 shrink-0 p-0 border-gray-200 bg-white text-gray-500 hover:bg-gray-50">
              <Plus className="h-5 w-5" />
            </Button>
          )
        )}
      </div>
    </div>
  );
}

// --------------------------------

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
              ? "bg-[#2A52EE] text-white shadow-sm"
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
            <StudentFormInput label="Student First Name" placeholder="Student First Name" />
            <StudentFormInput label="Student Last Name" placeholder="Student Last Name" />
            <StudentFormInput label="Email" placeholder="Email" type="email" />

            {/* Row 2 */}
            <StudentFormSelect label="Select Parent" placeholder="Parent" actionHref="/dashboard/users/parents/new" />
            <StudentFormSelect label="Select Class" placeholder="Class" onActionClick={() => { }} />
            <StudentFormSelect label="Select Stream" placeholder="Stream" onActionClick={() => { }} />

            {/* Row 3 */}
            <StudentFormInput label="Phone" placeholder="Phone" type="tel" />
            <StudentFormSelect label="Select Nationality" placeholder="Uganda" />
            <StudentFormInput label="Student Password" placeholder="Student Password" type="password" showIcon />

            {/* Row 4 */}
            <StudentFormInput label="State/Village" placeholder="State/Village" />
            <StudentFormInput label="Birth Certificate No." placeholder="Birth Certificate No." />
            <StudentFormSelect label="Select Religion" placeholder="Religion" />

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
