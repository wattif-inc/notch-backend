import validator from "validator";
import faunaClient from "../database/conn.js";
import { fql, ServiceError } from "fauna";
import { clerkClient } from "@clerk/express";

export const createAppliances = async (req, res) => {
  const { applianceName } = req.body;

  if (!applianceName) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const createSpaceQuery = fql`appliance.create(${{
      applianceName,
    }})`;

    const result = await faunaClient.query(createSpaceQuery);
    res.status(201).json({
      message: "Sappliance created successfully",
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

export const getAllAppliances = async (req, res) => {
  try {
    // FQL query to retrieve all spaces
    const getAllSpacesQuery = fql`appliance.all()`;

    const result = await faunaClient.query(getAllSpacesQuery);

    res.status(200).json({
      message: "appliances fetched successfully",
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
