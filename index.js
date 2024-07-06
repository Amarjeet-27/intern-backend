import express from "express";
import cors from "cors";
import { connectDb } from "./config/db.js";
import dotenv from "dotenv";
import { authRouter } from "./routes/authRoute.js";
const app = express();

app.use(cors());
dotenv.config();
app.use(express.json());
connectDb();
app.get("/", (req, res) => {
  res.status(200).send({
    success: true,
    message: "Request fetched successfully",
  });
});

app.use("/api/v1/auth", authRouter);

app.listen(5000, () => {
  console.log("server is running on 5000");
});
