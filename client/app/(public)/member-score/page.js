"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie"; // For managing session cookies
import Link from "next/link";
import "./memberScore.css";

export default function MemberScore() {
  // Slides data for the slideshow
  const slides = [
    { id: 1, image: "/MemberRedemptionBanner01.png" },
    { id: 2, image: "/theCollection2024.png" },
    { id: 3, image: "/MemberRedemptionBanner02.png" },
  ];

  // State for slideshow
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handle slideshow navigation
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  // State for product data and interaction
  const [payProductArray, setPayProductArray] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBoxId, setActiveBoxId] = useState(null);

  // Fetch product data on component mount
  useEffect(() => {
    const fetchPayProductData = async () => {
      try {
        const response = await fetch("http://localhost:3030/payProduct");
        const data = await response.json();

        if (!data.payProductData || !Array.isArray(data.payProductData)) {
          console.error("Invalid data format:", data.payProductData);
          setLoading(false);
          return;
        }

        // Filter products with negative points and assign shoppingType dynamically
        const negativePointProducts = data.payProductData
          .filter((product) => product.point < 0)
          .map((product) => ({
            id: product._id,
            name: product.productName,
            description: product.description,
            price: product.price,
            points: product.point,
            validDate: product.ValidDate,
            img: product.img || "./images/default-image.jpeg",
            stock: product.stock,
          }));

        negativePointProducts.forEach((product) => {
          if (product.name.includes("T-shirt")) {
            product.shoppingType = "T-shirt";
          } else if (product.name.includes("Ticket")) {
            product.shoppingType = "Ticket";
          } else if (product.name.includes("Gift")) {
            product.shoppingType = "Gift";
          } else {
            product.shoppingType = "Default Package"; // Default shopping type
          }
        });

        setPayProductArray(negativePointProducts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchPayProductData();
  }, []);

  // Generate unique session ID
  const generateSessionId = () => {
    return "session-" + Math.random().toString(36).substr(2, 9) + "-" + Date.now();
  };

  // Handle Add to Cart logic
  const handleAddToCart = (id) => {
    const selectedProduct = payProductArray.find((product) => product.id === id);

    if (!selectedProduct) {
      alert("Product not found. Please select a valid product.");
      return;
    }

    // Check if stock is available
    if (selectedProduct.stock <= 0) {
      alert("This product is out of stock.");
      return;
    }

    // Retrieve or create a session ID
    let sessionId = Cookies.get("session_id");
    if (!sessionId) {
      sessionId = generateSessionId();
      Cookies.set("session_id", sessionId);
    }

    // Call the Add to Cart API
    fetch("http://localhost:3030/shoppingCart/addtocart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productID: selectedProduct.id,
        collectionName: "payproducts",
        price: selectedProduct.points,
        shoppingType: selectedProduct.shoppingType,
        sessionID: sessionId,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to add product to cart.");
        }
      })
      .then((data) => {
        console.log("Add to Cart Success:", data);
        alert(`"${selectedProduct.name}" was successfully added to the cart!`);

        // Dispatch custom event to notify cart updates
        const event = new CustomEvent("userAddedCart", {
          detail: { message: "refresh shopping cart length" },
        });
        window.dispatchEvent(event);
      })
      .catch((error) => {
        console.error("Error adding to cart:", error);
        alert("An error occurred while adding the product to the cart.");
      });
  };

  // Handle product click events
  const handleClick = (id) => {
    const selectedProduct = payProductArray.find((product) => product.id === id);
    if (selectedProduct && selectedProduct.stock > 0) {
      setActiveBoxId(id);
    } else {
      alert("This product is out of stock.");
    }
  };

  if (loading) {
    return <p>Loading products...</p>;
  }

  // Render Component
  return (
    <section className="MSC-memberScoreChange" id="MSC-memberScoreChange">
      {/* Slideshow */}
      <div className="MSC-slideshow-container" id="MSC-slideshow-container">
        <div className="MSC-slide" id="MSC-slide">
          <img src={slides[currentIndex].image} alt={`Slide ${currentIndex + 1}`} />
        </div>
        <button className="MSC-prev" id="MSC-prev" onClick={prevSlide}>
          &#10094;
        </button>
        <button className="MSC-next" id="MSC-next" onClick={nextSlide}>
          &#10095;
        </button>
      </div>

      {/* Slideshow navigation dots */}
      <div className="MSC-dots" id="MSC-dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`MSC-dot ${currentIndex === index ? "MSC-active" : ""}`}
            id={`MSC-dot-${index}`}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>

      {/* Product List Section */}
      <div className="MSC-box-container" id="MSC-box-container">
        <div className="AllmemberScoreChangeP" id="AllmemberScoreChangeP">
          {payProductArray.map((product) => (
            <div
              key={product.id}
              className={`MSC-boxPrice ${product.stock <= 0 ? "disabled" : ""} ${
                activeBoxId === product.id ? "active" : ""
              }`}
              onClick={() => handleClick(product.id)}
            >
              <h1>{product.name}</h1>
              <img
                src={product.img}
                className="MSC-productImg"
                alt={`Image of ${product.name}`}
              />
              <p>Original: ${product.price}</p>
              <h2>Points: {product.points}</h2>
              <a href="#AddCart">
                <img
                  src="AddShoppingCart_black.png"
                  className="MSC-CartIcon"
                  alt={`Add ${product.name} to cart`}
                />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <section className="MSC-BuyClassButton">
        <div className="MSC-bottom-buttons">
          <button
            className="MSC-AddToCart-btn"
            onClick={() => handleAddToCart(activeBoxId)}
          >
            Add to Cart
          </button>
          <a
            href="https://wa.me/your-whatsapp-number"
            target="_blank"
            rel="noopener noreferrer"
            className="MSC-whatsapp-btn"
          >
            <img
              src="./WhatsAppWhite.png"
              alt="WhatsApp Icon"
              style={{ width: "25px", height: "25px" }}
            />
            WhatsApp Inquiries
          </a>
        </div>
      </section>
    </section>
  );
}
