"use client";

import { useAuthStore } from "@/store/authStore";
import { useSchoolStore } from "@/store/schoolStore";
import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Search, Loader2, MoreHorizontal, UserX, UserCheck, KeyRound, LogIn, ShieldCheck, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com";

interface PlatformUser {
  id: string;
  name: string;
  email: string;
  tenant: string;
  tenantId: string | null;
  roles: string[];
  status: string;
  createdAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const ROLE_COLORS: Record<string, string> = {
  SAAS_SUPER_ADMIN: "bg-purple-100 text-purple-800 border-purple-200",
  SUPER_ADMIN: "bg-blue-100 text-blue-800 border-blue-200",
  admin: "bg-indigo-100 text-indigo-800 border-indigo-200",
  teacher: "bg-green-100 text-green-800 border-green-200",
  student: "bg-amber-100 text-amber-800 border-amber-200",
  parent: "bg-orange-100 text-orange-800 border-orange-200",
  USER: "bg-gray-100 text-gray-700 border-gray-200",
};

function getRoleBadgeClass(role: string) {
  return ROLE_COLORS[role] || ROLE_COLORS.USER;
}

export default function UsersPage() {
  const adminUser = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const router = useRouter();

  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Edit Roles Dialog
  const [roleDialogUser, setRoleDialogUser] = useState<PlatformUser | null>(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [makeSaasAdmin, setMakeSaasAdmin] = useState(false);

  // Impersonation Confirm Dialog
  const [impersonateTarget, setImpersonateTarget] = useState<PlatformUser | null>(null);
  const [isImpersonateDialogOpen, setIsImpersonateDialogOpen] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "15" });
      if (search) params.append("search", search);

