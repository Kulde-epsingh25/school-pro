import { db } from "../db";

export async function seedDefaultPermissions(tenantId: string, adminUserId: string) {
  // Seed default permissions
  const defaultSubjects = ["USERS", "ROLES", "FEES", "CLASSES", "STUDENTS", "SETTINGS", "REPORTS", "DEPARTMENTS", "SUBJECTS", "AUDIT"];
  const defaultActions = ["CREATE", "READ", "UPDATE", "DELETE"];
  const defaultScopes = ["ALL", "DEPARTMENT", "OWN_ONLY"];
  
  const permissionsToCreate = [];
  for (const subject of defaultSubjects) {
    for (const action of defaultActions) {
      for (const scope of defaultScopes) {
        permissionsToCreate.push({
          tenantId: tenantId,
          action,
          subject,
          scope,
          description: `Can ${action.toLowerCase()} ${subject.toLowerCase()} (${scope.toLowerCase()})`
        });
      }
    }
  }

  const createdPermissions = await Promise.all(
    permissionsToCreate.map(p => db.tenantPermission.create({ data: p }))
  );

  // Seed default roles
  const defaultRoles = [
    { name: "SUPER_ADMIN", displayName: "Super Administrator", desc: "Full administrative access" },
    { name: "DEPARTMENT_ADMIN", displayName: "Department Head", desc: "Department level access" },
    { name: "FINANCE_ADMIN", displayName: "Finance Officer", desc: "Financial management access" },
    { name: "ACADEMIC_ADMIN", displayName: "Academic Coordinator", desc: "Academic management access" }
  ];

  let superAdminRole;
  
  for (const roleData of defaultRoles) {
    const role = await db.tenantRole.create({
      data: {
        tenantId: tenantId,
        name: roleData.name,
        displayName: roleData.displayName,
        description: roleData.desc,
        createdBy: adminUserId
      }
    });

    if (roleData.name === "SUPER_ADMIN") {
      superAdminRole = role;
      const rolePerms = createdPermissions.map(p => ({
        roleId: role.id,
        permissionId: p.id
      }));
      await db.tenantRolePermission.createMany({ data: rolePerms });
    } else if (roleData.name === "FINANCE_ADMIN") {
      const financePerms = createdPermissions
        .filter(p => ["FEES", "REPORTS", "STUDENTS"].includes(p.subject))
        .map(p => ({ roleId: role.id, permissionId: p.id }));
      await db.tenantRolePermission.createMany({ data: financePerms });
    } else if (roleData.name === "ACADEMIC_ADMIN") {
      const academicPerms = createdPermissions
        .filter(p => ["CLASSES", "SUBJECTS", "STUDENTS", "REPORTS", "DEPARTMENTS"].includes(p.subject))
        .map(p => ({ roleId: role.id, permissionId: p.id }));
      await db.tenantRolePermission.createMany({ data: academicPerms });
    }
  }

  // Link User to SUPER_ADMIN TenantRole
  if (superAdminRole) {
    await db.tenantUserRole.create({
      data: {
        userId: adminUserId,
        tenantId: tenantId,
        roleId: superAdminRole.id,
        assignedBy: adminUserId
      }
    });
  }
}
