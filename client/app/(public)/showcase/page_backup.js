"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import "./BuyShowcase.css";

export default function BuyShowcase() {
  // 定义状态变量
  const [payProductArray, setPayProductArray] = useState([]); // 保存产品数据的状态
  const [loading, setLoading] = useState(true); // 数据加载状态，标识是否加载完成
  const [showCalculate, setShowCalculate] = useState(false); // 是否显示计算区域
  const [clickCount, setClickCount] = useState(0); // 点击次数计数器
  const [activeBoxId, setActiveBoxId] = useState(null); // 当前激活的产品 ID

  // 从后端获取产品数据的函数
  useEffect(() => {
    const fetchPayProductData = async () => {
      try {
        // 调用后端 API 获取产品数据
        const response = await fetch("http://localhost:3030/payProduct"); // 后端接口地址
        const data = await response.json(); // 解析 JSON 数据

        // 验证返回的数据格式是否正确
        if (!data.payProductData || !Array.isArray(data.payProductData)) {
          console.error("无效的数据格式:", data.payProductData); // 输出错误日志
          return; // 停止执行
        }

        const today = new Date(); // 获取当前日期

        // 格式化、过滤和排序产品数据
        const showcaseProductItems = data.payProductData
          .map((product) => ({
            id: product._id, // 产品唯一 ID
            name: product.productName, // 产品名称
            description: product.description, // 产品描述
            price: product.price, // 产品价格
            ValidDate: product.ValidDate, // 产品有效日期
            img: product.img || "./images/default-image.jpeg", // 如果无图片，则使用默认图片
            clickable: new Date(product.ValidDate) >= today, // 根据有效日期判断产品是否可点击
          }))
          .filter((product) => product.name.includes("Showcase")) // 筛选包含 "Showcase" 的产品
          .sort((a, b) => {
            // 優先排序 "Earlybird" 產品
            const isEarlybirdA = a.name.includes("Earlybird");
            const isEarlybirdB = b.name.includes("Earlybird");

            // 如果一個是 Earlybird 而另一個不是，則 Earlybird 排在前面
            if (isEarlybirdA && !isEarlybirdB) return -1;
            if (!isEarlybirdA && isEarlybirdB) return 1;

            // 如果同為 Earlybird，按以下順序排列："Signal Piece" -> "2 Piece" -> "3 Piece"
            const order = ["Signal Piece", "2 Piece", "3 Piece"];
            const indexA = order.findIndex((keyword) => a.name.includes(keyword));
            const indexB = order.findIndex((keyword) => b.name.includes(keyword));

            if (indexA !== -1 && indexB !== -1) {
              return indexA - indexB; // 按 order 中的順序排列
            }

            // 如果名稱中既無 Signal Piece、2 Piece、3 Piece，按數字排序
            const numA = a.name.match(/(\d+)/) ? parseInt(a.name.match(/(\d+)/)[1], 10) : 0;
            const numB = b.name.match(/(\d+)/) ? parseInt(b.name.match(/(\d+)/)[1], 10) : 0;
            return numA - numB;
          });
        // 将处理后的数据保存到状态
        setPayProductArray(showcaseProductItems);
      } catch (error) {
        console.error("获取产品数据时出错:", error.message); // 输出错误日志
      } finally {
        setLoading(false); // 设置加载状态为完成
      }
    };

    fetchPayProductData(); // 调用获取数据函数
  }, []);

  // 处理点击产品事件的函数
  const handleClick = (id, clickable) => {
    if (!clickable) return; // 如果产品不可点击，则直接返回
    setActiveBoxId(id); // 设置当前激活的产品 ID
    setShowCalculate(true); // 显示计算区域
    setClickCount((prevCount) => prevCount + 1); // 增加点击次数
  };

  const renderCalculationRows = (activeProduct) => {
    // 使用正则表达式从 "Showcase X Piece" 提取 X（数字）
    const classesMatch = activeProduct.name.match(/Showcase\s(\d+)\sPiece/); 
    const numberOfPieces = classesMatch ? parseInt(classesMatch[1], 10) : 1; 
    // 如果匹配成功，提取数字并转换为整数；否则默认为 1

    // 验证件数是否有效，如果无效则仅显示总价
    if (numberOfPieces <= 0) {
      return (
        <tr>
          <td>
            <h3>Total:</h3>
          </td>
          <td>
            <h3>${activeProduct.price}</h3>
          </td>
        </tr>
      );
    }
  
    // 根据件数计算单件价格
    const pricePerPiece = (activeProduct.price / numberOfPieces).toFixed(0);
  
    // 渲染计算结果行
    return (
      <>
        <tr>
          <td>
            <h2>Price per Piece:</h2>
          </td>
          <td>${pricePerPiece}</td>
          <td>/Piece</td>
        </tr>
        <tr>
          <td>
            <h3>Total:</h3>
          </td>
          <td>
            <h3>${activeProduct.price}</h3>
          </td>
        </tr>
      </>
    );
  };
  

  
  // 如果数据还在加载，显示加载指示
  if (loading) {
    return <p>Loading products...</p>;
  }

  return (
    <section className="BuyShowcase" id="BuyShowcase">
      {/* 页面头部区域 */}
      <div className="box-container">
        <div className="boxMain">
          <div className="image">
            <a href="#BuyShowcase">
              <img src="./cards01.png" alt="Buy Showcase Section" />
            </a>
          </div>
          <div className="content">
            <a href="#BuyShowcase">
              <h1>Buy Showcase</h1>
            </a>
          </div>
        </div>

        {/* 产品列表区域 */}
        <div className="AllPriceTag">
          {payProductArray.map((product) => (
            <div
              key={product.id}
              className={`boxPrice ${activeBoxId === product.id ? "active" : ""
                } ${!product.clickable ? "disabled" : ""}`} // 添加样式，区分可点击和禁用状态
              onClick={() => handleClick(product.id, product.clickable)} // 点击事件
            >
              <h1>{product.name}</h1> {/* 显示产品名称 */}
              <h2>${product.price}</h2> {/* 显示产品价格 */}

              {/* 始终显示“添加到购物车”图标 */}
              <a href="#AddCart">
                <img
                  src="AddShoppingCart_black.png"
                  className="CartIcon"
                  alt={`Add ${product.name} to cart`}
                />
              </a>

              {/* 如果产品不可点击，显示有效日期 */}
              {!product.clickable && (
                <p className="disabled-info">
                  Valid until: {new Date(product.ValidDate).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 订单详情区域 */}
      {showCalculate && activeBoxId && (
        <section className="calculate">
          <hr />
          <table>
            <thead>
              <tr>
                <th colSpan="3">
                  <h1>Your Order</h1>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <h2>{payProductArray.find((product) => product.id === activeBoxId).name}:</h2>
                </td>
                <td>${payProductArray.find((product) => product.id === activeBoxId).price}</td>
              </tr>
              {renderCalculationRows(payProductArray.find((product) => product.id === activeBoxId))}
              <tr>
                <td colSpan="3">
                  <span>{payProductArray.find((product) => product.id === activeBoxId).description}</span>
                </td>
              </tr>
            </tbody>
          </table>
          <hr />
        </section>
      )}

      {/* 底部按钮区域 */}
      <section className="BuyShowcaseButton">
        <div className="bottom-buttons">
          <button className="AddToCart-btn" onClick={() => console.log("Add to Cart clicked!")}>
            Add to Cart
          </button>
          <a
            href="https://wa.me/your-whatsapp-number"
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-btn"
          >
            <img
              src="./WhatsAppWhite.png"
              alt="WhatsApp Icon"
              style={{ width: "25px", height: "25px" }}
            />
            WhatsApp Inquiries
          </a>
          <button
            className="BookTheClass-btn"
            onClick={() => console.log("Book the Showcase clicked!")}
          >
            <Link href="/tutor" aria-label="Tutor Page">
              Book the Showcase
            </Link>
          </button>
        </div>
      </section>
    </section>
  );
}