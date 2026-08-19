import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function seedSaintJude() {
  console.log("🌱 Creating & Seeding Saint Jude High School (stjude.edu)...");

  // 1. Create or find Tenant
  let tenant = await prisma.tenant.findFirst({ where: { domain: "stjude.edu" } });
  if (!tenant) {
    tenant = await prisma.tenant.create({
      data: {
        name: "Saint Jude High School",
        domain: "stjude.edu",
        isMaster: true,
        subscription: {
          create: {
            plan: "Professional",
            status: "ACTIVE",
            billingCycle: "YEARLY",
            amount: 499
          }
        }
      }
    });
  }

  const tenantId = tenant.id;

  // 2. Create Super Admin User if not exists
  const hashedPassword = await bcrypt.hash("Password123!", 10);
  let adminUser = await prisma.user.findFirst({ where: { email: "admin@stjude.edu" } });
  if (!adminUser) {
    adminUser = await prisma.user.create({
      data: {
        email: "admin@stjude.edu",
        password: hashedPassword,
        firstName: "Saint Jude",
        lastName: "Administrator",
        isActive: true
      }
    });

    await prisma.tenantSuperAdmin.create({
      data: {
        tenantId,
        userId: adminUser.id,
        sharedWith: []
      }
    });
  } else {
    await prisma.user.update({
      where: { id: adminUser.id },
      data: { isActive: true, password: hashedPassword }
    });
  }

  // 3. Create Academic Infrastructure: Departments & Subjects
  const deptSci = await prisma.department.upsert({
    where: { name_tenantId: { name: "Science & Technology", tenantId } },
    update: {},
    create: { name: "Science & Technology", tenantId }
  });

  const deptMath = await prisma.department.upsert({
    where: { name_tenantId: { name: "Mathematics & Physics", tenantId } },
    update: {},
    create: { name: "Mathematics & Physics", tenantId }
  });

  const deptHumanities = await prisma.department.upsert({
    where: { name_tenantId: { name: "Languages & Humanities", tenantId } },
    update: {},
    create: { name: "Languages & Humanities", tenantId }
  });

  // 4. Create Classes & Streams
  const classGrade10 = await prisma.class.upsert({
    where: { name_tenantId: { name: "Grade 10 - Senior Secondary", tenantId } },
    update: {},
    create: { name: "Grade 10 - Senior Secondary", tenantId }
  });

  const streamA = await prisma.stream.upsert({
    where: { name_classId: { name: "Section A (STEM)", classId: classGrade10.id } },
    update: {},
    create: { name: "Section A (STEM)", classId: classGrade10.id }
  });

  // 5. Create Teachers
  const teacherUsersData = [
    { email: "dr.sarah@stjude.edu", firstName: "Dr. Sarah", lastName: "Jenkins", jobTitle: "Senior Physics Lecturer" },
    { email: "prof.michael@stjude.edu", firstName: "Prof. Michael", lastName: "Vance", jobTitle: "Head of Mathematics" },
    { email: "ms.elena@stjude.edu", firstName: "Ms. Elena", lastName: "Rostova", jobTitle: "English Literature Specialist" }
  ];

  const teacherProfiles = [];
  for (const t of teacherUsersData) {
    let tUser = await prisma.user.findFirst({ where: { email: t.email } });
    if (!tUser) {
      tUser = await prisma.user.create({
        data: {
          email: t.email,
          password: hashedPassword,
          firstName: t.firstName,
          lastName: t.lastName,
          isActive: true
        }
      });

      const tProf = await prisma.teacherProfile.create({
        data: { userId: tUser.id }
      });
      teacherProfiles.push({ user: tUser, profile: tProf });
    }
  }

  // 6. Assign Subjects to Departments & Teachers
  if (teacherProfiles.length >= 2) {
    await prisma.subject.upsert({
      where: { code_departmentId: { code: "PHYS101", departmentId: deptSci.id } },
      update: {},
      create: { name: "Advanced Physics", code: "PHYS101", departmentId: deptSci.id, teacherId: teacherProfiles[0].profile.id }
    });

    await prisma.subject.upsert({
      where: { code_departmentId: { code: "MATH201", departmentId: deptMath.id } },
      update: {},
      create: { name: "Calculus & Geometry", code: "MATH201", departmentId: deptMath.id, teacherId: teacherProfiles[1].profile.id }
    });
  }

  // 7. Seed Students & Attendance
  const studentList = [
    { firstName: "Lucas", lastName: "Skywalker", email: "lucas@stjude.edu" },
    { firstName: "Emma", lastName: "Watson", email: "emma@stjude.edu" },
    { firstName: "David", lastName: "Miller", email: "david@stjude.edu" },
    { firstName: "Sophia", lastName: "Taylor", email: "sophia@stjude.edu" },
    { firstName: "Ethan", lastName: "Hunt", email: "ethan@stjude.edu" }
  ];

  for (const s of studentList) {
    let sUser = await prisma.user.findFirst({ where: { email: s.email } });
    if (!sUser) {
      sUser = await prisma.user.create({
        data: {
          email: s.email,
          password: hashedPassword,
          firstName: s.firstName,
          lastName: s.lastName,
          isActive: true
        }
      });

      const sProf = await prisma.studentProfile.create({
        data: {
          userId: sUser.id,
          classId: classGrade10.id,
          streamId: streamA.id,
          gender: "Male",
          country: "USA"
        }
      });

      // Seed Fee for Student
      const fee = await prisma.studentFee.create({
        data: {
          tenantId,
          studentId: sProf.id,
          type: "TUITION",
          title: "Annual Tuition Fee 2026",
          amount: 3500,
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          isPaid: true
        }
      });

      await prisma.feePayment.create({
        data: {
          feeId: fee.id,
          amount: 3500,
          method: "ONLINE",
          reference: `PAY-${Date.now()}-${s.firstName.toUpperCase()}`,
          recordedBy: adminUser.id
        }
      });

      // Attendance
      await prisma.attendance.create({
        data: {
          tenantId,
          studentId: sProf.id,
          classId: classGrade10.id,
          streamId: streamA.id,
          status: "PRESENT",
          markedBy: adminUser.id
        }
      });
    }
  }

  // 8. Library Management (Books & Borrowing)
  const bookPhysics = await prisma.book.create({
    data: {
      tenantId,
      title: "University Physics with Modern Physics",
      author: "Hugh D. Young",
      isbn: "978-0133969290",
      category: "Science & Engineering",
      totalCopies: 10,
      availableCopies: 8
    }
  });

  // 9. Transport Management (Buses & Routes)
  const bus = await prisma.vehicle.create({
    data: {
      tenantId,
      registrationNo: "STJUDE-BUS-01",
      capacity: 48,
      driverName: "Robert Davis"
    }
  });

  await prisma.route.create({
    data: {
      tenantId,
      name: "Metro Central Express Route",
      vehicleId: bus.id
    }
  });

  // 10. Hostel Management
  const hostel = await prisma.hostel.create({
    data: {
      tenantId,
      name: "St. Jude Honors Residence",
      type: "Co-Ed",
      wardenName: "Dr. Arthur Pendelton"
    }
  });

  // 11. School Announcements
  await prisma.announcement.create({
    data: {
      tenantId,
      title: "Welcome to St. Jude International Academy - Academic Year 2026",
      content: "All academic operations, attendance tracking, digital library, and fee management portals are live.",
      targetRole: "ALL",
      createdBy: adminUser.id,
      authorName: "Saint Jude Administrator"
    }
  });

  console.log("✅ Live School Data Successfully Seeded for St. Jude International Academy!");
}

seedSaintJude()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
