import { Client, fql, FaunaError } from "fauna";
import dotenv from "dotenv";

dotenv.config();

// To configure your client:
const faunaClient = new Client({
  secret: process.env.YOUR_FAUNA_SECRET, // Replace with your actual FaunaDB secret
  domain: "db.fauna.com",
  // scheme: "https",
});

export default faunaClient;
