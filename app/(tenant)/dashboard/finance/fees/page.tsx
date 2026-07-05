"use client";

import React, { useState, useEffect } from "react";
import { Plus, Download, Upload, Calendar as CalendarIcon, Filter, Eye, MoreHorizontal, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FinanceFeesPage() {
  const [fees, setFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFees = async () => {
    try {
      const res = await fetch("https://school-pro-api-6mxq-5qzq.onrender.com/finance/fees");
      const data = await res.json();
      setFees(data);
    } catch (error) {
      console.error("Failed to fetch fees:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  return (
    <div className="flex-1 space-y-6 bg-white min-h-[calc(100vh-64px)] p-8 relative">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-gray-100 pb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">School Fees for year 2025(2)</h1>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="text-gray-700 border-gray-200 font-medium">
            <Download className="w-4 h-4 mr-2 text-gray-500" />
            Export
          </Button>
          <Button variant="outline" className="text-gray-700 border-gray-200 font-medium">
            <Upload className="w-4 h-4 mr-2 text-gray-500" />
            Import
          </Button>
          <Link href="/dashboard/finance/fees/new">
            <Button className="bg-[#2563EB] hover:bg-blue-700 text-white font-medium shadow-sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Fee
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-2">
        <div className="w-full md:w-[300px]">
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full h-10 border border-gray-200 rounded-md px-3 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <div className="flex items-center border border-gray-200 rounded-md px-3 h-10 bg-white min-w-[240px]">
            <CalendarIcon className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-sm text-gray-600 font-medium">Jan 20, 2024 - Feb 09, 2024</span>
          </div>
          
          <Button variant="outline" className="text-gray-600 border-gray-200 font-medium whitespace-nowrap">
            Life time
            <span className="ml-2 text-gray-400">&gt;</span>
          </Button>
          
          <Button variant="outline" className="text-gray-600 border-gray-200 font-medium">
            <Filter className="w-4 h-4 mr-2 text-gray-500" />
            Filter
          </Button>
          
          <Button variant="outline" className="text-gray-600 border-gray-200 font-medium">
            <Eye className="w-4 h-4 mr-2 text-gray-500" />
            View
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <div className="border border-gray-100 rounded-xl overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 font-medium">
                <th className="py-4 px-6 w-10">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="py-4 px-6 font-semibold">Term</th>
                <th className="py-4 px-6 font-semibold">Class</th>
                <th className="py-4 px-6 font-semibold text-right">Total Amount</th>
                <th className="py-4 px-6 font-semibold text-center"></th>
              </tr>
            </thead>
            <tbody className="text-gray-900 font-medium">
              {loading ? (
                <tr><td colSpan={5} className="py-8 text-center text-gray-500">Loading fees...</td></tr>
              ) : fees.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-gray-500 italic">No fees found. Create one.</td></tr>
              ) : (
                fees.map((fee) => (
                  <tr key={fee.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-5 px-6">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </td>
                    <td className="py-5 px-6">
                      <span className="text-gray-900 font-medium">{fee.term?.name || "Unknown"}</span>
                    </td>
                    <td className="py-5 px-6">
                      <span className="text-gray-900 font-bold">{fee.class?.name || "Unknown"}</span>
                    </td>
                    <td className="py-5 px-6 text-right">
                      <span className="text-gray-900 font-bold">${(fee.totalAmount || 0).toFixed(2)}</span>
                    </td>
                    <td className="py-5 px-6 text-center">
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
        
        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white text-sm text-gray-500 font-medium">
          <div>0 of {fees.length} row(s) selected.</div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span>Rows per page</span>
              <select className="border border-gray-200 rounded px-2 py-1 text-gray-700 outline-none focus:border-blue-500">
                <option>10</option>
                <option>20</option>
                <option>50</option>
              </select>
            </div>
            <div>Page 1 of 1</div>
            <div className="flex gap-1">
              <Button variant="outline" size="icon" className="h-8 w-8 text-gray-400" disabled><ChevronsLeft className="w-4 h-4" /></Button>
              <Button variant="outline" size="icon" className="h-8 w-8 text-gray-400" disabled><ChevronLeft className="w-4 h-4" /></Button>
              <Button variant="outline" size="icon" className="h-8 w-8 text-gray-400" disabled><ChevronRight className="w-4 h-4" /></Button>
              <Button variant="outline" size="icon" className="h-8 w-8 text-gray-400" disabled><ChevronsRight className="w-4 h-4" /></Button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
