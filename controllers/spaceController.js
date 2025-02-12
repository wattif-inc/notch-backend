import validator from "validator";
import faunaClient from "../database/conn.js";
import { fql, ServiceError } from "fauna";
import { clerkClient } from "@clerk/express";

export const createSpaceWithDevices = async (req, res) => {
  const { spaceName, spaceSize, spaceType, floor, devices, clerkId } = req.body;

  // Basic validation to ensure spaceName and Devices are provided
  if (!spaceName || !spaceSize || !spaceType || !floor || !clerkId) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const createSpaceQuery = fql`spaces.create(${{
      spaceName,
      spaceSize,
      spaceType,
      floor,
      devices,
      clerkId,
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
  } 
};

export const createWorkSpace = async (req, res) => {
  const { workspaceName } = req.body;

  if (!workspaceName) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const createWorkspaceQuery = fql`workspaces.create(${{
      workspaceName,
    }})`;

    const result = await faunaClient.query(createWorkspaceQuery);
    res.status(201).json({
      message: "Workspace was created successfully",
      data: result,
    });
  } catch (error) {
    if (error instanceof ServiceError) {
      console.error("Fauna error:", error);
      return res.status(500).json({
        error: "An error occurred while creating the Workspace",
      });
    }

    console.error("Error creating Workspace:", error);
    res.status(500).json({
      error: "An error occurred while creating the Workspace",
    });
  }
};

export const getAllworkspaces = async (req, res) => {
  try {
    const getAllWorkspacesQuery = fql`workspaces.all()`;

    const result = await faunaClient.query(getAllWorkspacesQuery);

    res.status(200).json({
      message: "Workspaces were fetched successfully",
      data: result.data,
    });
  } catch (error) {
    if (error instanceof ServiceError) {
      console.error("Fauna error:", error);
      return res.status(500).json({
        error: "An error occurred while fetching the Workspaces",
      });
    }

    console.error("Error fetching Workspaces:", error);
    res.status(500).json({
      error: "An error occurred while fetching the Workspaces",
    });
  }
};
