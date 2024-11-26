const express = require("express");
const asyncHandler = require("express-async-handler");
const Categoryservice = require("../models/servicecategory");

const createCategory = asyncHandler(async (req, res) => {
  const { title } = req.body;
  try {
    const category = await Categoryservice.create({ title });
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: "Unable to create category", error });
  }
});

const getCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await Categoryservice.find({});
    if (!categories || categories.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No categories found" });
    }
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch categories",
      error: error.message,
    });
  }
});

const deleteCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Categoryservice.findByIdAndDelete(req.params.id);
    if (category) {
      res.status(200).json({ message: "Category deleted successfully" });
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Unable to delete category", error });
  }
});
module.exports = {
  createCategory,
  getCategories,
  deleteCategory,
};
