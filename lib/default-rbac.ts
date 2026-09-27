/**
 * Foundational RBAC Matrix & Default Institutional Roles
 * Resolves Issues #5 & #6 from USER_REPORTED_ISSUES.md:
 * Ensures newly initialized school tenants always have a complete set of
 * standard roles and 4D permissions scoped automatically to their tenantId.
 */

export interface SystemPermission {
  id: string;
  code: string;
  name: string;
  category: "Academics" | "Finance" | "Health" | "Administration" | "Facilities";
  description: string;
  action: "create" | "read" | "update" | "delete" | "export" | "manage";
  scope: "school" | "department" | "own";
}

export interface StandardSchoolRole {
  id: string;
  tenantId: string;
  name: string;
  roleKey: string;
  description: string;
  isSystemDefault: boolean;
  permissionCodes: string[];
}

export const SYSTEM_PERMISSIONS: SystemPermission[] = [
  // Academics
  { id: "perm-acad-1", code: "STUDENTS:READ", name: "View Students Directory", category: "Academics", description: "View student profiles, enrollment status, and records", action: "read", scope: "school" },
  { id: "perm-acad-2", code: "STUDENTS:MANAGE", name: "Manage Students", category: "Academics", description: "Create, edit, suspend, or graduate student profiles", action: "manage", scope: "school" },
  { id: "perm-acad-3", code: "ATTENDANCE:LOG", name: "Log Attendance", category: "Academics", description: "Mark daily or period-level attendance for assigned classes", action: "create", scope: "department" },
  { id: "perm-acad-4", code: "GRADEBOOK:MANAGE", name: "Manage Gradebook", category: "Academics", description: "Enter examination marks, calculate GPA, and generate report cards", action: "manage", scope: "department" },
  { id: "perm-acad-5", code: "AI_PREDICTIONS:READ", name: "View At-Risk Analytics", category: "Academics", description: "Access multivariate predictive early warning dashboards", action: "read", scope: "school" },

  // Finance
  { id: "perm-fin-1", code: "FEES:COLLECT", name: "Collect Fees & Issue Receipts", category: "Finance", description: "Record cash, card, and bank tuition fee transactions", action: "create", scope: "school" },
  { id: "perm-fin-2", code: "FEES:STRUCTURE_MANAGE", name: "Configure Fee Structures", category: "Finance", description: "Define term billing schedules, discounts, and late fine rules", action: "manage", scope: "school" },
  { id: "perm-fin-3", code: "PROCUREMENT:MANAGE", name: "Procurement & Purchase Orders", category: "Finance", description: "Submit, verify, and approve vendor purchase orders", action: "manage", scope: "school" },
  { id: "perm-fin-4", code: "PAYROLL:MANAGE", name: "Manage Staff Payroll", category: "Finance", description: "Calculate monthly salaries, deductions, and issue payslips", action: "manage", scope: "school" },

  // Health & Counseling (Zero-Trust Protected)
  { id: "perm-hlth-1", code: "CLINIC:READ", name: "View Infirmary Records", category: "Health", description: "Access student clinic visits, allergy logs, and medical alerts", action: "read", scope: "school" },
  { id: "perm-hlth-2", code: "CLINIC:LOG_INTAKE", name: "Log Clinic Encounters", category: "Health", description: "Administer medications, record treatments, and notify parents", action: "create", scope: "school" },
  { id: "perm-hlth-3", code: "COUNSELING:CONFIDENTIAL", name: "Confidential Counseling Vault", category: "Health", description: "Manage privileged student behavioral intervention notes", action: "manage", scope: "school" },

  // Administration & RBAC
  { id: "perm-adm-1", code: "USERS:MANAGE", name: "Manage Staff Accounts", category: "Administration", description: "Create staff users, assign roles, and trigger password resets", action: "manage", scope: "school" },
  { id: "perm-adm-2", code: "RBAC:CONFIG", name: "Configure Roles & Permissions", category: "Administration", description: "Create custom tenant roles and toggle atomic permission gates", action: "manage", scope: "school" },
  { id: "perm-adm-3", code: "AUDIT:READ", name: "Inspect Audit Trail", category: "Administration", description: "Review immutable zero-trust before/after data diffs and logs", action: "read", scope: "school" },

  // Campus Facilities
  { id: "perm-fac-1", code: "TRANSPORT:FLEET", name: "Manage Transport Fleet", category: "Facilities", description: "Assign drivers, routes, and monitor live vehicle telemetry", action: "manage", scope: "school" },
  { id: "perm-fac-2", code: "LIBRARY:CATALOG", name: "Library Catalog & Circulation", category: "Facilities", description: "Issue, return, and catalog digital and physical books", action: "manage", scope: "school" },
  { id: "perm-fac-3", code: "HOSTEL:ROOMS", name: "Hostel & Room Allocations", category: "Facilities", description: "Allocate student hostel rooms and enforce curfews", action: "manage", scope: "school" },
];

