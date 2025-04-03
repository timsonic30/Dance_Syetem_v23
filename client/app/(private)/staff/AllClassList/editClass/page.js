"use client";
import { useState, useEffect } from "react";
import Loading from "@/app/components/loading";
import "./editClassStaff.css";

export default function EditClass({ classId, onClose }) {
  const [schema, setSchema] = useState(null); // Store schema
  const [teacher, setTeacher] = useState([]);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getData();
    getTeacherList();
    getClassData();
  }, []);

  // Fetch Schema for class fields
  const getData = async () => {
    try {
      const response = await fetch("http://localhost:3030/danceclass/schema");
      const res = await response.json();
      setSchema(res.schema);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch list of teachers
  const getTeacherList = async () => {
    try {
      const response = await fetch("http://localhost:3030/danceclass/tutor");
      const data = await response.json();
      const list = data.Teachers.map((teacher) => ({
        Id: teacher["_id"],
        nickname: teacher["nickname"],
      }));
      setTeacher(list);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch existing class data
  const getClassData = async () => {
    try {
      const response = await fetch(`http://localhost:3030/classEdit/${classId}`);
      const data = await response.json();
      setFormData(data.updatedClass || {});
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching class data:", err);
      setError("Failed to load class data.");
      setIsLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (e, key) => {
    let value = e.target.value;

    if (key === "price" || key === "vacancy") {
      value = value.replace(/[^0-9]/g, ""); // Only allow numbers
    }

    setFormData((prevFormData) => ({ ...prevFormData, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3030/classEdit/${classId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Class updated successfully!");
        onClose(); // Close edit form after updating
      } else {
        alert("Error updating class!");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating class!");
    }
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div id="EditClassStaff-container">
          <div id="EditClassStaff-header">
            <h2 id="EditClassStaff-title">Edit Dance Class</h2>
            <p id="EditClassStaff-description">Modify class details below</p>
          </div>

          <div id="EditClassStaff-form-section">
            <form onSubmit={handleSubmit} id="EditClassStaff-form">
              <div id="EditClassStaff-inputs">
                {schema &&
                  Object.entries(schema).map(([key, value]) =>
                    key !== "_id" &&
                    key !== "createdAt" &&
                    key !== "__v" &&
                    key !== "updatedAt" ? (
                      <div key={key} className="EditClassStaff-input-container">
                        <label className="EditClassStaff-label">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </label>
                        {value.enumValues && value.enumValues.length ? (
                          <select
                            className="EditClassStaff-select"
                            name={key}
                            value={formData[key] || ""}
                            onChange={(e) => handleInputChange(e, key)}
                          >
                            {value.enumValues.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : key === "teacher" ? (
                          <select
                            className="EditClassStaff-select"
                            name={key}
                            value={formData[key] || ""}
                            onChange={(e) => handleInputChange(e, key)}
                          >
                            {teacher.map((option) => (
                              <option key={option.Id} value={option.nickname}>
                                {option.nickname}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            className="EditClassStaff-input"
                            type={key === "performanceDay" ? "date" : "text"}
                            value={formData[key] || ""}
                            onChange={(e) => handleInputChange(e, key)}
                          />
                        )}
                      </div>
                    ) : null
                  )}
              </div>

              <div id="EditClassStaff-submit-container">
                <button className="EditClassStaff-button" type="submit">
                  Update Class
                </button>
                <button
                  className="EditClassStaff-button cancel"
                  type="button"
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
