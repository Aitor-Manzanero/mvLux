import express from "express";
import filmRoutes from "./routes/film.routes.js";
import cors from "cors";

const app = express();
app.use(cors());

app.use(express.json());
app.use("/api", filmRoutes);

export default app;