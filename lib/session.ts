import { prisma } from "@/lib/db";

export async function requireUser() {
  const owner = await prisma.user.upsert({
    where: { email: "owner@amritvella.local" },
    update: {},
    create: {
      name: "AmritVella",
      email: "owner@amritvella.local",
      passwordHash: "auth-disabled"
    },
    select: { id: true, name: true, email: true }
  });

  await prisma.appSetting.upsert({
    where: { userId_key: { userId: owner.id, key: "routineMode" } },
    update: {},
    create: {
      userId: owner.id,
      key: "routineMode",
      value: "BEGINNER"
    },
  });

  return owner;
}
