# User Observations & Requested Fixes

This file tracks all observations, feedback, and requested fixes for the School Pro project. 
*Note: These are pending changes to be implemented at a later time.*

## 1. Onboarding Flow UI Preference
- **Observation:** The user prefers the design and flow of the `/onboarding` page (`https://school-pro-mocha-beta.vercel.app/onboarding`) over the newer `/school-onboarding` page. This is the "best onboarding".
- **Requested Fix:** Keep the `/onboarding` UI, but add a **Logo Input** field at the very first "Institution level" step of the form.
- **Requested Fix:** Redirect all "school onboarding" links across the application to point to this `/onboarding` URL instead.
- **Requested Fix:** Ensure that this specific onboarding flow adds/creates a user with the `SUPER_ADMIN` role.
- **Observation:** The frontend contains hardcoded mock logic (like checking `values.email === "super@admin.com"` in `login.tsx`).
- **Requested Fix:** Remove all mock authentication and hardcoded role checks from the frontend. Fully connect the `/login` flow (and any other mocked forms) to the live backend API to verify credentials and fetch real roles dynamically.

## 2. Overarching Architecture Goals (Backend Integration)
- **Requirement:** The onboarding flow must successfully register a school and automatically create its initial master user (e.g., Super Admin / School Admin) in the database.
- **Requirement:** The login system must have completely clean logic that ALWAYS checks the user's role directly from the database and redirects them to their correct respective dashboard (`/super-admin`, `/dashboard/admin`, etc.). No exceptions.
- **Requirement:** Absolute removal of ALL mock logic across the entire frontend. Since the backend is fully operational, the frontend must exclusively communicate with the live API.
## 3. Admin Creation & User Provisioning
- **Requirement:** A Super Admin must be able to manually create a new School Admin (or other roles).
- **Observation:** Currently, when a user is created via the backend API, the system bypasses email verification (hardcodes `isActive: true` and a default password). It only outputs a "Mock Email" magic link in the server console.
- **Requested Fix:** Implement a real email verification service (like Resend or SendGrid) that sends a secure invitation link to newly created admins so they can verify their email and securely set their own password before their account becomes `isActive: true`.
