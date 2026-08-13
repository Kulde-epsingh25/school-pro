# Frontend Changes and UI Improvement Plan

This document lists the recommended frontend fixes for School Pro, with file names and implementation examples. These changes are proposed documentation only; they have not been applied yet.

## Priority 1: Fix API client URL and error handling

### File
`lib/api-client.ts`

### Problems
- `tenantId` is always appended with `?`, which breaks endpoints that already have query parameters.
- Backend errors may be objects, but the frontend treats them as strings.
- `any` is used for request data and caught errors.

### Recommended code

```ts
interface ApiErrorBody {
  error?: string | { message?: string; code?: string };
  code?: string;
  message?: string;
}

interface ApiResponse<T> {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
  code?: string;
}

function getErrorMessage(body: ApiErrorBody, fallback: string) {
  if (typeof body.error === "string") return body.error;
  if (body.error?.message) return body.error.message;
  if (body.message) return body.message;
  return fallback;
}

// Replace URL construction inside request()
const url = new URL(`${this.baseUrl}${endpoint}`);

if (
  tenantId &&
  !endpoint.includes("/saas") &&
  !endpoint.includes("/auth")
) {
  url.searchParams.set("tenantId", tenantId);
}

const response = await fetch(url.toString(), {
  ...options,
  headers,
  credentials: "include",
});

const body = (await response.json()) as ApiErrorBody;

return {
  ok: response.ok,
  status: response.status,
  data: body as T,
  error: response.ok
    ? undefined
    : getErrorMessage(body, "Something went wrong"),
  code: body.code,
};
```

## Priority 2: Use the API client in the dashboard

### File
`app/(tenant)/dashboard/page.tsx`

### Problems
- The dashboard bypasses `apiClient` and manually sends `x-user-id`.
- The page uses hardcoded attendance, fee, and admissions data as fallback content.
- No visible loading skeleton or error state is rendered.
- Several unused imports make the page harder to maintain.

### Recommended types

```ts
type DashboardMetrics = {
  stats: {
    totalStudents: number;
    totalTeachers: number;
    totalParents: number;
    totalRevenue: number;
  };
  attendanceData: { name: string; value: number }[];
  feeCollectionData: { name: string; value: number }[];
  recentAdmissions: {
    customer: string;
    email: string;
    source: string;
    status: string;
    date: string;
    amount: string;
  }[];
};
```

### Recommended loading and error state

```tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

const [error, setError] = useState<string | null>(null);

const fetchDashboardData = async () => {
  setLoading(true);
  setError(null);

  const response = await apiClient.get<DashboardMetrics>("/dashboard/metrics");

  if (!response.ok || !response.data) {
    setError(response.error ?? "Unable to load dashboard metrics.");
    setLoading(false);
    return;
  }

  const data = response.data;
  setStats([
    {
      title: "Students",
      value: data.stats.totalStudents.toLocaleString(),
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Teachers",
      value: data.stats.totalTeachers.toLocaleString(),
      icon: GraduationCap,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Parents",
      value: data.stats.totalParents.toLocaleString(),
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Fee revenue",
      value: `₹${data.stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ]);
  setRevenueData(data.feeCollectionData);
  setRecentData(data.recentAdmissions);
  setLoading(false);
};
```

### Recommended JSX states

```tsx
{loading ? (
  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
    {Array.from({ length: 4 }).map((_, index) => (
      <Skeleton key={index} className="h-28 rounded-xl" />
    ))}
  </div>
) : error ? (
  <Alert variant="destructive">
    <AlertCircle />
    <AlertTitle>Dashboard unavailable</AlertTitle>
    <AlertDescription>{error}</AlertDescription>
  </Alert>
) : (
  <StatCards cards={stats} />
)}
```

## Priority 3: Improve the dashboard header

### File
`components/dashboard/dashboard-header.tsx`

### Problems
- Search placeholder says `Search products...`, which is unrelated to school management.
- School switching performs a full browser reload.
- Theme and add buttons do not have visible behavior.
- Profile links are not connected to routes.
- `any[]` is used for tenant data.

### Recommended tenant type

```ts
type Tenant = {
  id: string;
  name: string;
  logo?: string | null;
};

