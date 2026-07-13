"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useSchoolStore } from "@/store/schoolStore";
import { useAuthStore } from "@/store/authStore";
import { Plus, Megaphone, Clock, User } from "lucide-react";

type Announcement = { 
  id: string; 
  title: string; 
  content: string; 
  targetRole: string; 
  authorName: string;
  createdAt: string;
};

export default function NoticeboardPage() {
  const school = useSchoolStore((state) => state.school);
  const user = useAuthStore((state) => state.user);
  
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    targetRole: "ALL",
  });

  // Only allow ADMIN or TEACHER to create announcements
  const canCreate = user?.roles?.includes("ADMIN") || user?.roles?.includes("TEACHER") || user?.roles?.includes("SUPERADMIN");

  useEffect(() => {
    if (school?.id && user?.roles) {
      fetchAnnouncements();
    }
  }, [school?.id, user?.roles]);

  const fetchAnnouncements = async () => {
    try {
      // Pass the user's primary role to the backend to filter announcements appropriately
      const primaryRole = user?.roles?.[0] || "ALL";
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/announcements?tenantId=${school?.id}&role=${primaryRole}`, {
        headers: { "x-user-id": user?.id || "" }
      });
      if (res.ok) setAnnouncements(await res.json());
    } catch (error) {
      toast.error("Failed to load announcements");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error("Please fill all required fields");
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/announcements`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-user-id": user?.id || "" 
        },
        body: JSON.stringify({
          ...formData,
          tenantId: school?.id,
          authorName: user?.name || "Admin"
        })
      });

      if (res.ok) {
        toast.success("Announcement broadcasted successfully!");
        setShowCreate(false);
        setFormData({ ...formData, title: "", content: "" });
        fetchAnnouncements();
      } else {
        const data = await res.json().catch(() => null);
        toast.error(data?.error || "Failed to create announcement");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ALL": return <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">All School</span>;
      case "TEACHER": return <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Teachers Only</span>;
      case "STUDENT": return <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Students Only</span>;
      case "PARENT": return <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Parents Only</span>;
      default: return null;
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-[#4438CA]" /> Noticeboard
          </h2>
          <p className="text-gray-500 text-sm mt-1">Important announcements and updates</p>
        </div>
        
        {canCreate && (
          <Button 
            onClick={() => setShowCreate(!showCreate)} 
            className="bg-[#4438CA] hover:bg-[#3730A3] text-white mt-4 sm:mt-0"
          >
            {showCreate ? "Cancel" : <><Plus className="w-4 h-4 mr-2" /> New Announcement</>}
          </Button>
        )}
      </div>

      {showCreate && canCreate && (
        <div className="bg-white rounded-xl shadow-sm border border-blue-600/20 ring-1 ring-blue-600/10 p-6 mb-8 animate-in fade-in slide-in-from-top-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Create Announcement</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700">Subject / Title</label>
                <Input 
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. School closed on Friday" 
                  className="bg-white border-gray-200 h-11"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Target Audience</label>
                <select 
                  value={formData.targetRole} 
                  onChange={e => setFormData({ ...formData, targetRole: e.target.value })}
                  className="flex h-11 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                  required
                >
                  <option value="ALL">All School</option>
                  <option value="TEACHER">Teachers Only</option>
                  <option value="STUDENT">Students Only</option>
                  <option value="PARENT">Parents Only</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Message Content</label>
              <textarea 
                value={formData.content}
                onChange={e => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your announcement here..." 
                className="flex w-full rounded-md border border-gray-200 bg-white px-3 py-3 text-sm min-h-[120px]"
                required
              />
            </div>
            
            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={loading} className="bg-[#4438CA] hover:bg-[#3730A3] text-white h-11 px-8">
                {loading ? "Broadcasting..." : "Broadcast Announcement"}
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {announcements.map(ann => (
          <div key={ann.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#4438CA]"></div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-3">
              <div>
                <h3 className="font-bold text-gray-900 text-lg sm:text-xl">{ann.title}</h3>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-2">
                  <span className="flex items-center"><User className="w-4 h-4 mr-1" /> {ann.authorName}</span>
                  <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {new Date(ann.createdAt).toLocaleString()}</span>
                </div>
              </div>
              <div className="shrink-0">
                {getRoleBadge(ann.targetRole)}
              </div>
            </div>
            
            <div className="mt-4 text-gray-700 whitespace-pre-wrap text-sm leading-relaxed border-t border-gray-50 pt-4">
              {ann.content}
            </div>
          </div>
        ))}

        {announcements.length === 0 && !loading && (
          <div className="py-16 text-center text-gray-500 bg-white rounded-xl border border-gray-200 border-dashed">
            <Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-lg font-medium text-gray-900">No announcements yet</p>
            <p className="text-sm mt-1">When admins or teachers post announcements, they will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
