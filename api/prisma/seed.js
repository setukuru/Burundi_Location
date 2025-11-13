import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

async function main() {
  const adminEmail = "admin@example.com";
  const adminUsername = "admin";
  const adminPassword = "Admin@123"; // change to a secure password

  // Check if admin already exists
  const existingAdmin = await prisma.user.findFirst({
    where: { role: "admin" },
  });

  if (existingAdmin) {
    console.log("Admin already exists:", existingAdmin.username);
    return;
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // Create user as admin
  const newAdmin = await prisma.user.create({
    data: {
      username: adminUsername,
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    },
  });

  console.log("Admin created successfully:", newAdmin.username);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
