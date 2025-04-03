"use client";
import { useState, useEffect } from "react";
import Loading from "@/app/components/loading";
import { UserPlus } from "lucide-react";

export default function TeacherDataEntry() {
  const [inputs, setInputs] = useState([]);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const [requiredInputs, setRequiredInputs] = useState([]);
  const [nonRequiredInputs, setNonRequiredInputs] = useState([]);

  const getPlaceHolder = (fieldName) => {
    const placeHolder = {
      name: "Enter full name",
      email: "email@example.com",
      phone: "Enter phone number",
      danceStyle: "e.g., Jazz, Ballet, Hip Hop",
      dateOfBirth: "YYYY-MM-DD",
      profilePic: "Enter URL of profile picture",
    };

    return (
      placeHolder[fieldName] ||
      `Enter ${fieldName[0].toUpperCase() + fieldName.slice(1)}`
    );
  };

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

  const getData = async () => {
    try {
      const response = await fetch(
        "http://localhost:3030/danceclass/teacherDataEntry"
      );
      const res = await response.json();
      // 取出 schema 內容
      let tagList = [],
        requiredField = [],
        nonRequiredField = [];
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
                {key[0].toUpperCase() + key.slice(1) + ":"}
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
          nonRequiredField.push(selectTag);
          tagList.push(selectTag);
        } else {
          // 創建文字輸入欄位的標籤
          let inputTag = (
            <div key={key} className="flex items-center pb-2 pl-3 pr-3">
              <span
                className="text-gray-500 w-24"
                style={{ marginRight: "3rem" }}
              >
                {getKeyName(key) + ":"}
              </span>
              <input
                className="ml-2 p-1 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500"
                type="text"
                placeholder={getPlaceHolder(key)}
                name={key}
                onChange={(e) => handleInputChange(e, key)}
              />
            </div>
          );

          // 將文字輸入欄位標籤加入到 tagList 數組中
          tagList.push(inputTag);
          setInputs(tagList);

          // Separate required and non-required inputs
          if (["phone", "email", "password"].includes(key)) {
            requiredField.push(inputTag);
          } else {
            nonRequiredField.push(inputTag);
          }

          setRequiredInputs(requiredField);
          setNonRequiredInputs(nonRequiredField);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
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
        setRequiredInputs([]);
        setNonRequiredInputs([]);

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
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{ width: "600px" }}>
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

          <div className="p-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-b border-gray-200 pb-3">
                <h2>
                  Personal Information{" "}
                  <span className="text-red-500 text-xs">** required</span>
                </h2>
              </div>
              <div className="border-b border-gray-200 pb-3">
                <h2>Additional Information</h2>
              </div>
              {inputs}
              <div className="flex justify-center">
                <button
                  className="btn btn-xl normal-case bg-gray-500 hover:bg-gray-600 text-white border-none rounded-md"
                  type="submit"
                  style={{ marginTop: "5rem" }}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
