"use client";

import React, { useState } from "react";
import { Plus, Edit, Trash2, Users, BookOpen, DollarSign, Calendar, User, ChevronRight, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { data } from "@/components/dashboard/data";

const mockDepartments = [
  { id: "1", name: "Cooking Staff Department", created: "November 27th, 2024", hod: "Dr. Marie Curie", hodSince: "Not assigned", teachers: 2, subjects: 0, budget: 75000, fy: "FY 2023-2024" },
  { id: "2", name: "Chemistry Department", created: "November 27th, 2024", hod: "Dr. Walter White", hodSince: "2023", teachers: 4, subjects: 2, budget: 120000, fy: "FY 2023-2024" },
  { id: "3", name: "Biology Department", created: "November 27th, 2024", hod: "Dr. Jane Goodall", hodSince: "2022", teachers: 3, subjects: 3, budget: 95000, fy: "FY 2023-2024" },
  { id: "4", name: "Logistics Department", created: "November 27th, 2024", hod: "Not assigned", hodSince: "Not assigned", teachers: 0, subjects: 0, budget: 45000, fy: "FY 2023-2024" },
  { id: "5", name: "Science Department", created: "November 27th, 2024", hod: "Dr. Albert Einstein", hodSince: "2020", teachers: 15, subjects: 5, budget: 350000, fy: "FY 2023-2024" },
  { id: "6", name: "Mathematics Department", created: "November 27th, 2024", hod: "Dr. Alan Turing", hodSince: "2021", teachers: 8, subjects: 4, budget: 220000, fy: "FY 2023-2024" }
];

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState(mockDepartments);
  const [activeDept, setActiveDept] = useState(mockDepartments[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", hod: "" });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newDept = {
      id: Date.now().toString(),
      name: formData.name,
      hod: formData.hod || "Not assigned",
      created: "Just now",
      hodSince: formData.hod ? new Date().getFullYear().toString() : "Not assigned",
      teachers: 0,
      subjects: 0,
      budget: 0,
      fy: "FY 2023-2024"
    };
    setDepartments([...departments, newDept]);
    setIsModalOpen(false);
    setFormData({ name: "", hod: "" });
  };

  return (
        <div className="flex-1 flex bg-white min-h-[calc(100vh-64px)] -m-6 rounded-lg overflow-hidden border shadow-sm">
          
          {/* Left Side: Department List */}
          <div className="w-80 border-r flex flex-col bg-gray-50/30">
            <div className="p-4 border-b flex justify-between items-center bg-white">
              <div className="flex items-center gap-2 font-semibold text-gray-800">
                <Building className="w-5 h-5 text-gray-500" />
                Departments
              </div>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-900" type="button">
                    <Plus className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader className="border-b pb-4 mb-4">
                    <DialogTitle className="text-xl font-bold">Add New Department</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSave} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Department Name</label>
                      <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Science" className="h-11 border-blue-400 focus-visible:ring-blue-400" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Head of Department (HOD)</label>
                      <Input value={formData.hod} onChange={e => setFormData({ ...formData, hod: e.target.value })} placeholder="e.g. Dr. Albert Einstein" className="h-11 border-blue-400 focus-visible:ring-blue-400" />
                    </div>
                    <Button type="submit" className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-8 h-11 mt-2 w-full">
                      <Plus className="w-4 h-4 mr-2" /> Add Department
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              {departments.map(dept => (
                <div 
                  key={dept.id} 
                  onClick={() => setActiveDept(dept)}
                  className={`group w-full text-left px-4 py-3 flex items-center justify-between cursor-pointer transition-colors ${activeDept.id === dept.id ? 'bg-gray-100/80 border-r-2 border-gray-900' : 'hover:bg-gray-50'}`}
                >
                  <span className={`text-sm font-medium ${activeDept.id === dept.id ? 'text-gray-900' : 'text-gray-700'}`}>
                    {dept.name}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-gray-900">
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-red-600">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Detail View */}
          <div className="flex-1 bg-white p-8 overflow-y-auto">
            {activeDept ? (
              <div className="max-w-5xl mx-auto space-y-8">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{activeDept.name}</h1>
                </div>

                {/* Top Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="border rounded-xl p-6 bg-white shadow-sm flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-sm font-semibold text-gray-600">Teachers</span>
                      <Users className="w-5 h-5 text-gray-400" />
                    </div>
                    <span className="text-3xl font-bold text-gray-900">{activeDept.teachers}</span>
                  </div>
                  
                  <div className="border rounded-xl p-6 bg-white shadow-sm flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-sm font-semibold text-gray-600">Subjects</span>
                      <BookOpen className="w-5 h-5 text-gray-400" />
                    </div>
                    <span className="text-3xl font-bold text-gray-900">{activeDept.subjects}</span>
                  </div>

                  <div className="border rounded-xl p-6 bg-white shadow-sm flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-sm font-semibold text-gray-600">Annual Budget</span>
                      <DollarSign className="w-5 h-5 text-gray-400" />
                    </div>
                    <span className="text-3xl font-bold text-gray-900">$ {activeDept.budget}</span>
                    <span className="text-xs text-gray-400 font-medium mt-1 uppercase">{activeDept.fy}</span>
                  </div>
                </div>

                {/* Grid details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Department Details */}
                  <div className="border rounded-xl p-6 bg-white shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-6 text-lg">Department Details</h3>
                    <div className="space-y-4 text-sm">
                      <div className="flex items-center gap-3 text-gray-600">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="w-24">Created:</span>
                        <span className="font-medium text-gray-900">{activeDept.created}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="w-24">HOD:</span>
                        <span className="font-medium text-gray-900">{activeDept.hod}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="w-24">HOD Since:</span>
                        <span className="font-medium text-gray-900">{activeDept.hodSince}</span>
                      </div>
                    </div>
                  </div>

                  {/* Teachers */}
                  <div className="border rounded-xl p-6 bg-white shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-6 text-lg">Teachers</h3>
                    <div className="space-y-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 text-sm">Robert Wilson</span>
                        <span className="text-sm text-gray-500">Physics</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 text-sm">Mary Johnson</span>
                        <span className="text-sm text-gray-500">Chemistry</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subjects */}
                <div className="border rounded-xl p-6 bg-white shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-6 text-lg">Subjects</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border rounded-lg p-4 bg-gray-50/50">
                      <span className="font-bold text-gray-900 block">Physics</span>
                      <span className="text-sm text-gray-500">SCI101</span>
                    </div>
                    <div className="border rounded-lg p-4 bg-gray-50/50">
                      <span className="font-bold text-gray-900 block">Chemistry</span>
                      <span className="text-sm text-gray-500">SCI102</span>
                    </div>
                  </div>
                </div>

              </div>
            ) : null}
          </div>

        </div>
  );
}
