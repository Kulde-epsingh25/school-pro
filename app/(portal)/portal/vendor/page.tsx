"use client";

import React, { useState } from "react";
import { 
    Truck, 
    UploadCloud, 
    FileText, 
    CheckCircle2, 
    Clock, 
    Search, 
    AlertCircle,
    Building2
} from "lucide-react";

interface VendorPO {
    id: string;
    poNumber: string;
    schoolName: string;
    items: string;
    totalAmount: number;
    deliveryDeadline: string;
    status: "Pending Delivery" | "Delivered" | "Invoice Submitted" | "Paid";
}

const VENDOR_POS: VendorPO[] = [
    {
        id: "1",
        poNumber: "PO-2026-089",
        schoolName: "St. Xavier's International School",
        items: "24x Chemistry Laboratory Glassware Kits",
        totalAmount: 4800,
        deliveryDeadline: "2026-08-25",
        status: "Pending Delivery"
    },
    {
        id: "2",
        poNumber: "PO-2026-074",
        schoolName: "St. Xavier's International School",
        items: "50x Ergonomic Classroom Chairs",
        totalAmount: 6200,
        deliveryDeadline: "2026-08-01",
        status: "Invoice Submitted"
    },
    {
        id: "3",
        poNumber: "PO-2026-052",
        schoolName: "St. Xavier's International School",
        items: "Annual Maintenance Contract - Generator",
        totalAmount: 1800,
        deliveryDeadline: "2026-07-10",
        status: "Paid"
    }
];

export default function VendorPortalPage() {
    const [orders, setOrders] = useState<VendorPO[]>(VENDOR_POS);

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <Truck className="h-8 w-8 text-indigo-600" />
                        Vendor & Contractor Portal
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Track school-issued purchase orders, confirm deliveries, and submit tax invoices for fast disbursement.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition shadow-sm">
                        <UploadCloud className="h-4 w-4" />
                        Submit New Invoice
                    </button>
                </div>
            </div>

            {/* Orders List */}
            <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-lg text-foreground">Assigned Purchase Orders</h3>
                
                <div className="space-y-3">
                    {orders.map(o => (
                        <div key={o.id} className="border rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-indigo-300 transition">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-foreground">{o.poNumber}</span>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                        o.status === "Paid"
                                            ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300"
                                            : o.status === "Invoice Submitted"
                                            ? "bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300"
                                            : "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300"
                                    }`}>
                                        {o.status}
                                    </span>
                                </div>
                                <div className="text-sm font-medium text-foreground">{o.items}</div>
                                <div className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Building2 className="h-3.5 w-3.5" />
                                    {o.schoolName} • Due: {o.deliveryDeadline}
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <div className="text-xs text-muted-foreground">Amount Payable</div>
                                    <div className="text-lg font-extrabold text-foreground">${o.totalAmount.toLocaleString()}</div>
                                </div>
                                <button className="px-4 py-2 text-xs font-semibold bg-muted hover:bg-muted/80 rounded-lg text-foreground transition">
                                    View PO & Upload Bill
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
