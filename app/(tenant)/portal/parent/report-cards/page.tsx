"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useSchoolStore } from "@/store/schoolStore";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

const Printer = dynamic(() => import("lucide-react").then((mod) => mod.Printer), { ssr: false });
const UserIcon = dynamic(() => import("lucide-react").then((mod) => mod.User), { ssr: false });
const BookOpen = dynamic(() => import("lucide-react").then((mod) => mod.BookOpen), { ssr: false });

type Student = { id: string; user: { firstName: string; lastName: string } };
type ReportCard = {
  student: { name: string; class: string; stream?: string };
  summary: { totalScore: number; maxScore: number; overallPercentage: number; overallGradeLetter: string };
  subjects: {
    subject: string;
    totalScore: number;
    maxScore: number;
    percentage: number;
    gradeLetter: string;
    exams: { examName: string; score: number; maxScore: number; remarks: string }[];
  }[];
};

export default function ParentReportCardsPage() {
  const school = useSchoolStore((state) => state.school);
  const user = useAuthStore((state) => state.user);
  
  const [children, setChildren] = useState<Student[]>([]);
  const [selectedChild, setSelectedChild] = useState<Student | null>(null);
  const [reportCard, setReportCard] = useState<ReportCard | null>(null);
  const [loadingRC, setLoadingRC] = useState(false);
  const [loadingChildren, setLoadingChildren] = useState(true);

  useEffect(() => {
    if (school?.id && user?.id) {
      fetchMyChildren();
    }
  }, [school?.id, user?.id]);

  const fetchMyChildren = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/parents/me/children?tenantId=${school?.id}`, {
        headers: { "x-user-id": user?.id || "" }
      });
      if (res.ok) {
        const data = await res.json();
        setChildren(data);
        if (data.length > 0) {
          loadReportCard(data[0]);
        }
      }
    } catch (error) {
      toast.error("Failed to load children");
    } finally {
      setLoadingChildren(false);
    }
  };

  const loadReportCard = async (student: Student) => {
    setSelectedChild(student);
    setLoadingRC(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/grades/report-card/${student.id}?tenantId=${school?.id}`, {
        headers: { "x-user-id": user?.id || "" }
      });
      if (res.ok) {
        setReportCard(await res.json());
      } else {
        toast.error("Failed to load report card");
        setReportCard(null);
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoadingRC(false);
    }
  };

  if (loadingChildren) {
    return <div className="p-10 text-center text-gray-500">Loading your portal...</div>;
  }

  if (children.length === 0) {
    return (
      <div className="p-10 text-center text-gray-500 bg-white rounded-xl shadow-sm border border-gray-200 mt-6 mx-6 max-w-3xl">
        No children are currently linked to your account.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Student Report Cards</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Panel: Child Selection */}
        <div className="md:col-span-3 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50 font-medium text-gray-700">
              My Children
            </div>
            <div className="p-2 space-y-1">
              {children.map(child => (
                <button
                  key={child.id}
                  onClick={() => loadReportCard(child)}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${selectedChild?.id === child.id ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'hover:bg-gray-50 text-gray-700'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedChild?.id === child.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <span className="font-medium">{child.user.firstName} {child.user.lastName}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel: Report Card Display */}
        <div className="md:col-span-9">
          {loadingRC ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              Loading Report Card...
            </div>
          ) : reportCard ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative" id="printable-report-card">
              {/* Header */}
              <div className="bg-emerald-900 text-white p-8 text-center relative">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="absolute top-4 right-4 bg-white/10 border-white/20 hover:bg-white/20 text-white"
                  onClick={() => window.print()}
                >
                  <Printer className="w-4 h-4 mr-2" /> Print
                </Button>
                
                <h1 className="text-3xl font-bold mb-2">{school?.name || "School Pro"}</h1>
                <h2 className="text-xl text-emerald-200 tracking-wider uppercase font-semibold">Official Academic Report Card</h2>
                
                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-left border-t border-emerald-800 pt-6">
                  <div>
                    <p className="text-emerald-300 text-xs uppercase font-bold tracking-wider mb-1">Student Name</p>
                    <p className="font-medium text-lg">{reportCard.student.name}</p>
                  </div>
                  <div>
                    <p className="text-emerald-300 text-xs uppercase font-bold tracking-wider mb-1">Class</p>
                    <p className="font-medium text-lg">{reportCard.student.class} {reportCard.student.stream && `(${reportCard.student.stream})`}</p>
                  </div>
                  <div>
                    <p className="text-emerald-300 text-xs uppercase font-bold tracking-wider mb-1">Overall Grade</p>
                    <p className="font-medium text-lg text-emerald-100">{reportCard.summary.overallGradeLetter}</p>
                  </div>
                  <div>
                    <p className="text-emerald-300 text-xs uppercase font-bold tracking-wider mb-1">Total Score</p>
                    <p className="font-medium text-lg">{reportCard.summary.totalScore} / {reportCard.summary.maxScore}</p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-8">
                <h3 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2 mb-6 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-600" /> Subject Breakdown
                </h3>
                
                {reportCard.subjects.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No grades recorded for this student yet.</div>
                ) : (
                  <div className="space-y-6">
                    {reportCard.subjects.map((sub, idx) => (
                      <div key={idx} className="border border-gray-100 rounded-lg p-4 bg-gray-50/50">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-bold text-gray-900 text-lg">{sub.subject}</h4>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500">Score: <strong className="text-gray-900">{sub.totalScore}/{sub.maxScore}</strong></span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${sub.gradeLetter.includes('A') || sub.gradeLetter.includes('B') ? 'bg-green-100 text-green-800' : sub.gradeLetter.includes('C') ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                              {sub.gradeLetter} ({sub.percentage.toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded border border-gray-200 overflow-hidden">
                          <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                              <tr>
                                <th className="px-4 py-2 font-medium">Exam</th>
                                <th className="px-4 py-2 font-medium">Marks</th>
                                <th className="px-4 py-2 font-medium">Remarks</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {sub.exams.map((exam, i) => (
                                <tr key={i}>
                                  <td className="px-4 py-2 text-gray-900">{exam.examName}</td>
                                  <td className="px-4 py-2 text-gray-700 font-medium">{exam.score} / {exam.maxScore}</td>
                                  <td className="px-4 py-2 text-gray-500 italic text-xs">{exam.remarks || "-"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between text-center text-sm text-gray-500">
                  <div className="w-48 border-t border-gray-400 pt-2">Class Teacher Signature</div>
                  <div className="w-48 border-t border-gray-400 pt-2">Principal Signature</div>
                  <div className="w-48 border-t border-gray-400 pt-2">Parent Signature</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl border border-gray-200 border-dashed p-12 flex flex-col items-center justify-center text-gray-400 h-full min-h-[400px]">
              <BookOpen className="w-12 h-12 mb-4 text-gray-300" />
              <p>Select a child to view their report card</p>
            </div>
          )}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          #printable-report-card, #printable-report-card * { visibility: visible; }
          #printable-report-card { position: absolute; left: 0; top: 0; width: 100%; border: none !important; box-shadow: none !important; }
          #printable-report-card button { display: none !important; }
        }
      `}} />
    </div>
  );
}
