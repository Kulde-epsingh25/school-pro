"use client";

import React, { useState, useEffect } from "react";
import { CreditCard, DollarSign, Clock, Download, AlertCircle, RefreshCw } from "lucide-react";
import { useSchoolStore } from "@/store/schoolStore";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { PaymentModal } from "@/components/finance/PaymentModal";

interface FeePayment {
  id: string;
  amount: number;
  date?: string;
  method?: string;
}

interface FeeScholarship {
  id: string;
  amount: number;
}

interface OutstandingFee {
  id: string;
  title: string;
  type: string;
  amount: number;
  dueDate: string;
  student?: {
    user?: {
      firstName?: string;
      lastName?: string;
    };
  };
  payments?: FeePayment[];
  scholarship?: FeeScholarship;
}

export default function FeesPage() {
  const { school } = useSchoolStore();
  const [outstandingFees, setOutstandingFees] = useState<OutstandingFee[]>([]);
  const [selectedFee, setSelectedFee] = useState<OutstandingFee | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (school?.id) {
      fetchOutstandingFees();
    }
  }, [school?.id]);

  const fetchOutstandingFees = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get<OutstandingFee[]>(`/fees/outstanding?tenantId=${school?.id}`);
      if (res.ok && res.data) {
        setOutstandingFees(Array.isArray(res.data) ? res.data : []);
      } else {
        throw new Error(res.error || "Unable to fetch outstanding fee ledger");
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to load tuition fee ledger.");
      setOutstandingFees([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateRemaining = (fee: OutstandingFee) => {
    const totalPaid = fee.payments?.reduce((acc: number, p: FeePayment) => acc + p.amount, 0) || 0;
    const concession = fee.scholarship?.amount || 0;
    return fee.amount - concession - totalPaid;
  };

  const handlePaymentSubmit = async (data: { amount: number; method: string; reference: string }) => {
    if (!selectedFee) return;
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

  const exportCsv = () => {
    const headers = ["Student Name", "Fee Title", "Fee Type", "Due Date", "Total Amount", "Remaining"];
    const csvContent = [
      headers.join(","),
      ...outstandingFees.map(fee => [
        `"${fee.student?.user?.firstName || ''} ${fee.student?.user?.lastName || ''}"`,
        `"${fee.title}"`,
        `"${fee.type}"`,
        `"${new Date(fee.dueDate).toLocaleDateString()}"`,
        `"${fee.amount.toFixed(2)}"`,
        `"${calculateRemaining(fee).toFixed(2)}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `fee_ledger_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Aggregated Stats
  const totalOutstanding = outstandingFees.reduce((acc, fee) => acc + calculateRemaining(fee), 0);

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Fee Management</h1>
          <p className="text-muted-foreground mt-2">Track outstanding balances and record payments.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
            <div>
              <p className="text-sm font-semibold text-destructive">Billing System Connection Issue</p>
              <p className="text-xs text-muted-foreground">{error}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={fetchOutstandingFees} className="gap-2 h-8 text-xs">
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </Button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <div className="bg-card p-5 rounded-xl border shadow-xs flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium">Total Outstanding</p>
            <h3 className="text-2xl font-bold text-destructive mt-1">${totalOutstanding.toFixed(2)}</h3>
          </div>
          <div className="p-3 bg-destructive/10 text-destructive rounded-xl"><DollarSign className="w-6 h-6" /></div>
        </div>
        <div className="bg-card p-5 rounded-xl border shadow-xs flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium">Defaulters</p>
            <h3 className="text-2xl font-bold text-foreground mt-1">{outstandingFees.length}</h3>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl"><Clock className="w-6 h-6" /></div>
        </div>
        <div 
          onClick={exportCsv} 
          className="bg-card p-5 rounded-xl border shadow-xs flex items-center justify-between cursor-pointer hover:bg-muted/40 transition-colors"
        >
          <div>
            <p className="text-sm text-muted-foreground font-medium">Generate Report</p>
            <h3 className="text-base font-semibold text-primary mt-1">Export CSV</h3>
          </div>
          <div className="p-3 bg-primary/10 text-primary rounded-xl"><Download className="w-6 h-6" /></div>
        </div>
      </div>

      {/* Outstanding Fees Table */}
      <div className="bg-card rounded-xl border shadow-xs overflow-hidden">
        <div className="p-4 border-b font-semibold bg-muted/20 text-foreground">Outstanding Fees (Admin View)</div>
        <table className="w-full text-sm text-left">
          <thead className="bg-card text-muted-foreground text-xs uppercase tracking-wider border-b">
            <tr>
              <th className="px-6 py-3.5">Student</th>
              <th className="px-6 py-3.5">Fee Type & Title</th>
              <th className="px-6 py-3.5">Due Date</th>
              <th className="px-6 py-3.5 text-right">Total Amount</th>
              <th className="px-6 py-3.5 text-right">Remaining</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {outstandingFees.map(fee => {
              const remaining = calculateRemaining(fee);
              return (
                <tr key={fee.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">
                    {fee.student?.user?.firstName || "Student"} {fee.student?.user?.lastName || ""}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-foreground">{fee.title}</div>
                    <div className="text-xs text-muted-foreground">{fee.type}</div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">
                    {new Date(fee.dueDate).toLocaleDateString()}
                    {new Date(fee.dueDate) < new Date() && (
                      <span className="ml-2 text-[10px] bg-destructive/10 text-destructive px-1.5 py-0.5 rounded font-bold">OVERDUE</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right text-muted-foreground">
                    ${fee.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-destructive">
                    ${remaining.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button size="sm" onClick={() => setSelectedFee(fee)} className="h-8 text-xs">
                      <CreditCard className="w-3.5 h-3.5 mr-1.5" /> Pay
                    </Button>
                  </td>
                </tr>
              );
            })}
            {outstandingFees.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-muted-foreground">No outstanding fees found. All student balances are cleared.</td>
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
