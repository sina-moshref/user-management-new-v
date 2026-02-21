import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME || "fastify_db",
  process.env.DB_USER || "postgres",
  process.env.DB_PASSWORD || "00181818",
  {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    dialect: "postgres",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
  },
);

export async function syncModels() {
  try {
    // Add is_online column if it doesn't exist
    try {
      const [cols] = await sequelize.query(`
        SELECT column_name FROM information_schema.columns
        WHERE table_name = 'usersTa' AND column_name = 'is_online'
      `);
      if (cols.length === 0) {
        await sequelize.query(`
          ALTER TABLE "usersTa" ADD COLUMN "is_online" BOOLEAN DEFAULT false
        `);
        console.log("✅ Added column: is_online");
      }
    } catch (e) {
      console.warn("⚠️ is_online column check failed:", e.message);
    }

    // Migrate last_seen column from DATE to VARCHAR if needed
    try {
      const [results] = await sequelize.query(`
        SELECT data_type
        FROM information_schema.columns
        WHERE table_name = 'usersTa'
        AND column_name = 'last_seen'
      `);

      if (
        results.length > 0 &&
        (results[0].data_type === "timestamp without time zone" ||
          results[0].data_type === "timestamp with time zone")
      ) {
        console.log("Migrating last_seen column from DATE to VARCHAR...");
        await sequelize.query(`
          ALTER TABLE "usersTa"
          ALTER COLUMN "last_seen" TYPE VARCHAR(255)
          USING CASE
            WHEN "last_seen" IS NULL THEN NULL
            ELSE "last_seen"::text
          END
        `);
        console.log("✅ Migration completed: last_seen is now VARCHAR");
      } else if (results.length > 0) {
        console.log(
          `ℹ️  last_seen column type: ${results[0].data_type} (no migration needed)`,
        );
      }
    } catch (migrationError) {
      console.warn(
        "⚠️  Migration check failed (column may already be migrated):",
        migrationError.message,
      );
    }

    await sequelize.sync({ alter: false });
    console.log("Models synced");
  } catch (error) {
    console.error("Error syncing models:", error);
    throw error;
  }
}

export default sequelize;
