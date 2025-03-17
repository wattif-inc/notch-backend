import faunaClient from "../database/conn.js";
import { fql, ServiceError } from "fauna";
import { clerkClient } from "@clerk/express";
import { getInvitationData } from "../helpers/faunadb.js";

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
      message: `The Organization was successfully, and an invitation was sent to ${organizationEmail}`,
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

export const removeOrganization = async (req, res) => {
  const organizationId = req.params.id; // Extract the organization ID from the URL
  console.log("Fetching members for organization ID:", organizationId);

  if (!organizationId) {
    return res.status(400).json({ error: "Orginisation ID is required" });
  }

  try {
    const deleteOrganization =
      await clerkClient.organizations.deleteOrganization(organizationId);
    res.status(200).json(deleteOrganization);
  } catch (error) {
    res.status(500).json({
      msg: "An error occurred in deleting the Organisation ",
      error,
    });
  }
};

export const getMembersInOrganization = async (req, res) => {
  const organizationId = req.params.id; // Extract the organization ID from the URL
  console.log("Fetching members for organization ID:", organizationId);

  if (!organizationId) {
    return res.status(400).json({ error: "Orginisation ID is required" });
  }

  try {
    const orgMembers =
      await clerkClient.organizations.getOrganizationMembershipList({
        organizationId,
      });
    res.status(200).json(orgMembers);
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while fetching the Organisation Members",
    });
  }
};
