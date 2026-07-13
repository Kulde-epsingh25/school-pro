"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useSchoolStore } from "@/store/schoolStore";
import { useAuthStore } from "@/store/authStore";
import { Megaphone, Clock, User } from "lucide-react";

type Announcement = { 
  id: string; 
  title: string; 
  content: string; 
  targetRole: string; 
  authorName: string;
  createdAt: string;
};

export default function StudentNoticeboardPage() {
  const school = useSchoolStore((state) => state.school);
  const user = useAuthStore((state) => state.user);
  
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (school?.id && user?.roles) {
      fetchAnnouncements();
    }
  }, [school?.id, user?.roles]);

  const fetchAnnouncements = async () => {
    try {
      const primaryRole = user?.roles?.[0] || "STUDENT";
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/announcements?tenantId=${school?.id}&role=${primaryRole}`, {
        headers: { "x-user-id": user?.id || "" }
      });
      if (res.ok) setAnnouncements(await res.json());
    } catch (error) {
      toast.error("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ALL": return <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">All School</span>;
      case "STUDENT": return <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Students Only</span>;
      default: return null;
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading notices...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Megaphone className="w-6 h-6 text-green-600" /> Student Noticeboard
        </h2>
        <p className="text-gray-500 text-sm mt-1">Important announcements and updates for students</p>
      </div>

      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed text-gray-500">
            No announcements at this time.
          </div>
        ) : (
          announcements.map(ann => (
            <div key={ann.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-green-500"></div>
              
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
          ))
        )}
      </div>
    </div>
  );
}
