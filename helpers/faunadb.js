import faunaClient from "../database/conn.js";
import { fql, ServiceError } from "fauna";

export const getInvitationData = async (email) => {
  try {
    // Query using a Fauna index to search by email
    const getInvitedAccountQuery = fql`
      invites.where(.email == ${email}).order(desc(.ts)).first()
    `;

    const result = await faunaClient.query(getInvitedAccountQuery);

    if (!result) {
      console.log("No invitation found for this email.");
      return null;
    }

    return result.data;
  } catch (error) {
    if (error instanceof ServiceError) {
      console.error("Fauna error:", error);
      return null;
    }
    console.error("Unexpected error:", error);
  }
};
