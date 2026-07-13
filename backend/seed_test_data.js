const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
  const hash = bcrypt.hashSync('Password123!', 10);

  // 1. Tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Demo Academy',
      domain: 'demo',
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
        createdBy: tenant.id // mock ID
      }
    });
    createdRoles[r] = role;
  }

  // Helper to create user
  async function createUser(email, firstName, lastName, roleName) {
    const user = await prisma.user.create({
      data: {
        email,
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
        roleId: createdRoles[roleName].id
      }
    });
    return user;
  }

  // 3. Admin User
  const adminUser = await createUser('admin@demo.com', 'Admin', 'User', 'ADMIN');
  // Tenant Super Admin
  await prisma.tenantSuperAdmin.create({
    data: {
      tenantId: tenant.id,
      userId: adminUser.id
    }
  });

  // 4. Academic User
  const academicUser = await createUser('academic@demo.com', 'Academic', 'Head', 'ACADEMIC');

  // 5. Teacher User & Profile
  const teacherUser = await createUser('teacher@demo.com', 'John', 'Teacher', 'TEACHER');
  const teacherProfile = await prisma.teacherProfile.create({
    data: {
      userId: teacherUser.id,
      tenantId: tenant.id,
      teacherId: 'TCH001',
      departmentId: null,
      subjects: [],
      qualifications: ['B.Ed'],
      experience: 5
    }
  });

  // 6. Staff User & Profile
  const staffUser = await createUser('staff@demo.com', 'Mary', 'Staff', 'STAFF');
  const staffProfile = await prisma.staffProfile.create({
    data: {
      userId: staffUser.id,
      tenantId: tenant.id,
      staffId: 'STF001',
      departmentId: null,
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
  const studentUser = await createUser('student@demo.com', 'Kid', 'Student', 'STUDENT');
  const studentProfile = await prisma.studentProfile.create({
    data: {
      userId: studentUser.id,
      tenantId: tenant.id,
      studentId: 'STD001',
      classId: cls.id,
      streamId: stream.id,
      gender: 'MALE',
      dateOfBirth: new Date('2015-01-01')
    }
  });

  console.log('Seed completed successfully');
}
main().catch(console.error).finally(() => prisma.$disconnect());
