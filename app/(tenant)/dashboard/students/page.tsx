"use client";

import React, { useState, useEffect } from "react";
import { useSchoolStore } from "@/store/schoolStore";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MoreVertical, Mail, Phone, User, Calendar, Flag, MapPin, Hash, BookOpen, AlertCircle, RefreshCw } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageHeader } from "@/components/dashboard/page-header";
import { TableFilters } from "@/components/dashboard/table-filters";
import { TablePagination } from "@/components/dashboard/table-pagination";
import { UserInfoModal } from "@/components/dashboard/user-info-modal";
import { apiClient } from "@/lib/api-client";
import type { Student } from "@/types/dashboard";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const school = useSchoolStore((state) => state.school);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (school?.id) {
      fetchStudents();
    } else {
      setLoading(false);
    }
  }, [school?.id]);

  const fetchStudents = async (query?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const endpoint = query 
        ? `/students?search=${encodeURIComponent(query)}` 
        : `/students`;

      const res = await apiClient.get<Student[]>(endpoint);
      
      if (res.ok && res.data) {
        setStudents(Array.isArray(res.data) ? res.data : []);
      } else {
        throw new Error(res.error || "Unable to fetch students from institution API");
      }
    } catch (err: any) {
      console.error("Failed to fetch students", err);
      setError(err?.message || "Failed to load students. Please check network connection.");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter((student) => {
    const fullName = `${student.firstName || ""} ${student.lastName || ""}`.toLowerCase();
    const email = (student.email || "").toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || email.includes(query);
  });

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50/50 min-h-screen">
      <PageHeader 
        title="Students" 
        count={students.length} 
        onAdd={() => router.push('/dashboard/students/new')}
        onExport={() => {}}
        onImport={() => {}}
        addLabel="Add student"
      />

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <TableFilters 
          search={searchQuery} 
          setSearch={(val) => {
            setSearchQuery(val);
            fetchStudents(val);
          }} 
          searchPlaceholder="Search student by name or email..." 
          dateRange="Academic Year 2025 - 2026"
        />

        {error && (
          <div className="m-4 p-4 rounded-xl border border-destructive/30 bg-destructive/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
              <div>
                <p className="text-sm font-semibold text-destructive">Data Retrieval Issue</p>
                <p className="text-xs text-muted-foreground">{error}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => fetchStudents()}
              className="gap-2 h-8 text-xs"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Retry
            </Button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 bg-gray-50/70 border-b uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Student Name</th>
                <th className="px-6 py-4 font-semibold">Contact / Phone</th>
                <th className="px-6 py-4 font-semibold">Class / Stream</th>
                <th className="px-6 py-4 font-semibold">Profile</th>
                <th className="px-6 py-4 font-semibold">Enrolled</th>
                <th className="px-6 py-4 font-semibold text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 rounded-full border-2 border-primary border-r-transparent animate-spin" />
                      Loading student roster...
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-muted-foreground">
                    {error ? "Unable to display students." : "No student records found in current term."}
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={student.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {student.firstName?.[0] || "S"}{student.lastName?.[0] || "T"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-foreground">{student.firstName} {student.lastName}</div>
                          <div className="text-muted-foreground text-xs">{student.email || "No email on record"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-foreground font-medium">{student.phone || "—"}</div>
                      <div className="text-muted-foreground text-xs">{student.parentName ? `Parent: ${student.parentName}` : "Guardian info verified"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-foreground font-medium">{student.className || student.classId || "Grade"}</div>
                      <div className="text-muted-foreground text-xs">{student.streamName || student.streamId || "Main Section"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Button variant="outline" size="sm" className="h-8 text-xs font-medium" onClick={() => handleViewStudent(student)}>
                        View Dossier
                      </Button>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-xs">
                      {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : "Active"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
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
          name: `${selectedStudent.firstName || ""} ${selectedStudent.lastName || ""}`,
          subtext: `Student ID: ${selectedStudent.registrationNumber || selectedStudent.id}`,
          avatarUrl: selectedStudent.avatar,
          initials: `${selectedStudent.firstName?.[0] || "S"}${selectedStudent.lastName?.[0] || "T"}`
        } : null}
        onEdit={() => {}}
        onDelete={() => {}}
        details={selectedStudent ? [
          { label: "Email", value: selectedStudent.email || "N/A", icon: <Mail className="w-4 h-4" /> },
          { label: "Phone", value: selectedStudent.phone || "N/A", icon: <Phone className="w-4 h-4" /> },
          { label: "Gender", value: selectedStudent.gender || "Not specified", icon: <User className="w-4 h-4" /> },
          { label: "Date of Birth", value: selectedStudent.dateOfBirth || "N/A", icon: <Calendar className="w-4 h-4" /> },
          { label: "Class", value: `${selectedStudent.className || selectedStudent.classId || "Class N/A"}`, icon: <BookOpen className="w-4 h-4" /> },
          { label: "Stream", value: selectedStudent.streamName || selectedStudent.streamId || "Main", icon: <BookOpen className="w-4 h-4" /> },
          { label: "Roll No", value: selectedStudent.rollNumber || "Assigned", icon: <Hash className="w-4 h-4" /> },
          { label: "Reg No", value: selectedStudent.registrationNumber || selectedStudent.id, icon: <Hash className="w-4 h-4" /> },
          { label: "Parent / Guardian", value: selectedStudent.parentName || "On Record", icon: <User className="w-4 h-4" /> },
          { label: "Address", value: selectedStudent.address || "Local District", icon: <MapPin className="w-4 h-4" /> }
        ] : []}
      />
    </div>
  );
}
