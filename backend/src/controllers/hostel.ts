import { Request, Response } from "express";
import { db as prisma } from "../db";

export const getHostels = async (req: Request, res: Response) => {
  const { tenantId } = req.query;

  if (!tenantId || typeof tenantId !== 'string') {
    return res.status(400).json({ error: "Tenant ID required" });
  }

  try {
    const hostels = await prisma.hostel.findMany({
      where: { tenantId },
      include: {
        rooms: true
      },
      orderBy: { name: "asc" }
    });
    res.json(hostels);
  } catch (error) {
    console.error("Error fetching hostels:", error);
    res.status(500).json({ error: "Failed to fetch hostels" });
  }
};

export const createHostel = async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  const { name, type, wardenName, wardenPhone } = req.body;

  if (!tenantId || !name || !type || !wardenName) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const hostel = await prisma.hostel.create({
      data: {
        tenantId: tenantId as string,
        name,
        type,
        wardenName,
        wardenPhone
      }
    });
    res.status(201).json(hostel);
  } catch (error) {
    console.error("Error creating hostel:", error);
    res.status(500).json({ error: "Failed to create hostel" });
  }
};

export const addRoom = async (req: Request, res: Response) => {
  const { hostelId, roomNo, capacity, feePerMonth } = req.body;

  if (!hostelId || !roomNo || !capacity) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const room = await prisma.room.create({
      data: {
        hostelId,
        roomNo,
        capacity,
        feePerMonth: feePerMonth || 0
      }
    });
    res.status(201).json(room);
  } catch (error) {
    console.error("Error adding room:", error);
    res.status(500).json({ error: "Failed to add room" });
  }
};

export const allocateStudent = async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  const { studentId, roomId } = req.body;
  const assignedBy = ((req as any).user?.id || "");

  if (!tenantId || !studentId || !roomId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Check room capacity
      const room = await tx.room.findUnique({ where: { id: roomId } });
      if (!room) throw new Error("Room not found");
      
      if (room.currentOccupancy >= room.capacity) {
        throw new Error("Room is at full capacity");
      }

      // Check if student already allocated
      const existing = await tx.hostelAllocation.findUnique({
        where: {
          studentId_tenantId: { studentId, tenantId: tenantId as string }
        }
      });

      if (existing) {
        // Decrement old room
        await tx.room.update({
          where: { id: existing.roomId },
          data: { currentOccupancy: { decrement: 1 } }
        });
      }

      // Increment new room
      await tx.room.update({
        where: { id: roomId },
        data: { currentOccupancy: { increment: 1 } }
      });

      // Upsert allocation
      return await tx.hostelAllocation.upsert({
        where: {
          studentId_tenantId: { studentId, tenantId: tenantId as string }
        },
        update: { roomId, assignedBy: assignedBy || "system" },
        create: {
          tenantId: tenantId as string,
          studentId,
          roomId,
          assignedBy: assignedBy || "system"
        },
        include: { room: { include: { hostel: true } } }
      });
    });

    res.status(200).json(result);
  } catch (error: any) {
    console.error("Error allocating student:", error);
    res.status(500).json({ error: error.message || "Failed to allocate student" });
  }
};

export const getMyRoom = async (req: Request, res: Response) => {
  const { tenantId, studentId } = req.query;

  if (!tenantId || typeof tenantId !== 'string' || !studentId || typeof studentId !== 'string') {
    return res.status(400).json({ error: "Tenant ID and Student ID required" });
  }

  try {
    const allocation = await prisma.hostelAllocation.findUnique({
      where: {
        studentId_tenantId: {
          studentId,
          tenantId
        }
      },
      include: {
        room: { include: { hostel: true } }
      }
    });

    res.json(allocation || null);
  } catch (error) {
    console.error("Error fetching my room:", error);
    res.status(500).json({ error: "Failed to fetch room" });
  }
};

export const getVisitors = async (req: Request, res: Response) => {
  const { tenantId } = req.query;

  if (!tenantId || typeof tenantId !== 'string') {
    return res.status(400).json({ error: "Tenant ID required" });
  }

  try {
    const visitors = await prisma.visitorPass.findMany({
      where: { tenantId },
      include: {
        student: { include: { user: true } }
      },
      orderBy: { checkInTime: "desc" }
    });
    res.json(visitors);
  } catch (error) {
    console.error("Error fetching visitors:", error);
    res.status(500).json({ error: "Failed to fetch visitors" });
  }
};

export const issueVisitorPass = async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  const { studentId, visitorName, relation, reason } = req.body;
  const issuedBy = ((req as any).user?.id || "");

  if (!tenantId || !studentId || !visitorName || !relation) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const pass = await prisma.visitorPass.create({
      data: {
        tenantId: tenantId as string,
        studentId,
        visitorName,
        relation,
        reason: reason || "",
        issuedBy: issuedBy || "system"
      }
    });
    res.status(201).json(pass);
  } catch (error) {
    console.error("Error issuing pass:", error);
    res.status(500).json({ error: "Failed to issue pass" });
  }
};

export const checkoutVisitor = async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  const { passId } = req.body;

  if (!tenantId || !passId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const pass = await prisma.visitorPass.update({
      where: { id: passId },
      data: {
        checkOutTime: new Date(),
        status: "COMPLETED"
      }
    });
    res.json(pass);
  } catch (error) {
    console.error("Error checking out visitor:", error);
    res.status(500).json({ error: "Failed to checkout visitor" });
  }
};


