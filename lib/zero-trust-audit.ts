// Zero-Trust Audit Logging & Delegated Access Validator
import { DelegatedAccessGrant } from "@/types/advanced-features";

export interface AuditRecord {
  id: string;
  tenantId: string;
  userId: string;
  userName: string;
  userRole: string;
  resourceType: "HEALTH_RECORD" | "COUNSELING_NOTE" | "DISCIPLINARY" | "PAYROLL" | "STUDENT_RECORD";
  resourceId: string;
  action: "READ" | "EXPORT" | "UPDATE" | "DELETE" | "DELEGATE";
  timestamp: string;
  ipAddress?: string;
  justification?: string;
}

/**
 * Creates an immutable zero-trust audit log for sensitive record access
 */
export function createSensitiveAccessAudit(
  tenantId: string,
  userId: string,
  userName: string,
  userRole: string,
  resourceType: AuditRecord["resourceType"],
  resourceId: string,
  action: AuditRecord["action"],
  justification?: string
): AuditRecord {
  return {
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    tenantId,
    userId,
    userName,
    userRole,
    resourceType,
    resourceId,
    action,
    timestamp: new Date().toISOString(),
    justification: justification || "Authorized operational review",
  };
}

/**
 * Validates whether a time-boxed role delegation grant is currently active and within its validity window.
 */
export function isDelegationGrantValid(grant: DelegatedAccessGrant): {
  isValid: boolean;
  reason?: string;
  remainingMinutes?: number;
} {
  if (!grant.isActive) {
    return { isValid: false, reason: "Delegation grant has been marked inactive." };
  }

  if (grant.revokedAt) {
    return { isValid: false, reason: `Grant was revoked at ${grant.revokedAt}` };
  }

  const now = new Date().getTime();
  const start = new Date(grant.validFrom).getTime();
  const end = new Date(grant.validUntil).getTime();

  if (now < start) {
    return { isValid: false, reason: "Delegation grant window has not yet begun." };
  }

  if (now > end) {
    return { isValid: false, reason: "Delegation grant has expired." };
  }

  const remainingMinutes = Math.max(0, Math.round((end - now) / (1000 * 60)));
  return { isValid: true, remainingMinutes };
}
