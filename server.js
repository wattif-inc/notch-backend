import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import express from "express";
import { clerkMiddleware, clerkClient } from "@clerk/express";

import faunaClient from "./database/conn.js";
import Routes from "./router/index.js";

dotenv.config();
const app = express();

/** middlewares */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  express.json({
    type: "application/vnd.api+json",
  })
);
app.use(cors());
app.use(morgan("tiny"));

app.disable("x-powered-by"); //less hackers know about your stack

/** clerk integration keys */

app.use(clerkMiddleware());

const port = process.env.PORT || 8081;

/** HTTP GET Request */
app.get("/", async (req, res) => {
  res.status(200).json("Welcome to notch-backed");
});

/** API routes */

app.use("/api/v1", Routes);

app.listen(port, () => {
  console.log(`Server connected to PORT:${port}`);
});
