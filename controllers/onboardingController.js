import validator from "validator";
import faunaClient from "../database/conn.js";
import { fql, ServiceError } from "fauna";
import { clerkClient } from "@clerk/express";

export const createOrganization = async (req, res) => {
  const { organizationName, organizationEmail, slug } = req.body;

  const { auth } = req;

  console.log("auth==>", auth);

  // if (!auth || !auth.userId) {
  //   return res.status(401).json({ message: "Unauthorized" });
  // }

  if (!organizationName || !organizationEmail) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const organization = await clerkClient.organizations.createOrganization({
      name: organizationName,
      slug: slug,
      // createdBy: auth.userId,
      createdBy: "user_2mQl5L6YAqEBJy3fPsGb3a2nZ8z",
      maxAllowedMemberships: 100,
    });
    console.log("organization==>", organization);

    const invitation =
      await clerkClient.organizations.createOrganizationInvitation({
        organizationId: organization.id,
        emailAddress: organizationEmail,
        role: "org:admin",
        metadata: {
          company: organizationName,
          invitedBy: "user_2mQl5L6YAqEBJy3fPsGb3a2nZ8z",
        },
      });
    console.log("Invitation sent:", invitation);

    const createOrganizationQuery = fql`organization.create(${{
      organizationName,
      organizationEmail,
      clerkOrgId: organization.id,
    }})`;
    const result = await faunaClient.query(createOrganizationQuery);
    res.status(201).json({
      message: `The Organizationwas successfully, and an invitation was sent to ${organizationEmail}`,
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
  }
};

export const getOrganization = async (req, res) => {
  try {
    const getUsers = await clerkClient.organizations.getOrganizationList();
    res.status(200).json(getUsers);
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while fetching the Organisation accounts",
    });
  }
};

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

export const getAllUsers = async (req, res) => {
  try {
    const getUsers = await clerkClient.users.getUserList();
    res.status(200).json(getUsers);
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while fetching the Organisation accounts",
    });
  }
};
