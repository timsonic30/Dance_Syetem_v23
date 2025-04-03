"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie"; // For handling cookies
import Link from "next/link";
import "./BuyShowcase.css";

export default function BuyShowcase() {
  // State variables
  const [payProductArray, setPayProductArray] = useState([]); // Product data
  const [loading, setLoading] = useState(true); // Loading state
  const [showCalculate, setShowCalculate] = useState(false); // Whether to show calculation area
  const [clickCount, setClickCount] = useState(0); // Counter for clicks
  const [activeBoxId, setActiveBoxId] = useState(null); // Active product ID

  // Fetch product data from the backend
  useEffect(() => {
    const fetchPayProductData = async () => {
      try {
        const response = await fetch("http://localhost:3030/payProduct"); // Backend API
        const data = await response.json(); // Parse JSON

        if (!data.payProductData || !Array.isArray(data.payProductData)) {
          console.error("Invalid data format:", data.payProductData);
          return;
        }

        const today = new Date(); // Current date

        // Format, filter, and sort product data
        const showcaseProductItems = data.payProductData
          .map((product) => ({
            id: product._id,
            name: product.productName,
            description: product.description,
            price: product.price,
            ValidDate: product.ValidDate,
            img: product.img || "./images/default-image.jpeg",
            clickable: new Date(product.ValidDate) >= today, // Check validity
          }))
          .filter((product) => product.name.includes("Showcase"))
          .sort((a, b) => {
            const isEarlybirdA = a.name.includes("Earlybird");
            const isEarlybirdB = b.name.includes("Earlybird");

            if (isEarlybirdA && !isEarlybirdB) return -1;
            if (!isEarlybirdA && isEarlybirdB) return 1;

            const order = ["Single Piece", "2 Piece", "3 Piece"];
            const indexA = order.findIndex((keyword) => a.name.includes(keyword));
            const indexB = order.findIndex((keyword) => b.name.includes(keyword));

            if (indexA !== -1 && indexB !== -1) {
              return indexA - indexB;
            }

            const numA = a.name.match(/(\d+)/) ? parseInt(a.name.match(/(\d+)/)[1], 10) : 0;
            const numB = a.name.match(/(\d+)/) ? parseInt(b.name.match(/(\d+)/)[1], 10) : 0;
            return numA - numB;
          });

        // Dynamically assign shoppingType based on product names
        showcaseProductItems.forEach((product) => {
          if (product.name.includes("Single Piece")) {
            product.shoppingType = "1 Piece Package";
          } else if (product.name.includes("2 Piece")) {
            product.shoppingType = "2 Piece Package";
          } else if (product.name.includes("3 Piece")) {
            product.shoppingType = "3 Piece Package";
          } else {
            product.shoppingType = "Default Package"; // Fallback for unmatched names
          }
        });

        setPayProductArray(showcaseProductItems); // Save data
      } catch (error) {
        console.error("Error fetching product data:", error.message);
      } finally {
        setLoading(false); // Mark as finished loading
      }
    };

    fetchPayProductData(); // Call the function
  }, []);

  // Generate a unique session ID
  const generateSessionId = () => {
    return "session-" + Math.random().toString(36).substr(2, 9) + "-" + Date.now();
  };

  // Add product to cart
  const handleAddToCart = (id, classPrice, shoppingType) => {
    let sessionId = Cookies.get("session_id");
    if (!sessionId) {
      sessionId = generateSessionId();
      Cookies.set("session_id", sessionId);
    }

    fetch("http://localhost:3030/shoppingCart/addtocart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productID: id,
        collectionName: "payproducts",
        price: classPrice,
        shoppingType: shoppingType,
        sessionID: sessionId,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to add to cart");
        }
      })
      .then((data) => {
        console.log("Successfully added to cart:", data);
        alert("已加購物車！");
        const event = new CustomEvent("userAddedCart", {
          detail: { message: "refresh shopping Cart length" },
        });
        window.dispatchEvent(event);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  // Handle product click event
  const handleClick = (id, clickable) => {
    if (!clickable) return;
    setActiveBoxId(id);
    setShowCalculate(true);
    setClickCount((prevCount) => prevCount + 1);
  };

  // Render calculation rows based on active product
  const renderCalculationRows = (activeProduct) => {
    const classesMatch = activeProduct.name.match(/Showcase\s(\d+)\sPiece/);
    const numberOfPieces = classesMatch ? parseInt(classesMatch[1], 10) : 1;

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

    const pricePerPiece = (activeProduct.price / numberOfPieces).toFixed(0);

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

  if (loading) {
    return <p>Loading products...</p>;
  }

  return (
    <section className="BuyShowcase" id="BuyShowcase">
      {/* Header Section */}
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
  
        {/* Product List Section */}
        <div className="AllPriceTag">
          {payProductArray.map((product) => (
            <div
              key={product.id}
              className={`boxPrice ${activeBoxId === product.id ? "active" : ""} ${
                !product.clickable ? "disabled" : ""
              }`}
              onClick={() => handleClick(product.id, product.clickable)}
            >
              <h1>{product.name}</h1>
              <h2>${product.price}</h2>
              <a href="#AddCart">
                <img
                  src="AddShoppingCart_black.png"
                  className="CartIcon"
                  alt={`Add ${product.name} to cart`}
                />
              </a>
              {!product.clickable && (
                <p className="disabled-info">
                  Valid until: {new Date(product.ValidDate).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
  
      {/* Calculation Section */}
      {showCalculate && activeBoxId && (
        <section className="calculate">
          <hr /> {/* Place <hr> outside the table */}
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
                  <span>
                    {payProductArray.find((product) => product.id === activeBoxId).description}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          <hr />
        </section>
      )}
  
      {/* Bottom Buttons Section */}
      <section className="BuyShowcaseButton">
        <div className="bottom-buttons">
          <button
            className="AddToCart-btn"
            onClick={() => {
              const activeProduct = payProductArray.find(
                (product) => product.id === activeBoxId
              );
              if (activeProduct) {
                handleAddToCart(
                  activeProduct.id,
                  activeProduct.price,
                  activeProduct.shoppingType // Now dynamically assigned
                );
              } else {
                alert("請先選擇產品！");
              }
            }}
          >
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
          <button className="BookTheClass-btn">
            <Link href="/tutor" aria-label="Tutor Page">
              Book the Showcase
            </Link>
          </button>
        </div>
      </section>
    </section>
  );
}  