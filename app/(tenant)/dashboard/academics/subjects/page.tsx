"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, BookOpen, FileText, LayoutGrid, CheckCircle2, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiClient } from "@/lib/api-client";
import { useSchoolStore } from "@/store/schoolStore";
import { EmptyState } from "@/components/feedback/empty-state";
import { toast } from "sonner";

export interface SubjectItem {
  id: string;
  name: string;
  code: string;
  shortName: string;
  category: string;
  type: string;
  department: string;
  created?: string;
  updated?: string;
  slug?: string;
  active?: boolean;
  optional?: boolean;
  hasTheory?: boolean;
  hasPractical?: boolean;
  labRequired?: boolean;
}

export default function SubjectsPage() {
  const school = useSchoolStore((state) => state.school);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [activeSubject, setActiveSubject] = useState<SubjectItem | null>(null);
  const [departments, setDepartments] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    shortName: "",
    category: "CORE",
    type: "THEORY",
    department: ""
  });

  useEffect(() => {
    async function loadData() {
      if (!school?.id) return;
      try {
        setLoading(true);
        const [subRes, deptRes] = await Promise.all([
          apiClient.get<SubjectItem[]>(`/academics/subjects?tenantId=${school.id}`),
          apiClient.get<any[]>(`/academics/departments?tenantId=${school.id}`)
        ]);

        if (subRes.ok && subRes.data && subRes.data.length > 0) {
          setSubjects(subRes.data);
          setActiveSubject(subRes.data[0]);
        } else {
          setSubjects([]);
          setActiveSubject(null);
        }

        if (deptRes.ok && deptRes.data) {
          const names = deptRes.data.map((d: any) => d.name);
          setDepartments(names);
          if (names.length > 0) {
            setFormData((prev) => ({ ...prev, department: names[0] }));
          }
        }
      } catch (err) {
        setSubjects([]);
        setActiveSubject(null);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [school?.id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) return;

    const newSubject: SubjectItem = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      code: formData.code.trim().toUpperCase(),
      shortName: formData.shortName.trim() || formData.name.slice(0, 4),
      category: formData.category,
      type: formData.type,
      department: formData.department || "General",
      created: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      updated: "Just now",
      slug: formData.name.toLowerCase().replace(/\s+/g, "-"),
      active: true,
      optional: formData.category === "ELECTIVE",
      hasTheory: formData.type.includes("THEORY"),
      hasPractical: formData.type.includes("PRACTICAL"),
      labRequired: formData.type.includes("PRACTICAL")
    };

    try {
      if (school?.id) {
        await apiClient.post(`/academics/subjects?tenantId=${school.id}`, {
          ...newSubject,
          tenantId: school.id
        });
      }
    } catch (err) {
      console.error(err);
    }

    setSubjects((prev) => [...prev, newSubject]);
    setActiveSubject(newSubject);
    setIsModalOpen(false);
    setFormData({
      name: "",
      code: "",
      shortName: "",
      category: "CORE",
      type: "THEORY",
      department: departments[0] || ""
    });
    toast.success("Subject added successfully");
  };

  const handleDelete = async (id: string) => {
    try {
      if (school?.id) {
        await apiClient.delete(`/academics/subjects/${id}?tenantId=${school.id}`);
      }
    } catch (err) {
      console.error(err);
    }
    const next = subjects.filter((s) => s.id !== id);
    setSubjects(next);
    if (activeSubject?.id === id) {
      setActiveSubject(next.length > 0 ? next[0] : null);
    }
    toast.success("Subject removed");
  };

  const PropertyPill = ({ label, value }: { label: string; value?: boolean }) => (
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
                    <Input 
                      value={formData.name} 
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                      placeholder="e.g. Advanced Physics" 
                      className="pl-9 h-11 border-gray-300 focus-visible:ring-blue-500" 
                      required 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Subject code</label>
                    <Input 
                      value={formData.code} 
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })} 
                      placeholder="PHY201" 
                      className="h-11" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Short Name</label>
                    <Input 
                      value={formData.shortName} 
                      onChange={(e) => setFormData({ ...formData, shortName: e.target.value })} 
                      placeholder="Phys" 
                      className="h-11" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Select Category</label>
                    <select 
                      value={formData.category} 
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })} 
                      className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-gray-600"
                    >
                      <option value="CORE">CORE</option>
                      <option value="ELECTIVE">ELECTIVE</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Select Type</label>
                    <select 
                      value={formData.type} 
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })} 
                      className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-gray-600"
                    >
                      <option value="THEORY">THEORY</option>
                      <option value="PRACTICAL">PRACTICAL</option>
                      <option value="THEORY & PRACTICAL">THEORY & PRACTICAL</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Department</label>
                  {departments.length > 0 ? (
                    <select 
                      value={formData.department} 
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })} 
                      className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-gray-600"
                    >
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  ) : (
                    <Input 
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      placeholder="e.g. Science"
                      className="h-11"
                    />
                  )}
                </div>

                <Button type="submit" className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-8 h-11 mt-2 w-full">
                  <Plus className="w-4 h-4 mr-2" /> Add Subject
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {subjects.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-500">
              No subjects added yet.
            </div>
          ) : (
            subjects.map((subject) => {
              const isActive = activeSubject?.id === subject.id;
              return (
                <div 
                  key={subject.id} 
                  onClick={() => setActiveSubject(subject)}
                  className={`group w-full text-left px-4 py-3 flex items-center justify-between cursor-pointer transition-colors ${
                    isActive ? "bg-gray-100/80 border-r-2 border-gray-900" : "hover:bg-gray-50"
                  }`}
                >
                  <span className={`text-sm font-semibold ${isActive ? "text-gray-900" : "text-gray-700"}`}>
                    {subject.name}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(subject.id);
                      }}
                      className="h-6 w-6 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
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
                  <span className="text-sm font-bold text-gray-800">Curriculum Scope</span>
                  <CheckCircle2 className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex items-center gap-2 mt-auto">
                  <span className="text-sm text-gray-500">Grading:</span>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-green-50 text-green-700 rounded border border-green-200">STANDARD</span>
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
                    <span className="font-bold text-gray-900">{activeSubject.created || "Active"}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">Last Updated:</span>
                    <span className="font-bold text-gray-900">{activeSubject.updated || "Current"}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">Slug:</span>
                    <span className="font-bold text-gray-900">{activeSubject.slug || activeSubject.name.toLowerCase()}</span>
                  </div>
                </div>
              </div>

              {/* Subject Properties */}
              <div className="border rounded-xl p-6 bg-white shadow-sm flex flex-col">
                <h3 className="font-bold text-gray-900 mb-6 text-lg">Subject Properties</h3>
                <div className="flex flex-col">
                  <PropertyPill label="Active" value={activeSubject.active ?? true} />
                  <PropertyPill label="Optional" value={activeSubject.optional ?? false} />
                  <PropertyPill label="Has Theory" value={activeSubject.hasTheory ?? true} />
                  <PropertyPill label="Has Practical" value={activeSubject.hasPractical ?? false} />
                  <PropertyPill label="Lab Required" value={activeSubject.labRequired ?? false} />
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <EmptyState 
              icon={BookOpen}
              title="No subject selected"
              description="Select a subject from the left panel or register a new curriculum subject."
              action={{
                label: "Add Subject",
                onClick: () => setIsModalOpen(true)
              }}
            />
          </div>
        )}
      </div>

    </div>
  );
}
