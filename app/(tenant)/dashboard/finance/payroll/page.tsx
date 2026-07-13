"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useSchoolStore } from "@/store/schoolStore";
import { useAuthStore } from "@/store/authStore";
import { Plus, Download, UserCheck, Calendar } from "lucide-react";

type Staff = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
};

type SalaryPayment = {
  id: string;
  user: Staff;
  amount: number;
  month: number;
  year: number;
  status: string;
  createdAt: string;
};

export default function FinancePayrollPage() {
  const school = useSchoolStore((state) => state.school);
  const authUser = useAuthStore((state) => state.user);
  
  const [payments, setPayments] = useState<SalaryPayment[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  
  const [formData, setFormData] = useState({
    userId: "",
    amount: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    status: "PAID"
  });

  useEffect(() => {
    if (school?.id) {
      fetchPayroll();
      fetchStaff();
    }
  }, [school?.id]);

  const fetchPayroll = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/finance/payroll?tenantId=${school?.id}`, {
        headers: { "x-user-id": authUser?.id || "" }
      });
      if (res.ok) setPayments(await res.json());
    } catch (error) {
      toast.error("Failed to load payroll");
    } finally {
      setLoading(false);
    }
  };
  
  const fetchStaff = async () => {
    try {
      // Basic fetch to get users with role TEACHER or STAFF
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/users/staff?tenantId=${school?.id}`, {
        headers: { "x-user-id": authUser?.id || "" }
      });
      if (res.ok) {
        setStaff(await res.json());
      }
    } catch (error) {
      console.error("Failed to fetch staff", error);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.userId || !formData.amount) {
      toast.error("Please fill all required fields");
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/finance/payroll`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-user-id": authUser?.id || "" 
        },
        body: JSON.stringify({
          tenantId: school?.id,
          ...formData
        })
      });

      if (res.ok) {
        toast.success("Salary payment recorded!");
        setShowCreate(false);
        setFormData({ ...formData, userId: "", amount: "" });
        fetchPayroll();
      } else {
        const data = await res.json().catch(() => null);
        toast.error(data?.error || "Failed to record payment");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = (monthNum: number) => {
    const date = new Date();
    date.setMonth(monthNum - 1);
    return date.toLocaleString('default', { month: 'long' });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-[#4438CA]" /> Payroll Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">Track staff and teacher salary payments</p>
        </div>
        <div className="flex gap-3 mt-4 sm:mt-0">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          <Button 
            onClick={() => setShowCreate(!showCreate)} 
            className="bg-[#4438CA] hover:bg-[#3730A3] text-white"
          >
            {showCreate ? "Cancel" : <><Plus className="w-4 h-4 mr-2" /> Record Salary</>}
          </Button>
        </div>
      </div>

      {showCreate && (
        <div className="bg-white rounded-xl shadow-sm border border-blue-600/20 ring-1 ring-blue-600/10 p-6 mb-8 animate-in fade-in slide-in-from-top-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Record Salary Payment</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Staff / Teacher</label>
                <select 
                  value={formData.userId} 
                  onChange={e => setFormData({ ...formData, userId: e.target.value })}
                  className="flex h-11 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                  required
                >
                  <option value="">Select Employee</option>
                  {staff.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} ({s.roles?.join(", ")})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Amount Paid ($)</label>
                <Input 
                  type="number"
                  value={formData.amount}
                  onChange={e => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00" 
                  className="h-11"
                  min="1"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Month</label>
                <select 
                  value={formData.month} 
                  onChange={e => setFormData({ ...formData, month: parseInt(e.target.value) })}
                  className="flex h-11 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                >
                  {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                    <option key={m} value={m}>{getMonthName(m)}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Year</label>
                <Input 
                  type="number"
                  value={formData.year}
                  onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  className="h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Status</label>
                <select 
                  value={formData.status} 
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                  className="flex h-11 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                  required
                >
                  <option value="PAID">Paid</option>
                  <option value="PENDING">Pending</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={loading} className="bg-[#4438CA] hover:bg-[#3730A3] text-white px-8 h-11">
                {loading ? "Recording..." : "Record Salary"}
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 font-medium">
                <th className="py-4 px-6 font-semibold">Employee</th>
                <th className="py-4 px-6 font-semibold">Role</th>
                <th className="py-4 px-6 font-semibold">Period</th>
                <th className="py-4 px-6 font-semibold text-right">Amount</th>
                <th className="py-4 px-6 font-semibold text-center">Status</th>
                <th className="py-4 px-6 font-semibold text-right">Payment Date</th>
              </tr>
            </thead>
            <tbody className="text-gray-900">
              {loading && payments.length === 0 ? (
                <tr><td colSpan={6} className="py-8 text-center text-gray-500">Loading payroll...</td></tr>
              ) : payments.length === 0 ? (
                <tr><td colSpan={6} className="py-8 text-center text-gray-500 italic border-t border-dashed">No salary payments recorded.</td></tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium">
                      {p.user?.firstName} {p.user?.lastName}
                    </td>
                    <td className="py-4 px-6 text-xs text-gray-500 uppercase">{p.user?.roles?.join(", ") || "STAFF"}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-3 h-3 mr-1" />
                        {getMonthName(p.month)} {p.year}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right font-bold text-gray-900">
                      ${p.amount.toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        {p.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right text-gray-500 text-xs">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
