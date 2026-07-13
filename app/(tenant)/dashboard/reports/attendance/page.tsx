"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useSchoolStore } from "@/store/schoolStore";
import { useAuthStore } from "@/store/authStore";
import dynamic from "next/dynamic";

const CalendarDays = dynamic(() => import("lucide-react").then((mod) => mod.CalendarDays), { ssr: false });
const AlertTriangle = dynamic(() => import("lucide-react").then((mod) => mod.AlertTriangle), { ssr: false });
const CheckCircle2 = dynamic(() => import("lucide-react").then((mod) => mod.CheckCircle2), { ssr: false });
const XCircle = dynamic(() => import("lucide-react").then((mod) => mod.XCircle), { ssr: false });
const Clock = dynamic(() => import("lucide-react").then((mod) => mod.Clock), { ssr: false });

type AttendanceReport = {
  summary: {
    totalRecords: number;
    presentCount: number;
    absentCount: number;
    lateCount: number;
    excusedCount: number;
    overallPercentage: number;
  };
  classAverages: {
    class: string;
    percentage: number;
  }[];
  criticalStudents: {
    name: string;
    class: string;
    total: number;
    present: number;
    percentage: number;
  }[];
};

export default function AttendanceReportPage() {
  const school = useSchoolStore((state) => state.school);
  const user = useAuthStore((state) => state.user);
  
  const [data, setData] = useState<AttendanceReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (school?.id) {
      fetchReport();
    }
  }, [school?.id]);

  const fetchReport = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/reports/attendance?tenantId=${school?.id}`, {
        headers: { "x-user-id": user?.id || "" }
      });
      if (res.ok) {
        setData(await res.json());
      } else {
        toast.error("Failed to load attendance data");
      }
    } catch (error) {
      toast.error("An error occurred while fetching attendance data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Compiling attendance data...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto w-full space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <CalendarDays className="w-6 h-6 text-teal-600" /> Attendance Report
        </h2>
        <p className="text-sm text-gray-500 mt-1">School-wide attendance aggregates and critical absence tracking</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-center">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Overall Attendance</p>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-teal-500" />
            <span className="text-4xl font-black text-gray-900">
              {(data?.summary?.overallPercentage || 0).toFixed(1)}%
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-center">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Absences</p>
          <div className="flex items-center gap-3">
            <XCircle className="w-8 h-8 text-red-500" />
            <span className="text-4xl font-black text-gray-900">
              {data?.summary?.absentCount || 0}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-center">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Lates</p>
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-yellow-500" />
            <span className="text-4xl font-black text-gray-900">
              {data?.summary?.lateCount || 0}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-center">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Excused</p>
          <div className="flex items-center gap-3">
            <CalendarDays className="w-8 h-8 text-blue-500" />
            <span className="text-4xl font-black text-gray-900">
              {data?.summary?.excusedCount || 0}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Class Averages */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-gray-500" /> Class-wise Attendance
          </h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {data?.classAverages?.length === 0 && <p className="text-sm text-gray-400">No data available</p>}
            {data?.classAverages?.sort((a, b) => b.percentage - a.percentage).map((c, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="font-medium text-gray-700 w-1/3 truncate">{c.class}</span>
                <div className="flex items-center gap-3 w-2/3">
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className={\`h-2 rounded-full \${c.percentage >= 90 ? 'bg-teal-500' : c.percentage >= 75 ? 'bg-yellow-400' : 'bg-red-500'}\`} 
                      style={{ width: \`\${Math.min(c.percentage, 100)}%\` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-gray-900 w-12 text-right">{c.percentage.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Students */}
        <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" /> Critical Absences (&lt; 75%)
          </h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {data?.criticalStudents?.length === 0 ? (
              <div className="bg-green-50 text-green-700 p-4 rounded-md text-sm text-center">
                Great job! No students have critically low attendance.
              </div>
            ) : (
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                  <tr>
                    <th className="px-4 py-2">Student</th>
                    <th className="px-4 py-2">Class</th>
                    <th className="px-4 py-2 text-right">Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.criticalStudents?.map((student, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="px-4 py-3 font-medium text-gray-900">{student.name}</td>
                      <td className="px-4 py-3">{student.class}</td>
                      <td className="px-4 py-3 text-right">
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full font-bold text-xs">
                          {student.percentage.toFixed(1)}%
                        </span>
                        <div className="text-xs text-gray-400 mt-1">{student.present}/{student.total} days</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
