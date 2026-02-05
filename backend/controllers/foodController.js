import foodModel from "../models/foodModel.js";
import fs from "fs";

// Add new food item
const addFood = async (req, res) => {
  let image_filename = `${req.file.filename}`;
  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    price: req.body.price,
    image: image_filename,
  });

  try {
    await food.save();
    res.json({ success: true, message: "Food added successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Add bulk food items (for testing purposes)
const bulkAddFood = async (req, res) => {
  try {
    const foods = req.body;

    if (!Array.isArray(foods)) {
      return res.status(400).json({
        success: false,
        message: "Expected an array of food items",
      });
    }

    await foodModel.insertMany(foods);

    res.json({
      success: true,
      message: "Bulk food items added",
      count: foods.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Bulk insert failed" });
  }
};

// Get food list
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Remove food item
const removeFood = async (req, res) => {
  const foodId = req.body.id;
  try {
    const food = await foodModel.findById(foodId);
    fs.unlink(`uploads/${food.image}`, (err) => {
      if (err) {
        console.error("Error deleting image file:", err);
      } else {
        console.log("Image file deleted successfully");
      }
    });
    await foodModel.findByIdAndDelete(foodId);
    res.json({ success: true, message: "Food removed successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Update food item
const updateFood = async (req, res) => {
  const foodId = req.body.id;

  if (!foodId) {
    return res.status(400).json({ success: false, message: "Missing food id" });
  }

  const updatedData = {
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    price: req.body.price,
  };

  try {
    const existingFood = await foodModel.findById(foodId);
    if (!existingFood) {
      return res.status(404).json({ success: false, message: "Food not found" });
    }

    if (req.file?.filename) {
      const oldImage = existingFood.image;
      updatedData.image = req.file.filename;
      if (oldImage) {
        fs.unlink(`uploads/${oldImage}`, (err) => {
          if (err) {
            console.error("Error deleting old image file:", err);
          }
        });
      }
    }

    await foodModel.findByIdAndUpdate(foodId, updatedData);
    res.json({ success: true, message: "Food updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

export { addFood, listFood, removeFood, updateFood, bulkAddFood };
