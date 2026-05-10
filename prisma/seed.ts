import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const content = [
  ["Japji Sahib", "Nitnem"],
  ["Jaap Sahib", "Nitnem"],
  ["Tav-Prasad Savaiye", "Nitnem"],
  ["Chaupai Sahib", "Nitnem"],
  ["Anand Sahib", "Nitnem"],
  ["Rehras Sahib", "Nitnem"],
  ["Kirtan Sohila", "Nitnem"],
  ["Ardaas", "Prayer"],
  ["Mool Mantar", "Foundation"],
  ["Shabads for anxiety", "Healing"],
  ["Shabads for courage", "Healing"],
  ["Shabads for attachment", "Healing"],
  ["Shabads for humility", "Character"],
  ["Shabads for gratitude", "Character"]
] as const;

async function main() {
  const passwordHash = await bcrypt.hash("amritvella123", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@amritvella.local" },
    update: {},
    create: {
      name: "Amrit Vella User",
      email: "demo@amritvella.local",
      passwordHash
    }
  });

  await prisma.appSetting.upsert({
    where: { userId_key: { userId: user.id, key: "routineMode" } },
    update: { value: "BEGINNER" },
    create: {
      userId: user.id,
      key: "routineMode",
      value: "BEGINNER"
    }
  });

  for (const [title, category] of content) {
    await prisma.gurbaniContent.upsert({
      where: { title_category: { title, category } },
      update: {},
      create: {
        title,
        category,
        gurmukhiText: null,
        transliteration: null,
        englishMeaning: null,
        verifiedSourceUrl: null,
        notes:
          "Placeholder only. Add verified Gurmukhi, transliteration, English meaning, and source URL later."
      }
    });
  }

  await prisma.playlistLink.upsert({
    where: { id: "seed-kirtan-playlist-placeholder" },
    update: {},
    create: {
      id: "seed-kirtan-playlist-placeholder",
      title: "Kirtan playlist placeholder",
      url: "https://example.com/replace-with-verified-playlist",
      category: "Kirtan",
      notes: "Replace with a verified playlist link."
    }
  });

  console.log("Seed complete");
  console.log("Demo login: demo@amritvella.local / amritvella123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
