"use client";

import React, { useState } from "react";
import { 
    Boxes, 
    Plus, 
    Search, 
    Tag, 
    TrendingDown, 
    Building2, 
    Barcode, 
    Calendar 
} from "lucide-react";

interface AssetRecord {
    id: string;
    assetTag: string;
    name: string;
    category: "IT Equipment" | "Science Lab" | "Classroom Furniture" | "Sports Gear";
    purchasePrice: number;
    currentBookValue: number;
    location: string;
    annualDepreciationPct: number;
}

const ASSETS: AssetRecord[] = [
    {
        id: "1",
        assetTag: "AST-IT-0042",
        name: "Dell OptiPlex 7090 Desktop (Set of 20)",
        category: "IT Equipment",
        purchasePrice: 16000,
        currentBookValue: 11200,
        location: "Computer Lab 2",
        annualDepreciationPct: 20
    },
    {
        id: "2",
        assetTag: "AST-SCI-0118",
        name: "Olympus Binocular Microscope (x10)",
        category: "Science Lab",
        purchasePrice: 8500,
        currentBookValue: 6800,
        location: "Biology Laboratory",
        annualDepreciationPct: 10
    },
    {
        id: "3",
        assetTag: "AST-FUR-0301",
        name: "Solid Oak Library Reading Tables (x6)",
        category: "Classroom Furniture",
        purchasePrice: 4200,
        currentBookValue: 3780,
        location: "Central Library",
        annualDepreciationPct: 5
    }
];

export default function InventoryPage() {
    const [assets, setAssets] = useState<AssetRecord[]>(ASSETS);
    const [search, setSearch] = useState("");

    const totalValue = assets.reduce((sum, a) => sum + a.currentBookValue, 0);

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <Boxes className="h-8 w-8 text-primary" />
                        Fixed Assets & Inventory Tracking
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Barcode asset tagging, laboratory equipment inventory, and automated annual depreciation logs.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition shadow-sm">
                        <Plus className="h-4 w-4" />
                        Register New Asset
                    </button>
                </div>
            </div>

            {/* Total Book Value Metric */}
            <div className="bg-card border rounded-2xl p-5 flex items-center justify-between shadow-sm">
                <div>
                    <div className="text-xs text-muted-foreground uppercase font-semibold">Total Net Fixed Asset Valuation</div>
                    <div className="text-3xl font-extrabold text-foreground mt-1">${totalValue.toLocaleString()}</div>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                    <div>Depreciation Schedule: <strong className="text-foreground">Straight-Line</strong></div>
                    <div>Fiscal Audit: <strong className="text-emerald-600">Up to Date</strong></div>
                </div>
            </div>

            {/* Assets Table */}
            <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b">
                    <input
                        type="text"
                        placeholder="Search by asset tag or name..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full sm:w-72 px-4 py-2 bg-background text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase border-b">
                            <tr>
                                <th className="px-6 py-3">Asset Tag</th>
                                <th className="px-6 py-3">Item Description</th>
                                <th className="px-6 py-3">Category</th>
                                <th className="px-6 py-3">Location</th>
                                <th className="px-6 py-3">Purchase Cost</th>
                                <th className="px-6 py-3">Book Value</th>
                                <th className="px-6 py-3 text-right">Depreciation</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {assets.map(a => (
                                <tr key={a.id} className="hover:bg-muted/30 transition">
                                    <td className="px-6 py-4 font-mono font-bold text-xs text-primary">
                                        {a.assetTag}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-foreground">
                                        {a.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-0.5 rounded-md text-xs bg-muted font-medium text-foreground">
                                            {a.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-muted-foreground">
                                        {a.location}
                                    </td>
                                    <td className="px-6 py-4 text-xs text-muted-foreground">
                                        ${a.purchasePrice.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-foreground">
                                        ${a.currentBookValue.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right text-xs font-medium text-amber-600 dark:text-amber-400">
                                        -{a.annualDepreciationPct}% / yr
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
