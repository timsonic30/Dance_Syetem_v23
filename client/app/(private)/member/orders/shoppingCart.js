export default function ShoppingCart({ data }) {
  
  const handleDeleteTransactionRec = async (id) => {
    try {
      // 發送刪除請求
      const response = await fetch(`http://localhost:3030/danceclass/transactionDelete/${id}`, 
        { method: "DELETE" });  // 使用 DELETE 方法 
      const resData = await response.json();
      console.log("刪除結果:", resData);  // 確認刪除結果
      if (resData.response !== "ok") {
        console.error("刪除失敗:", resData);
        return;
      }else{
        console.log("刪除成功:", resData);
      // 刷新頁面 (重新抓取數據)      
      window.location.reload(); }
    } catch (err) {
      console.error("刪除失敗:", err);
    } };
  
  const renderHtml = () => {
    if (!data || !Array.isArray(data)) {
      console.log("數據無效或為空");
      return <p>No data available</p>;
    }

    // 遍歷數據，並添加條件渲染
    return data.map(
      (item) =>
        item.status === "Shopping Cart" && (
          <div
            className="flex items-center justify-between py-3"
            key={item._id}
          >
            {/* 顯示課程類型 */}
            <div className="text-sm font-medium text-gray-600">
              {item.classData.code} -
              <span className="text-sm text-gray-800">
                {" "}
                {item.classData.style}
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* 顯示課程價格 */}
              <span className="text-sm text-gray-800">HK${item.price}</span>

              {/* 刪除按鈕 */}
              <button
                variant="secondary"
                size="sm"
                className="h-8 rounded-full bg-gray-500 px-4 text-xs font-medium text-white hover:bg-gray-600 flex items-center justify-center"
                onClick={() => handleDeleteTransactionRec(item._id)} // 對應刪除邏輯
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
        Shopping Cart
      </h2>
      <div className="border-t border-gray-200 pt-4">{renderHtml()}</div>
    </div>
  );
}