/**
 * Returns default institutional roles scoped to the specified tenant ID
 */
export function getDefaultTenantRoles(tenantId: string): StandardSchoolRole[] {
  return [
    {
      id: `role-${tenantId}-principal`,
      tenantId,
      name: "School Principal / Master Admin",
      roleKey: "super_admin",
      description: "Full institutional sovereignty across academic, financial, HR, and campus governance.",
      isSystemDefault: true,
      permissionCodes: SYSTEM_PERMISSIONS.map((p) => p.code),
    },
    {
      id: `role-${tenantId}-academic-coord`,
      tenantId,
      name: "Academic Coordinator",
      roleKey: "academic_coordinator",
      description: "Oversees gradebooks, curriculum schedules, at-risk predictions, and teacher lesson plans.",
      isSystemDefault: true,
      permissionCodes: [
        "STUDENTS:READ",
        "STUDENTS:MANAGE",
        "ATTENDANCE:LOG",
        "GRADEBOOK:MANAGE",
        "AI_PREDICTIONS:READ",
        "AUDIT:READ",
      ],
    },
    {
      id: `role-${tenantId}-teacher`,
      tenantId,
      name: "Teacher / Faculty",
      roleKey: "teacher",
      description: "Daily classroom operations, attendance marking, grading assignments, and mentor logs.",
      isSystemDefault: true,
      permissionCodes: [
        "STUDENTS:READ",
        "ATTENDANCE:LOG",
        "GRADEBOOK:MANAGE",
      ],
    },
    {
      id: `role-${tenantId}-admissions`,
      tenantId,
      name: "Admissions Officer",
      roleKey: "admissions_officer",
      description: "Manages applicant inquiries, document verification, entrance exams, and enrollment pipelines.",
      isSystemDefault: true,
      permissionCodes: [
        "STUDENTS:READ",
        "STUDENTS:MANAGE",
      ],
    },
    {
      id: `role-${tenantId}-bursar`,
      tenantId,
      name: "Finance Officer / Bursar",
      roleKey: "finance_officer",
      description: "Tuition collection, fee structures, payroll disbursement, procurement, and asset ledgers.",
      isSystemDefault: true,
      permissionCodes: [
        "STUDENTS:READ",
        "FEES:COLLECT",
        "FEES:STRUCTURE_MANAGE",
        "PROCUREMENT:MANAGE",
        "PAYROLL:MANAGE",
        "AUDIT:READ",
      ],
    },
    {
      id: `role-${tenantId}-health`,
      tenantId,
      name: "Nurse / Health Officer",
      roleKey: "health_officer",
      description: "Zero-trust infirmary clinic encounters, critical allergy protocol logs, and health alerts.",
      isSystemDefault: true,
      permissionCodes: [
        "STUDENTS:READ",
        "CLINIC:READ",
        "CLINIC:LOG_INTAKE",
      ],
    },
    {
      id: `role-${tenantId}-counselor`,
      tenantId,
      name: "Student Counselor",
      roleKey: "counselor",
      description: "Confidential student behavioral guidance, mental wellness, and targeted interventions.",
      isSystemDefault: true,
      permissionCodes: [
        "STUDENTS:READ",
        "COUNSELING:CONFIDENTIAL",
        "AI_PREDICTIONS:READ",
      ],
    },
    {
      id: `role-${tenantId}-transport`,
      tenantId,
      name: "Transport Coordinator",
      roleKey: "transport_coordinator",
      description: "Bus fleet management, route planning, driver assignments, and live GPS tracking.",
      isSystemDefault: true,
      permissionCodes: [
        "STUDENTS:READ",
        "TRANSPORT:FLEET",
      ],
    },
    {
      id: `role-${tenantId}-librarian`,
      tenantId,
      name: "Librarian",
      roleKey: "librarian",
      description: "Book cataloging, ISBN lookup, circulation, overdue fines, and digital reservations.",
      isSystemDefault: true,
      permissionCodes: [
        "STUDENTS:READ",
        "LIBRARY:CATALOG",
      ],
    },
  ];
}
