"use client";

import React, { useState } from "react";
import { 
    Package, 
    Truck, 
    Plus, 
    Search, 
    FileCheck2, 
    Clock, 
    DollarSign,
    Building
} from "lucide-react";

interface PurchaseOrderItem {
    id: string;
    poNumber: string;
    vendorName: string;
    category: string;
    itemCount: number;
    totalAmount: number;
    issuedDate: string;
    status: "Draft" | "Issued" | "Partially Delivered" | "Fulfilled";
}

const INITIAL_POS: PurchaseOrderItem[] = [
    { id: "1", poNumber: "PO-2026-089", vendorName: "LabTech Scientific Supplies", category: "Science Equipment", itemCount: 24, totalAmount: 4800, issuedDate: "2026-08-11", status: "Issued" },
    { id: "2", poNumber: "PO-2026-088", vendorName: "Apex School Furnishings", category: "Furniture", itemCount: 60, totalAmount: 12500, issuedDate: "2026-08-04", status: "Partially Delivered" },
    { id: "3", poNumber: "PO-2026-087", vendorName: "Dell Education Direct", category: "IT Hardware", itemCount: 15, totalAmount: 9200, issuedDate: "2026-07-29", status: "Fulfilled" },
    { id: "4", poNumber: "PO-2026-086", vendorName: "Oxford University Press", category: "Library Books", itemCount: 120, totalAmount: 3100, issuedDate: "2026-07-15", status: "Fulfilled" }
];

export default function ProcurementPage() {
    const [pos, setPos] = useState<PurchaseOrderItem[]>(INITIAL_POS);
    const [search, setSearch] = useState("");

    const filtered = pos.filter(p => 
        p.poNumber.toLowerCase().includes(search.toLowerCase()) || 
        p.vendorName.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <Package className="h-8 w-8 text-blue-600" />
                        Procurement & Purchase Orders (PO)
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage vendor requisitions, purchase orders, approval cycles, and delivery confirmations.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition shadow-sm">
                        <Plus className="h-4 w-4" />
                        Generate Purchase Order
                    </button>
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b flex items-center gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by PO number or vendor..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-background text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase border-b">
                            <tr>
                                <th className="px-6 py-3">PO Number</th>
                                <th className="px-6 py-3">Vendor</th>
                                <th className="px-6 py-3">Category</th>
                                <th className="px-6 py-3">Issued Date</th>
                                <th className="px-6 py-3">Total Amount</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filtered.map(p => (
                                <tr key={p.id} className="hover:bg-muted/30 transition">
                                    <td className="px-6 py-4 font-bold text-foreground">
                                        {p.poNumber}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-foreground">{p.vendorName}</div>
                                        <div className="text-xs text-muted-foreground">{p.itemCount} items ordered</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs bg-muted px-2.5 py-1 rounded-md font-medium text-foreground">
                                            {p.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-muted-foreground">
                                        {p.issuedDate}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-foreground">
                                        ${p.totalAmount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                            p.status === "Fulfilled"
                                                ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300"
                                                : p.status === "Partially Delivered"
                                                ? "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300"
                                                : "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300"
                                        }`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-xs text-primary hover:underline font-medium">
                                            View PO Details
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
