"use client";
import React, { useEffect, useState } from "react";
import { LayoutGrid, TrendingUp, Users, Server } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCards, StatCardProps } from "@/components/dashboard/stat-cards";
import { apiClient } from "@/lib/api-client";

export default function SaaSAnalyticsPage() {
  const [stats, setStats] = useState<StatCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSaaSAnalytics();
  }, []);

  const fetchSaaSAnalytics = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get<any>('/system/metrics');
      if (res.ok && res.data) {
        setStats([
          { title: "Total Tenants", value: res.data.totalTenants?.toString() || "0", icon: Server, color: "text-blue-600", bgColor: "bg-blue-100" },
          { title: "Total Users", value: res.data.totalUsers?.toString() || "0", icon: Users, color: "text-teal-600", bgColor: "bg-teal-100" },
          { title: "Active Subscriptions", value: res.data.activeSubscriptions?.toString() || "0", icon: TrendingUp, color: "text-orange-600", bgColor: "bg-orange-100" },
          { title: "System Health", value: res.data.healthStatus || "Healthy", icon: LayoutGrid, color: "text-green-600", bgColor: "bg-green-100" },
        ]);
      } else {
        // Fallback if endpoint is not implemented
        setStats([
          { title: "Total Tenants", value: "Loading...", icon: Server, color: "text-blue-600", bgColor: "bg-blue-100" },
          { title: "Total Users", value: "Loading...", icon: Users, color: "text-teal-600", bgColor: "bg-teal-100" },
        ]);
      }
    } catch (error) {
      console.error("Failed to fetch SaaS analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Platform Analytics" />
      {loading ? (
        <div className="py-12 text-center text-muted-foreground">Loading platform analytics...</div>
      ) : (
        <div className="space-y-4">
          <StatCards cards={stats} />
          
          <div className="grid gap-4 md:grid-cols-2 mt-6">
            <div className="bg-white p-6 rounded-lg border shadow-sm flex flex-col justify-center items-center h-64">
              <TrendingUp className="w-12 h-12 text-slate-200 mb-4" />
              <h3 className="text-lg font-medium text-slate-700">Platform Growth</h3>
              <p className="text-sm text-slate-500 mt-2 text-center max-w-sm">
                Detailed charts for platform growth and subscription trends will appear here as more data is collected.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border shadow-sm flex flex-col justify-center items-center h-64">
              <Users className="w-12 h-12 text-slate-200 mb-4" />
              <h3 className="text-lg font-medium text-slate-700">Tenant Engagement</h3>
              <p className="text-sm text-slate-500 mt-2 text-center max-w-sm">
                Analytics detailing active vs inactive tenants and feature usage across the platform.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
