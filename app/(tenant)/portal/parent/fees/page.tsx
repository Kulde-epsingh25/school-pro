"use client";

import React, { useState } from "react";
import { CreditCard, Download, CheckCircle2, Clock, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChildFee {
  id: string;
  childName: string;
  grade: string;
  term: string;
  description: string;
  amount: number;
  dueDate: string;
  status: "Paid" | "Pending" | "Overdue";
  invoiceNumber: string;
}

const FAMILY_FEES: ChildFee[] = [
  {
    id: "f-1",
    childName: "Alex Vance",
    grade: "Grade 11 - Science Honors",
    term: "Fall Semester 2026",
    description: "Tuition, Science Lab Kit & Technology Access",
    amount: 2450,
    dueDate: "2026-08-15",
    status: "Paid",
    invoiceNumber: "INV-2026-00892"
  },
  {
    id: "f-2",
    childName: "Emma Vance",
    grade: "Grade 7 - Blue Section",
    term: "Fall Semester 2026",
    description: "Tuition, Arts & Crafts Workshop Dues",
    amount: 1950,
    dueDate: "2026-08-15",
    status: "Paid",
    invoiceNumber: "INV-2026-00893"
  },
  {
    id: "f-3",
    childName: "Alex Vance",
    grade: "Grade 11 - Science Honors",
    term: "Spring Semester 2027",
    description: "Spring Advance Tuition Installment",
    amount: 2450,
    dueDate: "2027-01-10",
    status: "Pending",
    invoiceNumber: "INV-2027-00104"
  }
];

export default function ParentFeesPage() {
  const [fees] = useState<ChildFee[]>(FAMILY_FEES);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <CreditCard className="h-8 w-8 text-emerald-600" />
            Family Tuition & Fee Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Consolidated invoices, online card payment gateway, and official receipt downloads for all enrolled children.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border rounded-2xl p-5 shadow-sm">
          <div className="text-xs text-muted-foreground uppercase font-semibold">Total Paid (2026-2027)</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">$4,400.00</div>
        </div>
        <div className="bg-card border rounded-2xl p-5 shadow-sm">
          <div className="text-xs text-muted-foreground uppercase font-semibold">Upcoming Due</div>
          <div className="text-2xl font-bold text-foreground mt-1">$2,450.00</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Alex Vance • Due Jan 10, 2027</div>
        </div>
        <div className="bg-card border rounded-2xl p-5 shadow-sm">
          <div className="text-xs text-muted-foreground uppercase font-semibold">Family Account Status</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">Current & Verified</div>
        </div>
      </div>

      <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-bold text-base text-foreground">Tuition Fee Statements by Child</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase border-b">
              <tr>
                <th className="px-6 py-3">Student</th>
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
                  <td className="px-6 py-4">
                    <div className="font-bold text-foreground">{f.childName}</div>
                    <div className="text-xs text-muted-foreground">{f.grade}</div>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-xs text-emerald-600">
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
                      <Button size="sm" className="gap-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white">
                        Pay Fee <ArrowRight className="h-3.5 w-3.5" />
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
