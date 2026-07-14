const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const tenants = await prisma.tenant.findMany({
    orderBy: { createdAt: 'desc' },
    take: 1
  });
  const tenant = tenants[0];
  console.log("Latest Tenant:", tenant);
  
  if (tenant) {
    const perms = await prisma.tenantPermission.count({ where: { tenantId: tenant.id } });
    console.log("Permissions count for this tenant:", perms);
    
    const roles = await prisma.tenantRole.findMany({ where: { tenantId: tenant.id }});
    console.log("Roles for this tenant:", roles.length);
  }
}
main().finally(() => prisma.$disconnect());
