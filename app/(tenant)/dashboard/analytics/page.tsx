"use client";

import React, { useEffect, useState } from "react";
import { BarChart3, TrendingUp, Users, DollarSign } from "lucide-react";
import { useSchoolStore } from "@/store/schoolStore";
import { apiClient } from "@/lib/api-client";
import { PerformanceChart } from "@/components/analytics/PerformanceChart";
import { FinancialChart } from "@/components/analytics/FinancialChart";

export default function AnalyticsPage() {
  const { school } = useSchoolStore();
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [financialData, setFinancialData] = useState<any>(null);
  const [attendanceData, setAttendanceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (school?.id) {
      fetchAnalytics();
    }
  }, [school?.id]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [perfRes, finRes, attRes] = await Promise.all([
        apiClient.get<any>(`/analytics/student-performance?tenantId=${school?.id}`),
        apiClient.get<any>(`/analytics/financial-summary?tenantId=${school?.id}`),
        apiClient.get<any>(`/analytics/attendance-trends?tenantId=${school?.id}`)
      ]);

      if (perfRes.ok) setPerformanceData(perfRes.data);
      if (finRes.ok) setFinancialData(finRes.data);
      if (attRes.ok) setAttendanceData(attRes.data);
    } catch (err) {
      console.error("Error fetching analytics", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex h-[400px] items-center justify-center text-gray-500">Loading analytics...</div>;
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Advanced Analytics</h1>
        <p className="text-gray-500 mt-2">Comprehensive insights into academic and operational performance.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Avg Performance</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {performanceData?.trendData?.[performanceData.trendData.length - 1]?.score?.toFixed(1) || "0"}%
              </h3>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Monthly Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900">
                ${financialData?.financialData?.[financialData.financialData.length - 1]?.revenue?.toLocaleString() || "0"}
              </h3>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Avg Attendance</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {attendanceData?.trendData?.[attendanceData.trendData.length - 1]?.presentRate?.toFixed(1) || "0"}%
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gray-500" />
            Student Performance Trends
          </h3>
          <PerformanceChart data={performanceData?.trendData || []} />
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-gray-500" />
            Financial Summary
          </h3>
          <FinancialChart data={financialData?.financialData || []} />
        </div>
      </div>
    </div>
  );
}
