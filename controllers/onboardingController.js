import validator from "validator";

// Onboard new user route
app.post("/users", async (req, res) => {
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
    const result = await client.query(
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
});

// Add device route
app.post("/devices", async (req, res) => {
  const { deviceName, userId } = req.body;

  // Input validation
  if (!deviceName || !userId) {
    return res
      .status(400)
      .json({ error: "Device name and user ID are required" });
  }

  // Save device to FaunaDB
  try {
    const result = await client.query(
      q.Create(q.Collection("Devices"), {
        data: {
          deviceName,
          userId,
        },
      })
    );
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all devices route
app.get("/devices", async (req, res) => {
  try {
    const result = await client.query(
      q.Map(
        q.Paginate(q.Documents(q.Collection("Devices"))),
        q.Lambda("device", q.Get(q.Var("device")))
      )
    );
    res.status(200).json(result.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
