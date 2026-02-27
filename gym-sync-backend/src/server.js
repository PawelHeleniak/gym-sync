import express from "express";
import "dotenv/config";
import connectDB from "./db/connect.js";
import workoutRoutes from "./routes/workoutRouter.js";
import workoutHistoryRoutes from "./routes/workoutHistoryRouter.js";
import userRoutes from "./routes/userRouter.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: true,
  }),
);

app.set("trust proxy", 1);
app.use(express.json());

app.use("/workout", workoutRoutes);
app.use("/history", workoutHistoryRoutes);
app.use("/auth", userRoutes);

// === Pod serwerem statyczne pliki z katalogu public_html ===
const distPath = path.join(__dirname, "../../../public_html");

app.use(express.static(distPath));

app.use((req, res, next) => {
  if (req.method !== "GET") return next();
  res.sendFile(path.join(distPath, "index.html"));
});
// ===

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Serwer działa na porcie ${PORT}`);
    });
  } catch (error) {
    console.error("Błąd startu serwera", error.message);
  }
};

startServer();
