import Property from "../models/Property.js";

// ADD PROPERTY
export const addProperty = async (req, res) => {
  try {
    const property = new Property(req.body);
    await property.save();
    res.json({ message: "Property added!", property });
  } catch (e) {
    res.status(500).json({ error: "Error adding property" });
  }
};

// GET PROPERTY BY ID
export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    res.json(property);
  } catch (e) {
    res.status(404).json({ error: "Property not found" });
  }
};

// CHECK AVAILABILITY (Dummy)
export const checkAvailability = (req, res) => {
  res.json({ available: true });
};

// RESERVE DATES (Dummy)
export const reserveDates = (req, res) => {
  res.json({ reserved: true });
};
