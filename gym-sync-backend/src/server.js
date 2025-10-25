import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connect.js";

dotenv.config();

const app = express();
app.use(express.json());

await connectDB();

app.get("/", (req, res) => {
  res.send("Połączono");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serwer działa na porcie: ${PORT}`));
app.listen(PORT, () =>
  console.log(`Serwer działa na linku: http://localhost:${PORT}`)
);
