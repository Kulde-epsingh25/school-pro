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

The highest-impact frontend work is not only visual: it is standardizing API access, authentication, tenant switching, and data states. Once those foundations are corrected, the new navy/blue school-operations visual system can be applied consistently without hiding broken or incomplete functionality behind placeholder content.、】【assistant to=functions.Read from=commentary  (json񎟿_一本道 代  codeപ്പെടുത്ത♀♀♀ json 
