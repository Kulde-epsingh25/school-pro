"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, Activity, DollarSign, Loader2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface AnalyticsData {
  metrics: {
    totalTenants: number;
    totalUsers: number;
    monthlyRevenue: number;
    systemHealth: string;
  };
  recentLogs: {
    id: string;
    action: string;
    resourceType: string;
    details: string;
    createdAt: string;
  }[];
  growthData: {
    name: string;
    tenants: number;
    users: number;
  }[];
}

export default function SuperAdminDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/analytics`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Super Admin Dashboard</h2>
        <p className="text-muted-foreground">
          Platform overview and key metrics.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.metrics.totalTenants}</div>
            <p className="text-xs text-muted-foreground">Active organizations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.metrics.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Across all tenants</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.metrics.systemHealth}</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data.metrics.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Recurring subscriptions</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Platform Growth</CardTitle>
          </CardHeader>
          <CardContent className="pl-2 h-[350px]">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={data.growthData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} />
                 <YAxis yAxisId="left" axisLine={false} tickLine={false} />
                 <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} />
                 <Tooltip />
                 <Legend />
                 <Line yAxisId="left" type="monotone" dataKey="users" stroke="#8884d8" activeDot={{ r: 8 }} name="Active Users" strokeWidth={2} />
                 <Line yAxisId="right" type="monotone" dataKey="tenants" stroke="#82ca9d" name="Tenants" strokeWidth={2} />
               </LineChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity Logs</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-6">
                {data.recentLogs.map((log) => (
                  <div key={log.id} className="flex items-center">
                     <div className="space-y-1">
                       <p className="text-sm font-medium leading-none">
                         {log.action} {log.resourceType}
                       </p>
                       <p className="text-xs text-muted-foreground line-clamp-1">
                         {log.details || "No details provided"}
                       </p>
                     </div>
                     <div className="ml-auto font-medium text-xs text-muted-foreground">
                        {new Date(log.createdAt).toLocaleDateString()}
                     </div>
                  </div>
                ))}
                {data.recentLogs.length === 0 && (
                   <p className="text-sm text-muted-foreground">No recent activity.</p>
                )}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
