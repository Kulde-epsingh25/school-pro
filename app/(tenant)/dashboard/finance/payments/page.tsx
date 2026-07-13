"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useSchoolStore } from "@/store/schoolStore";
import { useAuthStore } from "@/store/authStore";
import { Plus, Search, DollarSign, Download, CheckCircle, Clock } from "lucide-react";
import { TableSkeleton } from "@/components/ui/loading-skeleton";

type Payment = {
  id: string;
  student: { id: string; user: { firstName: string; lastName: string }; admissionNumber: string; class: { name: string } };
  amount: number;
  status: string;
  prn: string;
  description: string;
  createdAt: string;
};

type Student = {
  id: string;
  user: { firstName: string; lastName: string };
  admissionNumber: string;
  class: { name: string };
};

export default function FinancePaymentsPage() {
  const school = useSchoolStore((state) => state.school);
  const user = useAuthStore((state) => state.user);
  
  const [payments, setPayments] = useState<Payment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  
  const [formData, setFormData] = useState({
    studentId: "",
    amount: "",
    status: "PAID",
    description: "Tuition Fee Installment"
  });

  useEffect(() => {
    if (school?.id) {
      fetchPayments();
      fetchStudents();
    }
  }, [school?.id]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/finance/payments?tenantId=${school?.id}`, {
        headers: { "x-user-id": user?.id || "" }
      });
      if (res.ok) setPayments(await res.json());
    } catch (error) {
      toast.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };
  
  const fetchStudents = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/students?tenantId=${school?.id}`, {
        headers: { "x-user-id": user?.id || "" }
      });
      if (res.ok) setStudents(await res.json());
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentId || !formData.amount) {
      toast.error("Please fill all required fields");
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/finance/payments`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-user-id": user?.id || "" 
        },
        body: JSON.stringify({
          tenantId: school?.id,
          ...formData
        })
      });

      if (res.ok) {
        toast.success("Payment recorded successfully!");
        setShowCreate(false);
        setFormData({ ...formData, studentId: "", amount: "" });
        fetchPayments();
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

  return (
    <div className="p-6 max-w-6xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-[#16A34A]" /> Payments
          </h2>
          <p className="text-sm text-gray-500 mt-1">Track and record student fee payments</p>
        </div>
        <div className="flex gap-3 mt-4 sm:mt-0">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          <Button 
            onClick={() => setShowCreate(!showCreate)} 
            className="bg-[#16A34A] hover:bg-[#15803D] text-white"
          >
            {showCreate ? "Cancel" : <><Plus className="w-4 h-4 mr-2" /> Record Payment</>}
          </Button>
        </div>
      </div>

      {showCreate && (
        <div className="bg-white rounded-xl shadow-sm border border-green-600/20 ring-1 ring-green-600/10 p-6 mb-8 animate-in fade-in slide-in-from-top-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Record Manual Payment</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Student</label>
                <select 
                  value={formData.studentId} 
                  onChange={e => setFormData({ ...formData, studentId: e.target.value })}
                  className="flex h-11 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                  required
                >
                  <option value="">Select Student</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.user?.firstName} {s.user?.lastName} - {s.admissionNumber} ({s.class?.name})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Amount ($)</label>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Description</label>
                <Input 
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Tuition Fee Installment" 
                  className="h-11"
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
                  <option value="PAID">Paid (Cleared)</option>
                  <option value="PENDING">Pending</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={loading} className="bg-[#16A34A] hover:bg-[#15803D] text-white px-8 h-11">
                {loading ? "Saving..." : "Record Payment"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Filters Toolbar */}
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Search payments by PRN or student..." className="pl-9 h-10" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 font-medium">
                <th className="py-4 px-6 font-semibold">PRN</th>
                <th className="py-4 px-6 font-semibold">Student</th>
                <th className="py-4 px-6 font-semibold">Class</th>
                <th className="py-4 px-6 font-semibold text-right">Amount</th>
                <th className="py-4 px-6 font-semibold text-center">Status</th>
                <th className="py-4 px-6 font-semibold text-right">Date</th>
              </tr>
            </thead>
            <tbody className="text-gray-900">
              {loading && payments.length === 0 ? (
                <tr><td colSpan={6} className="py-8"><TableSkeleton columns={6} /></td></tr>
              ) : payments.length === 0 ? (
                <tr><td colSpan={6} className="py-8 text-center text-gray-500 italic border-t border-dashed">No payments recorded.</td></tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs text-gray-500">{p.prn}</td>
                    <td className="py-4 px-6 font-medium">
                      {p.student?.user?.firstName} {p.student?.user?.lastName}
                      <div className="text-xs text-gray-400">{p.student?.admissionNumber}</div>
                    </td>
                    <td className="py-4 px-6">{p.student?.class?.name || "N/A"}</td>
                    <td className="py-4 px-6 text-right font-bold text-green-700">
                      ${p.amount.toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {p.status === "PAID" ? (
                        <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                          <CheckCircle className="w-3 h-3 mr-1" /> Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                          <Clock className="w-3 h-3 mr-1" /> Pending
                        </span>
                      )}
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
