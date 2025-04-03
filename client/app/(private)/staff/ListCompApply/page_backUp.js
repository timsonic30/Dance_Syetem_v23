"use client";

import React, { useState, useEffect } from "react";
import "./submissionList.css";

export default function SubmissionList() {
  const [submissions, setSubmissions] = useState([]); // Submission data
  const [isLoading, setIsLoading] = useState(true); // Loading indicator
  const [errorMessage, setErrorMessage] = useState(""); // Error messages
  const [editingRow, setEditingRow] = useState(null); // Track which row is being edited
  const [editData, setEditData] = useState({}); // Temporary data for the row being edited

  // Fetch submissions
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch("http://localhost:3030/competitionApply/submissions");
        if (!response.ok) throw new Error(`Error fetching submissions: ${response.statusText}`);

        const data = await response.json();
        setSubmissions(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch submissions:", error.message);
        setErrorMessage("Unable to load submissions. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  // Handle Edit button click (start editing row)
  const handleEditButton = (id) => {
    const rowToEdit = submissions.find((submission) => submission._id === id);
    setEditingRow(id); // Set the ID of the row being edited
    setEditData({ ...rowToEdit }); // Copy the row data for editing
  };

  // Handle field change in the editable row
  const handleFieldChange = (field, value) => {
    setEditData((prevEditData) => ({
      ...prevEditData,
      [field]: value,
    }));
  };

  // Handle Update button click (save changes)
  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:3030/competitionApply/submissions/${editingRow}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData), // Send updated data
      });

      if (!response.ok) throw new Error("Failed to update submission");

      const updatedSubmission = await response.json();

      // Update local state
      setSubmissions((prevSubmissions) =>
        prevSubmissions.map((submission) =>
          submission._id === updatedSubmission._id ? updatedSubmission : submission
        )
      );

      // Reset editing state
      setEditingRow(null);
      setEditData({});
    } catch (error) {
      console.error("Update error:", error.message);
      setErrorMessage("Unable to update the submission. Please try again later.");
    }
  };

  // Handle Cancel button click (discard changes)
  const handleCancel = () => {
    setEditingRow(null); // Exit editing mode
    setEditData({});
  };

  // Your existing delete functionality
  const handleDelete = async (id) => {
    const userConfirmed = window.confirm("Are you sure you want to delete this submission?");
    if (!userConfirmed) return;

    try {
      const response = await fetch(`http://localhost:3030/competitionApply/submissions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete submission");

      setSubmissions((prevSubmissions) =>
        prevSubmissions.filter((submission) => submission._id !== id)
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
              <th>Team Members</th>
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
                        type="text"
                        value={editData[field] || ""}
                        onChange={(e) => handleFieldChange(field, e.target.value)}
                      />
                    ) : (
                      submission[field]
                    )}
                  </td>
                ))}
                <td>
                  {submission.transactionSlip ? (
                    <div>
                      <p className="LCA-file-name">{submission.transactionSlip}</p>
                      <a
                        href={`http://localhost:3030/uploads/${submission.transactionSlip}`}
                        download={`CompApply${index + 1}.png`}
                        className="LCA-table-link"
                      >
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
                      <button
                        className="LCA-action-button update"
                        onClick={handleUpdate}
                      >
                        Update
                      </button>
                      <button
                        className="LCA-action-button cancel"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div>
                      <button
                        className="LCA-action-button edit"
                        onClick={() => handleEditButton(submission._id)}
                      >
                        Edit
                      </button>
                      <button
                        className="LCA-action-button delete"
                        onClick={() => handleDelete(submission._id)}
                      >
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
