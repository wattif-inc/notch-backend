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
    const createApplianceQuery = fql`appliance.create(${{
      applianceName,
    }})`;

    const result = await faunaClient.query(createApplianceQuery);
    res.status(201).json({
      message: "Sappliance created successfully",
      data: result,
    });
  } catch (error) {
    if (error instanceof ServiceError) {
      console.error("Fauna error:", error);
      return res.status(500).json({
        error: "An error occurred while creating appliances",
      });
    }

    console.error("Error creating appliances:", error);
    res.status(500).json({
      error: "An error occurred while creatingappliances",
    });
  }
};

export const getAllAppliances = async (req, res) => {
  try {
    // FQL query to retrieve all spaces
    const getAllApplianceQuery = fql`appliance.all()`;

    const result = await faunaClient.query(getAllApplianceQuery);

    res.status(200).json({
      message: "appliances fetched successfully",
      data: result.data, // assuming `result.data` contains the list of spaces
    });
  } catch (error) {
    if (error instanceof ServiceError) {
      console.error("Fauna error:", error);
      return res.status(500).json({
        error: "An error occurred while fetching the appliances",
      });
    }

    console.error("Error fetching appliances:", error);
    res.status(500).json({
      error: "An error occurred while fetching appliances",
    });
  }
};

export const createSensor = async (req, res) => {
  const { sensorName } = req.body;

  if (!sensorName) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const createSensorQuery = fql`sensors.create(${{
      sensorName,
    }})`;

    const result = await faunaClient.query(createSensorQuery);
    res.status(201).json({
      message: "sensor was created successfully",
      data: result,
    });
  } catch (error) {
    if (error instanceof ServiceError) {
      console.error("Fauna error:", error);
      return res.status(500).json({
        error: "An error occurred while creating the sensors",
      });
    }

    console.error("Error creating sensor:", error);
    res.status(500).json({
      error: "An error occurred while creating the sensor",
    });
  }
};

export const getAllSensors = async (req, res) => {
  try {
    const getAllSensorsQuery = fql`sensors.all()`;

    const result = await faunaClient.query(getAllSensorsQuery);

    res.status(200).json({
      message: "sensors were fetched successfully",
      data: result.data,
    });
  } catch (error) {
    if (error instanceof ServiceError) {
      console.error("Fauna error:", error);
      return res.status(500).json({
        error: "An error occurred while fetching the sensors",
      });
    }

    console.error("Error fetching sensors:", error);
    res.status(500).json({
      error: "An error occurred while fetching the sensors",
    });
  }
};
