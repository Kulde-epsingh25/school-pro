"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStudent = exports.getStudents = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.query;
    if (!tenantId || typeof tenantId !== 'string') {
        return res.status(400).json({ error: "Tenant ID is required" });
    }
    try {
        const students = yield prisma.studentProfile.findMany({
            where: {
                user: {
                    tenantRoles: {
                        some: {
                            tenantId
                        }
                    }
                }
            },
            include: {
                user: true,
                class: true,
                stream: true
            },
            orderBy: {
                user: {
                    firstName: 'asc'
                }
            }
        });
        res.json(students);
    }
    catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ error: "Failed to fetch students" });
    }
});
exports.getStudents = getStudents;
const createStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId, firstName, lastName, email, gender, dob, classId, streamId, parentId } = req.body;
    if (!tenantId || typeof tenantId !== 'string' || !firstName || !lastName || !email) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    try {
        const result = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // Create Base User
            const user = yield tx.user.create({
                data: {
                    email,
                    firstName,
                    lastName,
                    password: "TempPassword123!", // Should be generated and emailed
                    isActive: true
                }
            });
            // Find "STUDENT" role for this tenant
            let studentRole = yield tx.tenantRole.findFirst({
                where: { tenantId, name: "STUDENT" }
            });
            if (!studentRole) {
                // Fallback create if not exists
                studentRole = yield tx.tenantRole.create({
                    data: {
                        tenantId,
                        name: "STUDENT",
                        displayName: "Student",
                        description: "Default student role",
                        createdBy: user.id
                    }
                });
            }
            // Assign role
            yield tx.tenantUserRole.create({
                data: {
                    userId: user.id,
                    tenantId,
                    roleId: studentRole.id,
                    assignedBy: user.id
                }
            });
            // Create Student Profile
            const studentProfile = yield tx.studentProfile.create({
                data: {
                    userId: user.id,
                    gender,
                    dob: dob ? new Date(dob) : null,
                    classId: classId || null,
                    streamId: streamId || null,
                    parentId: parentId || null
                },
                include: {
                    user: true,
                    class: true,
                    stream: true
                }
            });
            return studentProfile;
        }));
        res.status(201).json(result);
    }
    catch (error) {
        console.error("Error creating student:", error);
        res.status(500).json({ error: "Failed to create student" });
    }
});
exports.createStudent = createStudent;
