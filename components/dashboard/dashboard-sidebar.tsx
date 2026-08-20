"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronsUpDown,
  Plus,
  ChevronRight,
  Sparkles,
  BadgeCheck,
  CreditCard,
  Bell,
  LogOut,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Logo from "@/components/frontend/logo";
import { useSchoolStore } from "@/store/schoolStore";
import { useAuthStore } from "@/store/authStore";
import { logOut } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { getNavData } from "./data";

export interface DashboardSidebarProps {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  roles: string[];
}

export function DashboardSidebar({
  user = { name: "Guest", email: "", avatar: "" },
  roles = [],
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const school = useSchoolStore((state) => state.school);
  
  // Extract dynamic navigation groups
  const navData = React.useMemo(() => getNavData(roles), [roles]);
  const { navMain } = navData;

  // Single-expanded accordion tracking
  const [openSection, setOpenSection] = React.useState<string | null>(() => {
    const activeSection = navMain.find((item: any) =>
      item.items?.some((sub: any) => pathname.startsWith(sub.url))
    );
    return activeSection ? activeSection.title : (navMain[0]?.title || null);
  });

  React.useEffect(() => {
    const currentActive = navMain.find((item: any) =>
      item.items?.some((sub: any) => pathname.startsWith(sub.url))
    );
    if (currentActive) {
      setOpenSection(currentActive.title);
    }
  }, [pathname, navMain]);

  const handleToggleSection = (title: string) => {
    setOpenSection((prev) => (prev === title ? null : title));
  };

  const handleLogout = async () => {
    await logOut();
    useAuthStore.getState().clearAuth();
    router.push("/login");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/dashboard" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-card border overflow-hidden">
                {school?.logo ? (
                  <img src={school.logo} alt="School Logo" className="object-contain h-full w-full p-0.5" />
                ) : (
                  <Logo />
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-bold text-foreground">
                  {school?.name || "School Pro"}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  Academic Instance
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management Hub</SidebarGroupLabel>
          <SidebarMenu>
            {navMain.map((item: any) => {
              const isOpen = openSection === item.title;
              return (
                <Collapsible
                  key={item.title}
                  open={isOpen}
                  onOpenChange={() => handleToggleSection(item.title)}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger
                      render={
                        <SidebarMenuButton
                          tooltip={item.title}
                          className="w-full justify-between"
                        />
                      }
                    >
                      <div className="flex items-center gap-2">
                        {item.icon && <item.icon className="h-4 w-4 shrink-0 text-muted-foreground group-hover/collapsible:text-foreground" />}
                        <span className="font-medium text-sm">{item.title}</span>
                      </div>
                      <ChevronRight
                        className={`ml-auto h-4 w-4 transition-transform duration-200 ${
                          isOpen ? "rotate-90 text-primary" : "text-muted-foreground"
                        }`}
                      />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                      <SidebarMenuSub>
                        {item.items?.map((subItem: any) => {
                          const isActive = pathname === subItem.url;
                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                render={
                                  <Link
                                    href={subItem.url}
                                    className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors ${
                                      isActive
                                        ? "bg-primary/10 text-primary font-semibold"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                                  />
                                }
                              >
                                <span>{subItem.title}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  />
                }
              >
                <Avatar className="h-8 w-8 rounded-lg border bg-card">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-bold text-xs">
                    {user.name?.substring(0, 2).toUpperCase() || "SP"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-foreground">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl p-1 shadow-lg"
                side="bottom"
                align="end"
                sideOffset={6}
              >
                <DropdownMenuLabel className="p-2 font-normal">
                  <div className="flex items-center gap-2 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg bg-primary/10 text-primary">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="font-bold">{user.name?.substring(0, 2).toUpperCase() || "SP"}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold text-foreground">{user.name}</span>
                      <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => router.push("/admin/settings/branding")}>
                    <BadgeCheck className="w-4 h-4 mr-2" />
                    School Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/dashboard/finance/fees")}>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Billing & Fees
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
