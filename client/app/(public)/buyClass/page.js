"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Cookies from "js-cookie"; // For session ID management
import "./BuyClass.css";

export default function BuyClass() {
  const [products, setProducts] = useState([]);
  const [monthlyPass, setMonthlyPass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isMonthlyPassActive, setMonthlyPassActive] = useState(false);

  // Fetch product data on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3030/payProduct");
        const data = await response.json();

        if (!data.payProductData || !Array.isArray(data.payProductData)) {
          throw new Error("Invalid product data format");
        }

        // Format and set class products
        const classes = data.payProductData
          .filter((item) => item.productName.includes("Class"))
          .sort((a, b) => extractClassNumber(a.productName) - extractClassNumber(b.productName))
          .map((item) => formatProduct(item));

        // Extract monthly pass product
        const pass = data.payProductData.find(
          (item) => item.productName === "Monthly pass Package"
        );

        setProducts(classes);
        setMonthlyPass(pass ? formatProduct(pass) : null);
      } catch (error) {
        console.error("Error fetching products:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Helper to extract class number
  const extractClassNumber = (name) => parseInt(name.match(/\d+/)?.[0] || 0, 10);

  // Helper to format product data
  const formatProduct = (item) => ({
    id: item._id,
    name: item.productName,
    description: item.description,
    price: item.price,
    points: item.point,
    validDate: item.ValidDate,
    img:item.img ||"./images/default-image.jpeg",
  });

  // Handle product selection
  const handleSelectProduct = (id, isPass = false) => {
    setSelectedProductId(isPass ? null : id);
    setMonthlyPassActive(isPass);
  };

 // Dynamically assign shoppingType based on product names
const assignShoppingType = (product) => {
  if (product.name.includes("Single Class")) {
    return "1 Class Package";
  } else if (product.name.includes("1 Class")) {
    return "1 Class Package";
  } else if (product.name.includes("5 Class")) {
    return "5 Class Package";
  } else if (product.name.includes("10 Class")) {
    return "10 Class Package";
  } else if (product.name.includes("15 Class")) {
    return "15 Class Package";
  } else if (product.name.includes("Monthly pass")) {
    return "Monthly pass Package";
  } else {
    return "Default Package"; // Fallback for unmatched names
  }
};

  // Function to handle "Add to Cart"
  const handleAddToCart = () => {
    // Determine the active product (either a selected class product or the monthly pass)
    const activeProduct = isMonthlyPassActive
      ? monthlyPass
      : products.find((product) => product.id === selectedProductId);

    if (!activeProduct) {
      alert("Please select a product to add to the cart.");
      return;
    }

    // Assign the shoppingType dynamically
    const shoppingType = assignShoppingType(activeProduct);

    // Check for existing Session ID
    let sessionId = Cookies.get("session_id");
    if (!sessionId) {
      // Generate a new Session ID if none exists
      sessionId = generateSessionId();
      Cookies.set("session_id", sessionId);
    }

    // Send product details to the shopping cart database
    fetch("http://localhost:3030/shoppingCart/addtocart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productID: activeProduct.id,
        collectionName: "payproducts",
        price: activeProduct.price,
        shoppingType: shoppingType,
        sessionID: sessionId,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to add the product to the cart.");
        }
      })
      .then((data) => {
        console.log("Added to cart successfully:", data);
        alert(`${activeProduct.name} added to the cart!`);
        // Dispatch a custom event to notify other components
        const event = new CustomEvent("userAddedCart", {
          detail: { message: "Shopping cart length refreshed." },
        });
        window.dispatchEvent(event);
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to add the product to the cart.");
      });
  };

  // Function to generate a unique Session ID
  const generateSessionId = () => {
    return "session-" + Math.random().toString(36).substr(2, 9) + "-" + Date.now();
  };

  if (loading) return <p>Loading products...</p>;

  return (
    <section className="BuyClassShow" id="BuyClassShow">
      <div className="box-container">
        {/* Header Section */}
        <div className="boxMain">
          <img src="./cards04.jpeg" alt="Buy Class Section" />
          <h1>Buy Class</h1>
        </div>

        {/* Class Products Section */}
        <div className="AllPriceTag">
          {products.map((product) => (
            <div
              key={product.id}
              className={`boxPrice ${selectedProductId === product.id ? "active" : ""}`}
              onClick={() => handleSelectProduct(product.id)}
            >
              <h1>{product.name}</h1>
              <h2>${product.price}</h2>
              <img
                src="AddShoppingCart_black.png"
                className="CartIcon"
                alt={`Add ${product.name} to cart`}
              />
            </div>
          ))}
        </div>

        {/* Monthly Pass Section */}
        {monthlyPass && (
          <div
            className={`SpecialPro ${isMonthlyPassActive ? "active" : ""}`}
            onClick={() => handleSelectProduct(null, true)}
          >
            <h1>{monthlyPass.name} (30 Days)</h1>
            <h2>${monthlyPass.price}</h2>

            <img
              src="AddShoppingCart_black.png"
              className="CartIcon"
              alt={`Add ${monthlyPass.name} to cart`}
            />

            <p>{monthlyPass.description}</p>
          </div>
        )}
      </div>

      {/* Calculation Section */}
      {(selectedProductId || isMonthlyPassActive) && (
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
              {selectedProductId && products.find((product) => product.id === selectedProductId) ? (
                <>
                  <tr>
                    <td>
                      <h2>{products.find((product) => product.id === selectedProductId).name}:</h2>
                    </td>
                    <td>${products.find((product) => product.id === selectedProductId).price}</td>
                  </tr>
                  <tr>
                    <td>
                      <h2>Price per Class:</h2>
                    </td>
                    <td>
                      ${Math.round(
                        products.find((product) => product.id === selectedProductId).price /
                        extractClassNumber(
                          products.find((product) => product.id === selectedProductId).name
                        )
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h3>Total:</h3>
                    </td>
                    <td>
                      <h3>${products.find((product) => product.id === selectedProductId).price}</h3>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="3">
                      <span>
                        {products.find((product) => product.id === selectedProductId).description}
                      </span>
                    </td>
                  </tr>
                </>
              ) : (
                monthlyPass && (
                  <>
                    <tr>
                      <td>
                        <h2>{monthlyPass.name} (30 Days):</h2>
                      </td>
                      <td>${monthlyPass.price}</td>
                    </tr>
                    <tr>
                      <td>
                        <h3>Total:</h3>
                      </td>
                      <td>
                        <h3>${monthlyPass.price}</h3>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="3">
                        <span>{monthlyPass.description}</span>
                      </td>
                    </tr>
                  </>
                )
              )}
            </tbody>
          </table>
          <hr />
        </section>
      )}

      {/* Single Add to Cart Button */}
      <section className="BuyClassButton">
        <div className="bottom-buttons">
          <button className="AddToCart-btn" onClick={handleAddToCart}>
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
              Book the Class
            </Link>
          </button>
        </div>
      </section>
    </section>
  );

}
