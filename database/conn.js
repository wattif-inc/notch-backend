import { Client, fql, FaunaError } from "fauna";
import dotenv from "dotenv";

dotenv.config();

// To configure your client:
const connect = new Client({
  secret: process.env.YOUR_FAUNA_SECRET,
});

try {
  // Build a query using the `fql` method
  const collectionQuery = fql`Collection.create({ name: "Dogs" })`;
  // Run the query
  const collectionResponse = await connect.query(collectionQuery);

  // Declare a var for app data
  const dog = { name: "Scout" };

  // Build a query using the var
  const documentQuery = fql`
    Dogs.create(${dog}) {
      id,
      ts,
      name
    }
  `;

  // Run the query
  const response = await connect.query(documentQuery);
  console.log(response);
} catch (error) {
  if (error instanceof FaunaError) {
    console.log(error);
  }
} finally {
  // Clean up any remaining resources
  connect.close();
}

export default connect;
