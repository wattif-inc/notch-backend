import faunaClient from "../database/conn.js";
import { fql, ServiceError } from "fauna";
import { getInvitationData } from "../helpers/faunadb.js";

export const createBuilding = async (req, res) => {
  const {
    buildingName,
    buildingUrlSlug,
    location,
    region,
    noOfFloor,
    manager,
    organizationId,
  } = req.body;

  if (
    !buildingName ||
    !buildingUrlSlug ||
    !location ||
    !region ||
    !noOfFloor ||
    !manager ||
    !organizationId
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const createBuildingQuery = fql`buildings.create(${{
      buildingName,
      buildingUrlSlug,
      location,
      region,
      noOfFloor,
      manager,
      organizationId,
    }})`;

    const result = await faunaClient.query(createBuildingQuery);
    res.status(201).json({
      message: "Building was created successfully",
      data: result,
    });
  } catch (error) {
    if (error instanceof ServiceError) {
      console.error("Fauna error:", error);
      return res.status(500).json({
        error: "An error occurred while creating the building",
      });
    }

    console.error("Error creating building:", error);
    res.status(500).json({
      error: "An error occurred while creating the building",
    });
  }
};
