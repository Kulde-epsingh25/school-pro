"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSchoolStore } from "@/store/schoolStore";
import { useAuthStore } from "@/store/authStore";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

type Student = { 
  id: string; 
  user: { firstName: string; lastName: string; id: string };
  rollNo?: string;
  regNo?: string;
};

type Exam = { id: string; name: string; date: string; subject: string; maxScore: number; classId: string; class: { name: string } };

export default function GradeEntryPage() {
  const { id: examId } = useParams();
  const router = useRouter();
  
  const school = useSchoolStore((state) => state.school);
  const user = useAuthStore((state) => state.user);
  
  const [exam, setExam] = useState<Exam | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [gradesData, setGradesData] = useState<Record<string, { score: string; remarks: string }>>({});
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (school?.id && examId) {
      loadData();
    }
  }, [school?.id, examId]);

  const loadData = async () => {
    setFetching(true);
    try {
      // 1. Fetch Exam Details
      const exRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/exams/${examId}`, {
        headers: { "x-user-id": user?.id || "" }
      });
      const exData = await exRes.json();
      setExam(exData);
      
      // 2. Fetch Students for that Class
      const stRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/students?tenantId=${school?.id}&classId=${exData.classId}`, { 
        headers: { "x-user-id": user?.id || "" } 
      });
      const stData = await stRes.json();
      setStudents(stData || []);
      
      // 3. Fetch existing grades
      const grRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/grades?tenantId=${school?.id}&examId=${examId}`, { 
        headers: { "x-user-id": user?.id || "" } 
      });
      const grData = await grRes.json();
      
      const newGradesData: Record<string, { score: string; remarks: string }> = {};
      const existingMap = new Map<string, any>(grData.map((g: any) => [g.studentId, g]));
      
      (stData || []).forEach((student: Student) => {
        const existing = existingMap.get(student.id);
        newGradesData[student.id] = {
          score: existing ? existing.score.toString() : "",
          remarks: existing ? existing.remarks || "" : ""
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

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setGradesData(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], remarks }
    }));
  };

  const handleSave = async () => {
    if (!exam) return;
    
    // Only send records that have a score
    const records = students
      .filter(s => gradesData[s.id]?.score !== "")
      .map(s => ({
        studentId: s.id,
        score: gradesData[s.id].score,
        remarks: gradesData[s.id]?.remarks || ""
      }));

    if (records.length === 0) {
      toast.error("No scores entered to save");
      return;
    }

    // Validate max score
    const invalidScores = records.filter(r => Number(r.score) > exam.maxScore || Number(r.score) < 0);
    if (invalidScores.length > 0) {
      toast.error(`Scores must be between 0 and ${exam.maxScore}`);
      return;
    }

    try {
      setLoading(true);
      const payload = {
        tenantId: school?.id,
        examId: exam.id,
        records
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/grades`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-user-id": user?.id || "" 
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success("Grades saved successfully!");
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

  if (fetching) return <div className="p-12 text-center text-gray-500">Loading exam data...</div>;
  if (!exam) return <div className="p-12 text-center text-red-500">Exam not found.</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-gray-100 pb-6">
        <div className="flex items-center gap-4">
          <Button type="button" variant="outline" size="icon" className="h-10 w-10 border-gray-200" onClick={() => router.push("/dashboard/academics/exams")}>
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </Button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{exam.name}</h2>
            <p className="text-sm text-gray-500">{exam.class?.name} &bull; {exam.subject}</p>
          </div>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 text-center">
          <div className="text-xs text-blue-600 font-semibold uppercase tracking-wider">Max Score</div>
          <div className="text-xl font-bold text-blue-900">{exam.maxScore}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">
            Student List ({students.length} Students)
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th className="px-6 py-4 w-1/3">Student</th>
                <th className="px-6 py-4">Roll/Reg No</th>
                <th className="px-6 py-4 w-48">Score</th>
                <th className="px-6 py-4">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const currentScore = gradesData[student.id]?.score;
                const isInvalid = currentScore !== "" && (Number(currentScore) > exam.maxScore || Number(currentScore) < 0);
                
                return (
                  <tr key={student.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {student.user.firstName} {student.user.lastName}
                    </td>
                    <td className="px-6 py-4">
                      {student.rollNo || student.regNo || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <input 
                          type="number" 
                          value={currentScore || ""}
                          onChange={(e) => handleScoreChange(student.id, e.target.value)}
                          className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${isInvalid ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                          min="0"
                          max={exam.maxScore}
                          placeholder={`/ ${exam.maxScore}`}
                        />
                        {isInvalid && <span className="text-xs text-red-500 absolute -bottom-5 left-0">Invalid</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <input 
                        type="text" 
                        placeholder="Optional remarks"
                        value={gradesData[student.id]?.remarks || ""}
                        onChange={(e) => handleRemarksChange(student.id, e.target.value)}
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
              {loading ? "Saving..." : "Save Grades"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
