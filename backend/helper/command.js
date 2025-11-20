import postgres from "postgres";
import "dotenv/config";

const sql = postgres(process.env.DATABASE_URL, {
  ssl: "require",
});

async function randmCommand() {
  try {
    console.log("Connecting to database...");

    const result = await sql`
      SELECT pg_get_tabledef(oid, true)
      FROM pg_class
      WHERE relname = 'scholars' 
        AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');
    `;

    console.log("Success");
    console.table(result);
  } catch (error) {
    console.error("Error", error.message);
  } finally {
    await sql.end();
    console.log("Connection closed.");
  }
}

randmCommand();