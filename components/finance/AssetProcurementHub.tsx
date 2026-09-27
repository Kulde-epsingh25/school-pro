"use client";

import React, { useState } from "react";
import { calculateAssetDepreciation } from "@/lib/asset-intelligence";
import { InventoryItem, PurchaseOrder } from "@/types/advanced-features";
import {
  DollarSign,
  Package,
  CheckCircle2,
  TrendingDown,
  Building,
  FileText,
  Clock,
  Check,
  ShieldCheck,
} from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { StatusBadge } from "@/components/feedback/status-badge";
import { KPICard } from "@/components/feedback/kpi-card";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorBoundary } from "@/components/feedback/error-boundary";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/formatters";

export interface AssetProcurementHubProps {
  initialAssets?: InventoryItem[];
  initialPurchaseOrders?: PurchaseOrder[];
}

function AssetProcurementHubContent({ initialAssets = [], initialPurchaseOrders = [] }: AssetProcurementHubProps) {
  const [activeTab, setActiveTab] = useState<"ASSETS" | "PURCHASE_ORDERS">("ASSETS");
  const [assets] = useState<InventoryItem[]>(initialAssets);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(initialPurchaseOrders);

  const handleApprovePO = (poId: string) => {
    setPurchaseOrders((prev) =>
      prev.map((po) => {
        if (po.id === poId) {
          return {
            ...po,
            status: "PRINCIPAL_APPROVED",
            approvalHistory: [
              ...po.approvalHistory,
              {
                role: "Principal",
                approverName: "Dr. S. Ramanujan (Principal)",
                decision: "APPROVED",
                date: formatDate(new Date()),
              },
            ],
          };
        }
        return po;
      })
    );
  };

  const totalAssetCost = assets.reduce((sum, a) => sum + a.purchaseCost, 0);
  const totalDepreciatedValue = assets.reduce((sum, a) => sum + a.currentDepreciatedValue, 0);
  const pendingPOCount = purchaseOrders.filter((p) => p.status === "SUBMITTED").length;

  const getPOStatusBadge = (status: PurchaseOrder["status"]) => {
    switch (status) {
      case "PRINCIPAL_APPROVED":
        return <StatusBadge status="success" label="Principal Approved" icon={ShieldCheck} size="sm" />;
      case "BURSAR_APPROVED":
        return <StatusBadge status="info" label="Bursar Approved" size="sm" />;
      case "SUBMITTED":
        return <StatusBadge status="warning" label="Pending Sign-Off" icon={Clock} size="sm" />;
      default:
        return <StatusBadge status="neutral" label={status.replace(/_/g, " ")} size="sm" />;
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header & View Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-lg border border-border/80 bg-surface">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Building className="h-5 w-5 text-primary" /> Assets, Depreciation & Procurement Hub
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Audit-ready fixed asset schedules, real-time depreciation engine, and multi-tier PO approvals.
          </p>
        </div>

        <div className="flex rounded-md border border-border p-1 bg-surface-muted/60 self-start md:self-auto">
          <button
            onClick={() => setActiveTab("ASSETS")}
            className={`px-3 py-1 text-xs font-semibold rounded transition-all cursor-pointer ${
              activeTab === "ASSETS"
                ? "bg-surface text-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Fixed Assets & Depreciation
          </button>
          <button
            onClick={() => setActiveTab("PURCHASE_ORDERS")}
            className={`px-3 py-1 text-xs font-semibold rounded transition-all cursor-pointer ${
              activeTab === "PURCHASE_ORDERS"
                ? "bg-surface text-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Purchase Orders ({pendingPOCount})
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Gross Assets"
          value={formatCurrency(totalAssetCost, "INR")}
          comparison="Original acquisition cost"
          icon={Package}
        />
        <KPICard
          title="Current Book Value"
          value={formatCurrency(totalDepreciatedValue, "INR")}
          comparison="Post-depreciation balance"
          trend="neutral"
          icon={DollarSign}
        />
        <KPICard
          title="Accumulated Depreciation"
          value={formatCurrency(totalAssetCost - totalDepreciatedValue, "INR")}
          comparison="Audit write-down to date"
          trend="down"
          icon={TrendingDown}
        />
        <KPICard
          title="Pending Procurement"
          value={pendingPOCount}
          comparison="Awaiting principal approval"
          trend={pendingPOCount > 0 ? "down" : "up"}
          icon={FileText}
        />
      </div>

      {activeTab === "ASSETS" ? (
        <div className="space-y-4">
          {assets.length === 0 ? (
            <EmptyState
              type="no-data"
              title="No Tracked Institutional Assets"
              description="No physical, lab, vehicular, or IT assets are currently registered in this campus ledger."
              icon={Package}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {assets.map((asset) => {
              const dep = calculateAssetDepreciation(
                asset.purchaseCost,
                asset.salvageValue,
                asset.usefulLifeYears,
                asset.purchaseDate,
                asset.depreciationMethod
              );

              return (
                <Card key={asset.id} className="border-border/80">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-muted-foreground block">{asset.assetTag}</span>
                        <CardTitle className="text-sm font-bold text-foreground mt-0.5">{asset.name}</CardTitle>
                        <span className="text-xs text-primary font-medium">{asset.category}</span>
                      </div>
                      <StatusBadge status="success" label={asset.condition} size="sm" />
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 pt-1">
                    <div className="grid grid-cols-2 gap-2 text-xs border-y border-border/60 py-2.5">
                      <div>
                        <span className="text-muted-foreground block">Purchase Cost</span>
                        <span className="font-semibold text-foreground font-mono">
                          {formatCurrency(asset.purchaseCost, "INR")}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Current Book Value</span>
                        <span className="font-bold text-primary font-mono">
                          {formatCurrency(dep.currentBookValue, "INR")}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Acc. Depreciation</span>
                        <span className="font-medium text-danger font-mono">
                          {formatCurrency(dep.accumulatedDepreciation, "INR")}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Annual Depr.</span>
                        <span className="font-medium text-foreground font-mono">
                          {formatCurrency(dep.annualDepreciationRate, "INR")}/yr
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] text-muted-foreground flex justify-between">
                      <span>Location: <strong className="text-foreground">{asset.location}</strong></span>
                      <span className="font-mono">{asset.depreciationMethod}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      ) : (
        <div className="space-y-4">
          {purchaseOrders.length === 0 ? (
            <EmptyState
              type="no-data"
              title="No Purchase Orders Submitted"
              description="No departmental procurement requisitions are pending approval or fulfillment."
              icon={FileText}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PO Number & Vendor</TableHead>
                  <TableHead>Department & Requester</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Authorization</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchaseOrders.map((po) => (
                  <TableRow key={po.id}>
                    <TableCell>
                      <span className="font-mono font-bold text-xs text-foreground block">{po.poNumber}</span>
                      <span className="text-xs text-muted-foreground">{po.vendorName}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-xs text-foreground block">{po.department}</span>
                      <span className="text-[11px] text-muted-foreground">{po.requestedBy}</span>
                    </TableCell>
                    <TableCell className="font-bold text-xs text-foreground font-mono">
                      {formatCurrency(po.totalAmount, "INR")}
                    </TableCell>
                    <TableCell>{getPOStatusBadge(po.status)}</TableCell>
                    <TableCell>
                      {po.status === "SUBMITTED" ? (
                        <Button
                          size="sm"
                          onClick={() => handleApprovePO(po.id)}
                          className="gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Principal Sign-Off
                        </Button>
                      ) : (
                        <span className="text-xs text-success font-medium flex items-center gap-1">
                          <Check className="h-3.5 w-3.5" /> Authorized
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      )}
    </div>
  );
}

export function AssetProcurementHub(props: AssetProcurementHubProps = {}) {
  return (
    <ErrorBoundary fallbackTitle="Unable to load Asset & Procurement Hub">
      <AssetProcurementHubContent {...props} />
    </ErrorBoundary>
  );
}
