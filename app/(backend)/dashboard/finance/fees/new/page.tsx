"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

interface FeeItem {
  id: string;
  title: string;
  amount: string;
}

export default function NewSchoolFeePage() {
  const router = useRouter();
  const [feeItems, setFeeItems] = useState<FeeItem[]>([
    { id: "1", title: "", amount: "" }
  ]);
  const [total, setTotal] = useState(0);

  const [classes, setClasses] = useState<any[]>([]);
  const [terms, setTerms] = useState<any[]>([]);

  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedTermId, setSelectedTermId] = useState("");

  useEffect(() => {
    // Fetch terms
    fetch("https://school-pro-api-6mxq.onrender.com/academics/terms")
      .then(res => res.json())
      .then(data => {
        setTerms(data);
        if (data.length > 0) setSelectedTermId(data[0].id);
      })
      .catch(console.error);
    
    // TODO: We need a getClasses endpoint, but for now we'll hardcode or let it fail gracefully
    // fetch("https://school-pro-api-6mxq.onrender.com/academics/classes")
  }, []);

  useEffect(() => {
    const sum = feeItems.reduce((acc, item) => acc + (parseFloat(item.amount) || 0), 0);
    setTotal(sum);
  }, [feeItems]);

  const handleAddFee = () => {
    setFeeItems([
      ...feeItems,
      { id: Date.now().toString(), title: "", amount: "" }
    ]);
  };

  const handleRemoveFee = (id: string) => {
    setFeeItems(feeItems.filter(item => item.id !== id));
  };

  const handleFeeChange = (id: string, field: 'title' | 'amount', value: string) => {
    setFeeItems(feeItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleSave = async () => {
    if (!selectedClassId || !selectedTermId) {
      alert("Please select a Class and Term (Make sure they exist in the DB)");
      return;
    }

    try {
      await fetch("https://school-pro-api-6mxq.onrender.com/finance/fees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classId: selectedClassId,
          termId: selectedTermId,
          items: feeItems.filter(i => i.title && i.amount)
        })
      });
      router.push("/dashboard/finance/fees");
    } catch (error) {
      console.error("Failed to save fee", error);
    }
  };

  return (
    <div className="flex-1 space-y-6 bg-white min-h-[calc(100vh-64px)] p-8">
      
      {/* Top Selectors */}
      <div className="flex flex-col sm:flex-row gap-8 mb-8">
        <div className="flex-1 max-w-[400px]">
          <label className="block text-sm font-bold text-gray-800 mb-2">Select Class (Mock ID for now)</label>
          <div className="flex items-center gap-2">
            <Input 
              placeholder="Paste a Class UUID here" 
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="flex-1 h-12 border-gray-200"
            />
          </div>
        </div>

        <div className="flex-1 max-w-[400px]">
          <label className="block text-sm font-bold text-gray-800 mb-2">Select Term</label>
          <div className="flex items-center gap-2">
            <select 
              value={selectedTermId}
              onChange={(e) => setSelectedTermId(e.target.value)}
              className="flex-1 h-12 border border-gray-200 rounded-md px-4 font-medium text-gray-700 bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              {terms.map(t => (
                <option key={t.id} value={t.id}>{t.name} ({t.year})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Dynamic Form Area */}
      <div className="bg-gray-50/50 border border-gray-100 rounded-xl overflow-hidden">
        
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100 text-sm font-bold text-gray-600">
          <div className="col-span-6">Fee Title</div>
          <div className="col-span-5">Amount</div>
          <div className="col-span-1 text-center">Actions</div>
        </div>

        {/* Dynamic Rows */}
        <div className="p-6 space-y-4">
          {feeItems.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-6">
                <Input 
                  placeholder="e.g. Functional Fees"
                  value={item.title}
                  onChange={(e) => handleFeeChange(item.id, 'title', e.target.value)}
                  className="h-12 bg-white border-gray-200 font-medium text-gray-700"
                />
              </div>
              <div className="col-span-5">
                <Input 
                  type="number"
                  placeholder="0.00"
                  value={item.amount}
                  onChange={(e) => handleFeeChange(item.id, 'amount', e.target.value)}
                  className="h-12 bg-white border-gray-200 font-medium text-gray-700 focus-visible:ring-blue-500"
                />
              </div>
              <div className="col-span-1 flex justify-center">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                  onClick={() => handleRemoveFee(item.id)}
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Form Footer (Add Button & Total) */}
        <div className="px-6 py-6 border-t border-gray-100 flex justify-between items-center bg-gray-50/30">
          <Button 
            variant="outline" 
            className="border-gray-200 text-gray-700 font-bold bg-white"
            onClick={handleAddFee}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Fee
          </Button>

          <div className="text-xl text-gray-900">
            <span className="font-bold mr-2">Total:</span> 
            <span className="font-bold">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Main Page Footer */}
      <div className="flex justify-between items-center pt-8">
        <Button variant="outline" className="h-12 px-8 font-bold text-gray-600 border-gray-200" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button 
          className="h-12 px-8 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-base shadow-sm"
          onClick={handleSave}
        >
          <Plus className="w-5 h-5 mr-2" />
          Save School Fees
        </Button>
      </div>

    </div>
  );
}
