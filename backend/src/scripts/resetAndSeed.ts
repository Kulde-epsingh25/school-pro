import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function resetAndSeed() {
  console.log("🧹 Clearing all existing test data from MongoDB database...");

  // Delete all dependent collections
  await prisma.feePayment.deleteMany({});
  await prisma.scholarship.deleteMany({});
  await prisma.studentFee.deleteMany({});
  await prisma.feeItem.deleteMany({});
  await prisma.fee.deleteMany({});

  await prisma.bookIssue.deleteMany({});
  await prisma.book.deleteMany({});

  await prisma.attendance.deleteMany({});
  await prisma.studentGrade.deleteMany({});
  await prisma.exam.deleteMany({});
  await prisma.assignmentSubmission.deleteMany({});
  await prisma.assignment.deleteMany({});
  await prisma.timetablePeriod.deleteMany({});

  await prisma.announcement.deleteMany({});
  await prisma.salaryPayment.deleteMany({});
  await prisma.expense.deleteMany({});
  await prisma.payment.deleteMany({});

  await prisma.message.deleteMany({});
  await prisma.conversation.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.notificationPreference.deleteMany({});
  await prisma.documentTemplate.deleteMany({});
  await prisma.generatedDocument.deleteMany({});
  await prisma.leaveApproval.deleteMany({});
  await prisma.leaveApplication.deleteMany({});

  await prisma.transportAllocation.deleteMany({});
  await prisma.route.deleteMany({});
  await prisma.vehicle.deleteMany({});

  await prisma.visitorPass.deleteMany({});
  await prisma.hostelAllocation.deleteMany({});
  await prisma.hostel.deleteMany({});

  await prisma.stream.deleteMany({});
  await prisma.class.deleteMany({});
  await prisma.term.deleteMany({});
  await prisma.subject.deleteMany({});
  await prisma.department.deleteMany({});

  await prisma.teacherProfile.deleteMany({});
  await prisma.studentProfile.deleteMany({});
  await prisma.parentProfile.deleteMany({});
  await prisma.staffProfile.deleteMany({});

  await prisma.tenantUserRole.deleteMany({});
  await prisma.tenantRolePermission.deleteMany({});
  await prisma.tenantPermission.deleteMany({});
  await prisma.tenantRole.deleteMany({});

  await prisma.roleChangeAudit.deleteMany({});
  await prisma.tenantAuditLog.deleteMany({});

  await prisma.tenantSuperAdmin.deleteMany({});
  await prisma.saaSSuperAdmin.deleteMany({});
  await prisma.saaSRole.deleteMany({});

  await prisma.subscription.deleteMany({});
  await prisma.tenant.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("✨ All previous data cleared successfully.");

  console.log("\n🌱 Seeding clean default SaaS Super Admin...");

  const hashedPassword = await bcrypt.hash("Password123!", 10);

  // 1. Create SaaS Super Admin User
  const saasAdminUser = await prisma.user.create({
    data: {
      email: "super@admin.com",
      password: hashedPassword,
      firstName: "Platform",
      lastName: "SuperAdmin",
      isActive: true
    }
  });

  // 2. Create SaaSSuperAdmin record
  await prisma.saaSSuperAdmin.create({
    data: {
      userId: saasAdminUser.id,
      sharedWith: []
    }
  });

  console.log("✅ Database successfully reset and seeded!");
  console.log("\n=== DEFAULT SAAS SUPER ADMIN CREDENTIALS ===");
  console.log(`Email: super@admin.com`);
  console.log(`Password: Password123!`);
  console.log(`Role: saas_super_admin`);
}

resetAndSeed()
  .catch(err => {
    console.error("❌ Reset & Seed failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
