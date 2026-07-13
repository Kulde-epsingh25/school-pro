"use client";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useSchoolStore } from "@/store/schoolStore";
import { useAuthStore } from "@/store/authStore";
import dynamic from "next/dynamic";
import { CardSkeleton } from "@/components/ui/loading-skeleton";

const BarChart3 = dynamic(() => import("lucide-react").then((mod) => mod.BarChart3), { ssr: false });
const TrendingUp = dynamic(() => import("lucide-react").then((mod) => mod.TrendingUp), { ssr: false });
const TrendingDown = dynamic(() => import("lucide-react").then((mod) => mod.TrendingDown), { ssr: false });
const DollarSign = dynamic(() => import("lucide-react").then((mod) => mod.DollarSign), { ssr: false });
const Activity = dynamic(() => import("lucide-react").then((mod) => mod.Activity), { ssr: false });

export default function FinancialReportsPage() {
  const school = useSchoolStore((state) => state.school);
  const user = useAuthStore((state) => state.user);
  
  const [data, setData] = useState<{
    totalRevenue: number;
    totalExpenses: number;
    totalPayroll: number;
    netBalance: number;
  } | null>(null);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (school?.id) {
      fetchReport();
    }
  }, [school?.id]);

  const fetchReport = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/reports/financial?tenantId=${school?.id}`, {
        headers: { "x-user-id": user?.id || "" }
      });
      if (res.ok) {
        setData(await res.json());
      } else {
        toast.error("Failed to load financial data");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto w-full space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-600" /> Financial Report Overview
          </h2>
          <p className="text-sm text-gray-500 mt-1">High-level financial health and aggregates across the institution</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto w-full space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-600" /> Financial Report Overview
        </h2>
        <p className="text-sm text-gray-500 mt-1">High-level financial health and aggregates across the institution</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-1 bg-green-500"></div>
          <p className="text-sm font-medium text-gray-500 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-green-500" /> Total Revenue
          </p>
          <p className="text-3xl font-bold text-gray-900 mt-2">${(data?.totalRevenue || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
          <p className="text-xs text-green-600 mt-2">From student fee payments</p>
        </div>

        {/* Operating Expenses */}
        <div className="bg-white rounded-xl shadow-sm border border-red-100 p-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-1 bg-red-400"></div>
          <p className="text-sm font-medium text-gray-500 flex items-center">
            <TrendingDown className="w-4 h-4 mr-2 text-red-400" /> Operating Expenses
          </p>
          <p className="text-3xl font-bold text-gray-900 mt-2">${(data?.totalExpenses || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
          <p className="text-xs text-red-500 mt-2">Supplies, maintenance, etc.</p>
        </div>

        {/* Payroll */}
        <div className="bg-white rounded-xl shadow-sm border border-red-100 p-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-1 bg-red-600"></div>
          <p className="text-sm font-medium text-gray-500 flex items-center">
            <TrendingDown className="w-4 h-4 mr-2 text-red-600" /> Total Payroll
          </p>
          <p className="text-3xl font-bold text-gray-900 mt-2">${(data?.totalPayroll || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
          <p className="text-xs text-red-700 mt-2">Staff & Teacher salaries</p>
        </div>

        {/* Net Balance */}
        <div className={`bg-white rounded-xl shadow-sm border p-6 relative overflow-hidden ${Number(data?.netBalance) >= 0 ? 'border-indigo-200' : 'border-red-200'}`}>
          <div className={`absolute right-0 top-0 h-full w-1 ${Number(data?.netBalance) >= 0 ? 'bg-indigo-600' : 'bg-red-600'}`}></div>
          <p className="text-sm font-medium text-gray-500 flex items-center">
            <Activity className="w-4 h-4 mr-2 text-gray-600" /> Net Balance
          </p>
          <p className={`text-3xl font-bold mt-2 ${Number(data?.netBalance) >= 0 ? 'text-indigo-700' : 'text-red-700'}`}>
            ${(data?.netBalance || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}
          </p>
          <p className="text-xs text-gray-500 mt-2">Revenue - (Expenses + Payroll)</p>
        </div>
      </div>
      
      {/* Visualization Placeholder */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center min-h-[300px]">
         <DollarSign className="w-12 h-12 text-gray-300 mb-3" />
         <p className="text-gray-500">Advanced visualization charts would render here based on historical trends.</p>
      </div>
    </div>
  );
}
