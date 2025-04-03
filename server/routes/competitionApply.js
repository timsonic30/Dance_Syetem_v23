const express = require("express");
const multer = require("multer");

// Multer setup for file uploads
const upload = multer({ dest: "uploads/" }); // Files will be stored in the "uploads" folder

// Initialize Router
const router = express.Router();
const CompetitionApply = require("../models/competitionApply"); // Import CompetitionApply model

// Route for handling file upload
router.post("/upload", upload.single("transactionSlip"), (req, res) => {
  try {
    // Return success message and the renamed file details
    res.status(200).json({
      message: "File uploaded successfully!",
      fileName: req.file.filename,
      filePath: req.file.path,
    });
  } catch (error) {
    res.status(500).json({ message: "File upload failed.", error });
  }
});

// Insert new submission (POST)
router.post("/submissions", upload.single("transactionSlip"), async (req, res) => {
  try {
    // Handle uploaded file and other form data
    const newSubmission = new CompetitionApply({
      ...req.body,
      transactionSlip: req.file ? req.file.filename : null, // Save file name if uploaded
    });
    await newSubmission.save(); // Save submission to the database
    res.status(201).json({ message: "Submission successful!", data: newSubmission });
  } catch (error) {
    console.error("Error saving data:", error.message);
    res.status(500).json({ message: "Failed to save submission.", error });
  }
});

// Fetch all submissions (GET)
router.get("/submissions", async (req, res) => {
  try {
    const submissions = await CompetitionApply.find(); // Retrieve all submissions
    res.status(200).json(submissions); // Respond with the submission data
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ message: "Failed to fetch submissions." });
  }
});

// Update competition application (PUT)
router.put("/submissions/:id", upload.single("transactionSlip"), async (req, res) => {
  try {
    const { id } = req.params;

    // Prepare update object including file
    const updateData = {
      ...req.body,
      transactionSlip: req.file ? req.file.filename : undefined, // Update file name if uploaded
    };

    const updatedSubmission = await CompetitionApply.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
    });

    if (!updatedSubmission) {
      return res.status(404).json({ message: "Submission not found." });
    }

    res.status(200).json({ message: "Submission updated successfully!", updatedSubmission });
  } catch (error) {
    console.error("Error updating submission:", error.message);
    res.status(500).json({ message: "Failed to update submission.", error });
  }
});

// Debug: Log the uploaded file and body data (REMOVE after testing)
router.post("/debug", upload.single("transactionSlip"), async (req, res) => {
  console.log(req.file); // Logs the uploaded file
  console.log(req.body); // Logs other form fields
  res.status(200).json({ message: "Debug endpoint hit successfully." });
});

// Delete competition application (DELETE)
router.delete("/submissions/:id", async (req, res) => {
  try {
    const { id } = req.params; // Extract ID from URL
    const deletedSubmission = await CompetitionApply.findByIdAndDelete(id); // Use Mongoose's findByIdAndDelete

    if (!deletedSubmission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    res.status(200).json({ message: "Submission deleted successfully", deletedSubmission });
  } catch (error) {
    console.error("Error deleting submission:", error.message);
    res.status(500).json({ message: "Failed to delete submission" });
  }
});

module.exports = router; // Export the router for use in the main app
