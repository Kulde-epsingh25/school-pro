"use server";

import { cookies } from "next/headers";
import { User } from "@/store/authStore";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "user_session";

export async function createServerSession(user: User, accessToken: string, refreshToken: string) {
  const cookieStore = await cookies();
  
  // Set Access Token (1 hour)
  cookieStore.set(ACCESS_TOKEN_KEY, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60,
    path: "/",
  });

  // Set Refresh Token (30 days)
  cookieStore.set(REFRESH_TOKEN_KEY, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  // Store user info (safe to be accessed by middleware/client if needed)
  cookieStore.set(USER_KEY, JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
}

export async function getServerUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get(USER_KEY);
  
  if (!userCookie) {
    return null;
  }
  
  try {
    return JSON.parse(userCookie.value) as User;
  } catch (error) {
    return null;
  }
}

export async function logOut() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_KEY);
  cookieStore.delete(REFRESH_TOKEN_KEY);
  cookieStore.delete(USER_KEY);
}

export async function getServerSchool() {
  const user = await getServerUser();
  if (!user || user.role === "super_admin") {
    return null;
  }
  return {
    id: user.schoolId || null,
    name: user.schoolName || null,
  };
}
