"use client"; // 將這個組件聲明為 Client Component
import DanceClass from "@/app/danceClass/page";
import Cookies from "js-cookie";

export default function TestToken() {
    const checkToken = async () => {
        const token = localStorage.getItem("token");
        if (token) {
          console.log("Token 存在:", token);
          alert("Token 存在！");
      
          // 呼叫 API
          try {
            const response = await fetch("http://localhost:3030/danceClass/testToken", {
              method: "POST", // 或根據 API 需求使用 POST 等
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // 使用 Token 作為 Authorization
              },
            });
      
            if (response.ok) {
              const data = await response.json(); // 如果 API 返回 JSON
              console.log("API 回應資料:", data);
              alert("API 呼叫成功！");
            } else {
              console.error("API 呼叫失敗:", response.status, response.statusText);
              alert("API 呼叫失敗，請檢查伺服器！");
            }
          } catch (error) {
            console.error("發生錯誤:", error);
            alert("無法連接到 API，請稍後再試！");
          }
        } else {
          alert("未登入，請先登入！");
          const currentPath = window.location.pathname;
          console.log("當前路徑:", currentPath);
          Cookies.set("redirectPath", currentPath);
          window.location.href = "http://localhost:3000/login";
        }
      };
      

  return (
    <div className="bg-white text-zinc-700">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <button className="btn btn-primary" onClick={checkToken}>
          測試 Token
        </button>
      </div>
    </div>
  );
}
