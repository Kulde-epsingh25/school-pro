"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useSchoolStore } from "@/store/schoolStore";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { Plus, BookOpen } from "lucide-react";

type Class = { id: string; name: string };
type Exam = { id: string; name: string; date: string; subject: string; maxScore: number; class: Class };

export default function ExamsPage() {
  const school = useSchoolStore((state) => state.school);
  const user = useAuthStore((state) => state.user);
  
  const [exams, setExams] = useState<Exam[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    date: new Date().toISOString().split("T")[0],
    classId: "",
    subject: "",
    maxScore: "100"
  });

  useEffect(() => {
    if (school?.id) {
      fetchExams();
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

  const fetchExams = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/exams?tenantId=${school?.id}`, {
        headers: { "x-user-id": user?.id || "" }
      });
      if (res.ok) setExams(await res.json());
    } catch (error) {
      toast.error("Failed to load exams");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.classId || !formData.subject) {
      toast.error("Please fill all required fields");
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/exams`, {
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
        toast.success("Exam created successfully!");
        setShowCreate(false);
        setFormData({ ...formData, name: "", subject: "" });
        fetchExams();
      } else {
        const data = await res.json().catch(() => null);
        toast.error(data?.error || "Failed to create exam");
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
        <h2 className="text-2xl font-bold text-gray-900">Exams & Gradebook</h2>
        <Button 
          onClick={() => setShowCreate(!showCreate)} 
          className="bg-[#4438CA] hover:bg-[#3730A3] text-white mt-4 sm:mt-0"
        >
          {showCreate ? "Cancel" : <><Plus className="w-4 h-4 mr-2" /> Create Exam</>}
        </Button>
      </div>

      {showCreate && (
        <div className="bg-white rounded-xl shadow-sm border border-blue-600/20 ring-1 ring-blue-600/10 p-6 mb-8 animate-in fade-in slide-in-from-top-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">New Exam Details</h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Exam Name</label>
              <Input 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Midterm 2026" 
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
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Subject</label>
              <Input 
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g. Mathematics" 
                className="bg-white border-gray-200 h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Date</label>
              <input 
                type="date" 
                value={formData.date} 
                onChange={e => setFormData({ ...formData, date: e.target.value })}
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

            <div className="lg:col-span-5 flex justify-end mt-2">
              <Button type="submit" disabled={loading} className="bg-[#4438CA] hover:bg-[#3730A3] text-white h-11 px-8">
                {loading ? "Saving..." : "Save Exam"}
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map(exam => (
          <div key={exam.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-5 border-b border-gray-100 bg-gray-50/50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{exam.name}</h3>
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                    <BookOpen className="w-4 h-4 text-blue-500" /> {exam.subject}
                  </p>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  Max: {exam.maxScore}
                </span>
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between text-sm mb-4">
                <span className="text-gray-500">Class: <span className="font-semibold text-gray-900">{exam.class?.name}</span></span>
                <span className="text-gray-500">Date: <span className="font-semibold text-gray-900">{new Date(exam.date).toLocaleDateString()}</span></span>
              </div>
              <Link href={`/dashboard/academics/exams/${exam.id}`}>
                <Button className="w-full bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 hover:text-blue-600 transition-colors">
                  Enter / View Grades
                </Button>
              </Link>
            </div>
          </div>
        ))}

        {exams.length === 0 && !loading && (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border border-gray-200 border-dashed">
            No exams created yet. Click "Create Exam" to get started.
          </div>
        )}
      </div>
    </div>
  );
}
