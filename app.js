import express from "express";
import userRouter from "./routes/userRoutes.js";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.js";
import cors from "cors";

export const app = express();

config({
    path: "./data/config.env",
})

//Using middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
}));

//Using routes after express json
app.use("/api/v1/users", userRouter);

app.get("/", (req, res) => {
    res.send("Nice Working");
});

//Using Error Middle
app.use(errorMiddleware);
