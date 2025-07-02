import { defineConfig } from "drizzle-kit";
export default defineConfig({
  schema: "./src/drizzle/schema.ts",
  out: "./src/drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
  //generate migrtions tells us what will change
  verbose: true,

  //when running the migration changes to db, delete tables crtiical issues, will
  //ask are you sure you want to do it.s
  strict: true,
});
