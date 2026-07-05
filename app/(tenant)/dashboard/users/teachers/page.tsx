"use client";

import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { TableFilters } from "@/components/dashboard/table-filters";
import { TablePagination } from "@/components/dashboard/table-pagination";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async (query?: string) => {
    try {
      setLoading(true);
      // Fallback to mock data to match the UI screenshot
      setTimeout(() => {
        setTeachers([
          { id: "1", firstName: "Ignatius", lastName: "Fitzpatrick", role: "Father", email: "dynifugemi@mailinator.com", phone: "+1 (764) 161-7777", country: "Kenya", createdAt: new Date(Date.now() - 4 * 86400000).toISOString() },
          { id: "2", firstName: "Tanner", lastName: "Mills", role: "Guardian", email: "kyciz@mailinator.com", phone: "+1 (842) 261-4828", country: "Albania", createdAt: new Date(Date.now() - 4 * 86400000).toISOString() },
          { id: "3", firstName: "Pamela", lastName: "Henry", role: "Mother", email: "qesudu@mailinator.com", phone: "+1 (879) 136-1088", country: "Uganda", createdAt: new Date(Date.now() - 4 * 86400000).toISOString() },
          { id: "4", firstName: "Hilary", lastName: "Bass", role: "Father", email: "divabyhoxy@mailinator.com", phone: "+1 (781) 803-3822", country: "Uganda", createdAt: new Date(Date.now() - 4 * 86400000).toISOString() }
        ]);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Failed to fetch teachers", error);
      setLoading(false);
    }
  };

  const filteredTeachers = teachers.filter((teacher) => {
    const fullName = `${teacher.firstName} ${teacher.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="p-6 space-y-6 bg-gray-50/50 min-h-screen">
      <PageHeader 
        title="Teachers" 
        count={teachers.length} 
        onAdd={() => window.location.href = '/dashboard/users/teachers/new'}
        onExport={() => {}}
        onImport={() => {}}
        addLabel="Add Teacher"
      />

      <div className="bg-white rounded-md shadow-sm border">
        <TableFilters 
          search={searchQuery} 
          setSearch={(val) => {
            setSearchQuery(val);
            fetchTeachers(val);
          }} 
          searchPlaceholder="Search products..." 
          dateRange="Jan 20, 2024 - Feb 09, 2024"
        />

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 bg-white border-b">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">Country</th>
                <th className="px-6 py-4 font-medium">View</th>
                <th className="px-6 py-4 font-medium">Date Created</th>
                <th className="px-6 py-4 font-medium text-right"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-500">Loading teachers...</td></tr>
              ) : filteredTeachers.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-500">No teachers found.</td></tr>
              ) : (
                filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="border-b hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${teacher.firstName}`} />
                          <AvatarFallback className="bg-blue-100 text-blue-700">
                            {teacher.firstName?.[0]}{teacher.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-gray-900">{teacher.firstName} {teacher.lastName}</div>
                          <div className="mt-0.5 w-fit">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                              teacher.role.toLowerCase() === 'father' || teacher.role.toLowerCase() === 'mother' ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
                            }`}>
                              {teacher.role}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-blue-700 font-medium">{teacher.email}</div>
                      <div className="text-blue-700 text-xs mt-0.5">{teacher.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-blue-700 font-medium">
                        {teacher.country}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Button variant="outline" size="sm" className="h-8 text-xs font-medium text-blue-700 border-blue-200 hover:bg-blue-50">
                        View Parent Info
                      </Button>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="text-blue-700 font-medium">4 days ago</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-900">
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
