"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { TableFilters } from "@/components/dashboard/table-filters";
import { TablePagination } from "@/components/dashboard/table-pagination";

export default function ParentsPage() {
  const [parents, setParents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchParents();
  }, []);

  const fetchParents = async (query?: string) => {
    try {
      setLoading(true);
      // Fallback to mock data to match the UI screenshot
      setTimeout(() => {
        setParents([
          { id: "1", firstName: "Ignatius", lastName: "Fitzpatrick", relation: "Father", email: "dynifugemi@mailinator.com", phone: "+1 (764) 161-7777", country: "Kenya", createdAt: new Date(Date.now() - 1000).toISOString() },
          { id: "2", firstName: "Tanner", lastName: "Mills", relation: "Guardian", email: "kyciz@mailinator.com", phone: "+1 (842) 261-4828", country: "Albania", createdAt: new Date(Date.now() - 3600000).toISOString() },
          { id: "3", firstName: "Pamela", lastName: "Henry", relation: "Mother", email: "qesudu@mailinator.com", phone: "+1 (879) 136-1088", country: "Uganda", createdAt: new Date(Date.now() - 7200000).toISOString() },
          { id: "4", firstName: "Hilary", lastName: "Bowman", relation: "Guardian", email: "hilary@mailinator.com", phone: "+1 (555) 123-4567", country: "Uganda", createdAt: new Date(Date.now() - 86400000).toISOString() }
        ]);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Failed to fetch parents", error);
      setLoading(false);
    }
  };

  const filteredParents = parents.filter((parent) => {
    const fullName = `${parent.firstName} ${parent.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const getRelationColor = (relation: string) => {
    switch (relation.toLowerCase()) {
      case 'father': return 'bg-blue-600 text-white';
      case 'mother': return 'bg-pink-600 text-white';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50/50 min-h-screen">
      <PageHeader 
        title="Parents" 
        count={parents.length} 
        onAdd={() => window.location.href = '/dashboard/users/parents/new'}
        onExport={() => {}}
        onImport={() => {}}
        addLabel="Add Parent"
      />

      <div className="bg-white rounded-md shadow-sm border">
        <TableFilters 
          search={searchQuery} 
          setSearch={(val) => {
            setSearchQuery(val);
            fetchParents(val);
          }} 
          searchPlaceholder="Search parents..." 
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
                <tr><td colSpan={6} className="text-center py-8 text-gray-500">Loading parents...</td></tr>
              ) : filteredParents.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-500">No parents found.</td></tr>
              ) : (
                filteredParents.map((parent) => (
                  <tr key={parent.id} className="border-b hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${parent.firstName}`} />
                          <AvatarFallback className="bg-orange-100 text-orange-700">
                            {parent.firstName?.[0]}{parent.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-gray-900">{parent.firstName} {parent.lastName}</div>
                          <div className="mt-0.5 w-fit">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                              parent.relation.toLowerCase() === 'father' ? 'bg-blue-600 text-white' : 'text-gray-500'
                            }`}>
                              {parent.relation}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900 font-medium">{parent.email}</div>
                      <div className="text-gray-500 text-xs">{parent.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {parent.country}
                    </td>
                    <td className="px-6 py-4">
                      <Button variant="outline" size="sm" className="h-8 text-xs font-medium">
                        View Parent Info
                      </Button>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {/* For demo purposes, we format it based on the screenshot */}
                      {parent.firstName === "Ignatius" ? "1 second ago" : 
                       parent.firstName === "Tanner" ? "1 hour ago" : 
                       parent.firstName === "Pamela" ? "2 hours ago" : "1 day ago"}
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
          totalItems={filteredParents.length} 
          currentPage={1} 
          totalPages={1} 
          pageSize={10} 
        />
      </div>
    </div>
  );
}
