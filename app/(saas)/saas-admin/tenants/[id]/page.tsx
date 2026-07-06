"use client";

import { useAuthStore } from "@/store/authStore";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertTriangle, ArrowLeft } from "lucide-react";

interface TenantDetail {
  id: string;
  name: string;
  domain: string;
  createdAt: string;
  subscription: {
    id: string;
    plan: string;
    status: string;
    amount: number;
    billingCycle: string;
  };
  tenantSuperAdmin?: {
    user: {
      firstName: string;
      lastName: string;
      email: string;
    }
  };
  _count: {
    tenantUserRoles: number;
    classes: number;
    departments: number;
  };
}

export default function TenantDetailsPage() {
  const user = useAuthStore((state) => state.user);
  const params = useParams();
  const router = useRouter();
  const tenantId = params.id as string;

  const [tenant, setTenant] = useState<TenantDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [suspending, setSuspending] = useState(false);
  const [error, setError] = useState("");

  const fetchTenant = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/saas/tenants/${tenantId}`, {
        headers: { "x-user-id": user?.id || "",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (res.ok) {
        setTenant(await res.json());
      } else {
        setError("Failed to fetch tenant details.");
      }
    } catch (err) {
      setError("An error occurred while fetching.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenant();
  }, [tenantId]);

  const handleToggleSuspension = async () => {
    if (!confirm(`Are you sure you want to ${tenant?.subscription?.status === "SUSPENDED" ? "resume" : "suspend"} this tenant?`)) return;
    setSuspending(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/saas/tenants/${tenantId}/suspend`, {
        method: "PUT",
        headers: { "x-user-id": user?.id || "",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (res.ok) {
        fetchTenant();
      } else {
        alert("Failed to toggle suspension.");
      }
    } catch (err) {
      alert("Error occurred.");
    } finally {
      setSuspending(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>;
  }

  if (error || !tenant) {
    return <div className="text-red-500">{error || "Tenant not found."}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.push("/saas-admin/tenants")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{tenant.name}</h2>
          <p className="text-muted-foreground">Domain: {tenant.domain || "N/A"}</p>
        </div>
        <Badge variant={tenant.subscription?.status === "ACTIVE" ? "default" : "destructive"} className="ml-auto">
          {tenant.subscription?.status || "UNKNOWN"}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Super Admin</CardTitle>
          </CardHeader>
          <CardContent>
            {tenant.tenantSuperAdmin ? (
              <div className="space-y-1">
                <p className="font-medium">{tenant.tenantSuperAdmin.user.firstName} {tenant.tenantSuperAdmin.user.lastName}</p>
                <p className="text-sm text-muted-foreground">{tenant.tenantSuperAdmin.user.email}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No Super Admin assigned.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Active Users</span>
              <span className="font-medium">{tenant._count?.tenantUserRoles || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Classes</span>
              <span className="font-medium">{tenant._count?.classes || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Departments</span>
              <span className="font-medium">{tenant._count?.departments || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Plan</span>
              <span className="font-medium capitalize">{tenant.subscription?.plan}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-medium">${tenant.subscription?.amount} / {tenant.subscription?.billingCycle}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-red-200 bg-red-50 dark:bg-red-950/10">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Suspending a tenant will immediately block all their users from accessing the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant={tenant.subscription?.status === "SUSPENDED" ? "default" : "destructive"}
            onClick={handleToggleSuspension}
            disabled={suspending}
          >
            {suspending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {tenant.subscription?.status === "SUSPENDED" ? "Resume Tenant Access" : "Suspend Tenant"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
