"use client";
import {
  AudioWaveform,
  ClipboardList,
  Command,
  DollarSign,
  Frame,
  GraduationCap,
  LayoutDashboard,
  Map,
  PieChart,
  Settings2,
  Users,
} from "lucide-react";

// Import extracted components
import { RecentDataTable } from "@/components/dashboard/recent-data-table";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { StatCards, StatCardProps } from "@/components/dashboard/stat-cards";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { useSchoolStore } from "@/store/schoolStore";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";

const attendanceData = [
  { name: "Sun", value: 0 },
  { name: "Mon", value: 91 },
  { name: "Tue", value: 87 },
  { name: "Wed", value: 95 },
  { name: "Thu", value: 89 },
  { name: "Fri", value: 92 },
  { name: "Sat", value: 0 },
];

import { LayoutGrid } from "lucide-react";

const defaultStats: StatCardProps[] = [
  { title: "Students", value: "0", icon: LayoutGrid, color: "text-blue-600", bgColor: "bg-blue-100" },
  { title: "Teachers", value: "0", icon: LayoutGrid, color: "text-teal-600", bgColor: "bg-teal-100" },
  { title: "Parents", value: "0", icon: LayoutGrid, color: "text-green-600", bgColor: "bg-green-100" },
  { title: "Classes", value: "1", icon: LayoutGrid, color: "text-orange-600", bgColor: "bg-orange-100" },
];

const feeCollectionData = [
  { name: "Jan", value: 320000 },
  { name: "Feb", value: 280000 },
  { name: "Mar", value: 410000 },
  { name: "Apr", value: 390000 },
  { name: "May", value: 450000 },
  { name: "Jun", value: 370000 },
];

const recentAdmissions = [
  {
    customer: "Aarav Sharma",
    email: "aarav.sharma@school.edu",
    source: "Online",
    status: "ENROLLED",
    date: "2024-10-14",
    amount: "₹45,000",
  },
  {
    customer: "Priya Patel",
    email: "priya.patel@school.edu",
    source: "Walk-in",
    status: "ENROLLED",
    date: "2024-10-13",
    amount: "₹45,000",
  },
  {
    customer: "Rohan Mehta",
    email: "rohan.mehta@school.edu",
    source: "Referral",
    status: "PENDING",
    date: "2024-10-12",
    amount: "₹45,000",
  },
  {
    customer: "Sneha Iyer",
    email: "sneha.iyer@school.edu",
    source: "Online",
    status: "ENROLLED",
    date: "2024-10-11",
    amount: "₹45,000",
  },
  {
    customer: "Karan Singh",
    email: "karan.singh@school.edu",
    source: "Walk-in",
    status: "PROCESSING",
    date: "2024-10-10",
    amount: "₹45,000",
  },
];
export default function DashboardPage() {
  const school = useSchoolStore((state) => state.school);
  const user = useAuthStore((state) => state.user);
  
  const [stats, setStats] = useState<StatCardProps[]>(defaultStats);
  const [revenueData, setRevenueData] = useState(feeCollectionData);
  const [recentData, setRecentData] = useState(recentAdmissions);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (school?.id && user?.id) {
      fetchDashboardData();
    }
  }, [school?.id, user?.id]);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/dashboard/metrics?tenantId=${school?.id}`, {
        headers: { "x-user-id": user?.id || "" }
      });
      if (res.ok) {
        const data = await res.json();
        
        setStats([
          { title: "Students", value: data.stats.totalStudents.toString(), icon: LayoutGrid, color: "text-blue-600", bgColor: "bg-blue-100" },
          { title: "Teachers", value: data.stats.totalTeachers.toString(), icon: LayoutGrid, color: "text-teal-600", bgColor: "bg-teal-100" },
          { title: "Parents", value: data.stats.totalParents.toString(), icon: LayoutGrid, color: "text-green-600", bgColor: "bg-green-100" },
          { title: "Revenue", value: `₹${data.stats.totalRevenue.toLocaleString()}`, icon: LayoutGrid, color: "text-orange-600", bgColor: "bg-orange-100" },
        ]);
        
        if (data.feeCollectionData) {
          setRevenueData(data.feeCollectionData);
        }
        
        if (data.recentAdmissions) {
          setRecentData(data.recentAdmissions);
        }
      }
    } catch (error) {
      console.error("Failed to fetch dashboard metrics", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-4">
      <WelcomeBanner />
      <StatCards cards={stats} />
      <div className="grid gap-4 md:grid-cols-2">
        <SalesChart data={attendanceData} />
        <RevenueChart data={revenueData} />
      </div>
      <RecentDataTable data={recentData} />
    </div>
  );
}
