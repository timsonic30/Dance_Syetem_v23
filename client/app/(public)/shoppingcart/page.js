"use client"; // 將這個組件聲明為 Client Component
import Cookies from "js-cookie";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ShoppingCart() {
  const [cartData, setCartData] = useState();
  const [eachCartData, setEachCartData] = useState(null);
  // const resultArray = []; // 創建一個外部陣列來存儲數據
  const [resultArray, setResultArray] = useState([]);
  const [cartCount, setCartCount] = useState();
  const [total, setTotal] = useState(0);

  //======如果不是會員, 讓會員記著這個位置=========
  const loginNotYet = () => {
    alert("請先登入");
    // 保存當前頁面的URL
    const currentPageUrl = window.location.href;
    sessionStorage.setItem("redirectAfterRegister", currentPageUrl);
    window.location.href = "http://localhost:3000/login";
  };

  //=====如有token,將token send to backend, 找出會員objectID==================
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
  //========================

  //==========查看是不是已login========================
  const checkMenberOrNot = async () => {
    //找出browser的token
    const token = localStorage.getItem("token");
    if (token) {
      console.log("Token 存在:", token);
      //alert("Token 存在！");
      let userid = await sendTokenToBackEnd(token);
      return userid; //確認了是會員及將會員的ObjectID抽出來
    } else {
      //alert("沒有token");
      loginNotYet();
      return false;
    }
  };
  //======================================

  // 刪除購物車內容
  const handleDelete = (shoppingCartid) => {
    // 發送 DELETE 請求
    fetch(`http://localhost:3030/shoppingcart/delete/${shoppingCartid}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("刪除成功:", data);
        checkShoppingCart();
        const event = new CustomEvent("userAddedCart", {
          detail: { message: "refresh shopping Cart length" },
        });
        window.dispatchEvent(event);
      })
      .catch((error) => {
        console.error("刪除失敗:", error);
      });
  };

  //計算總價
  const totalPrices = (resultArray) => {
    let total = 0;
    resultArray.map((item) => {
      const price = item.data[0].price;
      console.log("item:", price);
      total += price;
    });
    setTotal(total);
    return total;
  };

  //作為記錄, 不要刪除================================
  // const renderCartData = (resultArray) => {
  //   resultArray.map((item) => {
  //     console.log(item)
  //     return(
  //       <div className="flex items-center justify-between py-4 border-b border-gray-100">
  //       <div className="flex items-center gap-4">
  //         <div className="w-16 h-16 relative flex-shrink-0">
  //           <img
  //             src={item.data[0].img}
  //             alt={item.data[0].code}
  //             width={64}
  //             height={64}
  //             className="object-contain"
  //           />
  //         </div>
  //         <div>
  //           <h3 className="font-medium text-gray-900">{item.data[0].code}</h3>
  //           <p className="text-amber-700">HK$ {item.data[0].price}</p>
  //         </div>
  //       </div>

  //       {/* 右側刪除按鈕 */}
  //           <div
  //         className="bg-[#FF9933] text-white w-12 h-12 flex items-center justify-center rounded"
  //         onClick={() => handleDelete(item.shoppingCartid)} // 點擊刪除
  //       >
  //         <svg
  //           xmlns="http://www.w3.org/2000/svg"
  //           className="h-6 w-6 cursor-pointer"
  //           fill="none"
  //           viewBox="0 0 24 24"
  //           stroke="currentColor"
  //           strokeWidth={2}
  //         >
  //           <path
  //             strokeLinecap="round"
  //             strokeLinejoin="round"
  //             d="M6 18L6 9M10 18L10 9M14 18L14 9M18 18L18 9M4 6h16M9 6v-2a1 1 0 011-1h4a1 1v2m-7 0h6"
  //           />
  //         </svg>
  //           </div>
  //       </div>
  //     )
  //   });
  // };
  //=================================================================================================

  // const tempArray = [];
  // 將購物車內容的每個項目發送到後端
  const runArray = (dataArray) => {
    const tempArray = []; // Move to here so the items won't be duplicated whenever click the cart
    const promises = dataArray.map((item) => {
      const collectionName = item.collectionName;
      const productID = item.productID;

      // 發送 POST 請求
      return fetch(
        `http://localhost:3030/shoppingcart/cartdata/${collectionName}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productID: productID,
            ShoppingCartid: item._id,
          }),
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          tempArray.push(data); // 將數據推入陣列
        })
        .catch((error) => {
          console.error(`Error fetching data for ${collectionName}:`, error);
        });
    });
    // 等待所有請求完成後返回結果數據
    return Promise.all(promises)
      .then(() => {
        setResultArray(tempArray);
      })
      .then(() => {
        totalPrices(tempArray);
      });
  };

  //=====將有關shoppingcart的data從server端取回====
  const checkShoppingCart = () => {
    // 檢查是否已經有 Session ID
    let sessionId = Cookies.get("session_id");
    if (sessionId) {
      // 如果有，則獲取購物車內容
      fetch(`http://localhost:3030/shoppingCart/getcart/${sessionId}`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("獲取購物車失敗");
          }
        })
        .then((data) => {
          setCartCount(data.length);
          //console.log('購物車內容在購物車頁面：', data);
          setCartData(data);
          runArray(data);
        })
        .catch((error) => {
          console.error("錯誤：", error);
          // 處理錯誤（如顯示錯誤訊息）
        });
    }
  };

  //=====將有關shoppingcart的data從server端取回====
  const isMemberAfterCheckOut = () => {
    // 清除 Cookie
    document.cookie =
      "session_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    // 顯示提示
    //alert("session_id 已清除");

    // 使用 window.dispatchEvent 觸發一個自定義事件,讓navbar上的icon更新
    const event = new CustomEvent("userAddedCart", {
      detail: { message: "refresh shopping Cart length" },
    });
    window.dispatchEvent(event);
    // 跳轉到指定頁面
    window.location.href = "http://localhost:3000/member/information";
  };
  //==============================

  //===將資料送到後端=====
  const sendTransactionData = async (data) => {
    const url = "http://localhost:3030/transaction";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("交易成功回應:", responseData);
        //alert("====交易資料已送出並成功處理！===");
      } else {
        console.error("交易失敗:", response.status, response.statusText);
        //alert("交易失敗，請稍後再試！");
      }
    } catch (error) {
      console.error("連接錯誤:", error);
      //alert("無法連接到伺服器！");
    }
  };
  //=============================

  //===綜合shopping cart及user資料, 準備送到後端====
  const processTransactions = async (cartData, userId) => {
    //console.log(cartData);
    const promises = cartData.map((item) => {
      const data = {
        userId: userId,
        status: "Pending Payment",
        type: item.shoppingType,
        detail: item.productID,
        price: item.price,
      };
      return sendTransactionData(data);
    });

    await Promise.all(promises);
  };
  //========================================

  //===========================================
  //找出現時在購物車的商品 - 其實已經有, 不需要, ****你現在需要的是將啲item發送到transaction的collection中
  // const findShoppingCart = () => {
  //   const token = localStorage.getItem("token"); //為什麼要獲取token
  //   fetch("http://localhost:3030/shoppingcart/getcart", {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${token}`,
  //     },
  //   })
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error(`Failed to fetch: ${response.status}`);
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       console.log("購物車內容：", data);
  //       setCartData(data);
  //       runArray(data);
  //     })
  //     .catch((error) => {
  //       console.error("錯誤：", error);
  //     });
  // };
  //===========================================

  //==========================================================
  // 埋單按鈕
  const handleCheckOut = async () => {
    //alert("You Clicked Check Out");
    // 「cartData」是購物車的所有資料,是array
    let userId = await checkMenberOrNot();
    if (!userId) {
      return;
    }
    await processTransactions(cartData, userId);
    //清理有關cookie
    isMemberAfterCheckOut();
  };
  //====================================

  useEffect(() => {
    checkShoppingCart();
  }, []);

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg border border-gray-400 shadow-lg py-14 px-20 mt-16 w-full">
      <div className="mb-6">
        <h2 className="text-xl font-medium text-gray-800 border-b border-gray-200 pb-2 mb-4">
          Shopping Cart
        </h2>

        <div className="space-y-4">
          {/*在這裡插入*/}
          {resultArray.map((item, index) => {
            return (
              <div
                key={index}
                className="flex items-center justify-between py-4 border-b border-gray-100 mt-2"
              >
                <div className="flex items-center gap-4">
                  <div id='productImgForShoppingCart' className="w-16 h-16 relative flex-shrink-0 mt-2 mb-2">
                    <img
                      src={item.data[0].img || '/cards06.jpeg'}
                      alt={item.data[0].code}
                      width={64}
                      height={64}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {item.data[0].code}
                    </h3>
                    <p className="text-amber-700">HK$ {item.data[0].price}</p>
                  </div>
                </div>

                {/* 右側刪除按鈕 */}
                <div
                  className="bg-[#FF9933] text-white w-12 h-12 flex items-center justify-center rounded"
                  onClick={() => handleDelete(item.shoppingCartid)} // 點擊刪除
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 cursor-pointer"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      // d="M6 18L6 9M10 18L10 9M14 18L14 9M18 18L18 9M4 6h16M9 6v-2a1 1 0 011-1h4a1 1v2m-7 0h6"
                      d="M6 18L6 9M10 18L10 9M14 18L14 9M18 18L18 9M4 6h16M9 6v-2a1 1 0 011-1h4a1 1 0 011 1v2m-7 0h6"
                    />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Total and Checkout */}
      <div className="mt-16 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-gray-900">Total</h3>
          <p className="font-medium text-amber-700">HK$ {total}</p>
        </div>
        <p className="text-sm text-gray-500">(Excludes Tax)</p>

        <button
          className="btn w-full bg-[#FF9933] hover:bg-emerald-700 text-white py-5 rounded-md mt-8"
          onClick={handleCheckOut}
        >
          Checkout
        </button>
      </div>
    </div>
  );
}
