import bcrypt from "bcryptjs";
import { getSupabaseClient } from "../database/client.js";
import { BCRYPT_SALT_ROUNDS } from "../constants/index.js";
import { logger } from "../utils/logger.js";
import { sanitizeEmail } from "../utils/validation.js";

// Test users to seed
const testUsers = [
  {
    email: "admin@admin.com",
    password: "admin123",
  },
];

async function seedUsers(): Promise<void> {
  try {
    logger.info("Starting user seeding...");

    const supabase = getSupabaseClient();

    for (const user of testUsers) {
      const sanitizedEmail = sanitizeEmail(user.email);

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from("users")
        .select("email")
        .eq("email", sanitizedEmail)
        .single();

      if (existingUser) {
        logger.info(`User ${user.email} already exists, skipping...`);
        continue;
      }

      // Hash password
      const passwordHash = await bcrypt.hash(user.password, BCRYPT_SALT_ROUNDS);

      // Insert user
      const { error } = await supabase.from("users").insert([
        {
          email: sanitizedEmail,
          password_hash: passwordHash,
        },
      ]);

      if (error) {
        logger.error(`Error seeding user ${user.email}`, error);
      } else {
        logger.info(`Successfully seeded user: ${user.email}`);
      }
    }

    logger.info("User seeding completed!");
    logger.info("Test credentials:");
    testUsers.forEach((user) => {
      logger.info(`Email: ${user.email} | Password: ${user.password}`);
    });
  } catch (error) {
    logger.error("Seeding error", error);
    process.exit(1);
  }
}

// Run seeder
seedUsers()
  .then(() => {
    logger.info("Seeding process finished!");
    process.exit(0);
  })
  .catch((error) => {
    logger.error("Fatal error during seeding", error);
    process.exit(1);
  });

