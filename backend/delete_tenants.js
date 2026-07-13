const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const idsToDelete = [
    "6a4a700e16137e53c512a4fd",
    "6a4b529b2f934fa54cd6f3eb",
    "6a4b5a088263bd03ecad4027",
    "6a4b5b3a8263bd03ecad4169",
    "6a4b6ebe9f4f288d8cb2be74",
    "6a4b71a99f4f288d8cb2bfb9",
    "6a4b73dc9f4f288d8cb2c0fc",
    "6a4b764f9f4f288d8cb2c23e",
    "6a4b7c203a055eed3821f8e3",
    "6a5325f19b42d7599d44b4b8",
    "6a532d8e7bf0d43e739b1350",
    "6a53384d6875b35a8ea8528d",
    "6a546ee401daaa3b94e7d609",
    "6a546f66849caf3329cde5ae",
    "6a546faa48e878203429019e",
    "6a547054dc51c94a37f4721f"
  ];

  console.log(`Starting deletion of ${idsToDelete.length} test tenants...`);
  
  // Since onDelete: Cascade is defined on the relations in Prisma schema, 
  // deleting the Tenant will automatically delete related records (Classes, Users, etc.)
  const result = await prisma.tenant.deleteMany({
    where: {
      id: {
        in: idsToDelete
      }
    }
  });

  console.log(`Successfully deleted ${result.count} tenants.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
