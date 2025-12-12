import { prisma } from "../lib/prisma";
import { hashPassword } from "../lib/password";

async function main() {
  const password = await hashPassword("Admin123");

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

  console.log("Admin created:", admin);
}

main();
