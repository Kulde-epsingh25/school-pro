"use client";

import React, { useEffect, useState } from "react";
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { apiClient } from "@/lib/api-client";
import { useSchoolStore } from "@/store/schoolStore";
import { useAuthStore } from "@/store/authStore";

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const { school } = useSchoolStore();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (school?.id && user?.id) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 60000); // poll every minute
      return () => clearInterval(interval);
    }
  }, [school?.id, user?.id]);

  const fetchNotifications = async () => {
    if (!school?.id) return;
    try {
      const res = await apiClient.get<any[]>(`/communication/notifications?tenantId=${school.id}`);
      if (res.ok && res.data) {
        setNotifications(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  const markAsRead = async (id: string) => {
    if (!school?.id) return;
    try {
      await apiClient.put(`/communication/notifications/${id}/read?tenantId=${school.id}`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-[400px] overflow-y-auto">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">No notifications</div>
        ) : (
          notifications.map((n) => (
            <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-1 p-3 cursor-pointer" onClick={(e) => { e.preventDefault(); markAsRead(n.id); }}>
              <div className="flex w-full justify-between items-start">
                <span className={`text-sm font-semibold ${n.isRead ? 'text-gray-600' : 'text-gray-900'}`}>{n.title}</span>
                {!n.isRead && <div className="h-2 w-2 bg-blue-500 rounded-full mt-1"></div>}
              </div>
              <p className={`text-xs ${n.isRead ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>{n.message}</p>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
