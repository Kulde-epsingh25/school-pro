"use client";

import React, { useState, useEffect } from "react";
import { CreditCard, DollarSign, Clock, Download, Plus } from "lucide-react";
import { useSchoolStore } from "@/store/schoolStore";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { PaymentModal } from "@/components/finance/PaymentModal";

export default function FeesPage() {
  const { school } = useSchoolStore();
  const [outstandingFees, setOutstandingFees] = useState<any[]>([]);
  const [selectedFee, setSelectedFee] = useState<any>(null);
  
  useEffect(() => {
    if (school?.id) {
      fetchOutstandingFees();
    }
  }, [school?.id]);

  const fetchOutstandingFees = async () => {
    try {
      const res = await apiClient.get<any[]>(`/fees/outstanding?tenantId=${school?.id}`);
      if (res.ok && res.data) {
        setOutstandingFees(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const calculateRemaining = (fee: any) => {
    const totalPaid = fee.payments?.reduce((acc: number, p: any) => acc + p.amount, 0) || 0;
    const concession = fee.scholarship?.amount || 0;
    return fee.amount - concession - totalPaid;
  };

  const handlePaymentSubmit = async (data: { amount: number; method: string; reference: string }) => {
    try {
      await apiClient.post(`/fees/payment?tenantId=${school?.id}`, {
        feeId: selectedFee.id,
        ...data
      });
      setSelectedFee(null);
      fetchOutstandingFees();
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  // Aggregated Stats
  const totalOutstanding = outstandingFees.reduce((acc, fee) => acc + calculateRemaining(fee), 0);

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Fee Management</h1>
          <p className="text-gray-500 mt-2">Track outstanding balances and record payments.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <div className="bg-white p-4 rounded-xl border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Outstanding</p>
            <h3 className="text-2xl font-bold text-red-600">${totalOutstanding.toFixed(2)}</h3>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-lg"><DollarSign className="w-6 h-6" /></div>
        </div>
        <div className="bg-white p-4 rounded-xl border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Defaulters</p>
            <h3 className="text-2xl font-bold">{outstandingFees.length}</h3>
          </div>
          <div className="p-3 bg-orange-50 text-orange-600 rounded-lg"><Clock className="w-6 h-6" /></div>
        </div>
        <div className="bg-white p-4 rounded-xl border shadow-sm flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
          <div>
            <p className="text-sm text-gray-500 font-medium">Generate Report</p>
            <h3 className="text-lg font-semibold text-blue-600 mt-1">Export CSV</h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Download className="w-6 h-6" /></div>
        </div>
      </div>

      {/* Outstanding Fees Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b font-semibold bg-gray-50">Outstanding Fees (Admin View)</div>
        <table className="w-full text-sm text-left">
          <thead className="bg-white text-gray-700 border-b">
            <tr>
              <th className="px-6 py-3">Student</th>
              <th className="px-6 py-3">Fee Type & Title</th>
              <th className="px-6 py-3">Due Date</th>
              <th className="px-6 py-3 text-right">Total Amount</th>
              <th className="px-6 py-3 text-right">Remaining</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {outstandingFees.map(fee => {
              const remaining = calculateRemaining(fee);
              return (
                <tr key={fee.id} className="border-t bg-white">
                  <td className="px-6 py-4 font-medium">
                    {fee.student?.user?.firstName} {fee.student?.user?.lastName}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold">{fee.title}</div>
                    <div className="text-xs text-gray-500">{fee.type}</div>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(fee.dueDate).toLocaleDateString()}
                    {new Date(fee.dueDate) < new Date() && (
                      <span className="ml-2 text-xs text-red-600 font-bold">OVERDUE</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-500">
                    ${fee.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-red-600">
                    ${remaining.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button size="sm" onClick={() => setSelectedFee(fee)} className="bg-blue-600 hover:bg-blue-700">
                      <CreditCard className="w-4 h-4 mr-2" /> Pay
                    </Button>
                  </td>
                </tr>
              );
            })}
            {outstandingFees.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">No outstanding fees found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedFee && (
        <PaymentModal 
          fee={selectedFee} 
          remainingAmount={calculateRemaining(selectedFee)}
          onClose={() => setSelectedFee(null)}
          onSubmit={handlePaymentSubmit}
        />
      )}
    </div>
  );
}
