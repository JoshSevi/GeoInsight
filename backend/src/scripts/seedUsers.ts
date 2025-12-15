import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Test users to seed
const testUsers = [
  {
    email: "admin@admin.com",
    password: "admin123",
  },
];

async function seedUsers() {
  try {
    console.log("🌱 Starting user seeding...");

    for (const user of testUsers) {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from("users")
        .select("email")
        .eq("email", user.email.toLowerCase().trim())
        .single();

      if (existingUser) {
        console.log(`⏭️  User ${user.email} already exists, skipping...`);
        continue;
      }

      // Hash password
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(user.password, saltRounds);

      // Insert user
      const { data, error } = await supabase
        .from("users")
        .insert([
          {
            email: user.email.toLowerCase().trim(),
            password_hash: passwordHash,
          },
        ])
        .select();

      if (error) {
        console.error(`❌ Error seeding user ${user.email}:`, error.message);
      } else {
        console.log(`✅ Successfully seeded user: ${user.email}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Password: ${user.password}`);
      }
    }

    console.log("\n✨ User seeding completed!");
    console.log("\n📝 Test credentials:");
    testUsers.forEach((user) => {
      console.log(`   Email: ${user.email} | Password: ${user.password}`);
    });
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
}

// Run seeder
seedUsers()
  .then(() => {
    console.log("\n🎉 Seeding process finished!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  });

