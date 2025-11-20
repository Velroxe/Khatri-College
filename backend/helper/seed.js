import postgres from "postgres";
import bcrypt from "bcrypt";
import "dotenv/config";

const sql = postgres(process.env.DATABASE_URL, {
  ssl: "require",
});

async function seedAdmin() {
  try {
    console.log("Connecting to database...");

    const password = "Admin@123";
    const passwordHash = await bcrypt.hash(password, 10);

    const result = await sql`
      INSERT INTO admins (name, email, password_hash)
      VALUES (${ "Super Admin" }, ${ "sidakprojects@gmail.com" }, ${ passwordHash })
      RETURNING id, name, email, created_at;
    `;

    console.log("✅ Admin seeded successfully:");
    console.table(result);
  } catch (error) {
    console.error("❌ Error seeding admin:", error.message);
  } finally {
    await sql.end();
    console.log("Connection closed.");
  }
}

seedAdmin();