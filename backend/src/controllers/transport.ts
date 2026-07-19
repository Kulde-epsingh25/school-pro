import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getRoutes = async (req: Request, res: Response) => {
  const { tenantId } = req.query;

  if (!tenantId || typeof tenantId !== 'string') {
    return res.status(400).json({ error: "Tenant ID required" });
  }

  try {
    const routes = await prisma.route.findMany({
      where: { tenantId },
      include: {
        vehicle: true,
        stops: {
          orderBy: { orderIndex: 'asc' }
        },
        allocations: true
      },
      orderBy: { name: "asc" }
    });
    res.json(routes);
  } catch (error) {
    console.error("Error fetching routes:", error);
    res.status(500).json({ error: "Failed to fetch routes" });
  }
};

export const createRoute = async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  const { name, vehicleId, stops } = req.body;

  if (!tenantId || !name || !vehicleId || !stops || !Array.isArray(stops)) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const route = await prisma.route.create({
      data: {
        tenantId: tenantId as string,
        name,
        vehicleId,
        stops: {
          create: stops.map((stop: any, index: number) => ({
            stopName: stop.stopName,
            pickupTime: stop.pickupTime,
            dropTime: stop.dropTime,
            feeAmount: stop.feeAmount || 0,
            orderIndex: index
          }))
        }
      },
      include: { stops: true, vehicle: true }
    });

    res.status(201).json(route);
  } catch (error) {
    console.error("Error creating route:", error);
    res.status(500).json({ error: "Failed to create route" });
  }
};

export const getVehicles = async (req: Request, res: Response) => {
  const { tenantId } = req.query;

  if (!tenantId || typeof tenantId !== 'string') {
    return res.status(400).json({ error: "Tenant ID required" });
  }

  try {
    const vehicles = await prisma.vehicle.findMany({
      where: { tenantId },
      orderBy: { registrationNo: "asc" }
    });
    res.json(vehicles);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({ error: "Failed to fetch vehicles" });
  }
};

export const createVehicle = async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  const { registrationNo, capacity, driverName, driverPhone } = req.body;

  if (!tenantId || !registrationNo || !capacity || !driverName) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const vehicle = await prisma.vehicle.create({
      data: {
        tenantId: tenantId as string,
        registrationNo,
        capacity,
        driverName,
        driverPhone
      }
    });
    res.status(201).json(vehicle);
  } catch (error) {
    console.error("Error creating vehicle:", error);
    res.status(500).json({ error: "Failed to create vehicle" });
  }
};

export const allocateStudent = async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  const { studentId, routeId, stopId } = req.body;
  const assignedBy = req.headers["x-user-id"] as string;

  if (!tenantId || !studentId || !routeId || !stopId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Upsert allocation
    const allocation = await prisma.transportAllocation.upsert({
      where: {
        studentId_tenantId: {
          studentId,
          tenantId: tenantId as string
        }
      },
      update: {
        routeId,
        stopId,
        assignedBy: assignedBy || "system"
      },
      create: {
        tenantId: tenantId as string,
        studentId,
        routeId,
        stopId,
        assignedBy: assignedBy || "system"
      },
      include: { route: true, stop: true }
    });

    res.status(200).json(allocation);
  } catch (error) {
    console.error("Error allocating student:", error);
    res.status(500).json({ error: "Failed to allocate student" });
  }
};

export const getMyRoute = async (req: Request, res: Response) => {
  const { tenantId, studentId } = req.query;

  if (!tenantId || typeof tenantId !== 'string' || !studentId || typeof studentId !== 'string') {
    return res.status(400).json({ error: "Tenant ID and Student ID required" });
  }

  try {
    const allocation = await prisma.transportAllocation.findUnique({
      where: {
        studentId_tenantId: {
          studentId,
          tenantId
        }
      },
      include: {
        route: { include: { vehicle: true } },
        stop: true
      }
    });

    res.json(allocation || null);
  } catch (error) {
    console.error("Error fetching my route:", error);
    res.status(500).json({ error: "Failed to fetch route" });
  }
};
