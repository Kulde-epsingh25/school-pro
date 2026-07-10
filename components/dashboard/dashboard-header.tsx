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

export function DashboardHeader() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [tenants, setTenants] = React.useState<any[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const { school, setSchool } = useSchoolStore();

  React.useEffect(() => {
    // Only fetch tenants if we are in the tenant route
    if (pathname?.includes("/admin") || pathname?.includes("/teacher") || pathname?.includes("/student")) {
      apiClient.get<any[]>("/users/me/tenants").then(res => {
        if (res.ok && res.data) {
          setTenants(res.data);
          // If no school is set but we have tenants, set the first one
          if (!school && res.data.length > 0) {
            setSchool(res.data[0]);
          }
        }
      });
    }
  }, [pathname]);

  const handleLogout = async () => {
    await logOut();
    useAuthStore.getState().clearAuth();
    router.push("/login");
  };

  return (
    <div className="flex h-16 items-center gap-4 border-b px-4">
      <SidebarTrigger />
      <div className="flex-1">
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {tenants.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <Button variant="outline" className="flex gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden md:inline-block max-w-[150px] truncate">
                {school?.name || "Select School"}
              </span>
            </Button>
          } />
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>Switch Organization</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {tenants.map(t => (
              <DropdownMenuItem 
                key={t.id} 
                onClick={() => {
                  setSchool(t);
                  window.location.reload(); // Hard reload to clear all tenant-specific state safely
                }}
                className="justify-between"
              >
                <span className="truncate">{t.name}</span>
                {school?.id === t.id && <Check className="h-4 w-4 opacity-50" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <Button variant="outline" size="icon">
        <span className="sr-only">Toggle theme</span>
        <Sun className="h-5 w-5" />
      </Button>
      <Button variant="outline" size="icon">
        <Plus className="h-5 w-5" />
        <span className="sr-only">Add new</span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger render={
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" alt="@user" />
              <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase() || "CN"}</AvatarFallback>
            </Avatar>
          </Button>
        } />
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email || "user@example.com"}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
