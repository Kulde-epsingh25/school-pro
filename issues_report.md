# E2E Testing Bug & UX Report

This document tracks all bugs, blockers, and UX improvements identified during the End-to-End testing of the School Pro application.

## Bugs & Blockers

### 1. Permissions Not Seeded for New Tenants
**Severity**: High (Blocker)
**Location**: `app/(tenant)/dashboard/organization/roles/page.tsx`
**Description**: When a new school/tenant is created, the system displays a warning on the Role Creation form: *"No permissions have been seeded for this organization yet. Please contact support."* Because no permissions are available, the "Create Role" button remains disabled, preventing admins from creating roles for their staff.
**Temporary Workaround**: The browser subagent had to bypass the client-side disabled state via JavaScript to force-submit the form with empty permissions.
**Proposed Fix**: The backend Tenant Provisioning logic must automatically seed the standard permissions for the tenant upon creation.

### 2. "Add Department" / "Add new" Buttons Unresponsive
**Severity**: High (Blocker)
**Location**: `app/(tenant)/dashboard/academics/departments/page.tsx`
**Description**: On the deployed Vercel site, clicking the "Add Department" button (next to the header) or the "Add new" button (in the top right corner) does absolutely nothing. No dialog or modal opens. 
**Temporary Workaround**: None. The React `onClick` handler appears to be missing or failing silently in the production build.
**Proposed Fix**: Investigate the component wiring for the `Departments` page (likely missing a state toggle for the modal or an unhandled client-side error).
