import express from "express";
import cors from "cors";
import urlRoutes from "./routes/urlRoutes.js";
import { serverAdapter } from "./lib/bullBoard.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", urlRoutes);
app.use("/admin/queues", serverAdapter.getRouter());

export default app;