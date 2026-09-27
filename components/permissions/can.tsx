"use client";

import React from "react";
import { useAuthStore } from "@/store/authStore";

export type RbacAction = "create" | "read" | "update" | "delete" | "export" | "manage";
export type RbacScope = "all" | "school" | "department" | "own";

export interface CanProps {
  subject: string;
  action: RbacAction;
  scope?: RbacScope;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * 4D RBAC Permission Gate (Section 36)
 * Evaluates frontend authorization based on Subject, Action, Scope, and Role.
 * Note: Backend permissions remain authoritative.
 */
export function Can({
  subject,
  action,
  scope = "school",
  fallback = null,
  children,
}: CanProps) {
  const user = useAuthStore((state) => state.user);
  const roles = user?.roles || [];

  // Platform admin bypasses all boundaries
  if (roles.includes("saas_super_admin")) {
    return <>{children}</>;
  }

  // Tenant Super Admin has full administrative scope within their school
  if (roles.includes("super_admin") && scope !== "all") {
    return <>{children}</>;
  }

  // Domain permission mapping heuristics
  const hasAccess = evaluateRolePermission(roles, subject, action, scope);

  if (hasAccess) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}

function evaluateRolePermission(
  roles: string[],
  subject: string,
  action: RbacAction,
  scope: RbacScope
): boolean {
  // Teachers can manage grades, attendance, and lessons for their assigned classes
  if (roles.includes("teacher")) {
    if (["gradebook", "attendance", "lesson_plans", "students"].includes(subject)) {
      if (action === "read" || action === "update" || action === "create") {
        return scope === "own" || scope === "department" || scope === "school";
      }
    }
  }

  // Nurses/Health Officers can access clinic & health records
  if (roles.includes("health_officer") || roles.includes("nurse")) {
    if (subject === "clinic" || subject === "health") {
      return true;
    }
  }

  // Finance officers can collect fees and manage budgets
  if (roles.includes("finance_officer") || roles.includes("bursar")) {
    if (["fees", "payroll", "procurement", "inventory"].includes(subject)) {
      return true;
    }
  }

  // School Admins have broad daily operational access
  if (roles.includes("admin")) {
    if (!["platform_settings", "billing_saas"].includes(subject)) {
      return true;
    }
  }

  return false;
}
