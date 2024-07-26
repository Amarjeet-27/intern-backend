import express, { Application } from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import userRouter from "./routes/userRoute";
import electionRouter from "routes/electionRoute";
import { UserType } from "./db/user/userModel";
import connectDB from "./db/connect";
import healthCheckerRouter from "./routes/healthCheckerRouter";
dotenv.config();


declare global {
  namespace Express {
    interface Request {
      user: UserType;
    }
  }
}
const app: Application = express();
app.use(cors());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
//routes for the app
app.use("/api/v1/", healthCheckerRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/election",electionRouter);

const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL);
    app.listen(PORT, () => console.log(`server started at port ${PORT}`));
  } catch (error) {
    console.log(error.message);
  }
};
startServer();
export default app;
