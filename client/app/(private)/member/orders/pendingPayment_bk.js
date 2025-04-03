export default function PendingPayment({ data }) {
  console.log("data.transactions:", data.transactions);

  //=====在transaction的collection中找出每筆記錄去每個不同的collection找資料=====
  const typeMapping = {
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
  const fetchDynamicData = async (transactions) => {
    transactions.forEach(async (transaction) => {
      const collectionName =
        typeMapping[transaction.type] || "unknownCollection";
      console.log(collectionName);

      if (collectionName !== "unknownCollection") {
        // 將 detail 作為 URL 的查詢參數
        const url = `http://localhost:3030/transaction/recordDetail/${collectionName}?detail=${transaction.detail}`;

        try {
          const response = await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const data = await response.json();
            console.log(
              `Fetched data for ${collectionName} with detail ${transaction.detail}:`,
              data
            );

            console.log("xxxxxx", data.data[0], "xxxxx");
            return data.data[0];
          } else {
            console.error(
              `Failed to fetch data for ${collectionName} with detail ${transaction.detail}:`,
              response.status,
              response.statusText
            );
          }
        } catch (error) {
          console.error(
            `Error fetching data for ${collectionName} with detail ${transaction.detail}:`,
            error
          );
        }
      } else {
        console.log(`Type "${transaction.type}" is not mapped.`);
      }
    });
  };
  //=============================================

  // 呼叫函數
  let fetchData = fetchDynamicData(data.transactions);

  // const handleDeleteTransactionRec = async (id) => {
  //   try {
  //     // 發送刪除請求
  //     const response = await fetch(`http://localhost:3030/danceclass/transactionDelete/${id}`,
  //       { method: "DELETE" });  // 使用 DELETE 方法
  //     const resData = await response.json();
  //     console.log("刪除結果:", resData);  // 確認刪除結果
  //     if (resData.response !== "ok") {
  //       console.error("刪除失敗:", resData);
  //       return;
  //     }else{
  //       console.log("刪除成功:", resData);
  //     // 刷新頁面 (重新抓取數據)
  //     window.location.reload(); }
  //   } catch (err) {
  //     console.error("刪除失敗:", err);
  //   } };

  const renderHtml = () => {
    if (!data || !Array.isArray(data.transactions)) {
      console.log("數據無效或為空");
      return <p>No data available</p>;
    }

    //遍歷數據，並添加條件渲染
    return data.transactions.map(
      (item) =>
        item.status === "Pending Payment" && (
          <div
            className="flex items-center justify-between py-3"
            key={item._id}
          >
            {/* 顯示課程類型 */}
            <div className="text-sm font-medium text-gray-600">
              {item.detail} -
              <span className="text-sm text-gray-800"> class style</span>
            </div>

            <div className="flex items-center gap-4">
              {/* 顯示課程價格 */}
              <span className="text-sm text-gray-800">HK${item.price}</span>

              {/* 刪除按鈕 */}
              <button
                variant="secondary"
                size="sm"
                className="h-8 rounded-full bg-gray-500 px-4 text-xs font-medium text-white hover:bg-gray-600 flex items-center justify-center"
                onClick={() => handleDelete(item._id)} // 對應刪除邏輯
              >
                <span className="material-icons">delete</span>
              </button>
            </div>
          </div>
        )
    );
  };

  return (
    <div className="rounded-lg border border-gray-800 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-gray-800">
        Pending Payment
      </h2>
      <div className="border-t border-gray-200 pt-4">{renderHtml()}</div>
    </div>
  );
}
