"use client";

import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, AlertCircle, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { TableFilters } from "@/components/dashboard/table-filters";
import { TablePagination } from "@/components/dashboard/table-pagination";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import type { Parent } from "@/types/dashboard";

export default function ParentsPage() {
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchParents();
  }, []);

  const fetchParents = async (query?: string) => {
    try {
      setLoading(true);
      setError(null);
      const endpoint = query 
        ? `/parents?search=${encodeURIComponent(query)}` 
        : `/parents`;

      const res = await apiClient.get<Parent[]>(endpoint);
      if (res.ok && res.data) {
        setParents(Array.isArray(res.data) ? res.data : []);
      } else {
        throw new Error(res.error || "Failed to fetch guardian directory from API");
      }
    } catch (err: any) {
      console.error("Failed to fetch parents", err);
      setError(err?.message || "Failed to load parent records.");
      setParents([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredParents = parents.filter((parent) => {
    const fullName = `${parent.firstName || ""} ${parent.lastName || ""}`.toLowerCase();
    const email = (parent.email || "").toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || email.includes(query);
  });

  return (
    <div className="p-6 space-y-6 bg-gray-50/50 min-h-screen">
      <PageHeader 
        title="Parents & Guardians" 
        count={parents.length} 
        onAdd={() => router.push('/dashboard/users/parents/new')}
        onExport={() => {}}
        onImport={() => {}}
        addLabel="Add Parent"
      />

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <TableFilters 
          search={searchQuery} 
          setSearch={(val) => {
            setSearchQuery(val);
            fetchParents(val);
          }} 
          searchPlaceholder="Search parents by name, email or phone..." 
          dateRange="Academic Session 2025 - 2026"
        />

        {error && (
          <div className="m-4 p-4 rounded-xl border border-destructive/30 bg-destructive/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
              <div>
                <p className="text-sm font-semibold text-destructive">Guardian Directory Error</p>
                <p className="text-xs text-muted-foreground">{error}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => fetchParents()}
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
                <th className="px-6 py-4 font-semibold">Guardian Name</th>
                <th className="px-6 py-4 font-semibold">Contact Details</th>
                <th className="px-6 py-4 font-semibold">Students Linked</th>
                <th className="px-6 py-4 font-semibold">Profile</th>
                <th className="px-6 py-4 font-semibold">Created</th>
                <th className="px-6 py-4 font-semibold text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 rounded-full border-2 border-primary border-r-transparent animate-spin" />
                      Loading guardian directory...
                    </div>
                  </td>
                </tr>
              ) : filteredParents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-muted-foreground">
                    {error ? "Unable to display guardian records." : "No parent records found."}
                  </td>
                </tr>
              ) : (
                filteredParents.map((parent) => (
                  <tr key={parent.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${parent.firstName}`} />
                          <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {parent.firstName?.[0] || "P"}{parent.lastName?.[0] || "G"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-foreground">{parent.firstName} {parent.lastName}</div>
                          <div className="text-xs text-muted-foreground">{parent.occupation || "Guardian"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-foreground text-xs">{parent.email}</div>
                      <div className="text-muted-foreground text-xs mt-0.5">{parent.phone || "—"}</div>
                    </td>
                    <td className="px-6 py-4 text-foreground text-xs font-medium">
                      {parent.childrenCount ? `${parent.childrenCount} Enrolled` : "1 Enrolled"}
                    </td>
                    <td className="px-6 py-4">
                      <Button variant="outline" size="sm" className="h-8 text-xs font-medium">
                        View Family Ledger
                      </Button>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-xs">
                      {parent.createdAt ? new Date(parent.createdAt).toLocaleDateString() : "Active"}
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
          totalItems={filteredParents.length} 
          currentPage={1} 
          totalPages={1} 
          pageSize={10} 
        />
      </div>
    </div>
  );
}
