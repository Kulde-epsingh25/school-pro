"use client";

import React, { useState } from "react";
import { 
    RefreshCw, 
    CheckCircle2, 
    AlertCircle, 
    Search, 
    ArrowRightLeft, 
    CreditCard,
    DollarSign,
    Zap
} from "lucide-react";

interface WebhookTransaction {
    id: string;
    gatewayId: string;
    studentName: string;
    amount: number;
    channel: "Stripe" | "Razorpay" | "Bank Wire";
    timestamp: string;
    invoiceMatched: boolean;
    invoiceNo: string;
    reconciliationStatus: "Matched & Cleared" | "Unreconciled Exception";
}

const TRANSACTIONS: WebhookTransaction[] = [
    {
        id: "1",
        gatewayId: "ch_3N8vKjLkd9028",
        studentName: "Ethan Williams",
        amount: 3200,
        channel: "Stripe",
        timestamp: "2026-08-19 09:40",
        invoiceMatched: true,
        invoiceNo: "INV-2026-0812",
        reconciliationStatus: "Matched & Cleared"
    },
    {
        id: "2",
        gatewayId: "pay_Mz9281a0Kl99",
        studentName: "Zoya Khan",
        amount: 4500,
        channel: "Razorpay",
        timestamp: "2026-08-19 08:15",
        invoiceMatched: true,
        invoiceNo: "INV-2026-0811",
        reconciliationStatus: "Matched & Cleared"
    },
    {
        id: "3",
        gatewayId: "TXN-WIRE-90182",
        studentName: "Direct Deposit (No Ref)",
        amount: 1800,
        channel: "Bank Wire",
        timestamp: "2026-08-18 16:30",
        invoiceMatched: false,
        invoiceNo: "Unassigned",
        reconciliationStatus: "Unreconciled Exception"
    }
];

export default function ReconciliationPage() {
    const [txns, setTxns] = useState<WebhookTransaction[]>(TRANSACTIONS);

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <RefreshCw className="h-8 w-8 text-primary" />
                        Payment Gateway Reconciliation
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Automated ledger matching for Stripe/Razorpay webhook events against student fee invoices.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition shadow-sm">
                        <Zap className="h-4 w-4" />
                        Run Auto-Reconcile Job
                    </button>
                </div>
            </div>

            {/* Reconciliation Table */}
            <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase border-b">
                            <tr>
                                <th className="px-6 py-3">Gateway Transaction ID</th>
                                <th className="px-6 py-3">Payer / Student</th>
                                <th className="px-6 py-3">Channel</th>
                                <th className="px-6 py-3">Amount</th>
                                <th className="px-6 py-3">Matched Invoice</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {txns.map(t => (
                                <tr key={t.id} className="hover:bg-muted/30 transition">
                                    <td className="px-6 py-4 font-mono text-xs font-bold text-foreground">
                                        {t.gatewayId}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-foreground">
                                        {t.studentName}
                                        <div className="text-xs text-muted-foreground">{t.timestamp}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-0.5 rounded-md text-xs bg-muted font-medium text-foreground">
                                            {t.channel}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-foreground">
                                        ${t.amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                                        {t.invoiceNo}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                            t.reconciliationStatus === "Matched & Cleared"
                                                ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300"
                                                : "bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 animate-pulse"
                                        }`}>
                                            {t.reconciliationStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-xs text-primary hover:underline font-semibold">
                                            Audit Trace
                                        </button>
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
