"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSchoolStore } from "@/store/schoolStore";
import { useAuthStore } from "@/store/authStore";

type Class = { id: string; name: string; streams: Stream[] };
type Stream = { id: string; name: string };
type Student = { 
  id: string; 
  user: { firstName: string; lastName: string; id: string };
  rollNo?: string;
  regNo?: string;
};

export default function AttendancePage() {
  const school = useSchoolStore((state) => state.school);
  const user = useAuthStore((state) => state.user);
  
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedStreamId, setSelectedStreamId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceData, setAttendanceData] = useState<Record<string, { status: string; remarks: string }>>({});
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (school?.id) {
      fetchClasses();
    }
  }, [school?.id]);

  const fetchClasses = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/classes?tenantId=${school?.id}`, {
        headers: { "x-user-id": user?.id || "" }
      });
      if (res.ok) {
        setClasses(await res.json());
      }
    } catch (error) {
      toast.error("Failed to fetch classes");
    }
  };

  const loadStudentsAndAttendance = async () => {
    if (!selectedClassId) {
      toast.error("Please select a class");
      return;
    }
    
    setFetching(true);
    try {
      // 1. Fetch Students
      let url = `${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/students?tenantId=${school?.id}&classId=${selectedClassId}`;
      if (selectedStreamId) {
        url += `&streamId=${selectedStreamId}`;
      }
      const stRes = await fetch(url, { headers: { "x-user-id": user?.id || "" } });
      const stData = await stRes.json();
      
      // 2. Fetch existing attendance for this date
      let attUrl = `${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/attendance?tenantId=${school?.id}&classId=${selectedClassId}&date=${date}`;
      if (selectedStreamId) {
        attUrl += `&streamId=${selectedStreamId}`;
      }
      const attRes = await fetch(attUrl, { headers: { "x-user-id": user?.id || "" } });
      const attData = await attRes.json();
      
      setStudents(stData || []);
      
      // Map existing data or default to PRESENT
      const newAttData: Record<string, { status: string; remarks: string }> = {};
      
      const existingMap = new Map<string, any>(attData.map((a: any) => [a.studentId, a]));
      
      (stData || []).forEach((student: Student) => {
        const existing = existingMap.get(student.id);
        newAttData[student.id] = {
          status: existing ? existing.status : "PRESENT",
          remarks: existing ? existing.remarks || "" : ""
        };
      });
      
      setAttendanceData(newAttData);
      
      if (stData.length === 0) {
        toast.info("No students found in this class/stream.");
      } else {
        toast.success(`Loaded ${stData.length} students`);
      }
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setFetching(false);
    }
  };

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], status }
    }));
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], remarks }
    }));
  };

  const markAll = (status: string) => {
    const newAttData = { ...attendanceData };
    students.forEach(s => {
      newAttData[s.id] = { ...newAttData[s.id], status };
    });
    setAttendanceData(newAttData);
  };

  const handleSave = async () => {
    if (!selectedClassId || !date) return;
    
    const records = students.map(s => ({
      studentId: s.id,
      status: attendanceData[s.id]?.status || "PRESENT",
      remarks: attendanceData[s.id]?.remarks || ""
    }));

    try {
      setLoading(true);
      const payload = {
        tenantId: school?.id,
        classId: selectedClassId,
        streamId: selectedStreamId || undefined,
        date,
        records
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/attendance`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-user-id": user?.id || "" 
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success("Attendance saved successfully!");
      } else {
        const data = await res.json().catch(() => null);
        toast.error(data?.error || "Failed to save attendance");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const selectedClass = classes.find(c => c.id === selectedClassId);
  const streams = selectedClass?.streams || [];

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Mark Attendance</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Class</label>
            <select 
              value={selectedClassId} 
              onChange={e => { setSelectedClassId(e.target.value); setSelectedStreamId(""); }}
              className="flex h-11 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
            >
              <option value="">Select Class</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Stream (Optional)</label>
            <select 
              value={selectedStreamId} 
              onChange={e => setSelectedStreamId(e.target.value)}
              disabled={!selectedClassId || streams.length === 0}
              className="flex h-11 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm disabled:bg-gray-100"
            >
              <option value="">All Streams</option>
              {streams.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Date</label>
            <input 
              type="date" 
              value={date} 
              onChange={e => setDate(e.target.value)}
              className="flex h-11 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
            />
          </div>

          <Button 
            onClick={loadStudentsAndAttendance} 
            disabled={!selectedClassId || fetching}
            className="h-11 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {fetching ? "Loading..." : "Fetch Students"}
          </Button>
        </div>
      </div>

      {students.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">
              Attendance List ({students.length} Students)
            </h3>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => markAll("PRESENT")}>Mark All Present</Button>
              <Button size="sm" variant="outline" onClick={() => markAll("ABSENT")} className="text-red-600">Mark All Absent</Button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Roll/Reg No</th>
                  <th className="px-6 py-4">Attendance Status</th>
                  <th className="px-6 py-4">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {student.user.firstName} {student.user.lastName}
                    </td>
                    <td className="px-6 py-4">
                      {student.rollNo || student.regNo || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input 
                            type="radio" 
                            name={`status-${student.id}`} 
                            checked={attendanceData[student.id]?.status === "PRESENT"}
                            onChange={() => handleStatusChange(student.id, "PRESENT")}
                            className="text-green-600 focus:ring-green-500"
                          />
                          <span className="text-green-700 font-medium">Present</span>
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input 
                            type="radio" 
                            name={`status-${student.id}`} 
                            checked={attendanceData[student.id]?.status === "ABSENT"}
                            onChange={() => handleStatusChange(student.id, "ABSENT")}
                            className="text-red-600 focus:ring-red-500"
                          />
                          <span className="text-red-700 font-medium">Absent</span>
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input 
                            type="radio" 
                            name={`status-${student.id}`} 
                            checked={attendanceData[student.id]?.status === "LATE"}
                            onChange={() => handleStatusChange(student.id, "LATE")}
                            className="text-yellow-600 focus:ring-yellow-500"
                          />
                          <span className="text-yellow-700 font-medium">Late</span>
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input 
                            type="radio" 
                            name={`status-${student.id}`} 
                            checked={attendanceData[student.id]?.status === "EXCUSED"}
                            onChange={() => handleStatusChange(student.id, "EXCUSED")}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-blue-700 font-medium">Excused</span>
                        </label>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <input 
                        type="text" 
                        placeholder="Reason (Optional)"
                        value={attendanceData[student.id]?.remarks || ""}
                        onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                        className="w-full rounded-md border border-gray-200 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-6 bg-gray-50 border-t flex justify-end">
            <Button 
              onClick={handleSave} 
              disabled={loading}
              className="bg-[#4438CA] hover:bg-[#3730A3] text-white px-8 h-11"
            >
              {loading ? "Saving..." : "Save Attendance"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
