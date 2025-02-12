import validator from "validator";
import faunaClient from "../database/conn.js";
import { fql, ServiceError } from "fauna";
import { clerkClient } from "@clerk/express";

// Controller function to create an organization
export const createOrganization = async (req, res) => {
  const { organizationName, organizationEmail, buildingName, password } =
    req.body;

  if (!organizationName || !organizationEmail || !buildingName) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const user = await clerkClient.users.createUser({
      emailAddress: [organizationEmail],
      username: organizationName,
      firstName: organizationName,
      lastName: "Inc",
      password,
    });
    console.log("user==>", user);
    const createOrganizationQuery = fql`organization.create(${{
      organizationName,
      organizationEmail,
      buildingName,
      clerkId: user.id,
    }})`;
    const result = await faunaClient.query(createOrganizationQuery);
    res.status(201).json({
      message: "Organization and building onboarded successfully",
      data: result.data,
    });
  } catch (error) {
    if (error instanceof ServiceError) {
      console.log("from fauna==>", error);
      res.status(500).json({
        error: "An error occurred while creating the organisation",
      });
    }

    console.error("Error creating organisation:", error);
    res.status(500).json({
      msg: "An error occurred while creating the organisation",
      error,
    });
  } finally {
    // Clean up any remaining resources
    // faunaClient.close();
  }
};

export const getOrganization = async (req, res) => {
  try {
    const getUsers = await clerkClient.users.getUserList();
    res.status(200).json(getUsers);
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while fetching the Organisation accounts",
    });
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

