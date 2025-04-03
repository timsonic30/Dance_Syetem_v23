"use client";
import { useState, useEffect } from "react";
import Loading from "@/app/components/loading";
import { UserPlus, User, Info, Lock } from "lucide-react";

export default function TeacherDataEntry() {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const [personalInfo, setPersonalInfo] = useState([]);
  const [additionalInfo, setAdditionalInfo] = useState([]);

  // Function to generate placeholder text based on field name
  const getPlaceHolder = (fieldName) => {
    const placeHolder = {
      name: "Enter full name",
      email: "email@example.com",
      phone: "Enter phone number",
      username: "Choose a username",
      nickname: "Enter nickname (optional)",
      danceStyle: "e.g., Jazz, Ballet, Hip Hop",
      dateOfBirth: "YYYY-MM-DD",
      profilePic: "Enter URL of profile picture",
      description: "Tell us about yourself",
      instagram: "@yourusername",
      gender: "Select gender",
      password: "Create a strong password",
    };

    return (
      placeHolder[fieldName] ||
      `Enter ${fieldName[0].toUpperCase() + fieldName.slice(1)}`
    );
  };

  // Function to get display name for field
  const getKeyName = (fieldName) => {
    const value = {
      danceStyle: "Style",
      dateOfBirth: "Date of Birth",
      profilePic: "Profile Picture",
    };

    return (
      value[fieldName] || `${fieldName[0].toUpperCase() + fieldName.slice(1)}`
    );
  };

  // Function to fetch data from API
  const getData = async () => {
    try {
      const response = await fetch(
        "http://localhost:3030/danceclass/teacherDataEntry"
      );
      const res = await response.json();

      // Process schema to create form fields
      processSchemaData(res.schema);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to process schema data and organize into sections
  const processSchemaData = (schema) => {
    const personalFields = [];
    const additionalFields = [];

    // Define which fields belong to personal info section
    const personalInfoFields = ["name", "email", "phone"];

    // Define which fields belong to additional info section
    const additionalInfoFields = [
      "username",
      "nickname",
      "gender",
      "dateOfBirth",
      "description",
      "danceStyle",
      "instagram",
      "profilePic",
    ];

    // 取出 schema 內容
    for (const [key, value] of Object.entries(schema)) {
      // 如果 key 是 '_id' , 'createdAt', '__v', 'updatedAt', 'role', 'point'，則跳過
      if (
        [
          "_id",
          "createdAt",
          "__v",
          "updatedAt",
          "role",
          "point",
          "password",
        ].includes(key)
      ) {
        continue;
      }

      // Create form element based on field type
      let formElement;

      if (value.enumValues && value.enumValues.length !== 0) {
        // 創建下拉菜單的標籤
        formElement = (
          <div key={key} className="flex items-center pb-4 pl-3 pr-3">
            <span className="text-gray-700 w-32">{getKeyName(key) + ":"}</span>
            <select
              className="ml-2 p-2 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500 w-full"
              name={key}
              onChange={(e) => handleInputChange(e, key)}
            >
              <option value="">Select {getKeyName(key)}</option>
              {value.enumValues.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );
      } else {
        // 創建文字輸入欄位的標籤
        formElement = (
          <div key={key} className="flex items-center pb-4 pl-3 pr-3">
            <span className="text-gray-700 w-32">{getKeyName(key) + ":"}</span>
            <input
              className="ml-2 p-2 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500 w-full"
              type={
                key === "email"
                  ? "email"
                  : key === "dateOfBirth"
                  ? "date"
                  : "text"
              }
              placeholder={getPlaceHolder(key)}
              name={key}
              onChange={(e) => handleInputChange(e, key)}
              required={personalInfoFields.includes(key)}
            />
          </div>
        );
      }

      // Add field to appropriate section
      if (personalInfoFields.includes(key)) {
        personalFields.push(formElement);
      } else if (additionalInfoFields.includes(key)) {
        additionalFields.push(formElement);
      }
    }

    // Add missing fields to additional info section
    const missingAdditionalFields = additionalInfoFields.filter(
      (field) => !additionalFields.some((element) => element.key === field)
    );

    for (const field of missingAdditionalFields) {
      const formElement = (
        <div key={field} className="flex items-center pb-4 pl-3 pr-3">
          <span className="text-gray-700 w-32">{getKeyName(field) + ":"}</span>
          <input
            className="ml-2 p-2 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500 w-full"
            type={field === "dateOfBirth" ? "date" : "text"}
            placeholder={getPlaceHolder(field)}
            name={field}
            onChange={(e) => handleInputChange(e, field)}
          />
        </div>
      );
      additionalFields.push(formElement);
    }

    // Update state with organized fields
    setPersonalInfo(personalFields);
    setAdditionalInfo(additionalFields);
  };

  const handleInputChange = (e, key) => {
    const value = e.target.value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [key]: value,
    }));
    console.log("Form Data:", { ...formData, [key]: value }); // 添加調試輸出
  };

  // Handle password confirmation
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      password: value,
    }));

    // Check if passwords match
    if (confirmPassword && value !== confirmPassword) {
      setPasswordsMatch(false);
    } else {
      setPasswordsMatch(true);
    }
  };

  // Handle confirm password change
  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);

    // Check if passwords match
    if (formData.password && value !== formData.password) {
      setPasswordsMatch(false);
    } else {
      setPasswordsMatch(true);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.password !== confirmPassword) {
      alert("Passwords do not match!");
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
        alert("Teacher registration successful!");

        // Clear form data
        setFormData({}); // Reset the formData state to an empty object
        setConfirmPassword(""); // Reset password field
        setPasswordsMatch(true);

        // Optionally, call getData() to regenerate form inputs if dynamic
        getData();
      } else {
        alert("Error registering teacher!");
      }
    } catch (err) {
      console.error(err);
      alert("Error registering teacher!");
    }
  };

  useEffect(() => {
    getData(); // Fetch data on component mount
  }, []);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-3xl mx-auto my-8">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
            <div className="flex items-center space-x-3">
              <UserPlus className="h-8 w-8 text-white" />
              <h2 className="text-2xl font-bold text-white">
                Teacher Registration
              </h2>
            </div>
            <p className="mt-2 text-blue-100">
              Complete the form below to register as a dance teacher
            </p>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Section 1: Personal Information */}
              <div className="border-b border-gray-200 pb-2">
                <div className="flex items-center mb-4">
                  <User className="h-5 w-5 text-blue-500 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Personal Information
                    <span className="text-red-500 text-xs ml-2">
                      * required
                    </span>
                  </h2>
                </div>
                <div className="space-y-2">{personalInfo}</div>
              </div>

              {/* Section 2: Additional Information */}
              <div className="border-b border-gray-200 pb-2">
                <div className="flex items-center mb-4">
                  <Info className="h-5 w-5 text-blue-500 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Additional Information
                  </h2>
                </div>
                <div className="space-y-2">{additionalInfo}</div>
              </div>

              {/* Section 3: Password Creation */}
              <div className="border-b border-gray-200 pb-2">
                <div className="flex items-center mb-4">
                  <Lock className="h-5 w-5 text-blue-500 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Create Password
                    <span className="text-red-500 text-xs ml-2">
                      * required
                    </span>
                  </h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center pb-4 pl-3 pr-3">
                    <span className="text-gray-700 w-32">Password:</span>
                    <input
                      className="ml-2 p-2 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500 w-full"
                      type="password"
                      placeholder="Create a strong password"
                      name="password"
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                  <div className="flex items-center pb-4 pl-3 pr-3">
                    <span className="text-gray-700 w-32">
                      Confirm Password:
                    </span>
                    <input
                      className={`ml-2 p-2 border-2 ${
                        passwordsMatch ? "border-gray-300" : "border-red-500"
                      } rounded focus:outline-none focus:border-blue-500 w-full`}
                      type="password"
                      placeholder="Confirm your password"
                      onChange={handleConfirmPasswordChange}
                      required
                    />
                  </div>
                  {!passwordsMatch && (
                    <p className="text-red-500 text-sm ml-36">
                      Passwords do not match
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <button
                  className="btn btn-lg normal-case bg-blue-600 hover:bg-blue-700 text-white border-none rounded-md px-8 py-3"
                  type="submit"
                >
                  Register as Teacher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
