"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useSchoolStore } from "@/store/schoolStore";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import dynamic from "next/dynamic";
import { format } from "date-fns";
import Link from "next/link";

const FileText = dynamic(() => import("lucide-react").then((mod) => mod.FileText), { ssr: false });
const Calendar = dynamic(() => import("lucide-react").then((mod) => mod.Calendar), { ssr: false });
const CheckCircle2 = dynamic(() => import("lucide-react").then((mod) => mod.CheckCircle2), { ssr: false });
const Clock = dynamic(() => import("lucide-react").then((mod) => mod.Clock), { ssr: false });

type Assignment = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  subject: string;
  maxScore: number;
  submissions: {
    status: string;
    score?: number;
    submittedAt?: string;
  }[];
};

export default function StudentAssignmentsPage() {
  const school = useSchoolStore((state) => state.school);
  const user = useAuthStore((state) => state.user);
  
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (school?.id && user?.id) {
      fetchAssignments();
    }
  }, [school?.id, user?.id]);

  const fetchAssignments = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/assignments/student/me?tenantId=${school?.id}`, {
        headers: { "x-user-id": user?.id || "" }
      });
      if (res.ok) {
        const data = await res.json();
        setAssignments(data);
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to fetch assignments");
      }
    } catch (error) {
      toast.error("An error occurred while fetching assignments");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading your assignments...</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <FileText className="w-8 h-8 text-blue-600" />
          My Assignments
        </h1>
        <p className="text-gray-500 mt-2">View and submit your class assignments</p>
      </div>

      {assignments.length === 0 ? (
        <Card className="border-dashed bg-gray-50">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-900">All caught up!</h3>
            <p className="text-gray-500">You don't have any pending assignments at the moment.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((assignment) => {
            const submission = assignment.submissions?.[0];
            const isSubmitted = submission?.status === "SUBMITTED";
            const isGraded = submission?.status === "GRADED";
            
            const isPastDue = new Date(assignment.dueDate) < new Date();
            
            return (
              <Card key={assignment.id} className={`flex flex-col h-full border ${isGraded ? 'border-green-200 bg-green-50/30' : isSubmitted ? 'border-blue-200 bg-blue-50/30' : isPastDue ? 'border-red-200 bg-red-50/30' : 'border-gray-200'}`}>
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                      {assignment.subject}
                    </span>
                    {isGraded ? (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Graded: {submission.score}/{assignment.maxScore}
                      </span>
                    ) : isSubmitted ? (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Submitted
                      </span>
                    ) : isPastDue ? (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Overdue
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Pending
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-xl leading-tight text-gray-900">{assignment.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>Due: <strong className={isPastDue && !isSubmitted ? "text-red-600" : ""}>{format(new Date(assignment.dueDate), "MMM dd, yyyy h:mm a")}</strong></span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {assignment.description || "No description provided."}
                  </p>
                </CardContent>
                <CardFooter className="pt-0 border-t border-black/5 mt-4">
                  <Link href={`/portal/student/assignments/${assignment.id}`} className="w-full mt-4">
                    <Button variant={isGraded || isSubmitted ? "outline" : "default"} className="w-full">
                      {isGraded ? "View Grade" : isSubmitted ? "View Submission" : "Start Assignment"}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
