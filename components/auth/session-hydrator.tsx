"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/authStore";
import { useSchoolStore } from "@/store/schoolStore";

type SessionUser = {
  id: string;
  email: string;
  name: string;
  roles: string[];
  schoolId?: string;
  schoolName?: string;
  image?: string;
} | null;

type SessionSchool = {
  id: string;
  name: string | null;
} | null;

export function SessionHydrator({
  user,
  school,
  token,
}: {
  user: SessionUser;
  school: SessionSchool;
  token?: string | null;
}) {
  const initialized = useRef(false);

  useEffect(() => {
    // Prevent repetitive re-render cycles if user identity has already been hydrated
    if (initialized.current) return;
    initialized.current = true;

    if (user) {
      useAuthStore.getState().setAuth(user, token || "");
    }

    if (school) {
      useSchoolStore.getState().setSchool({
        id: school.id,
        name: school.name || "School Pro Academy",
        logo: "https://utfs.io/f/5a88ce2b-65bc-4f7f-bdc7-27b5e406f85d-8vj8v7.png",
      });
    }
  }, [user, school, token]);

  return null;
}