import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connect.js";
import workoutRoutes from "./routes/workoutRouter.js";
import workoutHistoryRoutes from "./routes/workoutHistoryRouter.js";
import cors from "cors";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: true,
  }),
);

app.use(express.json());

// Routery
app.use("/workout", workoutRoutes);
app.use("/history", workoutHistoryRoutes);

app.get("/", (req, res) => {
  res.send("Połączono");
});

const PORT = process.env.PORT || 3000;
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, "0.0.0.0", () =>
      console.log(`Serwer działa na: http://localhost:${PORT}`),
    );
  } catch (error) {
    console.error("Błąd startu serwera", error.message);
  }
};

startServer();
