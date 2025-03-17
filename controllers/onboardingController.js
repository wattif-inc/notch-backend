import validator from "validator";
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

export const getAllAccountsFauna = async (req, res) => {
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

export const inviteUser = async (req, res) => {
  const { email, role, organizationId } = req.body;
  const { auth } = req;

  // if (!auth || !auth.userId) {
  //   return res.status(401).json({ message: "Unauthorized" });
  // }

  if (!email || !role || !organizationId) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const invitation =
      await clerkClient.organizations.createOrganizationInvitation({
        // organizationId: auth.organizationId,
        organizationId,
        emailAddress: email,
        role,
        metadata: {
          // invitedBy: auth.userId,
          invitedBy: "user_2mQl5L6YAqEBJy3fPsGb3a2nZ8z",
        },
        redirect_url: "https://studio.notch.energy/sign-up",
      });

    const createInvitationQueries = fql`invites.create(${{
      invitationId: invitation.id,
      organizationId,
      email,
      role,
      status: invitation.status,
    }})`;
    const result = await faunaClient.query(createInvitationQueries);

    res.status(201).json({
      message: `Invitation sent to ${email}`,
      data: invitation,
    });
  } catch (error) {
    res.status(500).json({
      msg: "An error occurred while sending the invitation",
      error,
    });
  }
};

export const createUser = async (req, res) => {
  const { username, firstName, lastName, password, emailAddress } = req.body;
  const { auth } = req;

  if (!username || !firstName || !lastName || !password || !emailAddress) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const user = await clerkClient.users.createUser({
      emailAddress: [emailAddress],
      username,
      firstName,
      lastName,
      password,
      metadata: {
        createdBy: "user_2mQl5L6YAqEBJy3fPsGb3a2nZ8z",
      },
    });
    console.log("user clerk resp==>", user);

    const invitationData = await getInvitationData(emailAddress);
    console.log("invitationData checker  resp==>", invitationData);

    if (invitationData) {
      try {
        const addMember =
          await clerkClient.organizations.createOrganizationMembership({
            organizationId: invitationData.organizationId,
            userId: user.id,
            role: invitationData.role,
          });
        console.log("addMember==>", addMember);
      } catch (err) {
        console.error("Error adding member:", err);
      }
    }

    const createUserQuery = fql`users.create(${{
      emailAddress,
      username,
      firstName,
      lastName,
      clerkUserId: user.id,
      clerkOrgId: invitationData.organizationId,
    }})`;
    const result = await faunaClient.query(createUserQuery);
    console.log("result==>", result);

    res.status(201).json({
      message: `User ${username} created successfully`,
      data: result.data,
    });
  } catch (error) {
    res.status(500).json({
      msg: "An error occurred while creating the user",
      error: error,
    });
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
