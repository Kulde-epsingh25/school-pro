"use client";

import * as React from "react";
import { Plus, Sun, LogOut, User as UserIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Building2, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logOut } from "@/actions/auth";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useSchoolStore } from "@/store/schoolStore";
import { apiClient } from "@/lib/api-client";
import { NotificationCenter } from "@/components/communication/NotificationCenter";

export function DashboardHeader() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [tenants, setTenants] = React.useState<any[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const { school, setSchool } = useSchoolStore();

  React.useEffect(() => {
    // Only fetch tenants if we are in tenant-scoped route and user is logged in
    if (user?.id) {
      apiClient.get<any[]>("/users/me/tenants").then(res => {
        if (res.ok && res.data && res.data.length > 0) {
          setTenants(res.data);
          if (!useSchoolStore.getState().school) {
            setSchool(res.data[0]);
          }
        } else if (user.schoolId && !useSchoolStore.getState().school) {
          setSchool({
            id: user.schoolId,
            name: user.schoolName || "Beacon Prep",
            logo: "https://utfs.io/f/5a88ce2b-65bc-4f7f-bdc7-27b5e406f85d-8vj8v7.png"
          });
        }
      }).catch(() => {
        if (user.schoolId && !useSchoolStore.getState().school) {
          setSchool({
            id: user.schoolId,
            name: user.schoolName || "Beacon Prep",
            logo: "https://utfs.io/f/5a88ce2b-65bc-4f7f-bdc7-27b5e406f85d-8vj8v7.png"
          });
        }
      });
    }
  }, [pathname, user?.id]);

  const handleLogout = async () => {
    await logOut();
    useAuthStore.getState().clearAuth();
    router.push("/login");
  };

  const handleSwitchTenant = (t: any) => {
    setSchool(t);
    router.push("/dashboard");
  };

  return (
    <div className="flex h-16 items-center gap-4 border-b px-4 bg-card">
      <SidebarTrigger />
      <div className="flex-1">
        <Input
          placeholder="Search students, faculty, or invoices..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm h-9 text-xs"
        />
      </div>

      <div className="flex items-center gap-2">
        {tenants.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" size="sm" className="flex items-center gap-2 h-9 text-xs">
                  <Building2 className="h-4 w-4 text-primary" />
                  <span className="hidden md:inline-block max-w-[150px] truncate font-medium">
                    {school?.name || "Select School"}
                  </span>
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-56 p-1">
              <DropdownMenuLabel className="text-xs">Switch Academic Campus</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {tenants.map(t => (
                <DropdownMenuItem 
                  key={t.id} 
                  onClick={() => handleSwitchTenant(t)}
                  className="justify-between cursor-pointer text-xs"
                >
                  <span className="truncate">{t.name}</span>
                  {school?.id === t.id && <Check className="h-3.5 w-3.5 text-primary" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <NotificationCenter />
        
        <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => router.push("/admin/users")}>
          <Plus className="h-4 w-4" />
          <span className="sr-only">Invite user</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                <Avatar className="h-9 w-9 border bg-card">
                  <AvatarImage src={user?.image || "/placeholder.svg"} alt="@user" />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                    {user?.name?.substring(0, 2).toUpperCase() || "SP"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            }
          />
          <DropdownMenuContent className="w-56 p-1" align="end">
            <DropdownMenuLabel className="font-normal p-2">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold leading-none text-foreground">{user?.name || "School Administrator"}</p>
                <p className="text-xs leading-none text-muted-foreground truncate">
                  {user?.email || "admin@schoolpro.com"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/admin/users")} className="cursor-pointer text-xs">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>User Directory</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/admin/settings/security")} className="cursor-pointer text-xs">
              <Building2 className="mr-2 h-4 w-4" />
              <span>Security & Policies</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer text-xs">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
