import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connect.js";
import workoutRoutes from "./routes/workoutRouter.js";

dotenv.config();

const app = express();
app.use(express.json());

// Routery
app.use("/workout", workoutRoutes);

app.get("/", (req, res) => {
  res.send("Połączono");
});

const PORT = process.env.PORT || 3000;
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`Serwer działa na porcie: ${PORT}`));
    app.listen(PORT, () =>
      console.log(`Serwer działa na linku: http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error("Błąd startu serwera", error.message);
  }
};

startServer();
