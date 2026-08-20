# User Feedback & Active Issues Tracking Log

> **Purpose**: Dynamic tracking document for issues, UI observations, and feature requests reported directly during testing.

---

## 📌 Issue Ledger

| # | Date & Time | Page / Component | Problem Description | Severity | Status |
|---|---|---|---|---|---|
| 1 | 2026-08-20 | `/dashboard` (Post-Login) | Post-login hydration re-rendering loop | 🔴 Critical | **FIXED** (Ref-locked in `session-hydrator.tsx`) |
| 2 | 2026-08-20 | `components/dashboard/dashboard-header.tsx` | Switch Organization dropdown trigger and header logout button not responsive on click | 🔴 Critical | 🟡 **QUEUED FOR FIX** |
| 3 | 2026-08-20 | `components/dashboard/dashboard-sidebar.tsx` | Sidebar footer user dropdown and sub-item navigation links using raw HTML `<a>` tags instead of Next.js `<Link>` | 🟠 High | 🟡 **QUEUED FOR FIX** |
| 4 | 2026-08-20 | `components/dashboard/dashboard-header.tsx` | Switch organization handler executes aggressive full-page `window.location.reload()` | 🟡 Medium | 🟡 **QUEUED FOR FIX** |
| 5 | 2026-08-20 | `app/(tenant)/admin/users/page.tsx` | Unable to get users, roles, and permissions (API calls fail without fallback for fresh tenant; role dropdown empty) | 🔴 Critical | 🟡 **QUEUED FOR FIX** |
| 6 | 2026-08-20 | `app/(tenant)/admin/roles/page.tsx` | Unable to fetch system permissions matrix (`/roles/permissions`) and custom role creation must strictly scope roles to `tenantId` | 🔴 Critical | 🟡 **QUEUED FOR FIX** |
| 7 | 2026-08-20 | `components/dashboard/dashboard-sidebar.tsx` | Sidebar collapsible sections behavior: items should expand on hover/click and automatically roll up / collapse other open menus (accordion style) | 🟠 High | 🟡 **QUEUED FOR FIX** |
| 8 | 2026-08-20 | `components/dashboard/data.tsx` | Platform Admin (SaaS) navigation group appears in Tenant sidebar for School Super Admins; must be strictly restricted to `saas_super_admin` only | 🔴 Critical | 🟡 **QUEUED FOR FIX** |

---

## 📝 User-Reported Items Queue

1. **Issue #2**: Dashboard Header dropdown menus (Switch School, User Profile, Logout) and action triggers are unresponsive or do not trigger menu popups smoothly due to Base UI render prop syntax.
2. **Issue #3**: Navigation links in the sidebar menu do not use Next.js client-side router transition, causing full HTML document refreshes when navigating between pages.
3. **Issue #4**: Organization switching triggers `window.location.reload()`, causing unnecessary flash and multiple re-renders.
4. **Issue #5 & #6 — Unable to Get Users, Roles & Permissions**:
   - On `/admin/users` and `/admin/roles`, when a new school is onboarded, the backend has no pre-existing records for that tenant. When the API returns empty or fails, the UI completely blocks:
     - **Users**: Table is empty and "Invite User" modal has no roles to select from.
     - **Roles**: Role cards are empty and role creation fails because `/roles/permissions` is empty.
     - **Fix**: The frontend must supply a complete foundational set of **System Permissions** and **Standard School Roles** (`School Principal / Super Admin`, `Academic Coordinator`, `Teacher`, `Admissions Officer`, `Finance Officer / Bursar`, `Transport Coordinator`, `Hostel Warden`, `Exam Officer`) scoped automatically to the current `tenantId`, so the administrator can immediately manage permissions and assign roles without dead ends.
5. **Issue #7**: Sidebar navigation dropdown accordion behavior: Sub-navigation menus should open on click/hover and automatically collapse previous open menus so only one active group is expanded at a time without cluttering the screen.
6. **Issue #8**: **Tenant Isolation in Navigation**: As a school tenant admin (`super_admin` of a school), the global **"Platform Admin" (SaaS)** section should NOT appear in the navigation bar. Platform Admin must only be visible to platform-level `saas_super_admin`.

---

## 🚀 Fix Instructions & Execution Log

- Ready to fix:
  1. Fix `data.tsx`: Strictly gate the `Platform Admin` sidebar menu so ONLY users with `roles.includes("saas_super_admin")` see it.
  2. Implement accordion auto-collapse roll-up behavior and Next.js `<Link>` routing in [`dashboard-sidebar.tsx`](file:///c:/Users/HP/Documents/claude-code/New%20folder/school-pro-web/components/dashboard/dashboard-sidebar.tsx).
  3. Fix dropdown triggers in [`dashboard-header.tsx`](file:///c:/Users/HP/Documents/claude-code/New%20folder/school-pro-web/components/dashboard/dashboard-header.tsx).
  4. In [`app/(tenant)/admin/roles/page.tsx`](file:///c:/Users/HP/Documents/claude-code/New%20folder/school-pro-web/app/%28tenant%29/admin/roles/page.tsx), provide standard operational permissions matrix and default school roles if the tenant is newly initialized, persisting custom roles under `tenantId`.
  5. In [`app/(tenant)/admin/users/page.tsx`](file:///c:/Users/HP/Documents/claude-code/New%20folder/school-pro-web/app/%28tenant%29/admin/users/page.tsx), ensure the invite user modal always has available roles to assign and seamlessly persists newly invited users.
