"use client";
import React, { useEffect, useState } from "react";
import { LayoutGrid } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCards, StatCardProps } from "@/components/dashboard/stat-cards";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { useSchoolStore } from "@/store/schoolStore";
import { useAuthStore } from "@/store/authStore";
import { apiClient } from "@/lib/api-client";

export default function TenantAnalyticsPage() {
  const school = useSchoolStore((state) => state.school);
  const user = useAuthStore((state) => state.user);
  
  const [stats, setStats] = useState<StatCardProps[]>([]);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (school?.id && user?.id) {
      fetchAnalytics();
    }
  }, [school?.id, user?.id]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/dashboard/metrics?tenantId=${school?.id}`, {
        headers: { "x-user-id": user?.id || "" }
      });
      if (res.ok) {
        const data = await res.json();
        setStats([
          { title: "Active Students", value: data.stats?.totalStudents?.toString() || "0", icon: LayoutGrid, color: "text-blue-600", bgColor: "bg-blue-100" },
          { title: "Active Teachers", value: data.stats?.totalTeachers?.toString() || "0", icon: LayoutGrid, color: "text-teal-600", bgColor: "bg-teal-100" },
          { title: "Total Revenue", value: `₹${(data.stats?.totalRevenue || 0).toLocaleString()}`, icon: LayoutGrid, color: "text-orange-600", bgColor: "bg-orange-100" },
          { title: "Total Parents", value: data.stats?.totalParents?.toString() || "0", icon: LayoutGrid, color: "text-green-600", bgColor: "bg-green-100" },
        ]);
        
        if (data.feeCollectionData) {
          setRevenueData(data.feeCollectionData);
        }
        
        // Mock attendance if not returned by metrics endpoint
        setAttendanceData([
          { name: "Sun", value: 0 },
          { name: "Mon", value: 91 },
          { name: "Tue", value: 87 },
          { name: "Wed", value: 95 },
          { name: "Thu", value: 89 },
          { name: "Fri", value: 92 },
          { name: "Sat", value: 0 },
        ]);
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="School Analytics" />
      {loading ? (
        <div className="py-12 text-center text-muted-foreground">Loading analytics...</div>
      ) : (
        <div className="space-y-4">
          <StatCards cards={stats} />
          <div className="grid gap-4 md:grid-cols-2">
            <SalesChart data={attendanceData} />
            <RevenueChart data={revenueData} />
          </div>
        </div>
      )}
    </div>
  );
}
