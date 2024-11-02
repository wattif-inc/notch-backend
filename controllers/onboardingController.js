import validator from "validator";
import faunaClient from "../database/conn.js";
import { fql, ServiceError } from "fauna";

// Controller function to create an organization
export const createOrganisation = async (req, res) => {
  const { clientName, buildingName, numberOfFloors, space } = req.body;

  if (!clientName || !buildingName || !numberOfFloors || !space) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const createAccountQuery = fql`onboarding.create(${{
      clientName,
      buildingName,
      numberOfFloors,
      space,
    }})`;

    const result = await faunaClient.query(createAccountQuery);
    res
      .status(201)
      .json({ message: "Organisation created successfully", data: result });
  } catch (error) {
    if (error instanceof ServiceError) {
      console.log("from fauna==>", error);
      res.status(500).json({
        error: "An error occurred while creating the organisation",
      });
    }

    console.error("Error creating organisation:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the organisation" });
  } finally {
    // Clean up any remaining resources
    faunaClient.close();
  }
};
// Onboard new user route
export const createAccount = async (req, res) => {
  const { clientName, buildingName, numberOfFloors, space } = req.body;

  // Input validations
  if (!clientName || !buildingName || !numberOfFloors || !space) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (!validator.isInt(numberOfFloors.toString(), { min: 1 })) {
    return res
      .status(400)
      .json({ error: "Number of floors should be a positive integer" });
  }

  // Save user to FaunaDB
  try {
    const result = await faunaClient.query(
      q.Create(q.Collection("Users"), {
        data: {
          clientName,
          buildingName,
          numberOfFloors,
          space,
        },
      })
    );
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller function to create a space with devices
export const createSpaceWithDevices = async (req, res) => {
  const { space } = req.body;

  // Basic validation to ensure the space data is provided
  if (!space || typeof space !== "object" || Object.keys(space).length === 0) {
    return res.status(400).json({ error: "Space with devices is required" });
  }

  try {
    const createSpaceQuery = fql`spaces.create(${{
      space,
    }})`;

    const result = await faunaClient.query(createSpaceQuery);
    res
      .status(201)
      .json({
        message: "Space with devices created successfully",
        data: result,
      });
  } catch (error) {
    if (error instanceof ServiceError) {
      console.error("Fauna error:", error);
      return res.status(500).json({
        error: "An error occurred while creating the space with devices",
      });
    }

    console.error("Error creating space with devices:", error);
    res
      .status(500)
      .json({
        error: "An error occurred while creating the space with devices",
      });
  }
};
