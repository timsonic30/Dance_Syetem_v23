"use client";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";



export default function DanceInstructorProfile({
  showcaseData,
  showTeacherClassData,
  oneTeacherdata,  
}) {
 
  const [ cartCount, setCartCount ] = useState();
  

  const renderContent = () => {
    if (showcaseData) {
      return (
        <div className="flex">
          <div className="space-y-4 mr-10">
            <div className="relative">
              <img
                src={showcaseData.someOneTeacher.profilePic}
                alt={showcaseData.someOneTeacher.nickname}
                width={500}
                height={600}
                className="w-full max-w-md"
              />
              <div className="absolute bottom-0 left-0 p-4">
                <h2 className="text-xl uppercase tracking-wider font-light mb-1 text-white">
                  {showcaseData.someOneTeacher.role}
                </h2>
                <h1 className="text-5xl uppercase font-bold tracking-wide text-white">
                  {showcaseData.someOneTeacher.nickname}
                  <br />
                </h1>
              </div>
            </div>
          </div>
          {/* Bio and Schedule Section */}
          <div className="space-y-8">
            {/* Bio Section */}
            <section>
              <h2 className="text-3xl font-bold mb-4">Information</h2>
              <p className="text-sm md:text-base leading-relaxed">
                {showcaseData.someOneTeacher.description}
              </p>
            </section>
            {/* Schedule Section */}
            <section>
              <h2 className="text-3xl font-bold mb-4">Schedule</h2>
              <h3 className="text-2xl uppercase font-bold mb-4">
                {showcaseData.someOneTeacher.nickname} CLASSES SCHEDULE
              </h3>
              <div className="space-y-4 h-90 overflow-y-scroll">
                {renderClassContect()}
              </div>
            </section>
          </div>
        </div>
      );
    } else if (oneTeacherdata) {
      return (
        <div className="flex justify-center items-center h-full">
          <h2 className="text-2xl font-semibold text-gray-700">
            Please select your favorite teacher
          </h2>
        </div>
      );
    } else {
      return (
        <div className="flex justify-center items-center h-full">
          {/* Loading Spinner */}
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }
  };


  const generateSessionId = () => {
    // 使用隨機數生成唯一的 Session ID
    return 'session-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now();
  }

  const checkShoppingCart = () => {
    // 檢查是否已經有 Session ID
    let sessionId = Cookies.get('session_id');
    
    if (sessionId) {
      // 如果有，則獲取購物車內容
      fetch(`http://localhost:3030/shoppingCart/getcart/${sessionId}`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('獲取購物車失敗');
          }
        })
        .then((data) => {          
          Cookies.set("shoppinglength", length);
          setCartCount(data.length);               
        })
        .catch((error) => {
          console.error('錯誤：', error);
          // 處理錯誤（如顯示錯誤訊息）
        });
    }}

  const handleAddToCart = (id, classprice) => {
    // 檢查是否已經有 Session ID
    let sessionId = Cookies.get('session_id');
    if (!sessionId) {
      // 如果沒有，則生成新的 Session ID 並存儲
      sessionId = generateSessionId();
      Cookies.set('session_id', sessionId);
    }
    //將資料存入購物車DB    
    fetch("http://localhost:3030/shoppingCart/addtocart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // 設置內容類型為 JSON        
      },
      body: JSON.stringify({
        productID: id,
        collectionName: 'danceclasses',
        price: classprice,
        shoppingType: 'class',
        sessionID: sessionId, // 傳送 Session ID
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("預訂課程失敗");
        }
      })
      .then((data) => {
        console.log("預訂成功：", data);
        // 成功後處理邏輯（如顯示成功訊息或更新畫面）
        alert("已加購物車！");
        checkShoppingCart(); // 確保更新購物車內容
        //=======================
         // 使用 window.dispatchEvent 觸發一個自定義事件
    const event = new CustomEvent("userAddedCart", {
      detail: { message: "refresh shopping Cart length" },
    });
    window.dispatchEvent(event);
        //=========================
      })
      .catch((error) => {
        console.error("錯誤：", error);
        // 處理錯誤（如顯示錯誤訊息）
      });
  }



  const renderClassContect = () => {
    // 現在要將抓回來的課程內容變成一個個表
    if (showTeacherClassData) {
      return showTeacherClassData.tutorClass.map((element) => {
        const date = new Date(element.date); // 將日期字串轉換為 Date 物件
        const month = date.getMonth() + 1; // getMonth() 返回 0-11 的月份索引，因此需要加 1        



        const handleButtonClick = (id, classprice) => {

          //get token
          const token = localStorage.getItem("token");
          if (!token) {
            alert("未login，請先登入！");

            // 獲取當前路徑
            const currentPath = window.location.pathname;
            console.log(currentPath)
            // 設置 Cookie 保存路徑
            Cookies.set('redirectPath', currentPath)
            redirect("http://localhost:3000/login")
          }

          //get userId
          fetch('http://localhost:3030/danceclass/bookingClass', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json', // 設置內容類型為 JSON
              authorization: `Bearer ${token}` // 使用 Token 作為 Authorization
            },
            body: JSON.stringify({
              price: classprice,   // 傳送 price（價格）
              type: 'Class',    // 傳送類型              
              id,      // 傳送課程 ID
            }),
          })
            .then((response) => {
              if (response.ok) {
                return response.json();
              } else {
                throw new Error('預訂課程失敗');
              }
            })
            .then((data) => {
              console.log('預訂成功：', data);
              // 成功後處理邏輯（如顯示成功訊息或更新畫面）
              alert('預訂成功！');
            })
            .catch((error) => {
              console.error('錯誤：', error);
              // 處理錯誤（如顯示錯誤訊息）
            });

        };
        return (
          <div
            key={element._id} // React 渲染列表需要唯一的 key
            className="flex items-center bg-zinc-800 rounded-sm overflow-hidden hover:opacity-50 transition-opacity duration-100"
          >
            <div className="w-24 h-24 shrink-0">
              <img
                src={element.img}
                alt={showcaseData.someOneTeacher.nickname}
                width={100}
                height={100}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 flex items-center justify-between p-4 text-white">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold">{date.getDate()}</div>{" "}
                  {/* 獲取日期 */}
                  <div className="text-sm text-gray-300">{month}月</div> {/* 獲取月份 */}
                </div>
                <div>
                  <div className="text-xl font-bold text-white">
                    {element.style} - {showcaseData.someOneTeacher.nickname}
                  </div>
                  <div className="text-sm text-gray-300">
                    {element.startTime} - {element.endTime} • {element.room}
                  </div>
                </div>
              </div>
              <button
                className="border border-white text-white px-4 py-2 hover:bg-white hover:text-black transition duration-200 cursor-pointer"
                //onClick={() => handleButtonClick(element._id, element.price)}
                onClick={() => handleAddToCart(element._id, element.price)}

              >
                Add to Cart
              </button>
            </div>
          </div>
        );
      });
    }
    return null; // 如果沒有資料，返回 null
  };

  return (
    <div className="bg-white text-zinc-700">
      <div className="container mx-auto px-4 py-8 md:py-12">        
        {renderContent()}
      </div>      
    </div>

  );
}
