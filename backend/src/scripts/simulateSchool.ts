import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting school simulation...");

  // 1. Find the tenant "Test Academy" or just get the first one.
  let tenant = await prisma.tenant.findFirst();
  
  if (!tenant) {
    tenant = await prisma.tenant.create({
      data: {
        name: "Test Academy",
        domain: "testacademy.com"
      }
    });
  }
  
  const tenantId = tenant.id;
  console.log(`Simulating for Tenant: ${tenant.name} (${tenantId})`);

  // We need an admin user to act as "actor"
  let adminUser = await prisma.user.findFirst({ where: { email: "admin@testacademy.com" }});
  if (!adminUser) {
    adminUser = await prisma.user.create({
      data: { email: "admin@testacademy.com", password: "dummy", firstName: "Super", lastName: "Admin", isActive: true }
    });
  }

  // 3. Create Departments, Subjects, Classes
  const deptScience = await prisma.department.create({ data: { tenantId, name: "Science Dept " + Date.now() } });
  const classGrade10 = await prisma.class.create({ data: { tenantId, name: "Grade 10 " + Date.now() } });
  
  // 4. Create Teachers
  const teacherUser1 = await prisma.user.create({ data: { email: `teacher${Date.now()}@testacademy.com`, password: "dummy", firstName: "Alice", lastName: "Smith", isActive: true } });
  const teacherProf1 = await prisma.teacherProfile.create({ data: { userId: teacherUser1.id } });

  const subjMath = await prisma.subject.create({ data: { name: "Mathematics", code: "MATH101", departmentId: deptScience.id, teacherId: teacherProf1.id } });

  // 5. Create Students
  const students = [];
  for (let i = 1; i <= 10; i++) {
    const sUser = await prisma.user.create({ data: { email: `student${i}_${Date.now()}@testacademy.com`, password: "dummy", firstName: `Student${i}`, lastName: "Test", isActive: true } });
    const sProf = await prisma.studentProfile.create({ data: { userId: sUser.id, classId: classGrade10.id } });
    students.push(sProf);
    
    // Attendance
    await prisma.attendance.create({
        data: { tenantId, studentId: sProf.id, classId: classGrade10.id, status: "PRESENT", markedBy: adminUser.id }
    });
  }

  // 6. Library Management
  const book1 = await prisma.book.create({ data: { tenantId, title: "Calculus", author: "James Stewart", isbn: "9781305480513", category: "Math", totalCopies: 5, availableCopies: 4 } });
  
  // Issue book1 to student1 (late)
  await prisma.bookIssue.create({ data: { tenantId, bookId: book1.id, userId: students[0].userId, dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), fineAmount: 10, isReturned: false, issuedBy: adminUser.id } });

  // 7. Transport Management
  const vehicle = await prisma.vehicle.create({ data: { tenantId, registrationNo: "BUS-1001", capacity: 40, driverName: "John Doe" } });
  const route = await prisma.route.create({ data: { tenantId, name: "North Route", vehicleId: vehicle.id } });
  const stop1 = await prisma.routeStop.create({ data: { routeId: route.id, stopName: "Main Square", pickupTime: "07:00 AM", dropTime: "04:00 PM", orderIndex: 1 } });
  
  // Allocate Student1 to transport
  await prisma.transportAllocation.create({ data: { tenantId, studentId: students[0].id, routeId: route.id, stopId: stop1.id, assignedBy: adminUser.id } });

  // 8. Hostel Management
  const hostel = await prisma.hostel.create({ data: { tenantId, name: "Alpha Boys Hostel", type: "Boys", wardenName: "Mr. Brown" } });
  const room = await prisma.room.create({ data: { hostelId: hostel.id, roomNo: "101", capacity: 2, currentOccupancy: 1, feePerMonth: 500 } });
  
  // Allocate Student1 to hostel
  await prisma.hostelAllocation.create({ data: { tenantId, studentId: students[0].id, roomId: room.id, assignedBy: adminUser.id } });

  // 9. Finance (Fees)
  const feeType = await prisma.studentFee.create({ data: { tenantId, studentId: students[0].id, type: "TUITION", title: "Term 1 Tuition", amount: 2000, dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), isPaid: false } });
  await prisma.feePayment.create({ data: { feeId: feeType.id, amount: 1000, method: "CARD", reference: "TXN12345", recordedBy: adminUser.id } });

  console.log("Simulation complete! Data seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
