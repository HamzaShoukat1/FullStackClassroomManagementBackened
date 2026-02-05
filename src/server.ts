import { app } from "./app.js";
import { db } from "./db/index.js";
import { sql } from "drizzle-orm";

const startServer = async (): Promise<void> => {
  try {
    await db.execute(sql`select 1`);
    console.log("Database connected");

    const PORT = Number(process.env.PORT) || 8000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
