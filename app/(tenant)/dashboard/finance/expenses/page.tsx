"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useSchoolStore } from "@/store/schoolStore";
import { useAuthStore } from "@/store/authStore";
import { Plus, Download, CreditCard, Tag } from "lucide-react";

type Expense = {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  createdAt: string;
};

export default function FinanceExpensesPage() {
  const school = useSchoolStore((state) => state.school);
  const user = useAuthStore((state) => state.user);
  
  const [expenses, setExpenses] = useState<Expense[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "SUPPLIES",
    date: new Date().toISOString().split("T")[0]
  });

  useEffect(() => {
    if (school?.id) {
      fetchExpenses();
    }
  }, [school?.id]);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/finance/expenses?tenantId=${school?.id}`, {
        headers: { "x-user-id": user?.id || "" }
      });
      if (res.ok) setExpenses(await res.json());
    } catch (error) {
      toast.error("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) {
      toast.error("Please fill all required fields");
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/finance/expenses`, {
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
        toast.success("Expense logged successfully!");
        setShowCreate(false);
        setFormData({ ...formData, title: "", amount: "" });
        fetchExpenses();
      } else {
        const data = await res.json().catch(() => null);
        toast.error(data?.error || "Failed to log expense");
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
            <CreditCard className="w-6 h-6 text-[#DC2626]" /> Expenditures
          </h2>
          <p className="text-sm text-gray-500 mt-1">Track and manage school operating expenses</p>
        </div>
        <div className="flex gap-3 mt-4 sm:mt-0">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          <Button 
            onClick={() => setShowCreate(!showCreate)} 
            className="bg-[#DC2626] hover:bg-[#B91C1C] text-white"
          >
            {showCreate ? "Cancel" : <><Plus className="w-4 h-4 mr-2" /> Log Expense</>}
          </Button>
        </div>
      </div>

      {showCreate && (
        <div className="bg-white rounded-xl shadow-sm border border-red-600/20 ring-1 ring-red-600/10 p-6 mb-8 animate-in fade-in slide-in-from-top-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Log New Expense</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Expense Title</label>
                <Input 
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Printer Ink, Desk Repair" 
                  className="h-11"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Amount ($)</label>
                <Input 
                  type="number"
                  value={formData.amount}
                  onChange={e => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00" 
                  className="h-11"
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Category</label>
                <select 
                  value={formData.category} 
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="flex h-11 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                  required
                >
                  <option value="SUPPLIES">Supplies</option>
                  <option value="MAINTENANCE">Maintenance & Repairs</option>
                  <option value="UTILITIES">Utilities</option>
                  <option value="EVENTS">School Events</option>
                  <option value="MARKETING">Marketing & Outreach</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Date</label>
                <Input 
                  type="date"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  className="h-11"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={loading} className="bg-[#DC2626] hover:bg-[#B91C1C] text-white px-8 h-11">
                {loading ? "Logging..." : "Log Expense"}
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
                <th className="py-4 px-6 font-semibold">Title</th>
                <th className="py-4 px-6 font-semibold">Category</th>
                <th className="py-4 px-6 font-semibold text-right">Amount</th>
                <th className="py-4 px-6 font-semibold text-right">Expense Date</th>
              </tr>
            </thead>
            <tbody className="text-gray-900">
              {loading && expenses.length === 0 ? (
                <tr><td colSpan={4} className="py-8 text-center text-gray-500">Loading expenses...</td></tr>
              ) : expenses.length === 0 ? (
                <tr><td colSpan={4} className="py-8 text-center text-gray-500 italic border-t border-dashed">No expenses logged.</td></tr>
              ) : (
                expenses.map((exp) => (
                  <tr key={exp.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium text-gray-900">{exp.title}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center text-xs text-gray-500">
                        <Tag className="w-3 h-3 mr-1" /> {exp.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-bold text-red-600">
                      ${exp.amount.toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-right text-gray-500 text-xs">
                      {new Date(exp.date).toLocaleDateString()}
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
