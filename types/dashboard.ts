// Domain interfaces for School Pro multi-tenant platform

export interface Student {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  classId?: string;
  className?: string;
  streamId?: string;
  streamName?: string;
  registrationNumber?: string;
  rollNumber?: string;
  status?: "active" | "inactive" | "suspended" | "graduated";
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  address?: string;
  parentId?: string;
  parentName?: string;
  parentPhone?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Teacher {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  departmentId?: string;
  departmentName?: string;
  specialization?: string;
  subjects?: string[];
  qualifications?: string[];
  status?: "active" | "on_leave" | "inactive";
  employmentDate?: string;
  avatar?: string;
  createdAt?: string;
}

export interface Parent {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  occupation?: string;
  students?: Student[];
  childrenCount?: number;
  createdAt?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  schoolId?: string;
  schoolName?: string;
  image?: string;
  createdAt?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  role?: string;
  resourceType?: string;
  resourceId?: string;
  tenantId?: string;
  tenantName?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, unknown> | string;
  timestamp: string;
}

export interface Tenant {
  id: string;
  name: string;
  slug?: string;
  subdomain?: string;
  logo?: string;
  studentCount?: number;
  teacherCount?: number;
  status?: "active" | "trial" | "suspended";
  plan?: string;
  createdAt?: string;
}

export interface ApiResponse<T = unknown> {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
  code?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
