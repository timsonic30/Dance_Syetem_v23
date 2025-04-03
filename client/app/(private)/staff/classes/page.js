"use client";
import { useState, useEffect } from "react";
import Loading from "@/app/components/loading";
import "./ClassCreateStaff.css";

export default function ClassCreate() {
  const [schema, setSchema] = useState(null); // Store the schema instead of inputs
  const [teacher, setTeacher] = useState([]);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    try {
      const response = await fetch("http://localhost:3030/danceclass/schema");
      const res = await response.json();
      setSchema(res.schema); // Store the raw schema
    } catch (err) {
      console.error(err);
    }
  };

  const getTeacherList = async () => {
    try {
      const response = await fetch("http://localhost:3030/danceclass/tutor");
      const data = await response.json();
      const list = data.Teachers.map((teacher) => {
        return {
          Id: teacher["_id"],
          nickname: teacher["nickname"],
          profilePic: teacher["profilePic"],
        };
      });
      console.log(list);
      setTeacher(list);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      teacher.forEach((e) => console.log(e));
    }
  };

  const getPlaceHolder = (fieldName) => {
    const placeHolder = {
      code: "Class code (e.g. HH101)",
      img: "URL for class image",
      teacher: "Enter teacher's name",
      vacancy: "Enter a number",
      description: "Describe the details",
      price: "Enter class price",
    };
    return (
      placeHolder[fieldName] ||
      `Enter ${fieldName[0].toUpperCase() + fieldName.slice(1)}`
    );
  };

  const getLabelName = (fieldName) => {
    const value = {
      startTime: "Start Time",
      endTime: "End Time",
      lessonDuration: "Lesson Duration",
      danceStyle: "Style",
      performanceDay: "Performance Day",
      profilePic: "Profile Picture",
    };
    return (
      value[fieldName] || `${fieldName[0].toUpperCase() + fieldName.slice(1)}`
    );
  };

  const handleInputChange = (e, key) => {
    let value = e.target.value;

    if (key === "price" || key === "vacancy") {
      value = value.replace(/[^0-9]/g, "");
    }

    setFormData((prevFormData) => {
      const updatedFormData = { ...prevFormData, [key]: value };
      return updatedFormData;
    });
  };

  const handleAddDate = () => {
    console.log("HAHA");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check missing data
    const missingFields = [];
    if (!formData.code) missingFields.push("Code");
    if (!formData.type) missingFields.push("Type");
    if (!formData.style) missingFields.push("Style");
    if (!formData.teacher) missingFields.push("Teacher");
    if (!formData.vacancy) missingFields.push("Vacancy");
    if (!formData.level) missingFields.push("Level");
    if (!formData.startTime) missingFields.push("Start time");
    if (!formData.endTime) missingFields.push("End time");
    if (!formData.description) missingFields.push("Description");
    if (!formData.price) missingFields.push("Price");
    // if (!formData.img) missingFields.push("Class Image");

    // Check invalid data
    const timeToMinutes = (time) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    };

    if (formData.startTime === formData.endTime) {
      alert(`Start time cannot be as same as the end time`);
      return;
    } else if (
      timeToMinutes(formData.endTime) < timeToMinutes(formData.startTime)
    ) {
      alert(`End time cannot be earlier then the start time`);
      return;
    }

    // Check the performance day and the days of the classes
    if (
      new Date(formData.performanceDay).getTime() <=
      new Date(formData.date).getTime()
    ) {
      alert(
        `The date of the class cannot be earlier then the date of the performance`
      );
      return;
    }

    if (missingFields.length > 0) {
      alert(`Please fill in the following fields: ${missingFields.join(", ")}`);
      return;
    }

    // Use the tutor image for the class image
    let classImage;
    if (!formData.img) {
      const foundTeacher = teacher.find((el) => {
        return el["Id"] === formData.teacher;
      });
      classImage = foundTeacher["profilePic"];
      formData.img = classImage;
    }

    try {
      const response = await fetch(
        "http://localhost:3030/danceclass/classCreate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        alert("Class created successfully!");
        setFormData({});
        await getData(); // Refresh schema if needed
      } else {
        alert("Error creating class!");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating class!");
    }
  };

  useEffect(() => {
    getData();
    getTeacherList();
  }, []);

  // Generate inputs dynamically from schema
  const renderInputs = () => {
    if (!schema) return null;

    const inputs = [];
    // Omit the fields '_id', "createdAt", "__v", "updatedAt", "lessonDuration", "status",
    for (const [key, value] of Object.entries(schema)) {
      if (
        [
          "_id",
          "createdAt",
          "__v",
          "updatedAt",
          "lessonDuration",
          "status",
        ].includes(key)
      ) {
        continue;
      }

      if (
        (value.enumValues && value.enumValues.length !== 0) ||
        key === "teacher"
      ) {
        inputs.push(
          <div key={key} className="ClassCreateStaff-input-container">
            <span className="ClassCreateStaff-label">{getLabelName(key)}</span>
            <select
              className="ClassCreateStaff-select"
              name={key}
              value={formData[key] || ""}
              onChange={(e) => handleInputChange(e, key)}
            >
              {key !== "teacher"
                ? value.enumValues.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))
                : teacher.map((option) => (
                    <option key={option["Id"]} value={option["Id"]}>
                      {option["nickname"]}
                    </option>
                  ))}
            </select>
          </div>
        );
      } else {
        inputs.push(
          key !== "date" ? (
            <div key={key} className="ClassCreateStaff-input-container">
              <span className="ClassCreateStaff-label">
                {getLabelName(key)}
              </span>
              <input
                className="ClassCreateStaff-input"
                type={key === "performanceDay" ? "date" : "text"}
                placeholder={getPlaceHolder(key)}
                name={key}
                lang="en"
                value={formData[key] || ""}
                onChange={(e) => handleInputChange(e, key)}
              />
            </div>
          ) : (
            <div key={key} className="ClassCreateStaff-input-container">
              <span className="ClassCreateStaff-label">
                {getLabelName(key)}
              </span>
              <input
                className="ClassCreateStaff-input"
                type="date"
                placeholder={getPlaceHolder(key)}
                name={key}
                lang="en"
                value={formData[key] || ""}
                onChange={(e) => handleInputChange(e, key)}
              />
            </div>
          )
        );
      }
    }
    return inputs;
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div id="ClassCreateStaff-container">
          <div id="ClassCreateStaff-header">
            <div id="ClassCreateStaff-header-inner">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ClassCreateStaff-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <h2 id="ClassCreateStaff-title">Class Creation</h2>
            </div>
            <p id="ClassCreateStaff-description">
              Complete the form below to create a new dance class
            </p>
          </div>

          <div id="ClassCreateStaff-form-section">
            <form onSubmit={handleSubmit} id="ClassCreateStaff-form">
              <div id="ClassCreateStaff-form-header">
                <div id="ClassCreateStaff-info-header">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="ClassCreateStaff-icon-small"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h2 id="ClassCreateStaff-info-title">
                    Class Information
                    <span id="ClassCreateStaff-required-label">* required</span>
                  </h2>
                </div>
                <div id="ClassCreateStaff-inputs">{renderInputs()}</div>
              </div>
              <div id="ClassCreateStaff-submit-container">
                <button className="ClassCreateStaff-button" type="submit">
                  Create Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
