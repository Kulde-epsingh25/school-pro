"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSchoolStore } from "@/store/schoolStore";
import { useAuthStore } from "@/store/authStore";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, FileText } from "lucide-react";

type Student = { 
  id: string; 
  user: { firstName: string; lastName: string; id: string };
  rollNo?: string;
  regNo?: string;
};

type Assignment = { id: string; title: string; description: string; dueDate: string; subject: string; maxScore: number; classId: string; class: { name: string } };

export default function AssignmentGradingPage() {
  const { id: assignmentId } = useParams();
  const router = useRouter();
  
  const school = useSchoolStore((state) => state.school);
  const user = useAuthStore((state) => state.user);
  
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [gradesData, setGradesData] = useState<Record<string, { score: string; feedback: string; status: string; content: string }>>({});
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (school?.id && assignmentId) {
      loadData();
    }
  }, [school?.id, assignmentId]);

  const loadData = async () => {
    setFetching(true);
    try {
      // 1. Fetch Assignment Details
      const assRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/assignments/${assignmentId}`, {
        headers: { "x-user-id": user?.id || "" }
      });
      const assData = await assRes.json();
      setAssignment(assData);
      
      // 2. Fetch Students for that Class
      const stRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/students?tenantId=${school?.id}&classId=${assData.classId}`, { 
        headers: { "x-user-id": user?.id || "" } 
      });
      const stData = await stRes.json();
      setStudents(stData || []);
      
      // 3. Fetch existing submissions
      const subRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/assignments/${assignmentId}/submissions?tenantId=${school?.id}`, { 
        headers: { "x-user-id": user?.id || "" } 
      });
      const subData = await subRes.json();
      
      const newGradesData: Record<string, { score: string; feedback: string; status: string; content: string }> = {};
      const existingMap = new Map<string, any>(subData.map((s: any) => [s.studentId, s]));
      
      (stData || []).forEach((student: Student) => {
        const existing = existingMap.get(student.id);
        newGradesData[student.id] = {
          score: existing && existing.score !== null ? existing.score.toString() : "",
          feedback: existing ? existing.feedback || "" : "",
          status: existing ? existing.status : "PENDING",
          content: existing ? existing.content || "" : ""
        };
      });
      
      setGradesData(newGradesData);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setFetching(false);
    }
  };

  const handleScoreChange = (studentId: string, score: string) => {
    setGradesData(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], score }
    }));
  };

  const handleFeedbackChange = (studentId: string, feedback: string) => {
    setGradesData(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], feedback }
    }));
  };

  const handleSave = async () => {
    if (!assignment) return;
    
    // Only send records that have a score
    const records = students
      .filter(s => gradesData[s.id]?.score !== "")
      .map(s => ({
        studentId: s.id,
        score: gradesData[s.id].score,
        feedback: gradesData[s.id]?.feedback || ""
      }));

    if (records.length === 0) {
      toast.error("No scores entered to save");
      return;
    }

    // Validate max score
    const invalidScores = records.filter(r => Number(r.score) > assignment.maxScore || Number(r.score) < 0);
    if (invalidScores.length > 0) {
      toast.error(`Scores must be between 0 and ${assignment.maxScore}`);
      return;
    }

    try {
      setLoading(true);
      const payload = {
        tenantId: school?.id,
        assignmentId: assignment.id,
        records
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/assignments/${assignment.id}/submissions/grade`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-user-id": user?.id || "" 
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success("Grades saved successfully!");
        loadData(); // refresh status
      } else {
        const data = await res.json().catch(() => null);
        toast.error(data?.error || "Failed to save grades");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "GRADED": return <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">Graded</span>;
      case "SUBMITTED": return <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">Submitted</span>;
      default: return <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2 py-1 rounded-full">Pending</span>;
    }
  };

  if (fetching) return <div className="p-12 text-center text-gray-500">Loading assignment data...</div>;
  if (!assignment) return <div className="p-12 text-center text-red-500">Assignment not found.</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-gray-100 pb-6">
        <div className="flex items-center gap-4">
          <Button type="button" variant="outline" size="icon" className="h-10 w-10 border-gray-200" onClick={() => router.push("/dashboard/academics/assignments")}>
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </Button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{assignment.title}</h2>
            <p className="text-sm text-gray-500">{assignment.class?.name} &bull; {assignment.subject}</p>
          </div>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 text-center">
          <div className="text-xs text-blue-600 font-semibold uppercase tracking-wider">Max Score</div>
          <div className="text-xl font-bold text-blue-900">{assignment.maxScore}</div>
        </div>
      </div>

      {assignment.description && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6 text-sm text-gray-700">
          <strong>Instructions: </strong> {assignment.description}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">
            Submissions & Grading ({students.length} Students)
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th className="px-6 py-4 w-1/4">Student</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Submission Content</th>
                <th className="px-6 py-4 w-32">Score</th>
                <th className="px-6 py-4">Feedback (Private)</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const currentData = gradesData[student.id] || { score: "", feedback: "", status: "PENDING", content: "" };
                const isInvalid = currentData.score !== "" && (Number(currentData.score) > assignment.maxScore || Number(currentData.score) < 0);
                
                return (
                  <tr key={student.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {student.user.firstName} {student.user.lastName}
                      <div className="text-xs text-gray-500 font-normal">{student.rollNo || student.regNo}</div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(currentData.status)}
                    </td>
                    <td className="px-6 py-4 max-w-[200px] truncate">
                      {currentData.content ? (
                        <div className="flex items-center text-blue-600 hover:underline cursor-pointer" title={currentData.content}>
                          <FileText className="w-4 h-4 mr-1" /> View Link/Text
                        </div>
                      ) : (
                         <span className="text-gray-400 italic">No upload</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <input 
                          type="number" 
                          value={currentData.score}
                          onChange={(e) => handleScoreChange(student.id, e.target.value)}
                          className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${isInvalid ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                          min="0"
                          max={assignment.maxScore}
                        />
                        {isInvalid && <span className="text-xs text-red-500 absolute -bottom-5 left-0">Invalid</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <input 
                        type="text" 
                        placeholder="Add feedback..."
                        value={currentData.feedback}
                        onChange={(e) => handleFeedbackChange(student.id, e.target.value)}
                        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {students.length === 0 && (
           <div className="p-8 text-center text-gray-500">
             No students found in this class.
           </div>
        )}
        
        {students.length > 0 && (
          <div className="p-6 bg-gray-50 border-t flex justify-end">
            <Button 
              onClick={handleSave} 
              disabled={loading}
              className="bg-[#4438CA] hover:bg-[#3730A3] text-white px-8 h-11"
            >
              {loading ? "Saving..." : "Save Grades & Feedback"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
