"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useSchoolStore } from "@/store/schoolStore";
import { useAuthStore } from "@/store/authStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar as CalendarIcon, Clock, Users } from "lucide-react";

type Period = {
  id: string;
  subject: string;
  classId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  class: { name: string };
};

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function TeacherTimetablePage() {
  const school = useSchoolStore((state) => state.school);
  const user = useAuthStore((state) => state.user);
  
  const [timetable, setTimetable] = useState<Period[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (school?.id && user?.id) {
      fetchTimetable();
    }
  }, [school?.id, user?.id]);

  const fetchTimetable = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/timetable/teacher/me?tenantId=${school?.id}`, {
        headers: { "x-user-id": user?.id || "" }
      });
      if (res.ok) {
        setTimetable(await res.json());
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to load timetable");
      }
    } catch (error) {
      toast.error("Failed to load timetable");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading your schedule...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <CalendarIcon className="w-8 h-8 text-teal-600" /> My Teaching Schedule
        </h2>
        <p className="text-gray-500 mt-2">View your assigned classes for the week</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map(dayIdx => {
          const dayPeriods = timetable.filter(p => p.dayOfWeek === dayIdx);
          return (
            <div key={dayIdx} className="border rounded-lg bg-gray-50/50 flex flex-col shadow-sm">
              <div className="bg-white border-b px-4 py-3 font-bold text-center text-gray-800 rounded-t-lg">
                {DAYS[dayIdx]}
              </div>
              <div className="p-3 flex-1 space-y-3">
                {dayPeriods.length === 0 ? (
                  <div className="text-center text-sm text-gray-400 py-6 italic">No classes scheduled</div>
                ) : (
                  dayPeriods.map(period => (
                    <Card key={period.id} className="border-l-4 border-l-teal-500 hover:shadow-md transition-shadow">
                      <CardContent className="p-3">
                        <div className="font-bold text-gray-900 mb-2">{period.subject}</div>
                        <div className="flex flex-col gap-1.5 text-xs text-gray-600">
                          <div className="flex items-center gap-1.5 bg-gray-100/80 px-2 py-1 rounded w-fit">
                            <Clock className="w-3.5 h-3.5 text-gray-500" /> {period.startTime} - {period.endTime}
                          </div>
                          <div className="flex items-center gap-1.5 mt-1">
                            <Users className="w-3.5 h-3.5 text-teal-600" />
                            <span className="font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                              Class {period.class.name}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
