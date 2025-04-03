"use client";
import { useState, useEffect } from "react";
import Paid from "./paid";
import PendingPayment from "./pendingPayment";
import ShoppingCart from "./shoppingCart";

export default function Orders() {
  const [data, setData] = useState([]); // 主數據
  const [isLoading, setIsLoading] = useState(true); // 加載狀態
  const [error, setError] = useState(null); // 錯誤狀態

  //=====token 找出會員objectID==================
  const sendTokenToBackEnd = async (token) => {
    // 呼叫 API
    try {
      const response = await fetch(
        "http://localhost:3030/shoppingCart/tokenGetMember",
        {
          method: "POST", // 或根據 API 需求使用 POST 等
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // 使用 Token 作為 Authorization
          },
        }
      );
      if (response.ok) {
        const data = await response.json(); // 如果 API 返回 JSON
        //console.log("API 回應資料:", data);
        //alert("API 呼叫成功！");
        console.log(data.objectId);
        return data.objectId;
      } else {
        console.error("API 呼叫失敗:", response.status, response.statusText);
        //alert("API 呼叫失敗，請檢查伺服器！");
      }
    } catch (error) {
      console.error("發生錯誤:", error);
      //alert("無法連接到 API，請稍後再試！");
    }
  };

  //===================================
  const getData = async () => {
    const token = localStorage.getItem("token"); // 從 localStorage 獲取 token
    const userId = await sendTokenToBackEnd(token);
    if (!token) {
      //alert("未找到 Token，請先登入！");
      return;
    }
    const url = `http://localhost:3030/transaction/purchaseRecord/${userId}`; // 使用 token 作為路徑參數
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const dataFormApi = await response.json();
        console.log("購買記錄資料:", dataFormApi);
        setIsLoading(false);
        setData(dataFormApi);
        //alert("購買記錄已成功獲取！");
      } else {
        setData("");
        // console.error(
        //   "購買記錄獲取失敗:",
        //   response.status,
        //   response.statusText
        // );
        // alert("無法獲取購買記錄！");
        // return (
        //   <div className="w-full flex justify-center items-center h-screen">
        //     <p className="text-2xl text-red-500"> 無有購買記錄</p>
        //   </div>
        // );
      }
    } catch (error) {
      console.error("連接錯誤:", error);
      //alert("伺服器無法連接！");
    } finally {
      setIsLoading(false); // Always stop loading after the request
    }
  };
  //===================================

  //=======get Data Old Version=================
  // const getData = async () => {
  //   const token = localStorage.getItem("token");
  //   try {
  //     setIsLoading(true);
  //     setError(null);

  //     // const [userTransactionRes, classDataRes] = await Promise.all([
  //     //   fetch(`http://localhost:3030/danceclass/transaction/${userId}`).then(
  //     //     (res) => res.json()
  //     //   ),
  //     //   fetch(`http://localhost:3030/danceclass`).then((res) => res.json()),
  //     // ]);

  //     // 並行請求數據;
  //     const [userTransactionRes, classDataRes] = await Promise.all([
  //       fetch(`http://localhost:3030/danceclass/transaction/${userId}`, {
  //         method: "Get",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }).then((res) => res.json()),
  //       fetch(`http://localhost:3030/danceclass`).then((res) => res.json()),
  //     ]);

  //     // 提取必要數據
  //     const userTransactionList = userTransactionRes.userTransactions;
  //     const classDataList = classDataRes.classData;

  //     // 整合數據
  //     const dataList = userTransactionList
  //       .map((item) => {
  //         const matchedClass = classDataList.find(
  //           (classItem) => classItem._id === item.detail
  //         );
  //         if (matchedClass) {
  //           return {
  //             ...item,
  //             classData: matchedClass,
  //           };
  //         }
  //         return null; // 如果無匹配，返回 null
  //       })
  //       .filter((item) => item !== null); // 過濾掉無效項目

  //     setData(dataList);
  //   } catch (err) {
  //     console.error("Error fetching data:", err);
  //     setError("無法加載數據，請稍後再試。");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  //==================================

  useEffect(() => {
    getData();
  }, []); // 空依賴陣列，僅在組件初次渲染時執行

  // 如果加載中，顯示 Loading 畫面
  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center h-screen">
        <p className="text-2xl text-gray-500">數據加載中...</p>
      </div>
    );
  }

  // 如果發生錯誤，顯示錯誤信息
  if (error) {
    return (
      <div className="w-full flex justify-center items-center h-screen">
        <p className="text-2xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      {/* <div className="w-4/5 mb-4 mt-16 shadow-lg rounded-lg">
        <ShoppingCart data={data} />
      </div> */}

      <div className="w-4/5 mt-4 mb-4 shadow-lg rounded-lg">
        {data ? (
          <PendingPayment data={data} />
        ) : (
          // 或者顯示其他提示
          <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm pl-15 pr-15 pt-10">
            <h2 className="mb-4 text-xl font-semibold text-gray-800 p-3">
              Pending Payment
            </h2>
            <div className="border-t border-gray-200 pt-4">
              No pending payment data
            </div>
          </div>
        )}
      </div>
      <div className="w-4/5 mt-4 mb-4 shadow-lg rounded-lg">
        {data ? (
          <Paid data={data} />
        ) : (
          // 或者顯示其他提示
          <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm pl-15 pr-15 pt-10">
            <h2 className="mb-4 text-xl font-semibold text-gray-800 p-3">Paid</h2>
            <div className="border-t border-gray-200 pt-4">
              No paid data available
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