const [tenants, setTenants] = React.useState<Tenant[]>([]);
```

### Replace the search input

```tsx
<Input
  aria-label="Search school data"
  placeholder="Search students, classes, fees..."
  value={searchQuery}
  onChange={(event) => setSearchQuery(event.target.value)}
  className="hidden max-w-md flex-1 md:flex"
/>
```

### Replace hard reload when changing schools

```tsx
onClick={() => {
  setSchool(tenant);
  router.refresh();
}}
```

If client-side data remains stale after `router.refresh()`, add a tenant-aware query cache later instead of reloading the entire page.

### Make actions meaningful

```tsx
<Button
  variant="outline"
  size="icon"
  aria-label="Create new record"
  onClick={() => router.push("/admin/students/new")}
>
  <Plus data-icon="inline-start" />
</Button>
```

## Priority 4: Improve sidebar navigation

### File
`components/dashboard/dashboard-sidebar.tsx`

### Problems
- Sidebar links use raw `<a>` tags, causing full page navigations.
- The footer menu includes placeholder actions such as Upgrade to Pro and Billing.
- Log out is not wired to the existing auth action.
- The plan label is hardcoded as `Premium`.

### Recommended navigation link

```tsx
import Link from "next/link";

<SidebarMenuSubButton render={<Link href={subItem.url} />}>
  <span>{subItem.title}</span>
</SidebarMenuSubButton>
```

### Recommended user menu actions

```tsx
<DropdownMenuItem onClick={() => router.push("/profile")}>
  <BadgeCheck data-icon="inline-start" />
  Account
</DropdownMenuItem>

<DropdownMenuItem onClick={() => router.push("/settings")}>
  <Bell data-icon="inline-start" />
  Notifications
</DropdownMenuItem>

<DropdownMenuItem onClick={handleLogout}>
  <LogOut data-icon="inline-start" />
  Log out
</DropdownMenuItem>
```

The sidebar should receive an `onLogout` callback or import the existing logout action consistently with the header.

## Priority 5: Replace generic dashboard icons and colors

### Files
- `app/(tenant)/dashboard/page.tsx`
- `components/dashboard/stat-cards.tsx`

### Problems
Every statistic currently uses `LayoutGrid`, and direct Tailwind colors such as `text-blue-600` and `bg-blue-100` make the visual system inconsistent.

### Recommended mapping

```tsx
import {
  CircleDollarSign,
  GraduationCap,
  Users,
  UserRoundCheck,
} from "lucide-react";

const cards = [
  { title: "Students", icon: Users },
  { title: "Teachers", icon: GraduationCap },
  { title: "Parents", icon: UserRoundCheck },
  { title: "Fee revenue", icon: CircleDollarSign },
];
```

Use semantic classes in the stat-card component:

```tsx
<div className="bg-primary/10 text-primary rounded-lg p-2">
  <Icon aria-hidden="true" />
</div>
```

## Priority 6: Fix application metadata and root background

### File
`app/layout.tsx`

### Replace current metadata

```ts
export const metadata: Metadata = {
  title: {
    default: "School Pro",
    template: "%s | School Pro",
  },
  description:
    "School Pro helps schools manage students, teachers, attendance, fees, communication, and daily operations.",
};
```

### Update the root element

```tsx
<html lang="en" className="bg-background font-sans antialiased">
  <body className="min-h-screen bg-background text-foreground">
    {children}
  </body>
</html>
```

## Priority 7: Improve the design tokens

### File
`app/globals.css`

The existing tokens are mostly neutral. For a more recognizable school operations product, use one primary blue, one warm accent, and neutral surfaces while staying within the 3–5 color limit.

### Suggested token direction

```css
:root {
  --primary: oklch(0.48 0.18 255);
  --primary-foreground: oklch(0.98 0.01 255);
  --accent: oklch(0.92 0.08 85);
  --accent-foreground: oklch(0.25 0.04 85);
  --background: oklch(0.98 0.01 250);
  --foreground: oklch(0.22 0.03 250);
  --muted: oklch(0.94 0.02 250);
  --muted-foreground: oklch(0.48 0.03 250);
}
```

For dark mode, keep the same primary hue and use a deep navy background instead of pure black.

## Priority 8: Add proper empty states

### Recommended files
Apply to pages containing placeholder or missing data, especially:

- `app/(portal)/portal/parent/messages/page.tsx`
- `app/(portal)/portal/parent/payments/page.tsx`
- `app/(tenant)/portal/student/assignments/page.tsx`
- `app/(tenant)/portal/student/noticeboard/page.tsx`
- `app/(tenant)/portal/teacher/noticeboard/page.tsx`

### Recommended component

```tsx
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";

