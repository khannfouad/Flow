import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function seeder() {
  await prisma.availableTriggers.create({
    data: {
      id: "webhook",
      name: "Webhook",
    },
  });
  await prisma.availableTriggers.create({
    data: {
      id: "cron",
      name: "Cron-Work",
    },
  });

  await prisma.availableAction.create({
    data: {
      id: "email",
      name: "Send-email",
    },
  });

  await prisma.availableAction.create({
    data: {
      id: "sol-money",
      name: "Send-solana",
    },
  });
}

seeder();
