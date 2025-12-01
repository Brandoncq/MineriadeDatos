import express from "express";
import cors from "cors";
import predictionRoutes from "./routes/prediction.routes.js";
import { FRONTEND_URL } from "./config/env.js";

const app = express();

app.use(
  cors({
    origin: FRONTEND_URL,
  })
);
app.use(express.json());

app.use("/api/predict", predictionRoutes);

export default app;