<Empty>
  <EmptyHeader>
    <EmptyTitle>No messages yet</EmptyTitle>
    <EmptyDescription>
      Messages from teachers and school administrators will appear here.
    </EmptyDescription>
  </EmptyHeader>
</Empty>
```

Do not display fake messages, payments, attendance, or admissions just to fill the screen.

## Priority 9: Standardize page feedback

### Recommended pattern

Every data-driven page should have four states:

1. Loading: use `Skeleton`.
2. Error: use `Alert` with a retry button.
3. Empty: use `Empty`.
4. Success: show real data with `Badge`, `Table`, or `Card`.

```tsx
{error ? (
  <Alert variant="destructive">
    <AlertTitle>Could not load records</AlertTitle>
    <AlertDescription>{error}</AlertDescription>
    <Button variant="outline" onClick={loadRecords}>
      Try again
    </Button>
  </Alert>
) : records.length === 0 ? (
  <Empty>
    <EmptyTitle>No records found</EmptyTitle>
    <EmptyDescription>New records will appear here.</EmptyDescription>
  </Empty>
) : (
  <RecordsTable records={records} />
)}
```

## Priority 10: Remove frontend placeholders

Search the frontend for these patterns and replace them with real behavior:

```text
Search products...
Premium
Upgrade to Pro
user@example.com
CN
placeholder.svg
mock data
sample data
window.location.reload()
console.log(...)
```

Likely pages requiring attention include onboarding, school admin, parent messages, parent payments, student assignments, timetable, noticeboard, and SaaS admin pages.

## Suggested visual redesign

- Use a deep navy sidebar and blue primary action color.
- Keep page backgrounds quiet and reserve the accent color for actions and statuses.
- Make dashboard cards more compact and information-dense.
- Add a clear page title, description, and primary action to every page.
- Use tables for operational data and cards only for summaries.
- Add status badges for attendance, payment, enrollment, and approval states.
- Add responsive mobile navigation through the existing Sidebar/Sheet primitives.
- Add command-style global search for students, teachers, classes, fees, and announcements.
- Use real empty states and skeletons instead of hardcoded sample content.

## Recommended implementation order

1. `lib/api-client.ts`
2. `app/(tenant)/dashboard/page.tsx`
3. `components/dashboard/dashboard-header.tsx`
4. `components/dashboard/dashboard-sidebar.tsx`
5. `app/layout.tsx`
6. `app/globals.css`
7. Placeholder portal and admin pages
8. Shared loading, error, and empty-state components

This order fixes the shared frontend foundation first, then improves the primary dashboard, and finally applies the same patterns throughout the portals.

## Validation checklist

- [ ] No dashboard page manually sends `x-user-id`.
- [ ] All tenant URLs use `URL.searchParams`.
- [ ] API errors render readable messages.
- [ ] Dashboard does not display fake data when the API fails.
- [ ] School switching does not perform a full browser reload.
- [ ] Sidebar navigation uses `next/link`.
- [ ] Theme and add buttons perform real actions or are removed.
- [ ] Every data page has loading, error, empty, and success states.
- [ ] Root metadata no longer says `Create Next App`.
- [ ] Lint warnings are resolved without adding `any`.
- [ ] Desktop and mobile layouts are verified in the browser.

## Summary

The highest-impact frontend work is not only visual: it is standardizing API access, authentication, tenant switching, and data states. Once those foundations are corrected, the new navy/blue school-operations visual system can be applied consistently without hiding broken or incomplete functionality behind placeholder content.

---

# Agent Prompt: Implement the School Pro Frontend Improvements

Copy the prompt below into your coding agent. The agent should implement the changes in small, reviewable steps instead of changing the entire application at once.

## Role

You are a senior Next.js 16 frontend engineer working on School Pro, a multi-tenant school-management platform. You must understand the existing repository before editing it. Preserve existing working behavior, authentication, route structure, and backend contracts. Do not replace real API calls with mock data or localStorage.

## Primary objective

Make the frontend production-ready by:

1. Standardizing API calls through `lib/api-client.ts`.
2. Removing fake and placeholder data from user-facing pages.
3. Adding consistent loading, error, empty, and success states.
4. Fixing tenant switching and role-aware navigation.
5. Improving the dashboard UI for school operations.
6. Fixing metadata, accessibility, responsiveness, and semantic design tokens.
7. Keeping all changes compatible with the existing Next.js App Router and shadcn/ui setup.

## Non-negotiable rules

- First inspect the relevant file, parent layout, shared components, types, and existing API patterns.
- Do not guess backend endpoints. Search the backend route definitions before using an endpoint.
- Do not use `localStorage` for persistence.
- Do not hardcode students, payments, attendance, admissions, messages, or notices as production data.
- Do not use `any` when a real type can be created.
- Do not use `window.location.reload()` for tenant switching or ordinary data refreshes.
- Use `URL` and `URLSearchParams` for query parameters.
- Use `next/link` for internal navigation.
- Use shadcn components already installed in the project before creating custom equivalents.
- Use semantic Tailwind tokens such as `bg-background`, `text-foreground`, `bg-primary`, and `text-muted-foreground`.
- Do not introduce more than two font families or more than five major colors.
- Preserve the current authentication mechanism and send credentials consistently.
- Never expose secrets, tokens, or private environment-variable values in client components.
- Escape apostrophes and JSX characters according to repository conventions.
- Add accessible labels, keyboard support, focus states, and useful empty states.
- Do not remove imports before removing the code that uses them; clean unused imports afterward.
- After each logical change, run the relevant lint, type-check, build, and browser checks.

## Phase 1: Repository audit

Before writing code, inspect:

```text
package.json
app/layout.tsx
app/globals.css
lib/api-client.ts
proxy.ts
components/dashboard/dashboard-header.tsx
components/dashboard/dashboard-sidebar.tsx
app/(tenant)/dashboard/page.tsx
app/(portal)/**
app/(tenant)/portal/**
app/(saas)/**
backend/src/**
backend/prisma/schema.prisma
```

Search for unfinished behavior:

```bash
grep -RInE "TODO|FIXME|coming soon|not implemented|placeholder|mock|dummy|hardcoded|window.location.reload|Search products" app components lib
```

Create a short audit table before implementation:

| Area | File | Problem | Existing endpoint/component | Proposed fix |
|---|---|---|---|---|

Do not start the redesign until the audit identifies the actual page and shared component used by each issue.

## Phase 2: Fix the shared API client

### File

`lib/api-client.ts`

### Required behavior

- Build URLs with `new URL()`.
- Preserve existing endpoint query parameters.
- Add `tenantId` using `url.searchParams.set()` only where appropriate.
- Send `credentials: "include"`.
- Use the project’s existing authentication header/cookie convention.
- Parse both string errors and nested backend errors.
- Return a typed response.
- Handle empty responses such as `204 No Content` safely.
- Never display raw server objects as `[object Object]`.

### Suggested implementation lines

```ts
export type ApiErrorBody = {
  error?: string | { message?: string; code?: string };
  message?: string;
  code?: string;
};

export type ApiResponse<T> = {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
  code?: string;
};

function readApiError(body: ApiErrorBody | null, fallback: string): string {
  if (!body) return fallback;
  if (typeof body.error === "string") return body.error;
  if (body.error?.message) return body.error.message;
  if (body.message) return body.message;
  return fallback;
}
```

Use this URL pattern:

```ts
const url = new URL(endpoint, this.baseUrl);

if (tenantId && !endpoint.startsWith("/auth") && !endpoint.startsWith("/saas")) {
  url.searchParams.set("tenantId", tenantId);
}

const response = await fetch(url.toString(), {
  ...options,
  credentials: "include",
  headers: {
    Accept: "application/json",
    ...options.headers,
  },
});

const text = await response.text();
const body = text ? (JSON.parse(text) as T & ApiErrorBody) : null;

return {
  ok: response.ok,
  status: response.status,
  data: response.ok ? (body as T) : undefined,
  error: response.ok ? undefined : readApiError(body, "Request failed"),
  code: body?.code,
};
```

If the repository already uses a different `baseUrl` or auth header, preserve that convention and only apply the safe URL/error parsing improvements.

## Phase 3: Make the dashboard data-driven

### File

`app/(tenant)/dashboard/page.tsx`

### Required behavior

- Use `apiClient` instead of direct `fetch()`.
- Define a `DashboardMetrics` type based on the actual backend response.
- Remove hardcoded fallback admissions, attendance, and revenue values.
- Show skeletons while loading.
- Show an `Alert` with a retry action when loading fails.
- Show `Empty` when the API returns no records.
- Keep the page responsive at mobile, tablet, and desktop widths.
- Do not fetch inside `useEffect` if the app already has an established server-data or SWR pattern; follow the existing project convention.

### Suggested type lines

```ts
type DashboardMetrics = {
  stats: {
    totalStudents: number;
    totalTeachers: number;
    totalParents: number;
    totalRevenue: number;
  };
  attendanceData: Array<{ name: string; value: number }>;
  feeCollectionData: Array<{ name: string; value: number }>;
  recentAdmissions: Array<{
    id: string;
    studentName: string;
    email?: string | null;
    status: string;
    createdAt: string;
  }>;
};
```

### Suggested loading/error lines

```tsx
{isLoading ? (
  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Loading dashboard">
    {Array.from({ length: 4 }).map((_, index) => (
      <Skeleton key={index} className="h-28 rounded-xl" />
    ))}
  </div>
) : error ? (
  <Alert variant="destructive">
    <AlertCircle data-icon="inline-start" />
    <AlertTitle>Dashboard unavailable</AlertTitle>
    <AlertDescription className="flex flex-wrap items-center gap-3">
      <span>{error}</span>
      <Button variant="outline" size="sm" onClick={reload}>
        Try again
      </Button>
    </AlertDescription>
  </Alert>
) : data?.recentAdmissions.length === 0 ? (
  <Empty>
    <EmptyHeader>
      <EmptyTitle>No admissions yet</EmptyTitle>
      <EmptyDescription>New student admissions will appear here.</EmptyDescription>
    </EmptyHeader>
  </Empty>
) : (
  <DashboardContent data={data} />
)}
```

Do not invent `reload` or `DashboardContent` if equivalent project functions already exist. Adapt the names to the existing implementation.

## Phase 4: Improve shared dashboard navigation

### Files

```text
components/dashboard/dashboard-header.tsx
components/dashboard/dashboard-sidebar.tsx
```

### Header requirements

- Replace `Search products...` with `Search students, classes, fees...`.
- Add an accessible label to the search field.
- Use a typed tenant model instead of `any[]`.
- Replace full reloads with the project’s tenant state update and `router.refresh()`.
- Connect profile, settings, notifications, and logout actions to existing routes/actions.
- Remove or hide actions that do not exist yet instead of presenting dead buttons.

### Suggested header lines

```tsx
type Tenant = {
  id: string;
  name: string;
  logo?: string | null;
};

<Input
  aria-label="Search school data"
  placeholder="Search students, classes, fees..."
  value={searchQuery}
  onChange={(event) => setSearchQuery(event.target.value)}
/>
```

For an internal route:

```tsx
import Link from "next/link";

<Button render={<Link href="/admin/students/new" />}>
  Add student
</Button>
```

Use the correct `render` or `asChild` API based on the project’s shadcn base configuration. Inspect `components.json` before choosing.

### Sidebar requirements

- Replace raw internal `<a>` elements with `Link`.
- Keep active-route styling accessible and visible.
- Remove fake `Upgrade to Pro`, billing, or premium labels unless those features exist.
- Use the existing logout action and show a pending state.
- Ensure all menu items work on mobile and desktop.

## Phase 5: Replace placeholder pages with honest states

Inspect and update these pages if they contain mock values:

```text
app/school-admin/[schoolId]/page.tsx
app/(portal)/portal/parent/messages/page.tsx
app/(portal)/portal/parent/payments/page.tsx
app/(tenant)/portal/student/assignments/page.tsx
app/(tenant)/portal/student/noticeboard/page.tsx
app/(tenant)/portal/teacher/noticeboard/page.tsx
app/(tenant)/portal/student/timetable/page.tsx
app/(tenant)/portal/teacher/timetable/page.tsx
```

For each page:

1. Locate the real backend endpoint.
2. Create a response type.
3. Use the shared API client.
4. Add loading, error, empty, and success states.
5. Add retry behavior.
6. Validate IDs, dates, and amounts before rendering.
7. Never show fake records when the API is unavailable.

### Suggested empty state

```tsx
<Empty>
  <EmptyHeader>
    <EmptyTitle>No messages yet</EmptyTitle>
    <EmptyDescription>
      Messages from teachers and school administrators will appear here.
    </EmptyDescription>
  </EmptyHeader>
</Empty>
```

### Suggested status badge

```tsx
<Badge variant={status === "PAID" ? "default" : "secondary"}>
  {statusLabel}
</Badge>
```

Use the existing badge variants and avoid raw color classes.

## Phase 6: Apply the visual system

### Files

```text
app/layout.tsx
app/globals.css
```

Use a focused school-operations visual direction:

- Primary: trustworthy blue.
- Neutral: cool gray surfaces.
- Structure: deep navy sidebar only where needed.
- Accent: limited warm amber for attention states.
- Typography: no more than two font families.
- Layout: flexbox first, grid only for true two-dimensional data.
- Cards: use for summaries, not every piece of content.
- Tables: use for operational records.

### Metadata lines

```ts
export const metadata: Metadata = {
  title: {
    default: "School Pro",
    template: "%s | School Pro",
  },
  description:
    "School Pro helps schools manage students, teachers, attendance, fees, communication, and daily operations.",
};
```

### Root layout lines

```tsx
<html lang="en" className="bg-background font-sans antialiased">
  <body className="min-h-screen bg-background text-foreground">
    {children}
  </body>
</html>
```

Do not replace the existing font setup without inspecting `next/font` imports first.

### CSS token direction

Use the existing CSS variable names. Only change their values if the project currently supports those tokens:

```css
:root {
  --background: oklch(0.98 0.01 250);
  --foreground: oklch(0.22 0.03 250);
  --primary: oklch(0.48 0.18 255);
  --primary-foreground: oklch(0.98 0.01 255);
  --muted: oklch(0.94 0.02 250);
  --muted-foreground: oklch(0.48 0.03 250);
  --accent: oklch(0.92 0.08 85);
  --accent-foreground: oklch(0.25 0.04 85);
}
```

Do not introduce direct `bg-white`, `text-black`, `bg-blue-600`, or similar hardcoded colors in new code.

## Phase 7: Quality and verification

After implementation, run:

```bash
npm run lint
npm run build
cd backend && npm run build
```

Then verify in a real browser:

1. Open the deployed preview.
2. Check the current desktop viewport.
3. Check a mobile viewport.
4. Log in with a valid test account.
5. Switch tenants.
6. Open the dashboard.
7. Trigger an API error and confirm the error alert is readable.
8. Test an empty state.
9. Test the primary dashboard action.
10. Verify that sidebar links do not cause unexpected full reloads.

Take a screenshot of the dashboard after verification and inspect for:

- clipped content
- unreadable contrast
- broken mobile layout
- missing loading states
- fake data still visible
- buttons with no behavior
- incorrect route links

## Definition of done

The work is complete only when:

- The frontend uses one consistent API access pattern.
- Tenant query parameters remain valid for every endpoint.
- API errors render useful messages.
- The dashboard renders real data or an honest loading/error/empty state.
- Placeholder content is removed from the identified pages.
- Header and sidebar actions work or are removed.
- Metadata identifies School Pro.
- The UI is responsive and accessible.
- Lint and frontend build pass.
- Backend compatibility is preserved.
- Browser verification confirms the primary user flows.

## Expected agent response

At the end, report:

1. Files changed.
2. Backend endpoints used.
3. Mock/placeholder content removed.
4. Tests and builds run.
5. Browser flows verified.
6. Any remaining blockers with exact file names and error messages.

Do not claim completion if a build, lint check, or primary browser flow is failing.、】【assistant to=functions.Read from=commentary  (json񎟿_一本道 代  codeപ്പെടുത്ത♀♀♀ json 
