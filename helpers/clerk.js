import { clerkClient } from "@clerk/express";

export const getOrganizationIdFromInvite = async (email) => {
  try {
    const invitations = await clerkClient.organizations.getPendingInvitations();

    // Find the invitation that matches the email
    const invite = invitations.find((inv) => inv.emailAddress === email);
    console.log("invite data resp==>", invite);

    return invite ? invite.organizationId : null;
  } catch (error) {
    console.error("Error fetching organization ID:", error);
    return null;
  }
};
