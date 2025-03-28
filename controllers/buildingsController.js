import faunaClient from "../database/conn.js";
import { fql, ServiceError } from "fauna";

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
    console.log("===> Result of fauna querry:", result);
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

export const getAllBuildings = async (req, res) => {
  const organizationId = req.params.id;

  if (!organizationId) {
    return res.status(400).json({ error: "Organization ID is required" });
  }

  try {
    const getAllBuildingsQuery = fql`
      buildings.all().where(building => building.organizationId == ${organizationId})
    `;

    const result = await faunaClient.query(getAllBuildingsQuery);
    res.status(200).json({
      message: "Buildings retrieved successfully",
      data: result,
    });
  } catch (error) {
    if (error instanceof ServiceError) {
      console.error("Fauna error:", error);
      return res.status(500).json({
        msg: "An error occurred while retrieving the buildings",
        error,
      });
    }

    console.error("Error retrieving buildings:", error);
    res.status(500).json({
      error: "An error occurred while retrieving the buildings",
    });
  }
};

export const getBuildingById = async (req, res) => {
  const buildingId = req.params.id;

  if (!buildingId) {
    return res.status(400).json({ error: "Building ID is required" });
  }

  try {
    const getBuildingByIdQuery = fql`
      buildings.byId(${buildingId})
    `;

    const result = await faunaClient.query(getBuildingByIdQuery);
    res.status(200).json({
      message: "Building retrieved successfully",
      data: result,
    });
  } catch (error) {
    if (error instanceof ServiceError) {
      console.error("Fauna error:", error);
      return res.status(500).json({
        msg: "An error occurred while retrieving the building",
        error,
      });
    }

    console.error("Error retrieving building:", error);
    res.status(500).json({
      error: "An error occurred while retrieving the building",
    });
  }
};

export const updateBuilding = async (req, res) => {
  const buildingId = req.params.id;

  if (!buildingId) {
    return res.status(400).json({ error: "Building ID is required" });
  }

  const {
    buildingName,
    buildingUrlSlug,
    location,
    region,
    noOfFloor,
    manager,
  } = req.body;

  //   if (
  //     !!buildingName ||
  //     !buildingUrlSlug ||
  //     !location ||
  //     !region ||
  //     !noOfFloor ||
  //     !manager
  //   ) {
  //     return res.status(400).json({ error: "Building ID is required" });
  //   }

  try {
    const updateBuildingQuery = fql`
      buildings.byId(${buildingId})?.update(${{
      buildingName,
      buildingUrlSlug,
      location,
      region,
      noOfFloor,
      manager,
    }})
    `;

    const result = await faunaClient.query(updateBuildingQuery);
    res.status(200).json({
      message: "Building updated successfully",
      data: result,
    });
  } catch (error) {
    if (error instanceof ServiceError) {
      console.error("Fauna error:", error);
      return res.status(500).json({
        msg: "An error occurred while updating the building",
        error,
      });
    }

    console.error("Error updating building:", error);
    res.status(500).json({
      error: "An error occurred while updating the building",
    });
  }
};

export const deleteBuilding = async (req, res) => {
  const buildingId = req.params.id;

  if (!buildingId) {
    return res.status(400).json({ error: "Building ID is required" });
  }

  try {
    const deleteBuildingQuery = fql`
      buildings.byId(${buildingId})?.delete()
    `;

    const result = await faunaClient.query(deleteBuildingQuery);
    res.status(200).json({
      message: "Building deleted successfully",
      data: result,
    });
  } catch (error) {
    if (error instanceof ServiceError) {
      console.error("Fauna error:", error);
      return res.status(500).json({
        msg: "An error occurred while deleting the building",
        error,
      });
    }

    console.error("Error deleting building:", error);
    res.status(500).json({
      error: "An error occurred while deleting the building",
    });
  }
}