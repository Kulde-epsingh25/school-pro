import { tenantIsolation } from "../middleware/tenantIsolation";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken");

jest.mock("@prisma/client", () => {
  const mPrisma = {
    user: {
      findUnique: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrisma) };
});

import { PrismaClient } from "@prisma/client";
const mockPrismaClient = new PrismaClient() as any;

describe("tenantIsolation middleware", () => {
  let mockRequest: any;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 401 if missing token", async () => {
    mockRequest = { headers: {} };
    await tenantIsolation(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(401);
  });

  it("should return 401 if token is invalid", async () => {
    mockRequest = { headers: { authorization: "Bearer invalid_token" } };
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw { name: "JsonWebTokenError" };
    });

    await tenantIsolation(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(401);
  });

  it("should call next if SaaS Super Admin", async () => {
    mockRequest = { headers: { authorization: "Bearer token" } };
    (jwt.verify as jest.Mock).mockReturnValue({ userId: "u1" });
    mockPrismaClient.user.findUnique.mockResolvedValue({ id: "u1", isActive: true, saasSuperAdmin: true });

    await tenantIsolation(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
  });

  it("should reject if requesting tenant ID user doesn't belong to", async () => {
    mockRequest = { 
      headers: { authorization: "Bearer token" },
      query: { tenantId: "tenant999" } 
    };
    (jwt.verify as jest.Mock).mockReturnValue({ userId: "u1" });
    mockPrismaClient.user.findUnique.mockResolvedValue({ 
      id: "u1", 
      isActive: true, 
      tenantRoles: [{ tenantId: "tenant1" }] 
    });

    await tenantIsolation(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(403);
  });

  it("should allow if user belongs to requested tenant", async () => {
    mockRequest = { 
      headers: { authorization: "Bearer token" },
      query: { tenantId: "tenant1" } 
    };
    (jwt.verify as jest.Mock).mockReturnValue({ userId: "u1" });
    mockPrismaClient.user.findUnique.mockResolvedValue({ 
      id: "u1", 
      isActive: true, 
      tenantRoles: [{ tenantId: "tenant1" }] 
    });

    await tenantIsolation(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
  });
});
