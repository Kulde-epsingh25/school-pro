"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { data } from "@/components/dashboard/data";
import Select from "react-select";
import { generateEmployeeId } from "@/lib/registrationUtils";

type SelectOption = { value: string; label: string };

const subjectOptions: SelectOption[] = [
  { value: "algebra", label: "Algebra" },
  { value: "geometry", label: "Geometry" },
  { value: "physics", label: "Physics" },
  { value: "chemistry", label: "Chemistry" },
  { value: "english", label: "English" }
];

const classOptions: SelectOption[] = [
  { value: "grade8", label: "Grade 8" },
  { value: "grade9", label: "Grade 9" },
  { value: "grade10", label: "Grade 10" },
  { value: "grade11", label: "Grade 11" },
  { value: "grade12", label: "Grade 12" }
];

export default function NewTeacherPage() {
  const [employeeId, setEmployeeId] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<SelectOption[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<SelectOption[]>([]);

  useEffect(() => {
    // Mock API fetch to get the sequence number
    const fetchSequence = async () => {
      const mockSeq = 15; // Example sequence
      setEmployeeId(generateEmployeeId("SP", mockSeq));
    };
    fetchSequence();
  }, []);
  return (
    <SidebarProvider>
      <DashboardSidebar
        user={data.user}
        teams={data.teams}
        navMain={data.navMain}
        projects={data.projects}
      />
      <SidebarInset>
        <DashboardHeader />
        <div className="p-6 max-w-6xl mx-auto w-full">
          <div className="bg-white rounded-xl shadow-sm border border-blue-600/20 ring-1 ring-blue-600/10 p-6 sm:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-gray-100 pb-6">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" className="h-10 w-10 border-gray-200" onClick={() => window.history.back()}>
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </Button>
                <h2 className="text-xl font-bold text-gray-900">Create Teacher</h2>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="border-gray-200 text-gray-700">Cancel</Button>
                <Button className="bg-[#4438CA] hover:bg-[#3730A3] text-white shadow-sm font-medium">+ Save Teacher</Button>
              </div>
            </div>

            <form className="space-y-8">
              {/* Personal Info Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">First Name</label>
                    <Input placeholder="First Name" className="bg-white border-gray-200 h-11 focus-visible:ring-[#2A52EE]" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Last Name</label>
                    <Input placeholder="Last Name" className="bg-white border-gray-200 h-11 focus-visible:ring-[#2A52EE]" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Select Gender</label>
                    <select className="flex h-11 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:ring-[#2A52EE]" required>
                      <option value="">Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Date of Birth</label>
                    <Input type="date" className="bg-white border-gray-200 h-11 focus-visible:ring-[#2A52EE]" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Email</label>
                    <Input type="email" placeholder="Email Address" className="bg-white border-gray-200 h-11 focus-visible:ring-[#2A52EE]" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Phone</label>
                    <Input placeholder="Phone Number" className="bg-white border-gray-200 h-11 focus-visible:ring-[#2A52EE]" required />
                  </div>
                  <div className="md:col-span-3 space-y-2 border-t pt-4">
                    <label className="text-sm font-semibold text-gray-700">Profile Image</label>
                    <Input type="file" accept="image/*" className="bg-white border-gray-200" />
                  </div>
                </div>
              </div>

              {/* Employment Info Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Employment Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Employee ID</label>
                    <Input value={employeeId} readOnly className="bg-gray-100 border-gray-200 h-11 focus-visible:ring-[#2A52EE] font-mono" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Date of Joining</label>
                    <Input type="date" className="bg-white border-gray-200 h-11 focus-visible:ring-[#2A52EE]" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Designation</label>
                    <Input placeholder="e.g. Senior Teacher" className="bg-white border-gray-200 h-11 focus-visible:ring-[#2A52EE]" required />
                  </div>
                  <div className="space-y-2 md:col-span-3">
                    <label className="text-sm font-semibold text-gray-700">Department</label>
                    <select className="flex h-11 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:ring-[#2A52EE]" required>
                      <option value="">Select Department</option>
                      <option value="math">Mathematics</option>
                      <option value="science">Science</option>
                      <option value="arts">Arts</option>
                      <option value="languages">Languages</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Academic Info Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Academic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Subjects Taught (Multi-select)</label>
                    <Select
                      isMulti
                      options={subjectOptions}
                      value={selectedSubjects}
                      onChange={(selected) => setSelectedSubjects(selected as any)}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Classes Taught (Multi-select)</label>
                    <Select
                      isMulti
                      options={classOptions}
                      value={selectedClasses}
                      onChange={(selected) => setSelectedClasses(selected as any)}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700">Specialization & Qualifications</label>
                    <textarea className="flex min-h-[80px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:ring-[#2A52EE]" placeholder="BSc Mathematics, MSc Physics, etc."></textarea>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700">Upload Documents</label>
                    <Input type="file" multiple className="bg-white border-gray-200" />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
