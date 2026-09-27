"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Users, BookOpen, DollarSign, Calendar, User, Building, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiClient } from "@/lib/api-client";
import { useSchoolStore } from "@/store/schoolStore";
import { EmptyState } from "@/components/feedback/empty-state";
import { toast } from "sonner";

export interface DepartmentItem {
  id: string;
  name: string;
  created?: string;
  hod?: string;
  hodSince?: string;
  teachers?: number;
  subjects?: any[];
  budget?: number;
  fy?: string;
}

export default function DepartmentsPage() {
  const school = useSchoolStore((state) => state.school);
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [activeDept, setActiveDept] = useState<DepartmentItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", hod: "" });

  useEffect(() => {
    async function fetchDepartments() {
      if (!school?.id) return;
      try {
        setLoading(true);
        const res = await apiClient.get<DepartmentItem[]>(`/academics/departments?tenantId=${school.id}`);
        if (res.ok && res.data && res.data.length > 0) {
          setDepartments(res.data);
          setActiveDept(res.data[0]);
        } else {
          setDepartments([]);
          setActiveDept(null);
        }
      } catch (err) {
        setDepartments([]);
        setActiveDept(null);
      } finally {
        setLoading(false);
      }
    }
    fetchDepartments();
  }, [school?.id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const newDept: DepartmentItem = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      hod: formData.hod.trim() || "Unassigned",
      created: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      hodSince: formData.hod ? new Date().getFullYear().toString() : "Not assigned",
      teachers: 0,
      subjects: [],
      budget: 0,
      fy: `FY ${new Date().getFullYear()}-${new Date().getFullYear() + 1}`
    };

    try {
      if (school?.id) {
        await apiClient.post(`/academics/departments?tenantId=${school.id}`, {
          name: newDept.name,
          hod: newDept.hod,
          tenantId: school.id
        });
      }
    } catch (err) {
      console.error(err);
    }

    setDepartments((prev) => [...prev, newDept]);
    setActiveDept(newDept);
    setIsModalOpen(false);
    setFormData({ name: "", hod: "" });
    toast.success("Department added successfully");
  };

  const handleDelete = async (id: string) => {
    try {
      if (school?.id) {
        await apiClient.delete(`/academics/departments/${id}?tenantId=${school.id}`);
      }
    } catch (err) {
      console.error(err);
    }
    const next = departments.filter((d) => d.id !== id);
    setDepartments(next);
    if (activeDept?.id === id) {
      setActiveDept(next.length > 0 ? next[0] : null);
    }
    toast.success("Department removed");
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
                  <Input 
                    value={formData.name} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                    placeholder="e.g. Science, Mathematics, Humanities" 
                    className="h-11 border-gray-300 focus-visible:ring-blue-500" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Head of Department (HOD)</label>
                  <Input 
                    value={formData.hod} 
                    onChange={(e) => setFormData({ ...formData, hod: e.target.value })} 
                    placeholder="e.g. Faculty Name (Optional)" 
                    className="h-11 border-gray-300 focus-visible:ring-blue-500" 
                  />
                </div>
                <Button type="submit" className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-8 h-11 mt-2 w-full">
                  <Plus className="w-4 h-4 mr-2" /> Add Department
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {departments.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-500">
              No departments configured yet. Click '+' to create one.
            </div>
          ) : (
            departments.map((dept) => {
              const isActive = activeDept?.id === dept.id;
              return (
                <div 
                  key={dept.id} 
                  onClick={() => setActiveDept(dept)}
                  className={`group w-full text-left px-4 py-3 flex items-center justify-between cursor-pointer transition-colors ${
                    isActive ? "bg-gray-100/80 border-r-2 border-gray-900" : "hover:bg-gray-50"
                  }`}
                >
                  <span className={`text-sm font-medium ${isActive ? "text-gray-900" : "text-gray-700"}`}>
                    {dept.name}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(dept.id);
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
        {activeDept ? (
          <div className="max-w-5xl mx-auto space-y-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{activeDept.name}</h1>
            </div>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border rounded-xl p-6 bg-white shadow-sm flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-sm font-semibold text-gray-600">Faculty Count</span>
                  <Users className="w-5 h-5 text-gray-400" />
                </div>
                <span className="text-3xl font-bold text-gray-900">{activeDept.teachers ?? 0}</span>
              </div>
              
              <div className="border rounded-xl p-6 bg-white shadow-sm flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-sm font-semibold text-gray-600">Assigned Subjects</span>
                  <BookOpen className="w-5 h-5 text-gray-400" />
                </div>
                <span className="text-3xl font-bold text-gray-900">{activeDept.subjects?.length ?? 0}</span>
              </div>

              <div className="border rounded-xl p-6 bg-white shadow-sm flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-sm font-semibold text-gray-600">Annual Budget</span>
                  <DollarSign className="w-5 h-5 text-gray-400" />
                </div>
                <span className="text-3xl font-bold text-gray-900">${activeDept.budget ?? 0}</span>
                <span className="text-xs text-gray-400 font-medium mt-1 uppercase">{activeDept.fy || "Current FY"}</span>
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
                    <span className="font-medium text-gray-900">{activeDept.created || "Active"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="w-24">HOD:</span>
                    <span className="font-medium text-gray-900">{activeDept.hod || "Unassigned"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="w-24">HOD Since:</span>
                    <span className="font-medium text-gray-900">{activeDept.hodSince || "—"}</span>
                  </div>
                </div>
              </div>

              {/* Subjects */}
              <div className="border rounded-xl p-6 bg-white shadow-sm">
                <h3 className="font-bold text-gray-900 mb-6 text-lg">Subjects</h3>
                {activeDept.subjects && activeDept.subjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeDept.subjects.map((sub: any, i: number) => (
                      <div key={i} className="border rounded-lg p-3 bg-gray-50/50">
                        <span className="font-bold text-gray-900 block text-sm">{sub.name || sub.title}</span>
                        <span className="text-xs text-gray-500">{sub.code || "Core"}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-sm text-gray-400">
                    No subjects linked to this department yet.
                  </div>
                )}
              </div>
            </div>

          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <EmptyState 
              icon={Building}
              title="No department selected"
              description="Select a department from the left sidebar or create a new department."
              action={{
                label: "Add Department",
                onClick: () => setIsModalOpen(true)
              }}
            />
          </div>
        )}
      </div>

    </div>
  );
}
