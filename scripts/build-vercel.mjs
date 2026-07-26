import { spawnSync } from "node:child_process";
import console from "node:console";
import process from "node:process";
import { fileURLToPath, URL } from "node:url";
import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;

const projectRoot = fileURLToPath(new URL("..", import.meta.url));
const nextCli = fileURLToPath(
  new URL("../node_modules/next/dist/bin/next", import.meta.url),
);
const migrationsFolder = fileURLToPath(
  new URL("../drizzle-postgres", import.meta.url),
);
const migrateOnly = process.argv.includes("--migrate-only");
const shouldMigrate = migrateOnly || process.argv.includes("--migrate");

async function migratePostgres(required) {
  const connectionString =
    process.env.MIGRATION_DATABASE_URL?.trim() ||
    process.env.DATABASE_URL?.trim();

  if (!connectionString) {
    if (required) {
      throw new Error(
        "DATABASE_URL or MIGRATION_DATABASE_URL is required to migrate Postgres.",
      );
    }

    console.log(
      "No Postgres connection configured; skipping deployment migrations.",
    );
    return;
  }

  const [{ neon }, { drizzle }, { migrate }] = await Promise.all([
    import("@neondatabase/serverless"),
    import("drizzle-orm/neon-http"),
    import("drizzle-orm/neon-http/migrator"),
  ]);
  const database = drizzle(neon(connectionString));

  await migrate(database, { migrationsFolder });
  console.log("Postgres deployment migrations are up to date.");
}

if (shouldMigrate) {
  loadEnvConfig(projectRoot);
  await migratePostgres(migrateOnly);
}

if (migrateOnly) {
  process.exit(0);
}

const result = spawnSync(process.execPath, [nextCli, "build"], {
  env: {
    ...process.env,
    KBI_DEPLOY_TARGET: "vercel",
  },
  stdio: "inherit",
});

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
