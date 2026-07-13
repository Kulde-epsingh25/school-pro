import { getAccessToken } from "@/actions/auth";
import { useSchoolStore } from "@/store/schoolStore";

interface ApiResponse<T> {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
  code?: string;
}

export class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com";
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      // Get token from server action
      const token = await getAccessToken();

      if (!token && !endpoint.includes("/auth/")) {
        throw new Error("Not authenticated");
      }

      // Get tenant from store
      const school = useSchoolStore.getState().school;
      const tenantId = school?.id;

      // Build URL with tenantId query param if applicable
      let url = `${this.baseUrl}${endpoint}`;
      if (tenantId && !endpoint.includes("/saas") && !endpoint.includes("/auth")) {
        url += `?tenantId=${tenantId}`;
      }

      // Add authorization header
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
      };

      const response = await fetch(url, {
        ...options,
        headers,
        credentials: "include" // Send cookies
      });

      const body = await response.json();

      // Handle 403 (tenant isolation violation)
      if (response.status === 403) {
        if (body.code === "TENANT_ISOLATION_VIOLATION") {
          // Redirect to tenants list using window object (since this runs in browser)
          if (typeof window !== "undefined") {
            window.location.href = "/saas-admin/tenants";
          }
        }
      }

      return {
        ok: response.ok,
        status: response.status,
        data: body,
        error: body.error || (response.ok ? undefined : "Unknown error"),
        code: body.code
      };
    } catch (error: any) {
      return {
        ok: false,
        status: 0,
        error: error.message || "Network error"
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const school = useSchoolStore.getState().school;
    if (data && typeof data === "object" && school?.id && !endpoint.includes("/saas") && !endpoint.includes("/auth")) {
      data.tenantId = data.tenantId || school.id;
    }
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const school = useSchoolStore.getState().school;
    if (data && typeof data === "object" && school?.id && !endpoint.includes("/saas") && !endpoint.includes("/auth")) {
      data.tenantId = data.tenantId || school.id;
    }
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