      const res = await fetch(`${API_BASE}/platform-users?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setUsers(data);
          setPagination(null);
        } else {
          setUsers(data.users || []);
          setPagination(data.pagination || null);
        }
      }
    } catch (error) {
      console.error("Failed to fetch platform users", error);
      toast.error("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  }, [page, search, token]);

  useEffect(() => {
    const timer = setTimeout(fetchUsers, search ? 400 : 0);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const handleSuspend = async (targetUser: PlatformUser) => {
    if (!confirm(`Are you sure you want to ${targetUser.status === "Active" ? "suspend" : "reactivate"} ${targetUser.name}?`)) return;
    setActionLoading(targetUser.id + "_suspend");
    try {
      const res = await fetch(`${API_BASE}/platform-users/${targetUser.id}/suspend`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success(`User ${targetUser.status === "Active" ? "suspended" : "reactivated"} successfully.`);
        fetchUsers();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to update user.");
      }
    } catch {
      toast.error("Failed to update user.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleForceReset = async (targetUser: PlatformUser) => {
    if (!confirm(`Send a password reset email to ${targetUser.email}?`)) return;
    setActionLoading(targetUser.id + "_reset");
    try {
      const res = await fetch(`${API_BASE}/platform-users/${targetUser.id}/force-password-reset`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success(`Password reset email sent to ${targetUser.email}.`);
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to send reset email.");
      }
    } catch {
      toast.error("Failed to send reset email.");
    } finally {
      setActionLoading(null);
    }
  };

  const openRoleDialog = (targetUser: PlatformUser) => {
    setRoleDialogUser(targetUser);
    setMakeSaasAdmin(targetUser.roles.includes("SAAS_SUPER_ADMIN"));
    setIsRoleDialogOpen(true);
  };

  const handleUpdateRoles = async () => {
    if (!roleDialogUser) return;
    setActionLoading(roleDialogUser.id + "_roles");
    try {
      const res = await fetch(`${API_BASE}/platform-users/${roleDialogUser.id}/roles`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ makeSaasAdmin }),
      });
      if (res.ok) {
        toast.success("User roles updated successfully.");
        setIsRoleDialogOpen(false);
        fetchUsers();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to update roles.");
      }
    } catch {
      toast.error("Failed to update roles.");
    } finally {
      setActionLoading(null);
    }
  };

  const confirmImpersonate = (targetUser: PlatformUser) => {
    setImpersonateTarget(targetUser);
    setIsImpersonateDialogOpen(true);
  };

  const handleImpersonate = async () => {
    if (!impersonateTarget) return;
    setActionLoading(impersonateTarget.id + "_impersonate");
    try {
      const res = await fetch(`${API_BASE}/saas/impersonate/${impersonateTarget.id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        toast.success(`Logged in as ${impersonateTarget.name}. Redirecting...`);
        useAuthStore.getState().setAuth(data.user, data.accessToken);
        if (data.user.schoolId) {
          useSchoolStore.getState().setSchool({ id: data.user.schoolId, name: data.user.schoolName || "School Pro", logo: "" });
        } else {
          useSchoolStore.getState().clearSchool();
        }
        const roles: string[] = data.user.roles || [];
        if (roles.includes("super_admin")) router.push("/dashboard");
        else if (roles.includes("teacher")) router.push("/dashboard/teacher");
        else if (roles.includes("student")) router.push("/portal/student");
        else if (roles.includes("parent")) router.push("/portal/parent");
        else router.push("/dashboard");
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to impersonate user.");
      }
    } catch {
      toast.error("Failed to impersonate user.");
    } finally {
      setActionLoading(null);
      setIsImpersonateDialogOpen(false);
    }
  };

  const activeCount = users.filter(u => u.status === "Active").length;
  const suspendedCount = users.filter(u => u.status !== "Active").length;
  const saasAdminCount = users.filter(u => u.roles.includes("SAAS_SUPER_ADMIN")).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Users &amp; Roles</h2>
        <p className="text-muted-foreground">
          Manage all platform users, assign roles, and take administrative actions.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg"><Users className="h-5 w-5 text-blue-600" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{pagination?.total ?? users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg"><UserCheck className="h-5 w-5 text-green-600" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{activeCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 rounded-lg"><UserX className="h-5 w-5 text-red-500" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Suspended</p>
                <p className="text-2xl font-bold">{suspendedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg"><ShieldCheck className="h-5 w-5 text-purple-600" /></div>
              <div>
                <p className="text-sm text-muted-foreground">SaaS Admins</p>
                <p className="text-2xl font-bold">{saasAdminCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>All Platform Users</CardTitle>
            <CardDescription>
              {pagination
                ? `Page ${pagination.page} of ${pagination.totalPages} (${pagination.total} total)`
                : `${users.length} users`}
            </CardDescription>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="user-search"
              type="search"
              placeholder="Search by name or email..."
              className="pl-8"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Organisation</TableHead>
                      <TableHead>Roles</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right w-16">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u.id} className="group">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                              {u.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium text-sm">{u.name}</div>
                              <div className="text-xs text-muted-foreground">{u.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell><span className="text-sm">{u.tenant}</span></TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap max-w-[220px]">
                            {u.roles.map(role => (
                              <span key={role} className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${getRoleBadgeClass(role)}`}>
                                {role.replace(/_/g, " ")}
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${u.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${u.status === "Active" ? "bg-green-500" : "bg-red-500"}`} />
                            {u.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs text-muted-foreground">
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              render={
                                <Button
                                  id={`user-actions-${u.id}`}
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                  disabled={!!actionLoading}
                                >
                                  {actionLoading?.startsWith(u.id) ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <MoreHorizontal className="h-4 w-4" />
                                  )}
                                </Button>
                              }
                            />
                            <DropdownMenuContent align="end" className="w-52">
                              <DropdownMenuLabel className="text-xs text-muted-foreground font-normal truncate">{u.email}</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => confirmImpersonate(u)}
                                disabled={u.roles.includes("SAAS_SUPER_ADMIN")}
                                className="cursor-pointer"
                              >
                                <LogIn className="mr-2 h-4 w-4 text-blue-600" />
                                <span>Log in as this user</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openRoleDialog(u)} className="cursor-pointer">
                                <ShieldCheck className="mr-2 h-4 w-4 text-purple-600" />
                                <span>Edit Platform Roles</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleForceReset(u)} className="cursor-pointer">
                                <KeyRound className="mr-2 h-4 w-4 text-amber-600" />
                                <span>Force Password Reset</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleSuspend(u)}
                                disabled={u.id === adminUser?.id}
                                className={`cursor-pointer ${u.status === "Active" ? "text-red-600 focus:text-red-600" : "text-green-600 focus:text-green-600"}`}
                              >
                                {u.status === "Active" ? (
                                  <><UserX className="mr-2 h-4 w-4" /><span>Suspend User</span></>
                                ) : (
                                  <><UserCheck className="mr-2 h-4 w-4" /><span>Reactivate User</span></>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                    {users.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                          <Users className="h-8 w-8 mx-auto mb-2 text-slate-200" />
                          No users found{search ? ` matching "${search}"` : ""}.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {((pagination.page - 1) * pagination.limit) + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={pagination.page <= 1}>
                      <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={pagination.page >= pagination.totalPages}>
                      Next <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit Roles Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Platform Roles</DialogTitle>
            <DialogDescription>
              Manage platform-level privileges for <strong>{roleDialogUser?.name}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium text-sm">SaaS Super Admin</p>
                <p className="text-xs text-muted-foreground mt-0.5">Grants full platform-wide access. Use with caution.</p>
              </div>
              <button
                id="toggle-saas-admin"
                onClick={() => setMakeSaasAdmin(prev => !prev)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${makeSaasAdmin ? "bg-purple-600" : "bg-gray-200"}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${makeSaasAdmin ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateRoles} disabled={!!actionLoading}>
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Impersonation Confirm Dialog */}
      <Dialog open={isImpersonateDialogOpen} onOpenChange={setIsImpersonateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogIn className="h-5 w-5 text-blue-600" />
              Confirm User Impersonation
            </DialogTitle>
            <DialogDescription>
              You are about to log in as <strong>{impersonateTarget?.name}</strong> ({impersonateTarget?.email}).
              <br /><br />
              This action is <strong>fully audited</strong> and will be recorded in the Global Audit Logs.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImpersonateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleImpersonate} disabled={!!actionLoading} className="bg-blue-600 hover:bg-blue-700">
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <LogIn className="h-4 w-4 mr-2" />}
              Proceed &amp; Log In
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
