# White-Box Test Report

Target: https://school-pro-mocha-beta.vercel.app/

Scope: source-level review of the deployed app's auth, onboarding, and provisioning flows.

## Summary

I found four high-value issues that affect production behavior. The most severe is the password verification page, which is hardcoded to a local backend URL and will fail outside a dev machine. The next biggest issue is an admin login redirect that points to a route that does not exist in the current app structure. I also found two provisioning gaps: the onboarding logo is collected but not persisted, and the invitation flow still relies on mock email / fixed passwords instead of a real delivery service.

## Findings

### 1. Blocker: account verification is hardcoded to localhost

- Evidence: [app/auth/verify/page.tsx](app/auth/verify/page.tsx#L45)
- What happens: the verification form posts to `http://localhost:8000/auth/setup-password`.
- Why it matters: the deployed site cannot complete password setup unless the backend is running on the same local machine. Any invitation link opened in production will fail at submit time.
- Fix: read the API origin from configuration or `NEXT_PUBLIC_API_URL`, and keep the verify flow pointed at the deployed backend.

### 2. High: admin users are redirected to a route that does not exist

- Evidence: [components/frontend/login.tsx](components/frontend/login.tsx#L76), [components/frontend/login.tsx](components/frontend/login.tsx#L77)
- Supporting route map: the app exposes admin pages under [app/(tenant)/admin/users/page.tsx](app/(tenant)/admin/users/page.tsx) and related files, not under `/dashboard/admin`.
- What happens: users with the `admin` role are sent to `/dashboard/admin`.
- Why it matters: that URL does not match the current app structure, so the redirect can land on a 404 or an unexpected screen.
- Fix: change the redirect target to `/admin` or add a real `/dashboard/admin` route and wire it consistently everywhere.

### 3. Medium: onboarding logo upload is previewed but not persisted

- Evidence: [app/onboarding/page.tsx](app/onboarding/page.tsx#L19), [app/onboarding/page.tsx](app/onboarding/page.tsx#L38), [app/onboarding/page.tsx](app/onboarding/page.tsx#L152), [app/onboarding/page.tsx](app/onboarding/page.tsx#L171)
- Backend sink: [backend/src/controllers/tenant.ts](backend/src/controllers/tenant.ts#L25), [backend/src/controllers/tenant.ts](backend/src/controllers/tenant.ts#L33), [backend/src/controllers/tenant.ts](backend/src/controllers/tenant.ts#L50)
- What happens: the onboarding form stores `logoBase64` in client state and submits the full form payload, but the tenant controller only reads `name`, `schoolName`, `domain`, `adminFirstName`, `adminLastName`, `adminEmail`, and `plan`.
- Why it matters: the user sees a logo upload control and preview, but the data is dropped before tenant creation, so the logo never reaches persistence.
- Fix: add a logo field to the backend contract and save it during tenant creation, or remove the UI control until persistence exists.

### 4. High: tenant/user provisioning still uses mock credentials and console-only email

- Evidence: [backend/src/controllers/tenant.ts](backend/src/controllers/tenant.ts#L50), [backend/src/controllers/tenant.ts](backend/src/controllers/tenant.ts#L177), [backend/src/controllers/users.ts](backend/src/controllers/users.ts#L32), [backend/src/controllers/users.ts](backend/src/controllers/users.ts#L60)
- What happens: new tenant admins are created with a fixed temporary password and marked active immediately, while the invite flow only logs a `[MOCK EMAIL]` link to the server console.
- Why it matters: there is no real email delivery or secure invitation workflow, so newly created admins are not actually forced through a verifiable activation path. This also leaves a predictable password in the system during provisioning.
- Fix: replace the mock console output with a real email provider and one-time invitation tokens that let the user set their own password before activation.

## Notes

- The onboarding UI in [app/onboarding/page.tsx](app/onboarding/page.tsx) is the stronger flow compared with the legacy onboarding component in [components/forms/school/school-onboarding-form.tsx](components/forms/school/school-onboarding-form.tsx), but both still need backend alignment before they are production-safe.
- I did not find a `/super-admin` route in the current app tree, so any future role routing should be checked against the actual route structure before rollout.

## Verdict

The app has a usable shape, but these issues are strong enough that I would not call the auth/onboarding path production-ready yet.
