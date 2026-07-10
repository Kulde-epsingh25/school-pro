# Graph Report - school-pro-web  (2026-07-06)

## Corpus Check
- 178 files · ~139,953 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 636 nodes · 1723 edges · 46 communities (32 shown, 14 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3eac5e62`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 120 edges
2. `Button()` - 65 edges
3. `Input()` - 49 edges
4. `useAuthStore` - 45 edges
5. `useSchoolStore` - 26 edges
6. `Card()` - 20 edges
7. `CardHeader()` - 19 edges
8. `CardContent()` - 19 edges
9. `CardTitle()` - 18 edges
10. `DialogContent()` - 18 edges

## Surprising Connections (you probably didn't know these)
- `SiteHeader()` --calls--> `cn()`  [EXTRACTED]
  components/frontend/site-header.tsx → lib/utils.ts
- `DialogOverlay()` --calls--> `cn()`  [EXTRACTED]
  components/ui/dialog.tsx → lib/utils.ts
- `DropdownMenuSubTrigger()` --calls--> `cn()`  [EXTRACTED]
  components/ui/dropdown-menu.tsx → lib/utils.ts
- `DropdownMenuSubContent()` --calls--> `cn()`  [EXTRACTED]
  components/ui/dropdown-menu.tsx → lib/utils.ts
- `DropdownMenuCheckboxItem()` --calls--> `cn()`  [EXTRACTED]
  components/ui/dropdown-menu.tsx → lib/utils.ts

## Communities (46 total, 14 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (39): FormInputProps, FormSelectProps, childrenData, DashboardHeader(), DashboardSidebar(), data, getNavData(), TableFilters() (+31 more)

### Community 1 - "Community 1"
Cohesion: 0.08
Nodes (57): AccountDetails, AccountPage(), SaaSAuditPage(), TenantAuditPage(), attendanceData, DashboardPage(), data, defaultStats (+49 more)

### Community 2 - "Community 2"
Cohesion: 0.05
Nodes (50): getSaaSAuditLogs(), getTenantAuditLogs(), prisma, login(), prisma, setupPassword(), createClass(), createStream() (+42 more)

### Community 3 - "Community 3"
Cohesion: 0.13
Nodes (18): class_props, stream_props, ClassesPage(), ClassItem, Stream, AdminContactsPage(), Contact, TextInputProps (+10 more)

### Community 4 - "Community 4"
Cohesion: 0.12
Nodes (14): Icons, LoginFormValues, loginSchema, Icons, RegisterFormValues, registerSchema, Form(), FormControl() (+6 more)

### Community 5 - "Community 5"
Cohesion: 0.1
Nodes (27): useIsMobile(), navItems, Sidebar(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup() (+19 more)

### Community 6 - "Community 6"
Cohesion: 0.11
Nodes (9): DeskboardPreview(), features, HeroSection(), LogoCloud(), logos, Feature, Tab, TabbedFeatures() (+1 more)

### Community 7 - "Community 7"
Cohesion: 0.13
Nodes (18): SiteHeader(), NavigationMenu(), NavigationMenuContent(), NavigationMenuIndicator(), NavigationMenuItem(), NavigationMenuLink(), NavigationMenuList(), NavigationMenuPositioner() (+10 more)

### Community 8 - "Community 8"
Cohesion: 0.14
Nodes (16): DashboardSidebarProps, Collapsible(), CollapsibleContent(), CollapsibleTrigger(), DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup() (+8 more)

### Community 9 - "Community 9"
Cohesion: 0.23
Nodes (15): Tenant, Table(), TableBody(), TableCaption(), TableCell(), TableFooter(), TableHead(), TableHeader() (+7 more)

### Community 10 - "Community 10"
Cohesion: 0.15
Nodes (11): getDashboardMetrics(), getPlatformUsers(), getSettings(), updateSettings(), createTenant(), getTenants(), analyticsRouter, platformUserRouter (+3 more)

### Community 11 - "Community 11"
Cohesion: 0.16
Nodes (13): cn(), AvatarBadge(), AvatarGroup(), AvatarGroupCount(), CardAction(), SelectGroup(), SelectLabel(), SelectScrollDownButton() (+5 more)

### Community 12 - "Community 12"
Cohesion: 0.22
Nodes (10): createServerSession(), getServerSchool(), getServerUser(), logOut(), AdminLayout(), DashboardLayout(), page(), DashboardLayout() (+2 more)

### Community 13 - "Community 13"
Cohesion: 0.14
Nodes (4): FormSelectProps, Option, ImageInputProps, FormHeaderProps

### Community 14 - "Community 14"
Cohesion: 0.33
Nodes (8): createDepartment(), createSubject(), createTerm(), getDepartments(), getSubjects(), getTerms(), prisma, router

### Community 15 - "Community 15"
Cohesion: 0.36
Nodes (7): createFee(), createPayment(), getFees(), getPayments(), getStudentPayments(), prisma, router

### Community 16 - "Community 16"
Cohesion: 0.48
Nodes (4): Accordion(), AccordionContent(), AccordionItem(), AccordionTrigger()

### Community 17 - "Community 17"
Cohesion: 0.29
Nodes (6): adminSidebar, maintenanceSidebar, securitySidebar, studentSidebar, teacherSidebar, transportSidebar

### Community 18 - "Community 18"
Cohesion: 0.33
Nodes (4): fs, fullPath, path, targetFiles

### Community 19 - "Community 19"
Cohesion: 0.47
Nodes (4): createStudent(), getStudents(), prisma, router

### Community 20 - "Community 20"
Cohesion: 0.47
Nodes (4): createParent(), getParents(), prisma, router

### Community 21 - "Community 21"
Cohesion: 0.4
Nodes (4): content, fs, path, targetFiles

### Community 22 - "Community 22"
Cohesion: 0.4
Nodes (3): geistMono, geistSans, metadata

### Community 23 - "Community 23"
Cohesion: 0.4
Nodes (3): Tooltip(), TooltipContent(), TooltipTrigger()

### Community 24 - "Community 24"
Cohesion: 0.4
Nodes (4): 1. Onboarding Flow UI Preference, 2. Overarching Architecture Goals (Backend Integration), 3. Admin Creation & User Provisioning, User Observations & Requested Fixes

### Community 25 - "Community 25"
Cohesion: 0.4
Nodes (4): code:bash (npm run dev), Deploy on Vercel, Getting Started, Learn More

## Knowledge Gaps
- **120 isolated node(s):** `eslintConfig`, `fs`, `path`, `fs`, `path` (+115 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Community 11` to `Community 0`, `Community 1`, `Community 3`, `Community 5`, `Community 7`, `Community 8`, `Community 9`, `Community 16`, `Community 23`?**
  _High betweenness centrality (0.124) - this node is a cross-community bridge._
- **Why does `Button()` connect `Community 0` to `Community 1`, `Community 3`, `Community 4`, `Community 5`, `Community 7`, `Community 9`, `Community 11`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Why does `Input()` connect `Community 0` to `Community 1`, `Community 3`, `Community 4`, `Community 5`, `Community 9`, `Community 11`, `Community 13`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `fs`, `path` to the rest of the system?**
  _120 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._