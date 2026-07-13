const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
  const hash = bcrypt.hashSync('Password123!', 10);
  const ts = Date.now().toString().slice(-6);

  // 1. Tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Demo Academy',
      domain: 'demo' + ts,
      isMaster: false,
    }
  });

  // 2. Roles
  const rolesToCreate = ['ADMIN', 'ACADEMIC', 'TEACHER', 'STAFF', 'STUDENT'];
  const createdRoles = {};
  for (const r of rolesToCreate) {
    const role = await prisma.tenantRole.create({
      data: {
        tenantId: tenant.id,
        name: r,
        displayName: r.charAt(0) + r.slice(1).toLowerCase(),
        description: r + ' Role',
        createdBy: tenant.id
      }
    });
    createdRoles[r] = role;
  }

  // Helper to create user
  async function createUser(emailPrefix, firstName, lastName, roleName) {
    const user = await prisma.user.create({
      data: {
        email: emailPrefix + ts + '@demo.com',
        password: hash,
        firstName,
        lastName,
        isActive: true
      }
    });
    await prisma.tenantUserRole.create({
      data: {
        userId: user.id,
        tenantId: tenant.id,
        roleId: createdRoles[roleName].id,
        assignedBy: user.id
      }
    });
    return user;
  }

  // 3. Admin User
  const adminUser = await createUser('admin', 'Admin', 'User', 'ADMIN');
  // Tenant Super Admin
  await prisma.tenantSuperAdmin.create({
    data: {
      tenantId: tenant.id,
      userId: adminUser.id
    }
  });

  // 4. Academic User
  const academicUser = await createUser('academic', 'Academic', 'Head', 'ACADEMIC');

  // 5. Teacher User & Profile
  const teacherUser = await createUser('teacher', 'John', 'Teacher', 'TEACHER');
  const teacherProfile = await prisma.teacherProfile.create({
    data: {
      userId: teacherUser.id,
      teacherId: 'TCH' + ts,
      qualifications: ['B.Ed'],
      experience: 5
    }
  });

  // 6. Staff User & Profile
  const staffUser = await createUser('staff', 'Mary', 'Staff', 'STAFF');
  const staffProfile = await prisma.staffProfile.create({
    data: {
      userId: staffUser.id,
      staffId: 'STF' + ts,
      role: 'Receptionist'
    }
  });

  // 7. Class & Stream
  const cls = await prisma.class.create({
    data: {
      name: 'Class 1',
      capacity: 30,
      tenantId: tenant.id
    }
  });
  
  const stream = await prisma.stream.create({
    data: {
      name: 'Stream A',
      classId: cls.id,
      tenantId: tenant.id,
      capacity: 15
    }
  });

  // 8. Student User & Profile
  const studentUser = await createUser('student', 'Kid', 'Student', 'STUDENT');
  const studentProfile = await prisma.studentProfile.create({
    data: {
      userId: studentUser.id,
      studentId: 'STD' + ts,
      classId: cls.id,
      streamId: stream.id,
      gender: 'MALE',
      dateOfBirth: new Date('2015-01-01')
    }
  });

  console.log('Seed completed successfully');
  console.log('ADMIN_EMAIL=' + adminUser.email);
  console.log('ACADEMIC_EMAIL=' + academicUser.email);
  console.log('TEACHER_EMAIL=' + teacherUser.email);
  console.log('STAFF_EMAIL=' + staffUser.email);
  console.log('STUDENT_EMAIL=' + studentUser.email);

}
main().catch(console.error).finally(() => prisma.$disconnect());
