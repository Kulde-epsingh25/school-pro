# Graph Report - school-pro-web  (2026-07-01)

## Corpus Check
- 98 files · ~347,528 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 361 nodes · 854 edges · 25 communities (18 shown, 7 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `09f27431`
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
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 106 edges
2. `Button()` - 28 edges
3. `Input()` - 24 edges
4. `DialogContent()` - 11 edges
5. `Dialog()` - 10 edges
6. `DialogHeader()` - 10 edges
7. `DialogTitle()` - 10 edges
8. `SidebarProvider()` - 10 edges
9. `useSchoolStore` - 10 edges
10. `DashboardSidebar()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `SiteHeader()` --calls--> `cn()`  [EXTRACTED]
  components/frontend/site-header.tsx → lib/utils.ts
- `CardDescription()` --calls--> `cn()`  [EXTRACTED]
  components/ui/card.tsx → lib/utils.ts
- `CardAction()` --calls--> `cn()`  [EXTRACTED]
  components/ui/card.tsx → lib/utils.ts
- `CardFooter()` --calls--> `cn()`  [EXTRACTED]
  components/ui/card.tsx → lib/utils.ts
- `DialogOverlay()` --calls--> `cn()`  [EXTRACTED]
  components/ui/dialog.tsx → lib/utils.ts

## Communities (25 total, 7 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (34): class_props, stream_props, FormInputProps, FormSelectProps, ClassItem, Stream, Contact, DashboardHeader() (+26 more)

### Community 1 - "Community 1"
Cohesion: 0.07
Nodes (58): DashboardSidebarProps, useIsMobile(), cn(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount() (+50 more)

### Community 2 - "Community 2"
Cohesion: 0.11
Nodes (26): attendanceData, DashboardPage(), data, defaultStats, feeCollectionData, navMain, recentAdmissions, RecentDataTable() (+18 more)

### Community 3 - "Community 3"
Cohesion: 0.12
Nodes (14): Icons, LoginFormValues, loginSchema, Icons, RegisterFormValues, registerSchema, Form(), FormControl() (+6 more)

### Community 4 - "Community 4"
Cohesion: 0.13
Nodes (15): features, SiteHeader(), NavigationMenu(), NavigationMenuContent(), NavigationMenuIndicator(), NavigationMenuItem(), NavigationMenuLink(), NavigationMenuList() (+7 more)

### Community 5 - "Community 5"
Cohesion: 0.19
Nodes (15): Badge(), badgeVariants, Table(), TableBody(), TableCaption(), TableCell(), TableFooter(), TableHead() (+7 more)

### Community 6 - "Community 6"
Cohesion: 0.13
Nodes (7): HeroSection(), LogoCloud(), logos, Feature, Tab, TabbedFeatures(), tabs

### Community 7 - "Community 7"
Cohesion: 0.14
Nodes (4): FormSelectProps, Option, ImageInputProps, FormHeaderProps

### Community 8 - "Community 8"
Cohesion: 0.23
Nodes (9): createServerSession(), getServerSchool(), getServerUser(), logOut(), AdminLayout(), DashboardLayout(), page(), AuthState (+1 more)

### Community 9 - "Community 9"
Cohesion: 0.48
Nodes (4): Accordion(), AccordionContent(), AccordionItem(), AccordionTrigger()

### Community 10 - "Community 10"
Cohesion: 0.29
Nodes (6): adminSidebar, maintenanceSidebar, securitySidebar, studentSidebar, teacherSidebar, transportSidebar

### Community 11 - "Community 11"
Cohesion: 0.4
Nodes (3): geistMono, geistSans, metadata

### Community 12 - "Community 12"
Cohesion: 0.4
Nodes (4): code:bash (npm run dev), Deploy on Vercel, Getting Started, Learn More

## Knowledge Gaps
- **62 isolated node(s):** `eslintConfig`, `nextConfig`, `config`, `geistSans`, `geistMono` (+57 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Community 1` to `Community 0`, `Community 2`, `Community 4`, `Community 5`, `Community 9`?**
  _High betweenness centrality (0.267) - this node is a cross-community bridge._
- **Why does `Button()` connect `Community 0` to `Community 1`, `Community 2`, `Community 3`, `Community 4`, `Community 5`?**
  _High betweenness centrality (0.094) - this node is a cross-community bridge._
- **Why does `Input()` connect `Community 0` to `Community 1`, `Community 3`, `Community 5`, `Community 7`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `config` to the rest of the system?**
  _62 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._