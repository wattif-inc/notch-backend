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

// Controller function to fetch all spaces with devices
export const getAllAccounts = async (req, res) => {
  try {
    // FQL query to retrieve all spaces
    const getAllAccountsQuery = fql`onboarding.all()`;

    const result = await faunaClient.query(getAllAccountsQuery);

    res.status(200).json({
      message: "Organisation accounts fetched successfully",
      data: result.data, // assuming `result.data` contains the list of spaces
    });
  } catch (error) {
    if (error instanceof ServiceError) {
      console.error("Fauna error:", error);
      return res.status(500).json({
        error: "An error occurred while fetching the Organisation accounts",
      });
    }

    console.error("Error fetching Organisation accounts:", error);
    res.status(500).json({
      error: "An error occurred while fetching the Organisation accounts",
    });
  } finally {
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
  const { spaceName, Devices } = req.body;

  // Basic validation to ensure spaceName and Devices are provided
  if (!spaceName || !Array.isArray(Devices) || Devices.length === 0) {
    return res
      .status(400)
      .json({ error: "spaceName and Devices are required" });
  }

  try {
    const createSpaceQuery = fql`spaces.create(${{
      spaceName,
      devices: Devices,
    }})`;

    const result = await faunaClient.query(createSpaceQuery);
    res.status(201).json({
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
    res.status(500).json({
      error: "An error occurred while creating the space with devices",
    });
  }
};

// Controller function to fetch all spaces with devices
export const getAllSpacesWithDevices = async (req, res) => {
  try {
    // FQL query to retrieve all spaces
    const getAllSpacesQuery = fql`spaces.all()`;

    const result = await faunaClient.query(getAllSpacesQuery);

    res.status(200).json({
      message: "Spaces with devices fetched successfully",
      data: result.data, // assuming `result.data` contains the list of spaces
    });
  } catch (error) {
    if (error instanceof ServiceError) {
      console.error("Fauna error:", error);
      return res.status(500).json({
        error: "An error occurred while fetching the spaces with devices",
      });
    }

    console.error("Error fetching spaces with devices:", error);
    res.status(500).json({
      error: "An error occurred while fetching the spaces with devices",
    });
  } finally {
    faunaClient.close();
  }
};
