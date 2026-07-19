"use client";

import React, { useState, useEffect } from "react";
import { Check, X, Clock, Upload, Users } from "lucide-react";
import { useSchoolStore } from "@/store/schoolStore";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";

export default function BulkAttendancePage() {
  const { school } = useSchoolStore();
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [students, setStudents] = useState<any[]>([]);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [attendanceState, setAttendanceState] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (school?.id) {
      fetchClasses();
    }
  }, [school?.id]);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents(selectedClass);
    } else {
      setStudents([]);
    }
  }, [selectedClass]);

  const fetchClasses = async () => {
    try {
      const res = await apiClient.get<any[]>(`/classes?tenantId=${school?.id}`);
      if (res.ok && res.data) setClasses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStudents = async (classId: string) => {
    try {
      const res = await apiClient.get<any[]>(`/students?tenantId=${school?.id}&classId=${classId}`);
      if (res.ok && res.data) {
        setStudents(res.data);
        // Default all to present
        const defaultState: Record<string, string> = {};
        res.data.forEach(s => defaultState[s.id] = "PRESENT");
        setAttendanceState(defaultState);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = (studentId: string, status: string) => {
    setAttendanceState(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSave = async () => {
    if (!selectedClass) return;
    setSaving(true);
    try {
      const records = Object.keys(attendanceState).map(studentId => ({
        studentId,
        status: attendanceState[studentId]
      }));

      await apiClient.post(`/attendance?tenantId=${school?.id}`, {
        classId: selectedClass,
        date,
        records
      });

      alert("Attendance saved successfully!");
    } catch (error) {
      console.error("Failed to save attendance", error);
      alert("Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  const handleBiometricMock = async () => {
    if (!selectedClass || students.length === 0) {
      alert("Select a class first to mock biometric import");
      return;
    }
    
    // Mock import data for the selected class
    const mockData = students.map(s => ({
      studentId: s.id,
      classId: selectedClass,
      date,
      status: Math.random() > 0.1 ? "PRESENT" : "ABSENT"
    }));

    try {
      await apiClient.post(`/attendance/import-biometric?tenantId=${school?.id}`, {
        data: mockData
      });
      alert(`Successfully imported ${mockData.length} biometric records!`);
      // Update UI state to match the mock
      const newState: Record<string, string> = {};
      mockData.forEach(m => newState[m.studentId] = m.status);
      setAttendanceState(newState);
    } catch (error) {
      console.error("Biometric import failed", error);
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Bulk Attendance</h1>
          <p className="text-gray-500 mt-2">Quickly mark attendance for an entire class.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleBiometricMock} className="flex gap-2 items-center">
            <Upload className="w-4 h-4" /> Import Biometric Data
          </Button>
          <Button onClick={handleSave} disabled={saving || !selectedClass} className="bg-blue-600 hover:bg-blue-700">
            {saving ? "Saving..." : "Save Attendance"}
          </Button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <label className="text-sm font-semibold mb-1 block">Class</label>
            <select 
              value={selectedClass} 
              onChange={(e) => setSelectedClass(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Select a class...</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="text-sm font-semibold mb-1 block">Date</label>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>

        {students.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="px-6 py-3">Student Name</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student.id} className="border-t bg-white">
                    <td className="px-6 py-4 font-medium flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                        {student.user.firstName[0]}{student.user.lastName[0]}
                      </div>
                      {student.user.firstName} {student.user.lastName}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        attendanceState[student.id] === 'PRESENT' ? 'bg-green-100 text-green-700' : 
                        attendanceState[student.id] === 'ABSENT' ? 'bg-red-100 text-red-700' : 
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {attendanceState[student.id]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <Button size="icon" variant={attendanceState[student.id] === 'PRESENT' ? 'default' : 'outline'} className={attendanceState[student.id] === 'PRESENT' ? 'bg-green-600 hover:bg-green-700' : ''} onClick={() => handleToggle(student.id, 'PRESENT')}>
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant={attendanceState[student.id] === 'ABSENT' ? 'default' : 'outline'} className={attendanceState[student.id] === 'ABSENT' ? 'bg-red-600 hover:bg-red-700' : ''} onClick={() => handleToggle(student.id, 'ABSENT')}>
                        <X className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant={attendanceState[student.id] === 'LATE' ? 'default' : 'outline'} className={attendanceState[student.id] === 'LATE' ? 'bg-yellow-500 hover:bg-yellow-600' : ''} onClick={() => handleToggle(student.id, 'LATE')}>
                        <Clock className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Users className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p>Select a class to load students for bulk marking.</p>
          </div>
        )}
      </div>
    </div>
  );
}
