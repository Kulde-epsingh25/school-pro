"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useSchoolStore } from "@/store/schoolStore";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, Calendar as CalendarIcon, Clock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

type Class = { id: string; name: string };
type Teacher = { id: string; user: { firstName: string; lastName: string } };
type Subject = { id: string; name: string };
type Period = {
  id: string;
  subject: string;
  teacherId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  teacher: { user: { firstName: string; lastName: string } };
};

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function TimetableAdminPage() {
  const school = useSchoolStore((state) => state.school);
  const user = useAuthStore((state) => state.user);
  
  const [classes, setClasses] = useState<Class[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [timetable, setTimetable] = useState<Period[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    teacherId: "",
    dayOfWeek: "1",
    startTime: "09:00",
    endTime: "09:45"
  });

  useEffect(() => {
    if (school?.id) {
      fetchClassesAndTeachers();
    }
  }, [school?.id]);

  useEffect(() => {
    if (school?.id && selectedClassId) {
      fetchTimetable();
    } else {
      setTimetable([]);
    }
  }, [school?.id, selectedClassId]);

  const fetchClassesAndTeachers = async () => {
    try {
      const headers = { "x-user-id": user?.id || "" };
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com";
      
      const [clsRes, tchrRes] = await Promise.all([
        fetch(`${baseUrl}/classes?tenantId=${school?.id}`, { headers }),
        fetch(`${baseUrl}/teachers?tenantId=${school?.id}`, { headers })
      ]);
      
      if (clsRes.ok) setClasses(await clsRes.json());
      if (tchrRes.ok) setTeachers(await tchrRes.json());
    } catch (error) {
      toast.error("Failed to load initial data");
    }
  };

  const fetchTimetable = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/timetable?tenantId=${school?.id}&classId=${selectedClassId}`, {
        headers: { "x-user-id": user?.id || "" }
      });
      if (res.ok) {
        setTimetable(await res.json());
      }
    } catch (error) {
      toast.error("Failed to fetch timetable");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPeriod = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassId) {
      toast.error("Please select a class first");
      return;
    }
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/timetable`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user?.id || ""
        },
        body: JSON.stringify({
          tenantId: school?.id,
          classId: selectedClassId,
          ...formData
        })
      });
      
      if (res.ok) {
        toast.success("Period added successfully");
        setShowAddForm(false);
        fetchTimetable();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to add period");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-blue-600" /> Class Timetable
          </h2>
          <p className="text-sm text-gray-500 mt-1">Manage weekly schedules for classes</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} disabled={!selectedClassId}>
          <Plus className="w-4 h-4 mr-2" /> Add Period
        </Button>
      </div>

      <div className="mb-8 w-64">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Class</label>
        <Select value={selectedClassId} onValueChange={(val) => setSelectedClassId(val || "")}>
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Choose a class..." />
          </SelectTrigger>
          <SelectContent>
            {classes.map(c => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {showAddForm && (
        <Card className="mb-8 bg-blue-50/50 border-blue-100">
          <CardHeader>
            <CardTitle className="text-lg">Add New Period</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddPeriod} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <Input required value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} placeholder="e.g. Mathematics" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teacher</label>
                <Select value={formData.teacherId} onValueChange={val => setFormData({...formData, teacherId: val || ""})}>
                  <SelectTrigger className="bg-white"><SelectValue placeholder="Select teacher" /></SelectTrigger>
                  <SelectContent>
                    {teachers.map(t => (
                      <SelectItem key={t.id} value={t.id}>{t.user.firstName} {t.user.lastName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                <Select value={formData.dayOfWeek} onValueChange={val => setFormData({...formData, dayOfWeek: val || ""})}>
                  <SelectTrigger className="bg-white"><SelectValue placeholder="Select day" /></SelectTrigger>
                  <SelectContent>
                    {DAYS.map((d, i) => (
                      <SelectItem key={i} value={i.toString()}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start</label>
                  <Input type="time" required value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End</label>
                  <Input type="time" required value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} />
                </div>
              </div>
              <Button type="submit" className="w-full">Save Period</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {selectedClassId ? (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map(dayIdx => {
            const dayPeriods = timetable.filter(p => p.dayOfWeek === dayIdx);
            return (
              <div key={dayIdx} className="border rounded-lg bg-gray-50/50 flex flex-col">
                <div className="bg-white border-b px-4 py-3 font-bold text-center text-gray-700 rounded-t-lg">
                  {DAYS[dayIdx]}
                </div>
                <div className="p-3 flex-1 space-y-3">
                  {dayPeriods.length === 0 ? (
                    <div className="text-center text-sm text-gray-400 py-4 italic">No periods</div>
                  ) : (
                    dayPeriods.map(period => (
                      <div key={period.id} className="bg-white border rounded p-3 shadow-sm hover:shadow-md transition-shadow">
                        <div className="font-semibold text-gray-900">{period.subject}</div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {period.startTime} - {period.endTime}
                        </div>
                        <div className="text-xs font-medium text-blue-600 mt-2">
                          {period.teacher.user.firstName} {period.teacher.user.lastName}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 border border-dashed rounded-lg">
          <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No Class Selected</h3>
          <p className="text-gray-500">Select a class from the dropdown to view or manage its timetable.</p>
        </div>
      )}
    </div>
  );
}
