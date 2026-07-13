"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useSchoolStore } from "@/store/schoolStore";
import { useAuthStore } from "@/store/authStore";
import dynamic from "next/dynamic";

const GraduationCap = dynamic(() => import("lucide-react").then((mod) => mod.GraduationCap), { ssr: false });
const Award = dynamic(() => import("lucide-react").then((mod) => mod.Award), { ssr: false });
const BookOpen = dynamic(() => import("lucide-react").then((mod) => mod.BookOpen), { ssr: false });
const Users = dynamic(() => import("lucide-react").then((mod) => mod.Users), { ssr: false });

export default function AcademicReportsPage() {
  const school = useSchoolStore((state) => state.school);
  const user = useAuthStore((state) => state.user);
  
  const [data, setData] = useState<{
    overallAverage: number;
    subjectAverages: { subject: string; average: number }[];
    classAverages: { class: string; average: number }[];
  } | null>(null);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (school?.id) {
      fetchReport();
    }
  }, [school?.id]);

  const fetchReport = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/reports/academic?tenantId=${school?.id}`, {
        headers: { "x-user-id": user?.id || "" }
      });
      if (res.ok) {
        setData(await res.json());
      } else {
        toast.error("Failed to load academic data");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Compiling academic data...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto w-full space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-purple-600" /> Academic Report Overview
        </h2>
        <p className="text-sm text-gray-500 mt-1">School-wide performance aggregates and class-level insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Overall School Average */}
        <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden md:col-span-1">
          <div className="absolute top-0 w-full h-1 bg-purple-500"></div>
          <Award className="w-10 h-10 text-purple-400 mb-3" />
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Overall School Average</p>
          <p className="text-5xl font-black text-gray-900 mt-2">
            {(data?.overallAverage || 0).toFixed(1)}<span className="text-2xl text-gray-400">%</span>
          </p>
        </div>

        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Top Class */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4 text-gray-600 font-semibold">
              <Users className="w-5 h-5 text-blue-500" /> Performance by Class
            </div>
            <div className="space-y-4">
              {data?.classAverages.length === 0 && <p className="text-sm text-gray-400">No data available</p>}
              {data?.classAverages.sort((a, b) => b.average - a.average).map((c, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">{c.class}</span>
                  <div className="flex items-center gap-3 w-1/2">
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min(c.average, 100)}%` }}></div>
                    </div>
                    <span className="text-sm font-bold text-gray-900 w-10 text-right">{c.average.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Subject */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4 text-gray-600 font-semibold">
              <BookOpen className="w-5 h-5 text-orange-500" /> Performance by Subject
            </div>
            <div className="space-y-4">
              {data?.subjectAverages.length === 0 && <p className="text-sm text-gray-400">No data available</p>}
              {data?.subjectAverages.sort((a, b) => b.average - a.average).map((s, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">{s.subject}</span>
                  <div className="flex items-center gap-3 w-1/2">
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-orange-400 h-2 rounded-full" style={{ width: `${Math.min(s.average, 100)}%` }}></div>
                    </div>
                    <span className="text-sm font-bold text-gray-900 w-10 text-right">{s.average.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
