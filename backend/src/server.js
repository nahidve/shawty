import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

import { redis } from "./lib/redis.js";

await redis.set("test", "redis test");

const value = await redis.get("test");

console.log(value);