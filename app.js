import express from "express";
import userRouter from "./routes/userRoutes.js";
import tranRouter from "./routes/tranRoutes.js";
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
    credentials: true, //permission to include user credentials such as cookies and authentication headers
}));

//Using routes after express json
app.use("/api/v1/users", userRouter);
app.use("/api/v1/transactions", tranRouter);

app.get("/", (req, res) => {
    res.send("Nice Working");
});

//Using Error Middle
app.use(errorMiddleware);
