"use client";

import React, { useState, useEffect } from "react";
import { Search, History, Filter, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSchoolStore } from "@/store/schoolStore";
import { useAuthStore } from "@/store/authStore";
import { PageHeader } from "@/components/dashboard/page-header";
import { apiClient } from "@/lib/api-client";

export default function TenantAuditPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    action: "ALL",
    resourceType: "ALL"
  });

  const school = useSchoolStore((state) => state.school);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (school?.id) {
      fetchLogs();
    }
  }, [school?.id, filters]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({ tenantId: school?.id || '' });
      if (filters.action !== "ALL") queryParams.append("action", filters.action);
      if (filters.resourceType !== "ALL") queryParams.append("resourceType", filters.resourceType);

      const res = await apiClient.get<any[]>(`/audit?${queryParams.toString()}`);
      if (res.ok && res.data) {
        setLogs(res.data);
      } else {
        console.error("Failed to fetch audit logs:", res.error);
      }
    } catch (error) {
      console.error("Failed to fetch audit logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'CREATE': return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Create</Badge>;
      case 'UPDATE': return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Update</Badge>;
      case 'DELETE': return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Delete</Badge>;
      case 'LOGIN': return <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200">Login</Badge>;
      default: return <Badge variant="outline">{action}</Badge>;
    }
  };

  const exportCsv = () => {
    const headers = ["Date", "Actor Name", "Actor Email", "Action", "Resource Type", "Changes"];
    const csvContent = [
      headers.join(","),
      ...logs.map(log => [
        `"${new Date(log.createdAt).toLocaleString()}"`,
        `"${log.actor?.firstName || ''} ${log.actor?.lastName || ''}"`,
        `"${log.actor?.email || ''}"`,
        `"${log.action}"`,
        `"${log.resourceType}"`,
        `"${(log.changes || '').replace(/"/g, '""')}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `audit_logs_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs"
        count={logs.length}
      />

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <CardTitle>System Activity</CardTitle>
              <CardDescription>Track changes and access across the organization.</CardDescription>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="outline" onClick={exportCsv} disabled={logs.length === 0}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Select value={filters.action} onValueChange={(val) => setFilters(prev => ({ ...prev, action: val as string }))}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Actions</SelectItem>
                  <SelectItem value="CREATE">Create</SelectItem>
                  <SelectItem value="UPDATE">Update</SelectItem>
                  <SelectItem value="DELETE">Delete</SelectItem>
                  <SelectItem value="LOGIN">Login</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filters.resourceType} onValueChange={(val) => setFilters(prev => ({ ...prev, resourceType: val as string }))}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Resource" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Resources</SelectItem>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="ROLE">Role</SelectItem>
                  <SelectItem value="DEPARTMENT">Department</SelectItem>
                  <SelectItem value="PERMISSION">Permission</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-muted-foreground">Loading audit logs...</div>
          ) : logs.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground flex flex-col items-center">
              <History className="w-12 h-12 text-slate-200 mb-2" />
              <div>No audit logs found for the selected criteria.</div>
            </div>
          ) : (
            <div className="rounded-md border">
              <div className="grid grid-cols-12 gap-4 p-4 font-semibold text-sm border-b bg-slate-50 text-slate-600">
                <div className="col-span-3">Date & Time</div>
                <div className="col-span-3">Actor</div>
                <div className="col-span-2">Action</div>
                <div className="col-span-4">Details</div>
              </div>
              <div className="divide-y">
                {logs.map((log) => (
                  <div key={log.id} className="grid grid-cols-12 gap-4 p-4 items-center text-sm hover:bg-slate-50 transition-colors">
                    <div className="col-span-3 text-slate-500 text-xs">
                      {new Date(log.createdAt).toLocaleString()}
                    </div>
                    <div className="col-span-3">
                      <div className="font-medium text-slate-900">
                        {log.actor?.firstName} {log.actor?.lastName}
                      </div>
                      <div className="text-xs text-muted-foreground">{log.actor?.email}</div>
                    </div>
                    <div className="col-span-2">
                      {getActionBadge(log.action)}
                    </div>
                    <div className="col-span-4">
                      <div className="font-medium text-slate-700">{log.resourceType}</div>
                      {log.changes && (
                        <div className="text-xs text-muted-foreground truncate max-w-full mt-1" title={log.changes}>
                          {log.changes}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
