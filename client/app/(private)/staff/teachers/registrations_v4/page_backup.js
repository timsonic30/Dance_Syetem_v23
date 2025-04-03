"use client";
import { useState, useEffect } from "react";
import { UserPlus, User, Info, Lock } from "lucide-react";
import Loading from "@/app/components/loading";
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
      // 取出 schema 內容
      let tagList = [];
      // Extract schema content
      const personalFields = [];
      const additionalFields = [];

      // Define which fields belong to personal info section
      const personalInfoFields = ["name", "email", "phone"];

      for (const [key, value] of Object.entries(res.schema)) {
        // 如果 key 是 '_id' , 'createdAt', '__v', 'updatedAt', 'role', 'point'，則跳過
        if (
          ["_id", "createdAt", "__v", "updatedAt", "role", "point"].includes(
            key
          )
        ) {
          continue;
        }

        if (value.enumValues && value.enumValues.length !== 0) {
          // 創建下拉菜單的標籤
          let selectTag = (
            <div key={key} className="flex items-center pb-2 pl-3 pr-3">
              <span
                className="text-gray-500 w-24"
                style={{ marginRight: "3rem" }}
              >
                {key[0].toUpperCase() + key.slice(1)}
              </span>
              <select
                className="ml-2 p-1 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500"
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
          // 將下拉菜單標籤加入到 tagList 數組中
          additionalFields.push(selectTag);
        } else {
          // 創建文字輸入欄位的標籤
          let selectTag = (
            <div key={key} className="flex items-center pb-2 pl-3 pr-3">
              <span
                className="text-gray-500 w-24"
                style={{ marginRight: "3rem" }}
              >
                {getLabelName(key) + ":"}
              </span>
              <input
                className="ml-2 p-1 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500"
                type={key === "dateOfBirth" ? "date" : "text"}
                placeholder={getPlaceHolder(key)}
                name={key}
                onChange={(e) => handleInputChange(e, key)}
              />
            </div>
          );

          // Add field to appropriate section
          if (key === "password") {
            setPasswordField(selectTag);
          } else if (personalInfoFields.includes(key)) {
            personalFields.push(selectTag);
          } else {
            additionalFields.push(selectTag);
          }
          // 將文字輸入欄位標籤加入到 tagList 數組中
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
    console.log("Form Data:", { ...formData, [key]: value }); // 添加調試輸出
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // 阻止表單的默認提交行為

    setErrors({}); // Reset errors

    // Validation check
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

    // If there are errors, update the state and return to prevent from the submit
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      alert("Please field in all the field");
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
        alert("teacher Data created successfully!");

        // Clear the form data
        setFormData({}); // Reset the formData state to an empty object
        setInputs([]); // Reset the inputs state if necessary

        // Optionally, call getData() to regenerate form inputs if dynamic
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
    getData(); // Fetch data on component mount
  }, []);

  return (
    <div className="w-3/7">
      {isLoading ? (
        <div className="flex justify-center items-center">
          <Loading />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-3xl mx-auto my-8">
          {/* change the color from left to right*/}
          <div className="bg-gradient-to-r from-black to-gray-600 p-6">
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
          <form onSubmit={handleSubmit} className="space-y-8 p-4">
            {/* Section 1: Personal Information */}
            <div className="border-b border-gray-200 pb-2 px-3">
              <div className="flex items-center mb-4 ml-3">
                <User className="h-5 w-5 text-blue-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Personal Information
                  <span className="text-red-500 text-xs ml-2">* required</span>
                </h2>
              </div>
              <div className="space-y-2">{personalInfo}</div>
            </div>

            {/* Section 2: Additional Information */}
            <div className="border-b border-gray-200 pb-2 px-3">
              <div className="flex items-center mb-4 ml-3">
                <Info className="h-5 w-5 text-blue-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Additional Information
                </h2>
              </div>
              <div className="space-y-2">{additionalInfo}</div>
            </div>

            {/* Section 3: Password Creation */}
            <div className="border-b border-gray-200 pb-2 px-3">
              <div className="flex items-center mb-4 ml-3">
                <Lock className="h-5 w-5 text-blue-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Create Password
                  <span className="text-red-500 text-xs ml-2">* required</span>
                </h2>
              </div>
              <div className="space-y-2">{passwordField}</div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-2 pb-4">
              <button
                className="btn btn-lg normal-case bg-gray-900 hover:bg-[#ffa500] text-white border-none rounded-md px-50 py-3"
                type="submit"
                style={{ width: "600px" }}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
