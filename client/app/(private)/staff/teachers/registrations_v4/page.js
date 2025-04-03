"use client";
import { useState, useEffect } from "react";
import { UserPlus, User, Info, Lock } from "lucide-react";
import Loading from "@/app/components/loading";
import "./TeachRegist.css";

export default function TeacherDataEntry() {
  const [inputs, setInputs] = useState([]);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  // Create sections for Personal info, additional info, and password fields
  const [personalInfo, setPersonalInfo] = useState([]);
  const [additionalInfo, setAdditionalInfo] = useState([]);
  const [passwordField, setPasswordField] = useState(null);

  const [errors, setErrors] = useState({});

  const getData = async () => {
    try {
      const response = await fetch(
        "http://localhost:3030/danceclass/teacherDataEntry"
      );
      const res = await response.json();
      let tagList = [];
      const personalFields = [];
      const additionalFields = [];
  
      const personalInfoFields = ["name", "email", "phone"];
  
      for (const [key, value] of Object.entries(res.schema)) {
        if (
          ["_id", "createdAt", "__v", "updatedAt", "role", "point"].includes(
            key
          )
        ) {
          continue;
        }
  
        if (value.enumValues && value.enumValues.length !== 0) {
          let selectTag = (
            <div key={key} className="TeachRegist-input-container">
              <span className="TeachRegist-label">
                {key[0].toUpperCase() + key.slice(1)}
              </span>
              <select
                className="TeachRegist-select"
                name={key}
                onChange={(e) => handleInputChange(e, key)}
              >
                {value.enumValues.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          );
          additionalFields.push(selectTag);
        } else {
          let selectTag = (
            <div key={key} className="TeachRegist-input-container">
              <span className="TeachRegist-label">
                {getLabelName(key) + ":"}
              </span>
              <input
                className="TeachRegist-input"
                type={key === "dateOfBirth" ? "date" : "text"}
                placeholder={getPlaceHolder(key)}
                name={key}
                onChange={(e) => handleInputChange(e, key)}
              />
            </div>
          );
  
          if (key === "password") {
            setPasswordField(selectTag);
          } else if (personalInfoFields.includes(key)) {
            personalFields.push(selectTag);
          } else {
            additionalFields.push(selectTag);
          }
          tagList.push(selectTag);
        }
      }
      setInputs(tagList);
      setPersonalInfo(personalFields);
      setAdditionalInfo(additionalFields);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getPlaceHolder = (fieldName) => {
    const placeHolder = {
      name: "Enter full name",
      email: "email@example.com",
      phone: "Enter phone number",
      danceStyle: "e.g., Jazz, Ballet, Hip Hop",
      dateOfBirth: "YYYY-MM-DD",
      profilePic: "Enter URL of your picture",
    };
  
    return (
      placeHolder[fieldName] ||
      `Enter ${fieldName[0].toUpperCase() + fieldName.slice(1)}`
    );
  };
  
  const getLabelName = (fieldName) => {
    const value = {
      danceStyle: "Style",
      dateOfBirth: "Date of Birth",
      profilePic: "Profile Picture",
    };
  
    return (
      value[fieldName] || `${fieldName[0].toUpperCase() + fieldName.slice(1)}`
    );
  };
  
  const handleInputChange = (e, key) => {
    const value = e.target.value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [key]: value,
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    setErrors({});
  
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required.";
    }
    if (!formData.phone) {
      newErrors.phone = "Phone number is required.";
    }
    if (!formData.password) {
      newErrors.password = "Password is required.";
    }
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      alert("Please fill in all the fields");
      return;
    }
  
    try {
      const response = await fetch(
        "http://localhost:3030/danceclass/teacherDataEntry",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
  
      if (response.ok) {
        alert("Teacher Data created successfully!");
        setFormData({});
        setInputs([]);
        getData();
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
  }, []);
  
  return (
    <div id="TeachRegist-container">
      {isLoading ? (
        <div id="TeachRegist-loading">
          <Loading />
        </div>
      ) : (
        <div id="TeachRegist-wrapper">
          <div id="TeachRegist-header">
            <div id="TeachRegist-header-inner">
              <UserPlus id="TeachRegist-icon" />
              <h2 id="TeachRegist-title">Teacher Registration</h2>
            </div>
            <p id="TeachRegist-description">
              Complete the form below to register as a dance teacher
            </p>
          </div>
          <form onSubmit={handleSubmit} id="TeachRegist-form">
            <div id="TeachRegist-personal">
              <div id="TeachRegist-personal-header">
                <User id="TeachRegist-personal-icon" />
                <h2 id="TeachRegist-personal-title">
                  Personal Information
                  <span id="TeachRegist-required">* required</span>
                </h2>
              </div>
              <div id="TeachRegist-personal-inputs">{personalInfo}</div>
            </div>
  
            <div id="TeachRegist-additional">
              <div id="TeachRegist-additional-header">
                <Info id="TeachRegist-additional-icon" />
                <h2 id="TeachRegist-additional-title">Additional Information</h2>
              </div>
              <div id="TeachRegist-additional-inputs">{additionalInfo}</div>
            </div>
  
            <div id="TeachRegist-password">
              <div id="TeachRegist-password-header">
                <Lock id="TeachRegist-password-icon" />
                <h2 id="TeachRegist-password-title">
                  Create Password
                  <span id="TeachRegist-required">* required</span>
                </h2>
              </div>
              <div id="TeachRegist-password-inputs">{passwordField}</div>
            </div>
  
            <div id="TeachRegist-submit">
              <button id="TeachRegist-submit-button" type="submit">
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}  