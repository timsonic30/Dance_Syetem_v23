"use client";

import React, { useState, useEffect } from "react";
import "./submissionList.css";

export default function SubmissionList() {
  const [submissions, setSubmissions] = useState([]); // Submission data
  const [isLoading, setIsLoading] = useState(true); // Loading indicator
  const [errorMessage, setErrorMessage] = useState(""); // Error messages
  const [editingRow, setEditingRow] = useState(null); // Track the row being edited
  const [editData, setEditData] = useState({}); // Temporary data for editing

  // Fetch submissions from the server
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch("http://localhost:3030/competitionApply/submissions");
        if (!response.ok) throw new Error(`Error fetching submissions: ${response.statusText}`);

        const data = await response.json();
        setSubmissions(data); // Set the fetched submission data
        setIsLoading(false); // Set loading to false
      } catch (error) {
        console.error("Failed to fetch submissions:", error.message);
        setErrorMessage("Unable to load submissions. Please try again later."); // Set error message
        setIsLoading(false); // Set loading to false
      }
    };

    fetchSubmissions();
  }, []);

  // Handle Edit button click
  const handleEditButton = (id) => {
    const rowToEdit = submissions.find((submission) => submission._id === id);
    setEditingRow(id); // Enable edit mode for the specific row
    setEditData({ ...rowToEdit }); // Populate editData with row data
  };

  // Handle input field changes
  const handleFieldChange = (field, value) => {
    setEditData((prevEditData) => ({
      ...prevEditData,
      [field]: value, // Update the edited field value
    }));
  };

  // Handle file upload for editing transaction slips
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Format the file name as TranSlip with the current date
    const uploadDate = new Date().toISOString().split("T")[0];
    const formattedFileName = `TranSlip${uploadDate}${file.name.substring(file.name.lastIndexOf("."))}`;
    const renamedFile = new File([file], formattedFileName, { type: file.type }); // Rename the uploaded file

    setEditData((prevEditData) => ({
      ...prevEditData,
      transactionSlip: renamedFile, // Update transaction slip in edit data
    }));
  };

  // Handle Update button click to save changes
  const handleUpdate = async () => {
    const formData = new FormData();
    Object.keys(editData).forEach((key) => {
      formData.append(key, editData[key]); // Append all edited data to formData
    });

    try {
      const response = await fetch(`http://localhost:3030/competitionApply/submissions/${editingRow}`, {
        method: "PUT",
        body: formData, // Send formData to server
      });

      if (!response.ok) throw new Error("Failed to update submission");

      await response.json();

      // Refresh the page after updating
      window.location.reload();
    } catch (error) {
      console.error("Update error:", error.message);
      setErrorMessage("Unable to update the submission. Please try again later.");
    }
  };

  // Handle Cancel button click to discard changes
  const handleCancel = () => {
    setEditingRow(null); // Exit editing mode
    setEditData({}); // Clear edit data
  };

  // Handle Delete button click to delete a submission
  const handleDelete = async (id) => {
    const userConfirmed = window.confirm("Are you sure you want to delete this submission?");
    if (!userConfirmed) return;

    try {
      const response = await fetch(`http://localhost:3030/competitionApply/submissions/${id}`, {
        method: "DELETE", // Send DELETE request
      });

      if (!response.ok) throw new Error("Failed to delete submission");

      setSubmissions((prevSubmissions) =>
        prevSubmissions.filter((submission) => submission._id !== id) // Filter out the deleted submission
      );
    } catch (error) {
      console.error("Delete error:", error.message);
      setErrorMessage("Unable to delete the submission. Please try again later.");
    }
  };

  return (
    <div className="LCA-submission-list-container">
      <header className="LCA-submission-list-header">
        <h2 className="LCA-submission-list-title">Submission List</h2>
      </header>
      {isLoading ? (
        <p className="LCA-loading-message">Loading submissions...</p>
      ) : errorMessage ? (
        <p className="LCA-error-message">{errorMessage}</p>
      ) : submissions.length > 0 ? (
        <table className="LCA-table">
          <thead>
            <tr>
              <th></th>
              <th>Crew Name</th>
              <th>Contact Name</th>
              <th>Contact Number</th>
              <th>Instagram</th>
              <th>Category</th>
              <th>Members</th>
              <th>Transaction Slip</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission, index) => (
              <tr key={submission._id}>
                <td>{index + 1}</td>
                {["crewName", "contactName", "contactNumber", "instagram", "category", "teamMembers"].map((field) => (
                  <td key={field}>
                    {editingRow === submission._id ? (
                      <input
                        id={`LCA-${field}`} // Set the id dynamically
                        className={`LCA-${field}`} // Set the className dynamically with "LCA" prefix
                        type="text"
                        value={editData[field] || ""}
                        onChange={(e) => handleFieldChange(field, e.target.value)} // Update field values
                      />
                    ) : (
                      submission[field]
                    )}
                  </td>
                ))}
                <td>
                  {editingRow === submission._id ? (
                    <label>
                      Upload img:
                      <input
                        id="LCA-transactionSlip" // Set the id for the file upload field
                        className="LCA-transactionSlip" // Match className with id for consistency
                        type="file"
                        accept=".png, .jpg, .jpeg"
                        onChange={handleFileUpload} // Handle file upload
                        required
                      />
                    </label>
                  ) : submission.transactionSlip ? (
                    <div>
                      <a
                        href={`http://localhost:3030/uploads/${submission.transactionSlip}`}
                        download={`CompApply${index + 1}.png`}
                        className="LCA-table-link"
                      >
                        Download
                        <img
                          src={`http://localhost:3030/uploads/${submission.transactionSlip}`}
                          alt="Transaction Slip"
                          className="LCA-transaction-image"
                        />
                      </a>
                    </div>
                  ) : (
                    "No file uploaded"
                  )}
                </td>
                <td>
                  {editingRow === submission._id ? (
                    <div>
                      <button className="LCA-action-button update" onClick={handleUpdate}>
                        Update
                      </button>
                      <button className="LCA-action-button cancel" onClick={handleCancel}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div>
                      <button className="LCA-action-button edit" onClick={() => handleEditButton(submission._id)}>
                        Edit
                      </button>
                      <br />
                      <button className="LCA-action-button delete" onClick={() => handleDelete(submission._id)}>
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      ) : (
        <p className="LCA-error-message">No submissions found.</p>
      )}
    </div>
  );
}
