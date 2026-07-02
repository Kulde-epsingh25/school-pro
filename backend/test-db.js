const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "mongodb+srv://admin:admin@cluster0.3hbx2f2.mongodb.net/school-pro?appName=Cluster0"
    }
  }
});

async function main() {
  try {
    const deleted = await prisma.tenant.deleteMany({
      where: {
        name: 'Test Tenant DB'
      }
    });
    console.log("Deleted:", deleted);
  } catch (e) {
    console.error("Failed:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
