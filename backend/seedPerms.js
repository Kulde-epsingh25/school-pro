const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const tenantId = '6a565943a8bfca3c14da6559';
  const userId = '6a565943a8bfca3c14da655b'; // finaltest@example.com

  const existingCount = await prisma.tenantPermission.count({ where: { tenantId } });
  if (existingCount > 0) {
    console.log("Permissions already seeded.");
  } else {
    // Seed permissions
    const defaultSubjects = ["USERS", "ROLES", "FEES", "CLASSES", "STUDENTS", "SETTINGS", "REPORTS", "DEPARTMENTS", "SUBJECTS"];
    const defaultActions = ["CREATE", "READ", "UPDATE", "DELETE"];
    const defaultScopes = ["ALL", "DEPARTMENT", "OWN_ONLY"];
    
    const permissionsToCreate = [];
    for (const subject of defaultSubjects) {
      for (const action of defaultActions) {
        for (const scope of defaultScopes) {
          permissionsToCreate.push({
            tenantId,
            action,
            subject,
            scope,
            description: `Can ${action.toLowerCase()} ${subject.toLowerCase()} (${scope.toLowerCase()})`
          });
        }
      }
    }
    
    const createdPermissions = await Promise.all(
      permissionsToCreate.map(p => prisma.tenantPermission.create({ data: p }))
    );
    console.log("Successfully seeded permissions.");

    // Create roles
    const defaultRoles = [
      { name: "SUPER_ADMIN", displayName: "Super Administrator", desc: "Full administrative access" },
      { name: "DEPARTMENT_ADMIN", displayName: "Department Head", desc: "Department level access" },
      { name: "FINANCE_ADMIN", displayName: "Finance Officer", desc: "Financial management access" },
      { name: "ACADEMIC_ADMIN", displayName: "Academic Coordinator", desc: "Academic management access" }
    ];

    let superAdminRole;
    for (const roleData of defaultRoles) {
      const role = await prisma.tenantRole.create({
        data: {
          tenantId,
          name: roleData.name,
          displayName: roleData.displayName,
          description: roleData.desc,
          createdBy: userId
        }
      });

      if (roleData.name === "SUPER_ADMIN") {
        superAdminRole = role;
        const rolePerms = createdPermissions.map(p => ({
          roleId: role.id,
          permissionId: p.id
        }));
        await prisma.tenantRolePermission.createMany({ data: rolePerms });
      } else if (roleData.name === "FINANCE_ADMIN") {
        const financePerms = createdPermissions
          .filter(p => ["FEES", "REPORTS", "STUDENTS"].includes(p.subject))
          .map(p => ({ roleId: role.id, permissionId: p.id }));
        await prisma.tenantRolePermission.createMany({ data: financePerms });
      } else if (roleData.name === "ACADEMIC_ADMIN") {
        const academicPerms = createdPermissions
          .filter(p => ["CLASSES", "SUBJECTS", "STUDENTS", "REPORTS", "DEPARTMENTS"].includes(p.subject))
          .map(p => ({ roleId: role.id, permissionId: p.id }));
        await prisma.tenantRolePermission.createMany({ data: academicPerms });
      }
    }

    // Link user to SUPER_ADMIN role
    if (superAdminRole) {
      await prisma.tenantUserRole.create({
        data: {
          userId,
          tenantId,
          roleId: superAdminRole.id,
          assignedBy: userId
        }
      });
      console.log("Linked user to Super Admin role.");
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
