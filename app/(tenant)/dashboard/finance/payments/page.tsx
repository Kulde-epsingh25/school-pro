"use client";

import React, { useState, useEffect } from "react";
import { Plus, Download, Upload, Calendar as CalendarIcon, Filter, Eye, MoreHorizontal, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FinancePaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/finance/payments`);
      const data = await res.json();
      setPayments(data);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="flex-1 space-y-6 bg-white min-h-screen p-6 relative">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-gray-100 pb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">School Fees Payments</h1>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="text-gray-700 border-gray-200 font-medium">
            <Download className="w-4 h-4 mr-2 text-gray-500" />
            Export
          </Button>
          <Button variant="outline" className="text-gray-700 border-gray-200 font-medium">
            <Upload className="w-4 h-4 mr-2 text-gray-500" />
            Import
          </Button>
          <Button className="bg-[#2563EB] hover:bg-blue-700 text-white font-medium shadow-sm">
            <Plus className="w-4 h-4 mr-2" />
            Add New Payment
          </Button>
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
                <th className="py-4 px-6 font-semibold">Student Name</th>
                <th className="py-4 px-6 font-semibold">Details</th>
                <th className="py-4 px-6 font-semibold">Class</th>
                <th className="py-4 px-6 font-semibold text-center">View</th>
                <th className="py-4 px-6 font-semibold text-center"></th>
              </tr>
            </thead>
            <tbody className="text-gray-900 font-medium">
              {loading ? (
                <tr><td colSpan={6} className="py-8 text-center text-gray-500">Loading payments...</td></tr>
              ) : payments.length === 0 ? (
                <tr><td colSpan={6} className="py-8 text-center text-gray-500 italic">No payments found.</td></tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-5 px-6">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex flex-col">
                        <span className="text-gray-900 font-medium">
                          {payment.student ? `${payment.student.firstName} ${payment.student.lastName}` : "Unknown Student"}
                        </span>
                        <span className="text-gray-400 text-xs font-semibold">{payment.studentId}</span>
                      </div>
                    </td>
                    <td className="py-5 px-6 max-w-md truncate">
                      <div className="flex flex-col gap-1">
                        <span className="text-gray-700 font-bold tracking-wide text-xs">{payment.prn}</span>
                        <div className="text-xs">
                          <span className="text-blue-600 font-bold">UGX {payment.amount}</span>
                          <span className="text-gray-500 font-semibold ml-2">( {payment.description || "Payment"} )</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex flex-col">
                        <span className="text-gray-900 font-bold">{payment.student?.class?.name || "Unknown"}</span>
                        <span className="text-gray-400 text-xs font-semibold">{new Date(payment.createdAt).toDateString()}</span>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <span className={`px-6 py-2 rounded-md text-xs font-bold ${
                        payment.status === "PENDING" ? "bg-[#2563EB] text-white" : "bg-emerald-100 text-emerald-700"
                      }`}>
                        {payment.status}
                      </span>
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
          <div>0 of {payments.length} row(s) selected.</div>
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
