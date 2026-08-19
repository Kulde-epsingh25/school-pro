"use client";

import React, { useState } from "react";
import { CreditCard, Download, CheckCircle2, Clock, FileText, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeeItem {
  id: string;
  term: string;
  description: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: "Paid" | "Pending" | "Overdue";
  invoiceNumber: string;
}

const STUDENT_FEES: FeeItem[] = [
  {
    id: "1",
    term: "Fall Semester 2026",
    description: "Tuition Fee, Science Laboratory & Technology Access",
    amount: 2450,
    dueDate: "2026-08-15",
    paidDate: "2026-08-10",
    status: "Paid",
    invoiceNumber: "INV-2026-00892"
  },
  {
    id: "2",
    term: "Annual 2026-2027",
    description: "Campus Library & Athletic Association Dues",
    amount: 350,
    dueDate: "2026-08-20",
    paidDate: "2026-08-14",
    status: "Paid",
    invoiceNumber: "INV-2026-00910"
  },
  {
    id: "3",
    term: "Spring Semester 2027",
    description: "Advance Tuition Fee Installment",
    amount: 2450,
    dueDate: "2027-01-10",
    status: "Pending",
    invoiceNumber: "INV-2027-00104"
  }
];

export default function MyFeesPage() {
  const [fees, setFees] = useState<FeeItem[]>(STUDENT_FEES);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <CreditCard className="h-8 w-8 text-indigo-600" />
            My Tuition & Fee Ledger
          </h1>
          <p className="text-muted-foreground mt-1">
            Review your academic billing history, active payment receipts, and semester invoices.
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border rounded-2xl p-5 shadow-sm">
          <div className="text-xs text-muted-foreground uppercase font-semibold">Total Paid (This Year)</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">$2,800.00</div>
        </div>
        <div className="bg-card border rounded-2xl p-5 shadow-sm">
          <div className="text-xs text-muted-foreground uppercase font-semibold">Upcoming Due</div>
          <div className="text-2xl font-bold text-foreground mt-1">$2,450.00</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Due Jan 10, 2027</div>
        </div>
        <div className="bg-card border rounded-2xl p-5 shadow-sm">
          <div className="text-xs text-muted-foreground uppercase font-semibold">Current Account Standing</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">Good Standing</div>
        </div>
      </div>

      {/* Invoice Ledger Table */}
      <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-bold text-base text-foreground">Tuition & Fee Statements</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase border-b">
              <tr>
                <th className="px-6 py-3">Invoice #</th>
                <th className="px-6 py-3">Term & Description</th>
                <th className="px-6 py-3">Due Date</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {fees.map(f => (
                <tr key={f.id} className="hover:bg-muted/30 transition">
                  <td className="px-6 py-4 font-mono font-bold text-xs text-indigo-600">
                    {f.invoiceNumber}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-foreground">{f.term}</div>
                    <div className="text-xs text-muted-foreground">{f.description}</div>
                  </td>
                  <td className="px-6 py-4 text-xs text-muted-foreground font-mono">
                    {f.dueDate}
                  </td>
                  <td className="px-6 py-4 font-bold text-foreground">
                    ${f.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      f.status === "Paid"
                        ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300"
                        : "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300"
                    }`}>
                      {f.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {f.status === "Paid" ? (
                      <Button variant="outline" size="sm" className="gap-1 text-xs">
                        <Download className="h-3.5 w-3.5" /> Receipt
                      </Button>
                    ) : (
                      <Button size="sm" className="gap-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white">
                        Pay Online <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
