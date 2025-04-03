"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import "./memberScore.css";

export default function MemberScore() {
  // Slides data for the slideshow
  const slides = [
    {
      id: 1,
      image: "/MemberRedemptionBanner01.png",
    },
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

  // State management
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

        // Filter products with negative points
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

        // Update state with filtered products
        setPayProductArray(negativePointProducts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchPayProductData();
  }, []);

  // Update the handleClick function to include a check for stock
  const handleClick = (id) => {
    const selectedProduct = payProductArray.find((product) => product.id === id);
    if (selectedProduct && selectedProduct.stock > 0) {
      setActiveBoxId(id); // Only allow clicks when stock is greater than 0
    }
  };

  // Display loading spinner if fetching data
  if (loading) {
    return <p>Loading products...</p>;
  }

  return (
    <section className="MSC-memberScoreChange" id="MSC-memberScoreChange">
      {/* Slideshow */}
      <div className="MSC-slideshow-container" id="MSC-slideshow-container">
        <div className="MSC-slide" id="MSC-slide">
          <img src={slides[currentIndex].image} alt={`Slide ${currentIndex + 1}`} />
          {slides[currentIndex].caption && (
            <div className="MSC-caption" id="MSC-caption">
              {slides[currentIndex].caption}
            </div>
          )}
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

      {/* Header Section */}
      <div className="MSC-box-container" id="MSC-box-container">
        {/* Product List Section */}
        <div className="AllmemberScoreChangeP" id="AllmemberScoreChangeP">
          {payProductArray.map((product) => (
            <div
              key={product.id}
              className={`MSC-boxPrice ${product.stock <= 0 ? "disabled" : ""} ${activeBoxId === product.id ? "active" : ""}`}
              onClick={() => handleClick(product.id)}
            >
              <h1>{product.name}</h1>
              <img
                src={product.img} // Use the product's image URL here
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
          <button className="MSC-AddToCart-btn">Add to Cart</button>
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
