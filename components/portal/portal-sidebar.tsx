"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, Home, BookOpen, Database, FileText, Bell, LogOut, Users, MessageSquare, DollarSign } from "lucide-react";
import { Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const navItems = [
  { title: "Dashboard", url: "/portal", icon: Home },
  { title: "My Children", url: "/portal/parent/children", icon: Users },
  { title: "Messages", url: "/portal/parent/messages", icon: MessageSquare },
  { title: "Payments", url: "/portal/parent/payments", icon: DollarSign },
];

export function PortalSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-gray-100 bg-white">
      <SidebarHeader className="p-4 flex flex-row items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-8 h-8 text-orange-400" strokeWidth={1.5} />
          <span className="font-bold text-xl tracking-tight text-gray-900">
            Unique <span className="text-orange-400">High</span>
          </span>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 rounded-full border border-gray-200">
          <Bell className="w-4 h-4" />
        </Button>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarMenu className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.url || pathname.startsWith(`${item.url}/`);
            return (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton asChild isActive={isActive} className={`w-full justify-start h-11 px-4 rounded-md transition-colors ${isActive ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>
                  <Link href={item.url}>
                    <item.icon className="w-5 h-5 mr-3" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 mt-auto">
        <Button className="w-full bg-[#2563EB] hover:bg-blue-700 text-white rounded-md h-11 justify-start px-4 font-medium transition-colors">
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
