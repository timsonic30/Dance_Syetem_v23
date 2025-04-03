import React, { useState, useEffect } from "react";

export default function PendingPayment({ data }) {
  const [htmlContentData, sethtmlContentData] = useState([]); // 主數據



  //delete purchase History的按鈕
  const handleDelete = async (transactionsObjectId) => {
    const url = `http://localhost:3030/transaction/purchaseHistory/${transactionsObjectId}`;
    try {
      const response = await fetch(url, {
        method: "DELETE", // 使用 HTTP DELETE 方法
        headers: {
          "Content-Type": "application/json", // 告知伺服器數據格式為 JSON
        },
      });

      if (response.ok) {
        //alert("成功刪除");
        console.log('deleted後的:', htmlContentData)
        const deletedDataArray = htmlContentData.filter(item => item._id !== transactionsObjectId);
        sethtmlContentData(deletedDataArray)
        // window.location.reload(); // 強制刷新頁面
        //在這裡不要用reload, 應該要找htmlContentData去取資料, 再render出來

      } else {
        console.log(`Failed to delete transaction. Status: ${response.status}`);
      }
    } catch (error) {
      console.log("Error occurred while deleting transaction:", error);
    }
  };
  //=======================================

  // 定義 type 的映射
  const typeMap = {
    Class: "DanceClass",
    class: "DanceClass",
    RoomRental: "RoomRental",
    "room rental": "RoomRental",
    package: "PayProduct",
    tee: "PayProduct",
    Package: "PayProduct",
    Tee: "PayProduct",
    "1 Class Package": "PayProduct",
    "1 class package": "PayProduct",
    "5 Class Package": "PayProduct",
    "5 class package": "PayProduct",
    "10 Class Package": "PayProduct",
    "10 class package": "PayProduct",
    "15 Class Package": "PayProduct",
    "15 class package": "PayProduct",
    "Monthly pass Package": "PayProduct",
    "monthly pass package": "PayProduct",
    "1 Piece Package": "PayProduct",
    "1 piece package": "PayProduct",
    "2 Piece Package": "PayProduct",
    "2 piece package": "PayProduct",
    "3 Piece Package": "PayProduct",
    "3 piece package": "PayProduct",
    "1 Room Package": "PayProduct",
    "1 room package": "PayProduct",
    "10 Room Package": "PayProduct",
    "10 room package": "PayProduct",
    "T-shirt": "PayProduct",
    "t-shirt": "PayProduct",
    Ticket: "PayProduct",
    ticket: "PayProduct",
    Gift: "PayProduct",
    gift: "PayProduct",
  };

  // 整理要向不同 collection fetch 的資料
  const htmlContent = data.transactions.map((item) => {
    const collectionName = typeMap[item.type] || "DefaultValue";
    item.fetchUrl = `http://localhost:3030/transaction/recordDetail/${collectionName}?detail=${item.detail}`;
    return item;
  });

  const fetchData = async () => {
    const finalHtmlContent = await Promise.all(
      htmlContent.map(async (item) => {
        const url = `${item.fetchUrl}`;

        try {
          const response = await fetch(url, {
            method: "GET", // HTTP 方法，這裡使用 GET
            headers: {
              "Content-Type": "application/json", // 請求的內容類型為 JSON
            },
          });

          if (response) {
            const data = await response.json(); // 將回應轉換為 JSON 格式
            //console.log("Fetched Data:", data); // 印出接收到的資料
            item.detailContent = data; // 將資料儲存到 item
            return item; // 回傳更新後的 item
          } else {
            console.error(`Failed to fetch. Status: ${response.status}`);
          }
        } catch (error) {
          console.error("Error occurred while fetching data:", error);
        }

        item.detailContent = null; // 如果請求失敗，將 detailContent 設為 null
        return item; // 回傳未更新的 item
      })
    );
    let tempFinalHtmlContent = finalHtmlContent.filter(item => item.status === "Pending Payment");
    console.log("Pending Payment 的 Final HTML Content with Data:", tempFinalHtmlContent);
    return tempFinalHtmlContent; // 返回包含完整資料的陣列
  };

  useEffect(() => {
    // 呼叫函數以發送請求
    fetchData().then((results) => {
      sethtmlContentData(results); // 確認請求的結果
    });    
    
  }, []);

  return (
    
    <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm pl-15 pr-15 pt-10">
      <h2 className="mb-4 text-xl font-semibold text-gray-800 p-3">
      Pending Payment
      </h2>
      {htmlContentData.length === 0 ? (
        <div className="border-t border-gray-200 pt-4">
          No pending payment data
        </div>
    ) : (
      <div className="border-t border-gray-200 pt-4">
      {/* 確保 htmlContentData 有資料並進行遍歷 */}

      {htmlContentData &&
        htmlContentData.map(
          (item, index) =>
            item.status === "Pending Payment" ? ( // 檢查 status
              <div key={index} className="text-gray-800">
                <div
                  className="flex items-center justify-between py-3"
                  key={item._id}
                >
                  {/* 顯示課程類型 */}
                  <div className="text-sm font-medium text-gray-600">

                    <span className="text-sm text-gray-800 mr-3 ml-5">
                      {item.type === "class" || item.type === "Class" ?
                        `Class code : ${item.detailContent.data[0].code}` :
                        item.type === "room rental" || item.type === "Room rental" ?
                          ` Room rental : ${item.detailContent.data[0].roomType}` :
                          `Product : ${item.type.charAt(0).toUpperCase() + item.type.slice(1).toLowerCase()}`}
                    </span>

                    {/* {item.detailContent?.data?.[0]?.roomType && (
                      <span className="text-sm text-gray-800 mr-3 ml-5">
                        {item.detailContent.data[0].roomType}
                      </span>
                    )} */}

                    {item.detailContent?.data?.[0]?.style && (
                      <span className="text-sm text-gray-800 mr-3 ml-5">
                        Style : {item.detailContent.data[0].style}
                      </span>
                    )}

                    {/* {item.detailContent?.data?.[0]?.timeRange && (
                      <span className="text-sm text-gray-800 mr-3 ml-5">
                        {(() => {
                          const timeRange = item.detailContent.data[0].timeRange;
                          if (timeRange.length === 1) {
                            // 如果只有一個時間範圍，提取開始時間
                            return `Time : ${item.detailContent.data[0].timeRange}`;
                          } else {
                            // 如果有多個時間範圍，顯示第一個和最後一個的開始時間
                            const startTimes = [timeRange[0].split("-")[0], timeRange[timeRange.length - 1].split("-")[0]];
                            return `Time : ${startTimes.join(" - ")}`;
                          }
                        })()}
                      </span>
                    )} */}


                    {item.detailContent?.data?.[0]?.timeRange && (
                      <span className="text-sm text-gray-800 mr-3 ml-5">
                        {(() => {
                          const timeRange = item.detailContent.data[0].timeRange;
                          if (timeRange.length === 1) {
                            // 如果只有一個時間範圍，直接返回
                            return `Time : ${timeRange[0]}`;
                          } else {
                            // 合併連接的時間範圍
                            const result = [];
                            let start = timeRange[0].split("-")[0]; // 起始時間
                            let end = timeRange[0].split("-")[1];   // 當前結束時間

                            for (let i = 1; i < timeRange.length; i++) {
                              const [nextStart, nextEnd] = timeRange[i].split("-");

                              if (end === nextStart) {
                                // 如果當前結束時間和下一段的開始時間相連，更新結束時間
                                end = nextEnd;
                              } else {
                                // 如果不相連，保存目前的範圍，並開始新的範圍
                                result.push(`${start}-${end}`);
                                start = nextStart;
                                end = nextEnd;
                              }
                            }

                            // 最後一個範圍需要加入結果中
                            result.push(`${start}-${end}`);

                            return `Time : ${result.join(", ")}`;
                          }
                        })()}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    {/* 顯示課程價格 */}
                    {/* <span className="text-sm text-gray-800">
                      HK${item.price}
                    </span> */}
                    <span className="text-sm text-gray-800 mr-3 ml-5">
                      HKD {item.type === "room rental" || item.type === "Room rental"
                        ? item.price * (item.detailContent?.data?.[0]?.timeRange?.length)
                        : item.price}
                    </span>

                    {/* 刪除按鈕 */}
                    <button
                      variant="secondary"
                      size="sm"
                      className="h-8 rounded bg-red-500 px-4 text-xs font-medium text-white hover:bg-red-600 flex items-center"
                      onClick={() => {
                        handleDelete(item._id);
                      }}
                    >
                      <span className="material-icons">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : null // 如果條件不符合，什麼都不渲染
        )}


    </div>
    )}
  </div>






  );
}
