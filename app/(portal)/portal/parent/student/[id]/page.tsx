"use client";

import React from "react";
import { Calendar as CalendarIcon, FileText, Medal, Mail, Heart, Clock, Download, Activity, Droplet } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function StudentDetailsPage() {
  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto bg-slate-50/50 min-h-screen">
      
      {/* ROW 1: Select Term & Student Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Select Term */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Select Term</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Term</label>
              <select className="w-full h-10 border border-gray-200 rounded-md px-3 text-sm focus:outline-none focus:border-blue-500 bg-white text-gray-700">
                <option>Term 2</option>
                <option>Term 1</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Year</label>
              <select className="w-full h-10 border border-gray-200 rounded-md px-3 text-sm focus:outline-none focus:border-blue-500 bg-white text-gray-700">
                <option>2022</option>
                <option>2021</option>
              </select>
            </div>
          </div>
        </div>

        {/* Student Information */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 relative">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-bold text-gray-900">Student Information</h2>
            <Avatar className="h-12 w-12 border-2 border-gray-100">
              <AvatarFallback className="bg-gray-100 text-gray-700 font-bold">JD</AvatarFallback>
            </Avatar>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Name:</span>
              <span className="font-semibold text-gray-900">John Doe</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Grade:</span>
              <span className="font-semibold text-gray-900">10th</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Student ID:</span>
              <span className="font-semibold text-gray-900">12345</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Date of Birth:</span>
              <span className="font-semibold text-gray-900">01/01/2007</span>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 2: Academic Performance & Attendance */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Academic Performance (Spans 3 cols) */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 md:col-span-3">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Academic Performance</h2>
          <p className="text-sm text-gray-400 mb-6 font-medium">Term 2, 2022</p>
          
          <div className="space-y-5">
            {/* Math */}
            <div>
              <div className="flex justify-between text-sm font-semibold text-gray-900 mb-2">
                <span>Math</span>
                <span>82%</span>
              </div>
              <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#2563EB] rounded-full" style={{ width: '82%' }}></div>
              </div>
            </div>
            {/* Science */}
            <div>
              <div className="flex justify-between text-sm font-semibold text-gray-900 mb-2">
                <span>Science</span>
                <span>89%</span>
              </div>
              <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#2563EB] rounded-full" style={{ width: '89%' }}></div>
              </div>
            </div>
            {/* English */}
            <div>
              <div className="flex justify-between text-sm font-semibold text-gray-900 mb-2">
                <span>English</span>
                <span>79%</span>
              </div>
              <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#2563EB] rounded-full" style={{ width: '79%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance (Spans 2 cols) */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 md:col-span-2 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-bold text-gray-900">Attendance</h2>
            <CalendarIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex flex-col flex-1">
            <span className="text-5xl font-extrabold text-[#2563EB] tracking-tight mb-2">96%</span>
            <div className="space-y-1 mt-auto">
              <p className="text-sm font-medium text-gray-600">Present: <span className="text-gray-900 font-semibold">58 days</span></p>
              <p className="text-sm font-medium text-gray-600">Absent: <span className="text-gray-900 font-semibold">2 days</span></p>
            </div>
            <p className="text-sm font-semibold text-gray-900 mt-4">Term 2, 2022</p>
          </div>
        </div>
      </div>

      {/* ROW 3: Report Card & Leadership */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Report Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-gray-900">Report Card</h2>
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-sm text-gray-600 mb-6">
            View and download your child's report card for Term 1, 2022.
          </p>
          <Button className="w-full bg-[#2563EB] hover:bg-blue-700 text-white mt-auto h-11 font-semibold">
            Download Report Card
          </Button>
        </div>

        {/* Leadership & Activities */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xl font-bold text-gray-900">Leadership & Activities</h2>
            <Medal className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-sm text-gray-400 mb-4 font-medium">Term 1, 2022</p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-sm text-gray-700 font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-700"></div> Class Monitor
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-700 font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-700"></div> Science Club Member
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-700 font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-700"></div> Junior Basketball Team
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-700 font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-700"></div> Art Club Participant
            </li>
          </ul>
        </div>
      </div>

      {/* ROW 4: Teacher Remarks & Medical Report */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Teacher Remarks */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xl font-bold text-gray-900">Teacher Remarks</h2>
            <Mail className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-sm text-gray-400 mb-4 font-medium">Term 1, 2022</p>
          <p className="text-sm text-gray-600 leading-relaxed italic">
            "John is adapting well to the new academic year. He shows promise in mathematics and science, though there's room for improvement in English. He's a respectful and attentive student."
          </p>
          <p className="text-xs text-gray-400 mt-4 mb-6">
            - Mr. Wilson, Homeroom Teacher
          </p>
          <Button className="w-full bg-[#2563EB] hover:bg-blue-700 text-white mt-auto h-11 font-semibold">
            Email Teacher
          </Button>
        </div>

        {/* Medical Report */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xl font-bold text-gray-900">Medical Report</h2>
            <Heart className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-sm text-gray-400 mb-4 font-medium">Term 1, 2022</p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-blue-400" strokeWidth={1.5} />
              <span className="text-sm font-medium text-gray-600">Height:</span>
              <span className="text-sm font-semibold text-gray-900">160 cm</span>
            </div>
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-blue-400" strokeWidth={1.5} />
              <span className="text-sm font-medium text-gray-600">Weight:</span>
              <span className="text-sm font-semibold text-gray-900">55 kg</span>
            </div>
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-red-400" strokeWidth={1.5} />
              <span className="text-sm font-medium text-gray-600">Blood Pressure:</span>
              <span className="text-sm font-semibold text-gray-900">108/68</span>
            </div>
            <div className="flex items-center gap-3">
              <Droplet className="w-5 h-5 text-red-500" strokeWidth={1.5} />
              <span className="text-sm font-medium text-gray-600">Blood Type:</span>
              <span className="text-sm font-semibold text-gray-900">A+</span>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-sm font-bold text-gray-900 mb-2">Allergies:</p>
            <ul className="list-disc pl-5 text-sm font-medium text-gray-700">
              <li>Peanuts</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ROW 5: Class Timetable */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-bold text-gray-900">Class Timetable</h2>
          <Clock className="w-5 h-5 text-blue-600" />
        </div>
        <p className="text-sm text-gray-400 mb-6 font-medium">Term 1, 2022</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500">
                <th className="py-4 px-2 font-medium">Time</th>
                <th className="py-4 px-2 font-medium">Monday</th>
                <th className="py-4 px-2 font-medium">Tuesday</th>
                <th className="py-4 px-2 font-medium">Wednesday</th>
                <th className="py-4 px-2 font-medium">Thursday</th>
                <th className="py-4 px-2 font-medium">Friday</th>
              </tr>
            </thead>
            <tbody className="text-gray-900 font-semibold">
              <tr className="border-b border-gray-50">
                <td className="py-4 px-2 text-gray-600 font-medium">08:00 - 09:00</td>
                <td className="py-4 px-2">Math</td>
                <td className="py-4 px-2">English</td>
                <td className="py-4 px-2">Science</td>
                <td className="py-4 px-2">History</td>
                <td className="py-4 px-2">PE</td>
              </tr>
              <tr className="border-b border-gray-50">
                <td className="py-4 px-2 text-gray-600 font-medium">09:00 - 10:00</td>
                <td className="py-4 px-2">Science</td>
                <td className="py-4 px-2">Math</td>
                <td className="py-4 px-2">English</td>
                <td className="py-4 px-2">Geography</td>
                <td className="py-4 px-2">Art</td>
              </tr>
              <tr className="border-b border-gray-50">
                <td className="py-4 px-2 text-gray-600 font-medium">10:00 - 11:00</td>
                <td className="py-4 px-2">English</td>
                <td className="py-4 px-2">Science</td>
                <td className="py-4 px-2">Math</td>
                <td className="py-4 px-2">PE</td>
                <td className="py-4 px-2">Music</td>
              </tr>
              <tr className="border-b border-gray-50 bg-gray-50/50 text-gray-400">
                <td className="py-4 px-2 font-medium">11:00 - 12:00</td>
                <td className="py-4 px-2 text-center" colSpan={5}>Break</td>
              </tr>
              <tr>
                <td className="py-4 px-2 text-gray-600 font-medium">12:00 - 13:00</td>
                <td className="py-4 px-2">History</td>
                <td className="py-4 px-2">Geography</td>
                <td className="py-4 px-2">Art</td>
                <td className="py-4 px-2">Math</td>
                <td className="py-4 px-2">Science</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
