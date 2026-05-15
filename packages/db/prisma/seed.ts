import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function seeder() {
  await Promise.all([
    prisma.availableTriggers.upsert({
      where: { id: "webhook" },
      update: {},
      create: { id: "webhook", name: "Webhook" },
    }),
    prisma.availableTriggers.upsert({
      where: { id: "cron" },
      update: {},
      create: { id: "cron", name: "Cron-Work" },
    }),
    prisma.availableAction.upsert({
      where: { id: "email" },
      update: {},
      create: { id: "email", name: "Send-email" },
    }),
    prisma.availableAction.upsert({
      where: { id: "sol-money" },
      update: {},
      create: { id: "sol-money", name: "Send-solana" },
    }),
    prisma.availableAction.upsert({
      where: { id: "http-request" },
      update: {},
      create: { id: "http-request", name: "HTTP-Request" },
    }),
  ]);

  console.log("Seeded all");
}

seeder()
  .catch((e) => {
    console.error(" Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
