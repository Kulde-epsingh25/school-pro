import { requirePermission } from "../middleware/rbac";
import { Request, Response, NextFunction } from "express";

// Mock prisma client
jest.mock("@prisma/client", () => {
  const mPrismaClient = {
    tenantUserRole: {
      findMany: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient() as any;

describe("rbac middleware", () => {
  let mockRequest: any;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      params: {},
      query: {},
      body: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 401 if user is not set", async () => {
    const middleware = requirePermission("READ", "USERS");
    await middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: "Unauthorized" });
  });

  it("should bypass and call next if user is SaaS Super Admin", async () => {
    mockRequest.user = { saasSuperAdmin: true } as any;
    const middleware = requirePermission("READ", "USERS");
    await middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
  });

  it("should bypass and call next if user is Tenant Super Admin for the requested tenant", async () => {
    mockRequest.user = {
      tenantSuperAdmin: { tenantId: "tenant1" }
    } as any;
    mockRequest.query = { tenantId: "tenant1" };
    const middleware = requirePermission("READ", "USERS");
    await middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
  });

  it("should query prisma for roles and fail if no permission matches", async () => {
    mockRequest.user = { id: "user1" } as any;
    mockRequest.query = { tenantId: "tenant1" };
    
    prisma.tenantUserRole.findMany.mockResolvedValue([]);

    const middleware = requirePermission("READ", "USERS");
    await middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(prisma.tenantUserRole.findMany).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(403);
  });

  it("should grant permission and set scope if roles contain permission", async () => {
    mockRequest.user = { id: "user1" } as any;
    mockRequest.query = { tenantId: "tenant1" };
    
    prisma.tenantUserRole.findMany.mockResolvedValue([
      {
        role: {
          permissions: [
            { permission: { action: "READ", subject: "USERS", scope: "ALL" } }
          ]
        }
      }
    ]);

    const middleware = requirePermission("READ", "USERS");
    await middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
    expect((mockRequest as any).permissionScope).toBe("ALL");
  });
});
