"use client";

import React, { useState } from "react";
import { Plus, Edit, Trash2, BookOpen, FileText, LayoutGrid, CheckCircle2, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { data } from "@/components/dashboard/data";

const mockSubjects = [
  { id: "1", name: "History", code: "HIST023", shortName: "Hist", category: "ELECTIVE", type: "THEORY", department: "Logistics", created: "November 27th, 2024", updated: "November 27th, 2024", slug: "history", active: true, optional: false, hasTheory: true, hasPractical: false, labRequired: false },
  { id: "2", name: "Biology", code: "BIO101", shortName: "Bio", category: "CORE", type: "THEORY & PRACTICAL", department: "Science", created: "November 27th, 2024", updated: "November 27th, 2024", slug: "biology", active: true, optional: false, hasTheory: true, hasPractical: true, labRequired: true },
  { id: "3", name: "Mathematics", code: "MATH101", shortName: "Math", category: "CORE", type: "THEORY", department: "Mathematics", created: "November 27th, 2024", updated: "November 27th, 2024", slug: "mathematics", active: true, optional: false, hasTheory: true, hasPractical: false, labRequired: false },
];

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState(mockSubjects);
  const [activeSubject, setActiveSubject] = useState(mockSubjects[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    shortName: "",
    category: "CORE",
    type: "THEORY",
    department: "History"
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newSubject = {
      id: Date.now().toString(),
      name: formData.name,
      code: formData.code,
      shortName: formData.shortName,
      category: formData.category,
      type: formData.type,
      department: formData.department,
      created: "Just now",
      updated: "Just now",
      slug: formData.name.toLowerCase().replace(/ /g, "-"),
      active: true,
      optional: false,
      hasTheory: formData.type.includes("THEORY"),
      hasPractical: formData.type.includes("PRACTICAL"),
      labRequired: formData.type.includes("PRACTICAL"),
    };
    setSubjects([...subjects, newSubject]);
    setIsModalOpen(false);
    setFormData({ name: "", code: "", shortName: "", category: "CORE", type: "THEORY", department: "History" });
  };

  const PropertyPill = ({ label, value }: { label: string, value: boolean }) => (
    <div className="flex items-center justify-between py-2 border-b last:border-0">
      <span className="text-sm font-medium text-gray-500">{label}:</span>
      <span className={`text-xs font-bold px-3 py-1 rounded-full ${value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
        {value ? 'Yes' : 'No'}
      </span>
    </div>
  );

  return (
        <div className="flex-1 flex bg-white min-h-[calc(100vh-64px)] -m-6 rounded-lg overflow-hidden border shadow-sm">
          
          {/* Left Side: Subject List */}
          <div className="w-80 border-r flex flex-col bg-gray-50/30">
            <div className="p-4 border-b flex justify-between items-center bg-white">
              <div className="flex items-center gap-2 font-semibold text-gray-800">
                <BookOpen className="w-5 h-5 text-gray-900" />
                Subjects
              </div>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-900" type="button">
                    <Plus className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader className="border-b pb-4 mb-4">
                    <DialogTitle className="text-xl font-bold">Add New Subject</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSave} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Name</label>
                      <div className="relative">
                        <CheckCircle2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                        <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Name" className="pl-9 h-11 border-blue-400 focus-visible:ring-blue-400" required />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Subject code</label>
                        <Input value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} placeholder="MATH101" className="h-11" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Short Name</label>
                        <Input value={formData.shortName} onChange={e => setFormData({ ...formData, shortName: e.target.value })} placeholder="Math" className="h-11" required />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Select Category</label>
                        <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-gray-600">
                          <option value="CORE">CORE</option>
                          <option value="ELECTIVE">ELECTIVE</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Select Type</label>
                        <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-gray-600">
                          <option value="THEORY">THEORY</option>
                          <option value="PRACTICAL">PRACTICAL</option>
                          <option value="THEORY & PRACTICAL">THEORY & PRACTICAL</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Select Department</label>
                      <div className="flex gap-2">
                        <select value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} className="flex h-11 flex-1 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-gray-600">
                          <option value="History">History</option>
                          <option value="Mathematics">Mathematics</option>
                          <option value="Science">Science</option>
                        </select>
                        <Button type="button" variant="outline" className="h-11 w-11 p-0 shrink-0 border-gray-300">
                          <Plus className="w-5 h-5 text-gray-600" />
                        </Button>
                      </div>
                    </div>

                    <Button type="submit" className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-8 h-11 mt-2">
                      <Plus className="w-4 h-4 mr-2" /> Add
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              {subjects.map(subject => (
                <div 
                  key={subject.id} 
                  onClick={() => setActiveSubject(subject)}
                  className={`group w-full text-left px-4 py-3 flex items-center justify-between cursor-pointer transition-colors ${activeSubject.id === subject.id ? 'bg-gray-100/80 border-r-2 border-gray-900' : 'hover:bg-gray-50'}`}
                >
                  <span className={`text-sm font-semibold ${activeSubject.id === subject.id ? 'text-gray-900' : 'text-gray-700'}`}>
                    {subject.name}
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
            {activeSubject ? (
              <div className="max-w-5xl mx-auto space-y-8">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{activeSubject.name}</h1>
                </div>

                {/* Top Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="border rounded-xl p-6 bg-white shadow-sm flex flex-col justify-between min-h-[140px]">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-sm font-bold text-gray-800">Subject Code</span>
                      <FileText className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-1">{activeSubject.code}</h2>
                      <span className="text-sm text-gray-500">{activeSubject.name}</span>
                    </div>
                  </div>
                  
                  <div className="border rounded-xl p-6 bg-white shadow-sm flex flex-col justify-between min-h-[140px]">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-sm font-bold text-gray-800">Category</span>
                      <LayoutGrid className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">{activeSubject.category}</h2>
                      <span className="text-sm text-gray-500">{activeSubject.type}</span>
                    </div>
                  </div>

                  <div className="border rounded-xl p-6 bg-white shadow-sm flex flex-col justify-between min-h-[140px]">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-sm font-bold text-gray-800">Marks</span>
                      <CheckCircle2 className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex items-center gap-2 mt-auto">
                      <span className="text-sm text-gray-500">Passing:</span>
                      <CheckSquare className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Grid details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Subject Details */}
                  <div className="border rounded-xl p-6 bg-white shadow-sm flex flex-col">
                    <h3 className="font-bold text-gray-900 mb-6 text-lg">Subject Details</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-medium">Department:</span>
                        <span className="font-bold text-gray-900">{activeSubject.department}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-medium">Created:</span>
                        <span className="font-bold text-gray-900">{activeSubject.created}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-medium">Last Updated:</span>
                        <span className="font-bold text-gray-900">{activeSubject.updated}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-medium">Slug:</span>
                        <span className="font-bold text-gray-900">{activeSubject.slug}</span>
                      </div>
                    </div>
                  </div>

                  {/* Subject Properties */}
                  <div className="border rounded-xl p-6 bg-white shadow-sm flex flex-col">
                    <h3 className="font-bold text-gray-900 mb-6 text-lg">Subject Properties</h3>
                    <div className="flex flex-col">
                      <PropertyPill label="Active" value={activeSubject.active} />
                      <PropertyPill label="Optional" value={activeSubject.optional} />
                      <PropertyPill label="Has Theory" value={activeSubject.hasTheory} />
                      <PropertyPill label="Has Practical" value={activeSubject.hasPractical} />
                      <PropertyPill label="Lab Required" value={activeSubject.labRequired} />
                    </div>
                  </div>
                </div>

              </div>
            ) : null}
          </div>

        </div>
  );
}
