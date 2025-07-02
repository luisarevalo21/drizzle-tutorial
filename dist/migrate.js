import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
async function main() {
    // Create postgres client for migration
    const migrationClient = postgres(process.env.DATABASE_URL, {
        max: 1,
        idle_timeout: 20,
        max_lifetime: 60 * 30,
    });
    try {
        console.log("Starting migration...");
        await migrate(drizzle(migrationClient), {
            migrationsFolder: "./src/drizzle/migrations",
        });
        console.log("Migration finished successfully.");
    }
    catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
    finally {
        // Close the postgres connection to prevent memory leaks
        await migrationClient.end();
    }
}
main().catch(error => {
    console.error("Unhandled error:", error);
    process.exit(1);
});
