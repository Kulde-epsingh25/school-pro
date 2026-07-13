"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useSchoolStore } from "@/store/schoolStore";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { Plus, BookOpen, Clock } from "lucide-react";

type Class = { id: string; name: string };
type Assignment = { id: string; title: string; description?: string; dueDate: string; subject: string; maxScore: number; class: Class };

export default function AssignmentsPage() {
  const school = useSchoolStore((state) => state.school);
  const user = useAuthStore((state) => state.user);
  
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: new Date().toISOString().split("T")[0],
    classId: "",
    subject: "",
    maxScore: "100"
  });

  useEffect(() => {
    if (school?.id) {
      fetchAssignments();
      fetchClasses();
    }
  }, [school?.id]);

  const fetchClasses = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/classes?tenantId=${school?.id}`, {
        headers: { "x-user-id": user?.id || "" }
      });
      if (res.ok) setClasses(await res.json());
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAssignments = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/assignments?tenantId=${school?.id}`, {
        headers: { "x-user-id": user?.id || "" }
      });
      if (res.ok) setAssignments(await res.json());
    } catch (error) {
      toast.error("Failed to load assignments");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.classId || !formData.subject || !formData.dueDate) {
      toast.error("Please fill all required fields");
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/assignments`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-user-id": user?.id || "" 
        },
        body: JSON.stringify({
          ...formData,
          tenantId: school?.id
        })
      });

      if (res.ok) {
        toast.success("Assignment created successfully!");
        setShowCreate(false);
        setFormData({ ...formData, title: "", description: "", subject: "" });
        fetchAssignments();
      } else {
        const data = await res.json().catch(() => null);
        toast.error(data?.error || "Failed to create assignment");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Assignments</h2>
        <Button 
          onClick={() => setShowCreate(!showCreate)} 
          className="bg-[#4438CA] hover:bg-[#3730A3] text-white mt-4 sm:mt-0"
        >
          {showCreate ? "Cancel" : <><Plus className="w-4 h-4 mr-2" /> Create Assignment</>}
        </Button>
      </div>

      {showCreate && (
        <div className="bg-white rounded-xl shadow-sm border border-blue-600/20 ring-1 ring-blue-600/10 p-6 mb-8 animate-in fade-in slide-in-from-top-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">New Assignment Details</h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
            <div className="space-y-2 lg:col-span-2">
              <label className="text-sm font-semibold text-gray-700">Assignment Title</label>
              <Input 
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Chapter 4 Essay" 
                className="bg-white border-gray-200 h-11"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Class</label>
              <select 
                value={formData.classId} 
                onChange={e => setFormData({ ...formData, classId: e.target.value })}
                className="flex h-11 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                required
              >
                <option value="">Select Class</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="space-y-2 lg:col-span-3">
              <label className="text-sm font-semibold text-gray-700">Description / Instructions</label>
              <textarea 
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Write an essay about..." 
                className="flex w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm min-h-[80px]"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Subject</label>
              <Input 
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g. English" 
                className="bg-white border-gray-200 h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Due Date</label>
              <input 
                type="date" 
                value={formData.dueDate} 
                onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                className="flex h-11 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Max Score</label>
              <Input 
                type="number"
                value={formData.maxScore}
                onChange={e => setFormData({ ...formData, maxScore: e.target.value })}
                className="bg-white border-gray-200 h-11"
                required
                min="1"
              />
            </div>

            <div className="lg:col-span-3 flex justify-end mt-2">
              <Button type="submit" disabled={loading} className="bg-[#4438CA] hover:bg-[#3730A3] text-white h-11 px-8">
                {loading ? "Saving..." : "Save Assignment"}
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map(assignment => (
          <div key={assignment.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
            <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900 text-lg line-clamp-2">{assignment.title}</h3>
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap ml-2">
                  Max: {assignment.maxScore}
                </span>
              </div>
              <p className="text-sm text-gray-500 flex items-center gap-1 mb-2">
                <BookOpen className="w-4 h-4 text-blue-500" /> {assignment.subject} &bull; <span className="font-medium text-gray-700">{assignment.class?.name}</span>
              </p>
              {assignment.description && (
                <p className="text-sm text-gray-600 line-clamp-2 mt-2">{assignment.description}</p>
              )}
            </div>
            <div className="p-5 bg-white mt-auto">
              <div className="flex items-center text-sm text-gray-500 mb-4 font-medium">
                <Clock className="w-4 h-4 mr-1 text-orange-500" /> Due: {new Date(assignment.dueDate).toLocaleDateString()}
              </div>
              <Link href={`/dashboard/academics/assignments/${assignment.id}`}>
                <Button className="w-full bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 hover:text-blue-600 transition-colors">
                  View & Grade Submissions
                </Button>
              </Link>
            </div>
          </div>
        ))}

        {assignments.length === 0 && !loading && (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border border-gray-200 border-dashed">
            No assignments created yet. Click "Create Assignment" to get started.
          </div>
        )}
      </div>
    </div>
  );
}
