import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import express from "express";

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

const port = process.env.PORT || process.env.APP_PORT || 8080;

/** HTTP GET Request */
app.get("/", (req, res) => {
  res.status(200).json("Welcome to notch-backed");
});

/** API routes */

app.use("/api/v1", Routes);

/** start server only when we have valid connection */

// faunaClient()
//   .then(() => {
//     try {
//       app.listen(port, () => {
//         console.log(`Server connected to PORT:${port}`);
//       });
//     } catch (error) {
//       console.log("Cannot connect to the server");
//     }
//   })
//   .catch((error) => {
//     console.log(error.message, "Invalid database connection");
//   });
app.listen(port, () => {
  console.log(`Server connected to PORT:${port}`);
});
