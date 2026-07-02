"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, Download, Upload, MoreVertical, Eye, Edit, Trash2, Mail, Phone, User, Calendar, Flag, MapPin, Hash, BookOpen } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageHeader } from "@/components/dashboard/page-header";
import { TableFilters } from "@/components/dashboard/table-filters";
import { TablePagination } from "@/components/dashboard/table-pagination";
import { UserInfoModal } from "@/components/dashboard/user-info-modal";

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async (query?: string) => {
    try {
      setLoading(true);
      const url = query ? `https://school-pro-api-6mxq-5qzq.onrender.com/students?search=${encodeURIComponent(query)}` : "https://school-pro-api-6mxq-5qzq.onrender.com/students";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      } else {
        throw new Error("API not ok");
      }
    } catch (error) {
      console.error("Failed to fetch students, using mock data", error);
      // Fallback to mock data since the backend isn't running
      setStudents([
        { id: "1", firstName: "Alice", lastName: "Johnson", email: "alice.j@example.com", phone: "555-0101", classId: "10", streamId: "Science", createdAt: new Date().toISOString() },
        { id: "2", firstName: "Bob", lastName: "Smith", email: "bob.s@example.com", phone: "555-0102", classId: "9", streamId: "Arts", createdAt: new Date().toISOString() },
        { id: "3", firstName: "Charlie", lastName: "Davis", email: "charlie.d@example.com", phone: "555-0103", classId: "11", streamId: "Commerce", createdAt: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter((student) => {
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const handleViewStudent = (student: any) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50/50 min-h-screen">
      <PageHeader 
        title="Students" 
        count={students.length} 
        onAdd={() => window.location.href = '/dashboard/students/new'}
        onExport={() => {}}
        onImport={() => {}}
        addLabel="Add student"
      />

      <div className="bg-white rounded-md shadow-sm border">
        <TableFilters 
          search={searchQuery} 
          setSearch={(val) => {
            setSearchQuery(val);
            fetchStudents(val);
          }} 
          searchPlaceholder="Search products..." 
          dateRange="Jan 20, 2024 - Feb 09, 2024"
        />

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 bg-white border-b">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Details</th>
                <th className="px-6 py-4 font-medium">Class</th>
                <th className="px-6 py-4 font-medium">View</th>
                <th className="px-6 py-4 font-medium">Date Created</th>
                <th className="px-6 py-4 font-medium text-right"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-500">Loading students...</td></tr>
              ) : filteredStudents.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-500">No students found.</td></tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={student.imageUrl || "/placeholder.svg"} />
                          <AvatarFallback className="bg-emerald-100 text-emerald-700">
                            {student.firstName?.[0]}{student.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-gray-900">{student.firstName} {student.lastName}</div>
                          <div className="text-gray-500 text-xs">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900 font-medium">{student.schoolName || "Quia mollitia eaque"}</div>
                      <div className="text-gray-500 text-xs">{student.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900 font-medium">{student.streamId || "S1"}</div>
                      <div className="text-gray-500 text-xs">{student.classId || "1A"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Button variant="outline" size="sm" className="h-8 text-xs font-medium" onClick={() => handleViewStudent(student)}>
                        View Student Info
                      </Button>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-900">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <TablePagination 
          totalItems={filteredStudents.length} 
          currentPage={1} 
          totalPages={1} 
          pageSize={10} 
        />
      </div>

      {/* Student Detail Modal */}
      <UserInfoModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Student Information"
        user={selectedStudent ? {
          name: `${selectedStudent.firstName} ${selectedStudent.lastName}`,
          subtext: `Student ID: cm3qxdahs0002axg1ecwy98bo`, // Mocking based on screenshot
          avatarUrl: selectedStudent.imageUrl,
          initials: `${selectedStudent.firstName?.[0]}${selectedStudent.lastName?.[0]}`
        } : null}
        onEdit={() => {}}
        onDelete={() => {}}
        details={selectedStudent ? [
          { label: "Email", value: selectedStudent.email, icon: <Mail className="w-4 h-4" /> },
          { label: "Phone", value: selectedStudent.phone, icon: <Phone className="w-4 h-4" /> },
          { label: "Gender", value: selectedStudent.gender || "MALE", icon: <User className="w-4 h-4" /> },
          { label: "Date of Birth", value: selectedStudent.dob || "July 14th, 1978", icon: <Calendar className="w-4 h-4" /> },
          { label: "Nationality", value: selectedStudent.nationality || "Kenya", icon: <Flag className="w-4 h-4" /> },
          { label: "Religion", value: selectedStudent.religion || "Catholic", icon: <User className="w-4 h-4" /> },
          { label: "State", value: selectedStudent.state || "Rerum neque magna fa", icon: <MapPin className="w-4 h-4" /> },
          { label: "BCN", value: selectedStudent.bcn || "Ipsa autem deserunt", icon: <Hash className="w-4 h-4" /> },
          { label: "Class", value: `Class ${selectedStudent.classId || "6"}`, icon: <BookOpen className="w-4 h-4" /> },
          { label: "Stream", value: selectedStudent.streamId || "6B", icon: <BookOpen className="w-4 h-4" /> },
          { label: "Roll No", value: selectedStudent.rollNo || "Veritatis excepturi", icon: <Hash className="w-4 h-4" /> },
          { label: "Reg No", value: selectedStudent.regNo || "BU/UG/2024/001", icon: <Hash className="w-4 h-4" /> },
          { label: "Admission Date", value: selectedStudent.admissionDate || "October 24th, 2003", icon: <Calendar className="w-4 h-4" /> },
          { label: "Parent", value: selectedStudent.parentId || "Ignatius Fitzpatrick", icon: <User className="w-4 h-4" /> },
          { label: "Address", value: selectedStudent.address || "Amet soluta magni q", icon: <MapPin className="w-4 h-4" /> }
        ] : []}
      />
    </div>
  );
}
