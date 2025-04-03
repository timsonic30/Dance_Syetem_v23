"use client";
import { useState, useEffect } from "react";

export default function ClassCreate() {
  const [inputs, setInputs] = useState([]);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null); // 初始化 error 狀態

  const getData = async () => {
    try {
      const response = await fetch("http://localhost:3030/danceclass/schema");
      const res = await response.json();
      // 取出 schema 內容
      let tagList = [];
      for (const [key, value] of Object.entries(res.schema)) {
        // 如果 key 是 '_id' , 'createdAt', '__v'，則跳過
        if (["_id", "createdAt", "__v"].includes(key)) {
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
                {key}
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
          tagList.push(selectTag);
        } else {
          // 創建文字輸入欄位的標籤
          let inputTag = (
            <div key={key} className="flex items-center pb-2 pl-3 pr-3">
              <span
                className="text-gray-500 w-24"
                style={{ marginRight: "3rem" }}
              >
                {key}
              </span>
              <input
                className="ml-2 p-1 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500"
                type="text"
                placeholder={`${key}`}
                name={key}
                onChange={(e) => handleInputChange(e, key)}
              />
            </div>
          );

          // 將文字輸入欄位標籤加入到 tagList 數組中
          tagList.push(inputTag);
        }
      }
      setInputs(tagList);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e, key) => {
    const value = e.target.value;

    setFormData((prevFormData) => {
      const updatedFormData = { ...prevFormData, [key]: value };

      // 驗證邏輯：檢查開始時間和結束時間
      if (key === "startTime" && updatedFormData.endTime) {
        if (!validateTimeOrder(value, updatedFormData.endTime)) {
          setError({ key: "endTime", message: "結束時間不能早於開始時間！" });
        } else {
          setError(null); // 清除錯誤訊息
        }
      } else if (key === "endTime" && updatedFormData.startTime) {
        if (!validateTimeOrder(updatedFormData.startTime, value)) {
          setError({ key: "endTime", message: "結束時間不能早於開始時間！" });
        } else {
          setError(null); // 清除錯誤訊息
        }
      }

      return updatedFormData;
    });
  };

  const validateTimeOrder = (startTime, endTime) => {
    const timeToMinutes = (time) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    };

    return timeToMinutes(endTime) >= timeToMinutes(startTime);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // 阻止表單的默認提交行為
    try {
      const response = await fetch(
        "http://localhost:3030/danceclass/classCreate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        alert("Class created successfully!");

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
    getData(); // 請求資料
  }, []);

  return (
    <div className="bg-white rounded-lg p-6 border-2">
      <h2
        className="text-xl font-semibold mb-6"
        style={{ marginBottom: "5rem" }}
      >
        Class Create
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {inputs.map((input) =>
          input.key === "endTime" ? (
            <div key={input.key} className="relative">
              {input}
              {error && error.key === "endTime" && (
                <p className="text-red-500 text-sm absolute mt-1">
                  {error.message}
                </p>
              )}
            </div>
          ) : (
            input
          )
        )}
        <button
          className="btn btn-xl normal-case bg-gray-500 hover:bg-gray-600 text-white border-none rounded-md"
          type="submit"
          style={{ marginTop: "5rem" }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
