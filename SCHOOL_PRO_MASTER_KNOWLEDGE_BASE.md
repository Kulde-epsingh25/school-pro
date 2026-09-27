# 🏫 School Pro — Master Project Knowledge Base & Architecture Encyclopedia

> **Document Version**: 2.0 (Master Comprehensive Edition)  
> **Last Updated**: September 2026  
> **Target Production Application**: [School Pro Web on Vercel](https://school-pro-mocha-beta.vercel.app/)  
> **Codebase Paths**:  
> - Frontend & Web App: `New folder/school-pro-web/`  
> - Core Blueprints & Architecture Guides: Root Workspace (`/`)  

---

## 📑 Table of Contents
1. [Executive Summary & System Purpose](#1-executive-summary--system-purpose)
2. [High-Level Architectural Topology](#2-high-level-architectural-topology)
3. [Full Technology Stack & Dependencies](#3-full-technology-stack--dependencies)
4. [Multi-Tenant Hierarchy (The 3-Tier Model)](#4-multi-tenant-hierarchy-the-3-tier-model)
5. [The 18 System Personas & Role Matrix](#5-the-18-system-personas--role-matrix)
6. [4-Dimensional RBAC Engine & Security Architecture](#6-4-dimensional-rbac-engine--security-architecture)
7. [Database Architecture & Prisma Schema Reference](#7-database-architecture--prisma-schema-reference)
8. [Complete Navigation Map & Route Directory](#8-complete-navigation-map--route-directory)
9. [Functional Modules Deep Dive](#9-functional-modules-deep-dive)
10. [Current Implementation Status (Completed vs. Missing)](#10-current-implementation-status-completed-vs-missing)
11. [Known Bugs, Blockers & White-Box Audit Ledger](#11-known-bugs-blockers--white-box-audit-ledger)
12. [End-to-End Remediation & Fix Roadmap](#12-end-to-end-remediation--fix-roadmap)
13. [Directory & File Organization Map](#13-directory--file-organization-map)

---

## 1. Executive Summary & System Purpose

**School Pro** is an enterprise-grade, multi-tenant SaaS School Management System (ERP). It provides a unified administrative operating system for multi-campus institutional groups, individual primary/secondary schools, and higher educational colleges.

The platform coordinates operations across:
- **Platform Owners (SaaS Admins)**: Tenant provisioning, domain routing, subscription billing, usage limits, and platform-wide security.
- **Institutional Leaders (School Super Admins & Principals)**: Master RBAC policies, campus setup, staff delegation, and compliance auditing.
- **Academic Staff & Operations**: Attendance, grading, lesson planning, timetable generation, fee collection, transport, hostel boarding, and clinic records.
- **Constituent Sub-Portals**: Dedicated, secured interfaces for Teachers, Students, Parents, Alumni, and Contractors/Vendors.

---

## 2. High-Level Architectural Topology

```mermaid
graph TD
    subgraph Client Tier [Next.js 16 App Router / React 19]
        A1[Public & Marketing Pages]
        A2[SaaS Admin Portal: /saas-admin]
        A3[Tenant Admin Console: /admin]
        A4[Staff Academic Operations: /dashboard]
        A5[Constituent Portals: /portal/student, /parent, /alumni, /vendor]
    end

    subgraph Gateway & Middleware Tier
        B1[Next.js Dynamic Route & Subdomain Resolver]
        B2[Tenant Isolation Middleware: tenantId Header/JWT]
        B3[RBAC & Permission Evaluator Engine]
    end

    subgraph Backend Core [Express.js + TypeScript]
        C1[Auth & Provisioning Controller]
        C2[Academics & Examination Engine]
        C3[Finance, Fee Ledger & Payroll Service]
        C4[Facilities: Transport, Hostel, Library]
        C5[Sensitive: Clinic & Counseling Vault]
    end

    subgraph Data & Async Processing
        D1[(MongoDB Multi-Tenant DB via Prisma)]
        D2[Read-Replica DB for Analytics & Reports]
        D3[BullMQ + Redis Task Queue]
        D4[Puppeteer PDF Certificate & Report Generator]
        D5[Resend / SendGrid Email Ingestion]
        D6[Biometric & GPS Telemetry Webhook Ingest]
    end

    Client Tier --> Gateway & Middleware Tier
    Gateway & Middleware Tier --> Backend Core
    Backend Core --> D1
    Backend Core --> D3
    D3 --> D4
    D3 --> D5
    D6 --> Backend Core
    D1 -.-> D2
```

### Architectural Tenets
1. **Strict Multi-Tenant Isolation**: Every database collection and query enforces a tenant boundary via `tenantId`. Cross-tenant data leakage is prevented at the database schema, query middleware, and UI levels.
2. **Dynamic 4D Permission Gates**: UI elements and API endpoints verify user access based on Subject, Action, Scope, and contextual Conditions.
3. **Decoupled Asynchronous Tasks**: Heavy operations (PDF generation, bulk SMS/email broadcasts, biometric device logs, invoice reconciliation) are dispatched to BullMQ workers.
4. **Audit Immutability & Delta Versioning**: Sensitive changes (grade modifications, attendance corrections, role grants, health notes) record `before` and `after` snapshots with actor identifiers.

---

## 3. Full Technology Stack & Dependencies

### Frontend (`school-pro-web`)
- **Core Framework**: Next.js 16.2.9 (App Router) + React 19.2.4
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4, `@tailwindcss/postcss`, `tw-animate-css`
- **UI Components & Primitives**: `shadcn/ui`, Radix UI (`@radix-ui/react-tabs`), Base UI (`@base-ui/react`), Lucide React icons, React Icons
- **State Management**: Zustand 5.0 (client session hydrator, theme, active tenant context)
- **Forms & Validation**: React Hook Form 7.80 + Zod 4.4, `@hookform/resolvers`
- **Data Visualization**: Recharts 3.9
- **Tables & Grids**: `@tanstack/react-table` 8.21
- **Feedback & Notifications**: Sonner toasts
- **End-to-End Testing**: Playwright 1.61

### Backend (`backend/`)
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js with TypeScript
- **ORM & Data Layer**: Prisma ORM with MongoDB driver
- **Security**: Helmet, CORS origin whitelisting, Express Rate Limiter, BCrypt
- **Auth**: JWT (JSON Web Tokens) with multi-tenant payload (`userId`, `tenantId`, `roles`, `permissions`)
- **Document Generation**: Puppeteer / PDFKit for report cards and printable certificates
- **Email Service**: Resend API / SMTP transport

---

## 4. Multi-Tenant Hierarchy (The 3-Tier Model)

```
┌─────────────────────────────────────────────────────────────┐
│ LEVEL 1: GLOBAL PLATFORM LAYER (SaaS)                       │
│ 👤 saas_super_admin                                         │
│ • Controls all tenants, platform telemetry, cloud billing    │
│ • Direct access to: /saas-admin/*                           │
└──────────────────────────────┬──────────────────────────────┘
                               │ provisions
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ LEVEL 2: TENANT ORGANIZATION LAYER (School / Institution)   │
│ 🏛️ super_admin (Tenant Super Admin) & admin (School Admin)  │
│ • Tenant-scoped users, custom roles, permissions matrix     │
│ • Direct access to: /admin/* and /dashboard/*               │
└──────────────────────────────┬──────────────────────────────┘
                               │ grants & assigns
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ LEVEL 3: OPERATIONAL & CONSTITUENT LAYER                    │
│ 🧑‍🏫 Staff Personas: teacher, finance_officer, librarian... │
│ 🎓 Constituent Portals: student, parent, alumni, vendor     │
│ • Direct access to: /dashboard/* & /portal/*                │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. The 18 System Personas & Role Matrix

| # | Role Display Name | Internal Slug | Authority Scope | Key Responsibilities & Access Bounds |
|---|---|---|---|---|
| 1 | **SaaS Super Admin** | `saas_super_admin` | Global Platform | Cloud infrastructure, tenant lifecycles, billing tiers, platform settings, impersonation. |
| 2 | **Tenant Super Admin** | `super_admin` | Full Institution | School owner/principal. Manages master RBAC, delegated permissions, security policies, and school profile. |
| 3 | **School Admin** | `admin` | Full Institution | Day-to-day operations, academic terms, timetable dispatch, admissions, and departmental oversight. |
| 4 | **Teacher / Faculty** | `teacher` | Assigned Classes | Daily attendance, gradebook entry, assignments, syllabus progression, student remarks. |
| 5 | **Student** | `student` | Own Profile Only | Class schedule, submitted homework, grade cards, library loans, fee receipts, digital ID. |
| 6 | **Parent / Guardian** | `parent` | Linked Children | Attendance push alerts, academic progress, online fee payments, report card downloads, teacher messaging. |
| 7 | **Finance Officer / Bursar** | `finance_officer` | Institution Finance | Fee structure definition, discount/scholarship approval, cash collections, payroll, expense ledgers. |
| 8 | **Librarian** | `librarian` | Library Module | Cataloging (ISBN), issue/return tracking, overdue fine calculation, book reservations. |
| 9 | **Transport Coordinator** | `transport_coordinator` | Transport Fleet | Vehicle maintenance, driver rosters, route waypoints, student bus allocation, GPS tracking. |
| 10 | **Hostel Warden** | `hostel_warden` | Hostel Facilities | Room allocation, bed occupancy, evening roll-call, night curfew logs, gate exit passes. |
| 11 | **Front Desk / Receptionist** | `front_desk` | Gate & Reception | Visitor pass issuance, visitor check-in/out, prospective admission inquiries, phone logs. |
| 12 | **Exam Coordinator** | `exam_coordinator` | Examinations | Examination schedules, room allocations, hall ticket issuance, invigilator assignments. |
| 13 | **Academic Coordinator** | `academic_coordinator` | Academic Curricula | Syllabus tracking, lesson plan reviews, course material approvals, teacher substitutions. |
| 14 | **Counselor** | `counselor` | Assigned Students | Confidential psychological logs, student welfare notes, behavioral intervention plans *(Strict Zero-Trust)*. |
| 15 | **Health Officer / Nurse** | `health_officer` | Campus Clinic | Student medical history, allergy registry, immunization logs, clinic visit tracking *(Strict Zero-Trust)*. |
| 16 | **Substitute Teacher** | `substitute` | Time-Boxed Slot | Temporary, expiring access to submit class attendance and view lesson plans for designated periods. |
| 17 | **Alumni** | `alumni` | Alumni Portal | Alumni network directory, transcript requests, reunion bookings, endowment donations. |
| 18 | **Vendor / Contractor** | `vendor` | Vendor Portal | Purchase order tracking, tender submissions, service contract milestones, invoice upload. |

---

## 6. 4-Dimensional RBAC Engine & Security Architecture

Permissions in School Pro are not binary flags. They are calculated dynamically using four dimensions:

$$\text{Permission} = \langle \text{Subject}, \text{Action}, \text{Scope}, \text{Conditions} \rangle$$

### 1. Subject (Resource Domain)
- `academic:class`, `academic:subject`, `academic:timetable`, `academic:lesson_plan`
- `student:profile`, `student:attendance`, `student:grade`, `student:disciplinary`
- `finance:fee_structure`, `finance:payment`, `finance:expense`, `finance:payroll`
- `facility:transport`, `facility:hostel`, `facility:library`
- `confidential:health`, `confidential:counseling`
- `admin:user`, `admin:role`, `admin:audit`, `admin:settings`

### 2. Action (Operations)
- `CREATE` · `READ` · `UPDATE` · `DELETE` · `EXPORT` · `APPROVE` · `SIGN_OFF`

### 3. Scope (Boundary of Authority)
- `GLOBAL`: SaaS wide (Platform Admins only).
- `TENANT`: Entire school organization.
- `DEPARTMENT`: Only users/records within the assigned academic department.
- `CLASS`: Only students/classes assigned to that faculty member.
- `OWN_ONLY`: Strictly the record belonging to the authenticated user.

### 4. Conditions (Contextual Rule Evaluator)
- `requires_mfa`: Action requires step-up Two-Factor Authentication (e.g. bulk refund approval).
- `requires_dual_approval`: Requires four-eyes signoff from both Finance Officer and Super Admin.
- `expiresAt`: Time-expiring delegation (used for substitute teachers or interim coordinators).
- `audit_on_read`: Immediate immutable audit entry generated whenever a record is viewed (mandatory for clinic and counseling notes).

---

## 7. Database Architecture & Prisma Schema Reference

### Core Schema Models (`prisma/schema.prisma`)

```prisma
model Tenant {
  id              String             @id @default(auto()) @map("_id") @db.ObjectId
  name            String
  code            String             @unique
  domain          String?            @unique
  logo            String?
  status          String             @default("ACTIVE") // ACTIVE, SUSPENDED, TRIAL
  plan            String             @default("STANDARD")
  createdAt       DateTime           @default(now())
  updatedAt       DateTime           @updatedAt
  
  users           User[]
  roles           TenantRole[]
  permissions     TenantPermission[]
  auditLogs       TenantAuditLog[]
}

model User {
  id              String             @id @default(auto()) @map("_id") @db.ObjectId
  email           String             @unique
  passwordHash    String
  firstName       String
  lastName        String
  phone           String?
  isActive        Boolean            @default(false)
  tenantId        String             @db.ObjectId
  tenant          Tenant             @relation(fields: [tenantId], references: [id])
  
  userRoles       TenantUserRole[]
  studentProfile  StudentProfile?
  teacherProfile  TeacherProfile?
  parentProfile   ParentProfile?
  staffProfile    StaffProfile?
  createdAt       DateTime           @default(now())
  updatedAt       DateTime           @updatedAt
}

model TenantRole {
  id              String             @id @default(auto()) @map("_id") @db.ObjectId
  tenantId        String             @db.ObjectId
  name            String
  slug            String
  description     String?
  isSystemRole    Boolean            @default(false)
  permissions     TenantRolePermission[]
  userRoles       TenantUserRole[]
  tenant          Tenant             @relation(fields: [tenantId], references: [id])
}

model TenantPermission {
  id              String             @id @default(auto()) @map("_id") @db.ObjectId
  tenantId        String             @db.ObjectId
  subject         String             // e.g. "student:grade"
  action          String             // e.g. "UPDATE"
  scope           String             // e.g. "CLASS"
  conditions      Json?              // e.g. {"requires_mfa": true}
  roles           TenantRolePermission[]
  tenant          Tenant             @relation(fields: [tenantId], references: [id])
}

model TenantUserRole {
  id              String             @id @default(auto()) @map("_id") @db.ObjectId
  userId          String             @db.ObjectId
  roleId          String             @db.ObjectId
  expiresAt       DateTime?          // For delegated time-boxed access
  user            User               @relation(fields: [userId], references: [id])
  role            TenantRole         @relation(fields: [roleId], references: [id])
}

model TenantRolePermission {
  id              String             @id @default(auto()) @map("_id") @db.ObjectId
  roleId          String             @db.ObjectId
  permissionId    String             @db.ObjectId
  role            TenantRole         @relation(fields: [roleId], references: [id])
  permission      TenantPermission   @relation(fields: [permissionId], references: [id])
}

model TenantAuditLog {
  id              String             @id @default(auto()) @map("_id") @db.ObjectId
  tenantId        String             @db.ObjectId
  actorId         String             @db.ObjectId
  action          String             // e.g. "GRADE_UPDATED", "USER_INVITED"
  subject         String             // e.g. "student:12345"
  details         Json?              // Diff of before vs after
  ipAddress       String?
  createdAt       DateTime           @default(now())
  tenant          Tenant             @relation(fields: [tenantId], references: [id])
}
```

---

## 8. Complete Navigation Map & Route Directory

### A. SaaS Global Super Admin (`/saas-admin/*`)
- `/saas-admin` — Platform overview, tenant counts, cloud infrastructure health.
- `/saas-admin/tenants` — School provisioning, suspension, license upgrades.
- `/saas-admin/billing` — Stripe/Razorpay subscription plans & payment status.
- `/saas-admin/feature-flags` — Global rollout of experimental features.
- `/saas-admin/support` — Emergency audited impersonation mode (30-min auto expire).
- `/saas-admin/audit` — Global platform event ledger.
- `/saas-admin/settings` — Cloud storage, email gateway, and security keys.

### B. Tenant Super Admin Console (`/admin/*`)
- `/admin` — School operations summary & institutional setup checklist.
- `/admin/users` — Staff, teacher, student, and parent user directory with invitations.
- `/admin/roles` — Interactive RBAC matrix, custom role builder, permission scopes.
- `/admin/roles/delegations` — Time-boxed role assignments (substitutes, interim coordinators).
- `/admin/audit` — Comprehensive institutional security and activity logs.
- `/admin/settings/security` — Password policies, MFA enforcement, session timeout.
- `/admin/settings/modules` — Toggle functional modules (Transport, Hostel, Clinic).
- `/admin/settings/data-requests` — GDPR/FERPA compliance & right-to-erasure workflows.

### C. Daily Academic & Campus Operations (`/dashboard/*`)
- **Academics**:
  - `/dashboard/academics/classes` — Grade levels, sections, and stream allocation.
  - `/dashboard/academics/subjects` — Course catalogue, credit weights, elective pools.
  - `/dashboard/academics/departments` — Faculty departments and HOD assignments.
  - `/dashboard/academics/timetable` — Dynamic drag-and-drop schedule builder.
  - `/dashboard/academics/lesson-plans` — Curriculum milestones and lesson plan submissions.
  - `/dashboard/academics/gradebook` — Mark evaluation, assessment weighting, at-risk flags.
- **Student Care & Records**:
  - `/dashboard/students` — Comprehensive student directory and profiles.
  - `/dashboard/students/admissions` — Prospective admissions Kanban pipeline.
  - `/dashboard/students/attendance` — Roll-call registers, biometric sync.
  - `/dashboard/students/health` — Clinic visits, allergies, immunizations *(Restricted)*.
  - `/dashboard/students/counseling` — Mental health logs, intervention notes *(Restricted)*.
- **Finance & Fee Ledger**:
  - `/dashboard/finance/fees` — Fee collection, receipts, overdue alerts.
  - `/dashboard/finance/fee-structures` — Custom fee schedules, transport/hostel add-ons.
  - `/dashboard/finance/expenses` — Departmental purchase requisitions and vouchers.
  - `/dashboard/finance/payroll` — Faculty salaries, deductions, payslip generation.
  - `/dashboard/finance/procurement` — Purchase orders (PO) and vendor invoices.
- **Campus Facilities**:
  - `/dashboard/facilities/transport` — Bus routes, stops, vehicle tracking, driver rosters.
  - `/dashboard/facilities/hostel` — Dormitory rooms, bed allocations, curfew registers.
  - `/dashboard/facilities/library` — Book catalog, ISBN scanner, issue/return tracker.
  - `/dashboard/facilities/visitors` — Front desk guest check-in, visitor digital passes.
- **HR & Staff**:
  - `/dashboard/teacher` — Staff directory and profile management.
  - `/dashboard/staff/leave` — Teacher leave applications and substitute assignments.

### D. Specialized Sub-Portals (`/portal/*`)
- `/portal/student` — Class schedule, homework submissions, digital report card, bus tracker.
- `/portal/parent` — Child progress, live attendance alerts, tuition payment gateway, teacher chat.
- `/portal/alumni` — Alumni directory, reunion event registration, endowment donations.
- `/portal/vendor` — Purchase order ledger, tender responses, invoice upload.

---

## 9. Functional Modules Deep Dive

### 1. Admissions & Prospective Student CRM
- **Pipeline Stages**: Inquiry $\rightarrow$ Application Submitted $\rightarrow$ Entrance Exam $\rightarrow$ Interview $\rightarrow$ Document Verification $\rightarrow$ Admission Granted $\rightarrow$ Fee Paid $\rightarrow$ Enrolled.
- Automated creation of `User`, `StudentProfile`, and linked `ParentProfile` upon enrollment completion.

### 2. Attendance & Biometric Ingestion
- Dual-mode support: Manual teacher roll-call via dashboard OR automated TCP/IP biometric device sync.
- Configurable thresholds: Automatically triggers SMS/push notification to parents when a student is marked Absent without prior leave.
- Offline PWA attendance synchronization using local storage/IndexedDB for field trips or poor connectivity.

### 3. Examination, Gradebook & Report Cards
- Support for multiple grading schemes: GPA, Percentage, Letter Grades (A+ through F), and CCE.
- **Delta Versioning**: Any post-finalization grade adjustment triggers an audit entry requiring an explanation reason.
- Headless Puppeteer microservice renders high-resolution, branded PDF report cards with QR-verifiable authenticators.

### 4. Fee Structures, Online Collections & Reconciliation
- Flexible installment schedules: Monthly, Quarterly, Term-based, or Annual.
- Dynamic discounts: Sibling discount, staff ward concessions, merit-based scholarships.
- Integrated payment gateways (Stripe, Razorpay) with automated webhook reconciliation to prevent duplicate credits.

### 5. Campus Safety & Zero-Trust Specialty Modules
- **Clinic Records**: Encrypted storage of medical alerts, chronic conditions, and emergency doctor contacts. Accessible only by authorized nurses and emergency responders.
- **Counseling Vault**: Confidential behavioral logs hidden from standard teachers and administrators. Logged view events (`audit_on_read`) ensure zero-leakage accountability.

---

## 10. Current Implementation Status (Completed vs. Missing)

```
┌──────────────────────────────────────────────────────────────┐
│ STATUS SUMMARY                                               │
│ • Public Marketing & Brand:   100% Complete                 │
│ • Architectural Specifications:100% Complete                 │
│ • Frontend Layouts & Pages:    75% Complete                  │
│ • Core CRUD Controllers:       70% Complete                  │
│ • Multi-Tenant RBAC Seeding:   40% Complete (Active Blocker) │
│ • Live API Integration:        50% Complete (Mock Fallbacks) │
│ • Async Queue & PDF Service:   30% Complete                  │
└──────────────────────────────────────────────────────────────┘
```

### ✅ What is Completed & Operational
- Full marketing frontend: Responsive landing page, pricing calculator, features showcase, and 12 custom feature illustrations.
- Interactive contact form with complete lead metadata fields.
- Route directory and layouts for `(saas)`, `(tenant)`, `(portal)`, `(auth)`, and `(frontend)`.
- Core database schema covering all major entities (Tenants, Users, Roles, Academics, Facilities, Finance).
- Basic Express API controllers for authentication, tenants, classes, and users.

### ❌ What is Incomplete / Needs Urgent Attention
- **Default Permissions Seeding**: Newly provisioned schools lack seeded permissions in MongoDB, causing role creation screens to block.
- **Hardcoded Localhost Endpoints**: Password verification points to `http://localhost:8000`, breaking remote Vercel deployments.
- **Mock Fallback Logic**: Residual checks (e.g. `super@admin.com` in `login.tsx`) remain in place rather than strictly querying the database.
- **Navigation Tenant Leaks**: `Platform Admin` sidebar appears for school admins; must be restricted to `saas_super_admin`.
- **Onboarding Logo Dropping**: School logo collected during onboarding is not persisted in the database tenant record.
- **Console-Only Invitations**: User invitation links are only logged to the backend console instead of delivered via transactional email.

---

## 11. Known Bugs, Blockers & White-Box Audit Ledger

### Critical & High Priority Ledger

| ID | Module / File | Bug / Gap Description | Severity | Impact |
|---|---|---|---|---|
| **ISS-01** | `app/(tenant)/admin/roles` & `admin/users` | **Permissions Not Seeded for New Tenants**: Newly registered schools have zero rows in `TenantPermission`. Role creation form is permanently disabled and Invite User modal has an empty role dropdown. | 🔴 Blocker | Prevents newly onboarded schools from operating or delegating staff roles. |
| **ISS-02** | `app/auth/verify/page.tsx` (#L45) | **Hardcoded Localhost API Origin**: Verification form submits to `http://localhost:8000/auth/setup-password`. | 🔴 Blocker | Production users on Vercel cannot activate accounts or set passwords. |
| **ISS-03** | `components/dashboard/data.tsx` | **Platform Admin Navigation Leakage**: The SaaS Platform Admin group is visible to School Super Admins in the tenant sidebar. | 🔴 Blocker | Violates tenant isolation; school admins see platform-level navigation links. |
| **ISS-04** | `components/frontend/login.tsx` (#L76) | **Admin Redirect Target Mismatch**: Admin login attempts redirect to `/dashboard/admin`, which does not exist in the route structure. | 🟠 High | Lands users on a 404 screen after successful login. Must point to `/admin`. |
| **ISS-05** | `dashboard-sidebar.tsx` | **Non-SPA Full Page Reloads**: Sidebar navigation items use standard `<a>` tags instead of Next.js `<Link>`. | 🟠 High | Causes full page reloads, destroys client state, and degrades perceived speed. |
| **ISS-06** | `dashboard-header.tsx` | **Unresponsive Dropdown Triggers**: Switch School, Profile, and Logout triggers fail to toggle smoothly due to Base UI render prop syntax. | 🟠 High | Users cannot switch organizations or log out cleanly from the header. |
| **ISS-07** | `app/onboarding/page.tsx` & `backend/src/controllers/tenant.ts` | **Onboarding Logo Dropped**: Logo is previewed via `logoBase64` in the frontend but omitted from the backend tenant creation controller. | 🟡 Medium | School profiles are created without the institutional emblem uploaded by the user. |
| **ISS-08** | `backend/src/controllers/users.ts` | **Console-Only Mock Email**: New staff invitations generate a `[MOCK EMAIL]` terminal log with hardcoded initial passwords (`isActive: true`). | 🟠 High | Insecure provisioning; requires real email provider (Resend) and one-time setup tokens. |
| **ISS-09** | `dashboard/academics/departments` | **Dead Action Buttons**: "Add Department" and "Add new" buttons trigger no modal dialog in production builds. | 🟠 High | Department creation form cannot be opened from the main index view. |

---

## 12. End-to-End Remediation & Fix Roadmap

```
PHASE 1: Core Functionality & Onboarding (Days 1–3)
  ├── 1. Seed standard permissions & default roles automatically on tenant creation
  ├── 2. Replace hardcoded localhost in /auth/verify with NEXT_PUBLIC_API_URL
  ├── 3. Fix admin login redirect target: change /dashboard/admin -> /admin
  ├── 4. Strictly gate "Platform Admin" sidebar in data.tsx to saas_super_admin only
  └── 5. Persist school logo during onboarding in tenant controller

PHASE 2: Navigation & Component Wiring (Days 4–5)
  ├── 1. Replace <a> tags with Next.js <Link> in dashboard-sidebar.tsx
  ├── 2. Implement accordion auto-collapse (only 1 menu expanded at a time)
  ├── 3. Fix Base UI dropdown handlers in dashboard-header.tsx
  ├── 4. Wire modal trigger on /academics/departments ("Add Department" button)
  └── 5. Remove all hardcoded credentials & mock auth fallbacks from login.tsx

PHASE 3: Provisioning & Email Verification (Days 6–7)
  ├── 1. Connect Resend/SendGrid mailer for staff invitation workflows
  ├── 2. Issue secure, one-time invitation tokens expiring in 48 hours
  ├── 3. Keep invited accounts inactive (isActive: false) until password set
  └── 4. Implement password reset and email change flows

PHASE 4: Enterprise Scale & Background Services (Days 8+)
  ├── 1. Deploy Redis + BullMQ worker instance
  ├── 2. Implement headless Puppeteer report card generator
  ├── 3. Connect payment webhooks for Stripe/Razorpay fee reconciliation
  └── 4. Set up read-replica database queries for analytics dashboards
```

---

## 13. Directory & File Organization Map

```
school-pro/
├── New folder/school-pro-web/               # Primary Next.js 16 Application
│   ├── app/
│   │   ├── (auth)/                          # Authentication Routes
│   │   │   ├── login/page.tsx               # Central Login Interface
│   │   │   ├── register/page.tsx            # Self-Service Registration
│   │   │   └── verify/page.tsx              # Password Setup & Token Verification
│   │   ├── (frontend)/                      # Public Marketing Surface
│   │   │   ├── page.tsx                     # Landing Page & Hero
│   │   │   ├── pricing/page.tsx             # Pricing Tiers & Calculator
│   │   │   ├── features/page.tsx            # Feature Showcase & Specs
│   │   │   └── contact/page.tsx             # Enterprise Contact & Demo Form
│   │   ├── (onboarding)/
│   │   │   └── onboarding/page.tsx          # Multi-Step School Onboarding Wizard
│   │   ├── (saas)/
│   │   │   └── saas-admin/                  # Global Platform Admin Surface
│   │   │       ├── page.tsx                 # SaaS Analytics & Telemetry
│   │   │       ├── tenants/page.tsx         # Tenant Directory & Life Cycle
│   │   │       └── settings/page.tsx        # Platform-Wide Configuration
│   │   ├── (tenant)/
│   │   │   ├── admin/                       # Tenant Super Admin Management
│   │   │   │   ├── users/page.tsx           # User Directory & Role Assignment
│   │   │   │   ├── roles/page.tsx           # RBAC Matrix & Role Creator
│   │   │   │   └── audit/page.tsx           # Security Audit Logs
│   │   │   └── dashboard/                   # Institutional Academic Operations
│   │   │       ├── academics/               # Classes, Subjects, Timetable, Gradebook
│   │   │       ├── students/                # Directory, Attendance, Clinic, Counseling
│   │   │       ├── finance/                 # Fees, Fee Structures, Expenses, Payroll
│   │   │       ├── facilities/              # Transport, Hostel, Library, Visitors
│   │   │       └── teacher/                 # Faculty Directory & Leave Management
│   │   └── (portal)/                        # Constituent Sub-Portals
│   │       ├── student/                     # Student Dashboard, Homework, Report Cards
│   │       ├── parent/                      # Parent Alerts, Child Progress, Fee Gateway
│   │       ├── alumni/                      # Alumni Network, Transcripts, Donations
│   │       └── vendor/                      # Contractor PO Tracking & Invoicing
│   ├── components/
│   │   ├── dashboard/                       # Header, Sidebar, Nav Data, Breadcrumbs
│   │   ├── ui/                              # shadcn / Radix Primitive UI Components
│   │   └── forms/                           # Form Models & Validation Schemas
│   ├── lib/
│   │   ├── api-client.ts                    # Axios / Fetch HTTP Wrapper with Auth Header
│   │   └── utils.ts                         # Tailwind Merge & Formatting Utilities
│   ├── store/                               # Zustand State Management
│   │   └── session-hydrator.tsx             # Client Token & Session Restorer
│   └── types/                               # TypeScript Domain Interfaces
│
├── backend/                                 # Express.js REST API Server
│   ├── src/
│   │   ├── controllers/                     # Route Handlers (Auth, Tenant, User, etc.)
│   │   ├── middleware/                      # Auth Guard, Tenant Isolation, RBAC Gate
│   │   ├── routes/                          # API Route Registrations
│   │   └── utils/                           # Token Generators, Formatters, Mailers
│   └── prisma/
│       └── schema.prisma                    # MongoDB Multi-Tenant Database Schema
│
└── Root Knowledge Documents (Architecture Blueprints):
    ├── SCHOOL_PRO_MASTER_KNOWLEDGE_BASE.md  # (This Master Encyclopedia)
    ├── SCHOOL_MANAGEMENT_SYSTEM_GUIDE.md    # Expanded v2.0 Architecture & Personas
    ├── DYNAMIC_NAVIGATION_AND_PERMISSIONS.md# 4D RBAC & Dynamic Navigation Specs
    ├── GAP_ANALYSIS_AND_ROADMAP.md          # Implementation Matrix: Have vs. Need
    └── USER_REPORTED_ISSUES.md              # Live QA Issue Tracking Ledger
```

---

*This document serves as the absolute single source of truth for the School Pro ecosystem. All engineering, debugging, and feature additions should reference this file to maintain architectural consistency and strict multi-tenant isolation.*
