"use client";

import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, AlertCircle, RefreshCw, Mail, Phone, BookOpen } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { TableFilters } from "@/components/dashboard/table-filters";
import { TablePagination } from "@/components/dashboard/table-pagination";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import type { Teacher } from "@/types/dashboard";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async (query?: string) => {
    try {
      setLoading(true);
      setError(null);
      const endpoint = query 
        ? `/teachers?search=${encodeURIComponent(query)}` 
        : `/teachers`;

      const res = await apiClient.get<Teacher[]>(endpoint);
      if (res.ok && res.data) {
        setTeachers(Array.isArray(res.data) ? res.data : []);
      } else {
        throw new Error(res.error || "Failed to fetch teachers from API");
      }
    } catch (err: any) {
      console.error("Failed to fetch teachers", err);
      setError(err?.message || "Failed to load faculty records.");
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTeachers = teachers.filter((teacher) => {
    const fullName = `${teacher.firstName || ""} ${teacher.lastName || ""}`.toLowerCase();
    const email = (teacher.email || "").toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || email.includes(query);
  });

  return (
    <div className="p-6 space-y-6 bg-gray-50/50 min-h-screen">
      <PageHeader 
        title="Faculty & Teachers" 
        count={teachers.length} 
        onAdd={() => router.push('/dashboard/users/teachers/new')}
        onExport={() => {}}
        onImport={() => {}}
        addLabel="Add Teacher"
      />

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <TableFilters 
          search={searchQuery} 
          setSearch={(val) => {
            setSearchQuery(val);
            fetchTeachers(val);
          }} 
          searchPlaceholder="Search teacher by name or email..." 
          dateRange="Current Academic Term"
        />

        {error && (
          <div className="m-4 p-4 rounded-xl border border-destructive/30 bg-destructive/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
              <div>
                <p className="text-sm font-semibold text-destructive">Faculty Roster Error</p>
                <p className="text-xs text-muted-foreground">{error}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => fetchTeachers()}
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
                <th className="px-6 py-4 font-semibold">Teacher Name</th>
                <th className="px-6 py-4 font-semibold">Department</th>
                <th className="px-6 py-4 font-semibold">Contact</th>
                <th className="px-6 py-4 font-semibold">Status</th>
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
                      Loading faculty directory...
                    </div>
                  </td>
                </tr>
              ) : filteredTeachers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-muted-foreground">
                    {error ? "Unable to display faculty records." : "No faculty members found."}
                  </td>
                </tr>
              ) : (
                filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={teacher.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${teacher.firstName}`} />
                          <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {teacher.firstName?.[0] || "T"}{teacher.lastName?.[0] || "F"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-foreground">{teacher.firstName} {teacher.lastName}</div>
                          <div className="text-xs text-muted-foreground">{teacher.specialization || "Senior Faculty"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-foreground font-medium">{teacher.departmentName || teacher.departmentId || "General Sciences"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-foreground text-xs">{teacher.email}</div>
                      <div className="text-muted-foreground text-xs mt-0.5">{teacher.phone || "—"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">
                        {teacher.status || "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      {teacher.createdAt ? new Date(teacher.createdAt).toLocaleDateString() : "Active"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <TablePagination 
          totalItems={filteredTeachers.length} 
          currentPage={1} 
          totalPages={1} 
          pageSize={10} 
        />
      </div>
    </div>
  );
}
