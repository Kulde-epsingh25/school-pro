"use client";

import React, { useState, useEffect, use } from "react";
import { toast } from "sonner";
import { useSchoolStore } from "@/store/schoolStore";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import dynamic from "next/dynamic";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ArrowLeft = dynamic(() => import("lucide-react").then((mod) => mod.ArrowLeft), { ssr: false });
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
    content?: string;
    score?: number;
    feedback?: string;
    submittedAt?: string;
    gradedAt?: string;
  }[];
};

export default function StudentAssignmentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const assignmentId = unwrappedParams.id;
  
  const router = useRouter();
  const school = useSchoolStore((state) => state.school);
  const user = useAuthStore((state) => state.user);
  
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (school?.id && user?.id) {
      fetchAssignment();
    }
  }, [school?.id, user?.id]);

  const fetchAssignment = async () => {
    try {
      // First, we need to fetch all assignments to find this specific one with its submissions included
      // This is because our getStudentAssignments endpoint returns the merged data we need
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/assignments/student/me?tenantId=${school?.id}`, {
        headers: { "x-user-id": user?.id || "" }
      });
      
      if (res.ok) {
        const data: Assignment[] = await res.json();
        const found = data.find(a => a.id === assignmentId);
        if (found) {
          setAssignment(found);
          if (found.submissions?.[0]?.content) {
            setContent(found.submissions[0].content);
          }
        } else {
          toast.error("Assignment not found");
          router.push("/portal/student/assignments");
        }
      } else {
        toast.error("Failed to fetch assignment details");
      }
    } catch (error) {
      toast.error("An error occurred while fetching assignment details");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error("Please provide some content for your submission");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/assignments/student/me/${assignmentId}/submit?tenantId=${school?.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user?.id || ""
        },
        body: JSON.stringify({ content })
      });

      if (res.ok) {
        toast.success("Assignment submitted successfully!");
        fetchAssignment(); // Refresh to show updated status
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to submit assignment");
      }
    } catch (error) {
      toast.error("An error occurred while submitting");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading assignment details...</div>;
  }

  if (!assignment) return null;

  const submission = assignment.submissions?.[0];
  const isSubmitted = submission?.status === "SUBMITTED";
  const isGraded = submission?.status === "GRADED";
  const isPastDue = new Date(assignment.dueDate) < new Date();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link href="/portal/student/assignments">
        <Button variant="ghost" className="mb-6 -ml-4 flex items-center gap-2 text-gray-500">
          <ArrowLeft className="w-4 h-4" /> Back to Assignments
        </Button>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Assignment Details */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-700">
                {assignment.subject}
              </span>
              {isGraded ? (
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Graded
                </span>
              ) : isSubmitted ? (
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Submitted
                </span>
              ) : isPastDue ? (
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800 flex items-center gap-1">
                  <Clock className="w-4 h-4" /> Overdue
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800 flex items-center gap-1">
                  <Clock className="w-4 h-4" /> Pending
                </span>
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{assignment.title}</h1>
            
            <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-8 pb-8 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="font-medium">Due: <span className={isPastDue && !isSubmitted ? "text-red-600" : ""}>{format(new Date(assignment.dueDate), "MMMM do, yyyy 'at' h:mm a")}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-400" />
                <span className="font-medium">Max Score: {assignment.maxScore} pts</span>
              </div>
            </div>

            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Instructions</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{assignment.description || "No instructions provided."}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Submission Panel */}
        <div>
          <Card className={`sticky top-8 shadow-sm ${isGraded ? 'border-green-200' : isSubmitted ? 'border-blue-200' : ''}`}>
            <CardHeader className={isGraded ? 'bg-green-50/50' : isSubmitted ? 'bg-blue-50/50' : 'bg-gray-50/50'}>
              <CardTitle className="text-lg">Your Work</CardTitle>
              <CardDescription>
                {isGraded ? "This assignment has been graded." : isSubmitted ? "Your work has been turned in." : "Submit your assignment below."}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {isGraded ? (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-green-100 shadow-sm text-center">
                    <p className="text-sm text-gray-500 mb-1">Score</p>
                    <p className="text-3xl font-bold text-green-600">{submission?.score} <span className="text-lg text-gray-400 font-normal">/ {assignment.maxScore}</span></p>
                  </div>
                  {submission?.feedback && (
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-2">Teacher Feedback:</p>
                      <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 italic border border-gray-100">
                        "{submission.feedback}"
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-2">Your Submission:</p>
                    <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 border border-gray-100 whitespace-pre-wrap">
                      {submission?.content}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Submission Content (Text or URL Link)</label>
                    <Textarea 
                      placeholder="Paste your Google Doc link here, or write your text submission..."
                      className="min-h-[150px] resize-y"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      disabled={isSubmitted || submitting}
                    />
                  </div>
                  {isSubmitted && submission?.submittedAt && (
                    <p className="text-xs text-gray-500 text-center">
                      Submitted on {format(new Date(submission.submittedAt), "MMM dd, yyyy 'at' h:mm a")}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
            {(!isGraded) && (
              <CardFooter className="bg-gray-50/50 rounded-b-lg border-t border-gray-100">
                <Button 
                  className="w-full" 
                  onClick={handleSubmit} 
                  disabled={submitting || (!content.trim() && !isSubmitted)}
                  variant={isSubmitted ? "outline" : "default"}
                >
                  {submitting ? "Submitting..." : isSubmitted ? "Update Submission" : "Turn In Assignment"}
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
