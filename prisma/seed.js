import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("Admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@local.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@local.com",
      password,
      role: "ADMIN",
    },
  });

  console.log("✔ Admin user created:", admin.email);
}

main()
  .then(() => {
    console.log("✔ Seed completed");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Seed failed", err);
    process.exit(1);
  });
