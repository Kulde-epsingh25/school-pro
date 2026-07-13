"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useSchoolStore } from "@/store/schoolStore";
import { useAuthStore } from "@/store/authStore";
import { Plus, Download, MoreHorizontal, FileText, Trash2 } from "lucide-react";
import { TableSkeleton } from "@/components/ui/loading-skeleton";

type Class = { id: string; name: string };
type Term = { id: string; name: string };
type FeeItem = { id?: string; title: string; amount: number };
type Fee = { id: string; class: Class; term: Term; totalAmount: number; items: FeeItem[] };

export default function FinanceFeesPage() {
  const school = useSchoolStore((state) => state.school);
  const user = useAuthStore((state) => state.user);
  
  const [fees, setFees] = useState<Fee[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  
  const [classId, setClassId] = useState("");
  const [termId, setTermId] = useState("");
  const [items, setItems] = useState<FeeItem[]>([{ title: "Tuition Fee", amount: 0 }]);

  useEffect(() => {
    if (school?.id) {
      fetchFees();
      fetchClasses();
      fetchTerms();
    }
  }, [school?.id]);

  const fetchClasses = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/classes?tenantId=${school?.id}`, {
        headers: { "x-user-id": user?.id || "" }
      });
      if (res.ok) setClasses(await res.json());
    } catch (error) {
      console.error(error);
    }
  };
  
  const fetchTerms = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/academics/terms?tenantId=${school?.id}`, {
        headers: { "x-user-id": user?.id || "" }
      });
      if (res.ok) setTerms(await res.json());
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFees = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/finance/fees?tenantId=${school?.id}`, {
        headers: { "x-user-id": user?.id || "" }
      });
      if (res.ok) setFees(await res.json());
    } catch (error) {
      toast.error("Failed to load fees");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classId || !termId) {
      toast.error("Please select a Class and Term");
      return;
    }
    
    if (items.some(i => !i.title || i.amount <= 0)) {
      toast.error("All fee items must have a title and amount > 0");
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/finance/fees`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-user-id": user?.id || "" 
        },
        body: JSON.stringify({
          tenantId: school?.id,
          classId,
          termId,
          items
        })
      });

      if (res.ok) {
        toast.success("Fee structure created successfully!");
        setShowCreate(false);
        setClassId("");
        setTermId("");
        setItems([{ title: "Tuition Fee", amount: 0 }]);
        fetchFees();
      } else {
        const data = await res.json().catch(() => null);
        toast.error(data?.error || "Failed to create fee structure");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const updateItem = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Fee Structures</h2>
          <p className="text-sm text-gray-500 mt-1">Manage school fees by class and term</p>
        </div>
        <div className="flex gap-3 mt-4 sm:mt-0">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          <Button 
            onClick={() => setShowCreate(!showCreate)} 
            className="bg-[#4438CA] hover:bg-[#3730A3] text-white"
          >
            {showCreate ? "Cancel" : <><Plus className="w-4 h-4 mr-2" /> Add Fee Structure</>}
          </Button>
        </div>
      </div>

      {showCreate && (
        <div className="bg-white rounded-xl shadow-sm border border-blue-600/20 ring-1 ring-blue-600/10 p-6 mb-8 animate-in fade-in slide-in-from-top-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">New Fee Structure</h3>
          <form onSubmit={handleCreate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Class</label>
                <select 
                  value={classId} 
                  onChange={e => setClassId(e.target.value)}
                  className="flex h-11 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                  required
                >
                  <option value="">Select Class</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Term</label>
                <select 
                  value={termId} 
                  onChange={e => setTermId(e.target.value)}
                  className="flex h-11 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                  required
                >
                  <option value="">Select Term</option>
                  {terms.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Fee Items</label>
              <div className="space-y-3">
                {items.map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-center">
                    <Input 
                      value={item.title}
                      onChange={e => updateItem(idx, "title", e.target.value)}
                      placeholder="e.g. Tuition, Library"
                      className="flex-1"
                    />
                    <Input 
                      type="number"
                      value={item.amount || ""}
                      onChange={e => updateItem(idx, "amount", parseFloat(e.target.value))}
                      placeholder="Amount ($)"
                      className="w-32"
                      min="0"
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      className="text-red-500 px-2"
                      onClick={() => items.length > 1 && setItems(items.filter((_, i) => i !== idx))}
                      disabled={items.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="mt-3 text-blue-600 border-blue-200 hover:bg-blue-50"
                onClick={() => setItems([...items, { title: "", amount: 0 }])}
              >
                <Plus className="w-4 h-4 mr-1" /> Add Line Item
              </Button>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <div className="text-lg font-bold text-gray-900">
                Total: ${items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0).toFixed(2)}
              </div>
              <Button type="submit" disabled={loading} className="bg-[#4438CA] hover:bg-[#3730A3] text-white px-8">
                {loading ? "Saving..." : "Save Fee Structure"}
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
                <th className="py-4 px-6 font-semibold">Class</th>
                <th className="py-4 px-6 font-semibold">Term</th>
                <th className="py-4 px-6 font-semibold">Line Items</th>
                <th className="py-4 px-6 font-semibold text-right">Total Amount</th>
                <th className="py-4 px-6 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-900">
              {loading && fees.length === 0 ? (
                <tr><td colSpan={5} className="py-8"><TableSkeleton columns={5} /></td></tr>
              ) : fees.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-gray-500 italic border-t border-dashed">No fee structures found.</td></tr>
              ) : (
                fees.map((fee) => (
                  <tr key={fee.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-bold">{fee.class?.name || "N/A"}</td>
                    <td className="py-4 px-6">{fee.term?.name || "N/A"}</td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1 text-xs text-gray-500">
                        {fee.items?.map((item: any, idx: number) => (
                          <div key={idx}>{item.title}: ${item.amount.toFixed(2)}</div>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right font-bold text-blue-700">
                      ${(fee.totalAmount || 0).toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-700">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
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
