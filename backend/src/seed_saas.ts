import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding SaaS Super Admin...");

  // 1. Create the User record
  const user = await prisma.user.upsert({
    where: { email: "super@admin.com" },
    update: {
      password: "Password123!", // In a real app, hash this!
      isActive: true,
      firstName: "Platform",
      lastName: "Manager",
    },
    create: {
      email: "super@admin.com",
      password: "Password123!",
      firstName: "Platform",
      lastName: "Manager",
      isActive: true,
    },
  });

  // 2. Attach the SaaS Super Admin flag
  const saasAdmin = await prisma.saaSSuperAdmin.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      sharedWith: ["super@admin.com"]
    }
  });

  console.log("✅ SaaS Super Admin created successfully!");
  console.log("📧 Email: super@admin.com");
  console.log("🔑 Password: Password123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
