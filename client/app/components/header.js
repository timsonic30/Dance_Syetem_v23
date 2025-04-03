"use client";

import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, ShoppingCart, Menu, X, UserRound, Bug } from "lucide-react";
import { useAuth } from "@/app/components/AuthContext";
import { useRouter } from "next/navigation";
import Registration from "@/app/components/registration";
import Login from "@/app/components/login";

export default function XtraLabHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isLogin, setIsLogin] = useAuth();
  const [role, setRole] = useState(null);
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
          console.log("購物車內容：", data.length);
          setCartCount(data.length);
        })
        .catch((error) => {
          console.error("錯誤：", error);
          // 處理錯誤（如顯示錯誤訊息）
        });
    }
  };

  const handleLogout = () => {
    // Remove the identity
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    // Remove all the items in the shopping cart
    Cookies.remove("session_id");
    setCartCount(0);
    setIsLogin(false);
    router.push("/");
  };

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    isLogin ? setRole(userRole) : setRole(null);
    console.log(userRole);
  }, [isLogin]);

  useEffect(() => {
    checkShoppingCart();
    const handleHeaderShoppingCartRefresh = (event) => {
      checkShoppingCart();
    };
    window.addEventListener("userAddedCart", handleHeaderShoppingCartRefresh);
  }, []);

  // For pop-up window
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const openModal = () => setIsModalOpen(true);
  // const closeModal = () => setIsModalOpen(false);

  const [modalType, setModalType] = useState(null);
  const openModal = (type) => setModalType(type);
  const closeModal = () => setModalType(null);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FF9933] text-white py-4 px-4 shadow-[0px_10px_10px_rgba(128,128,128,0.5)]  font-[Geneva, Verdana, Tahoma, system-ui, sans-serif] ">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold ">
            XtraLab.
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/about" className="font-bold hover:text-black">
            About US
          </Link>
          <Link href="/tutor" className="font-bold hover:text-black">
            Tutor
          </Link>
          <Link href="/dance-path" className="font-bold hover:text-black">
            Dance Path
          </Link>
          <Link href="/member-score" className="font-bold hover:text-black">
            Member Score
          </Link>
          <Link
            href="/danceClass/roomRental"
            className="font-bold hover:text-black"
          >
            Rent
          </Link>
        </nav>

        {/* Icons and buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {isLogin && (
            <Link href={`/${role}/information`} aria-label="User">
              <UserRound className="h-6 w-6 hover:fill-current" />
            </Link>
          )}
          <Link href="/favorites" aria-label="Favorites">
            <Heart className="h-6 w-6 hover:fill-current" />
          </Link>

          <Bug
            className="h-6 w-6 hover:fill-current"
            onClick={() => openModal("login")}
          />

          <div className="relative inline-block">
            <Link href="/shoppingcart" aria-label="Shopping Cart">
              <ShoppingCart className="h-6 w-6 hover:fill-current" />
            </Link>
            {cartCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </div>
            )}
          </div>

          {!isLogin ? (
            <div className="space-x-3">
              <button
                variant="outline"
                className="btn btn-lg bg-white text-[#FF9933] hover:bg-black hover:text-white hover:cursor-pointer border-none transition-all duration-200 ease-in-out hover:shadow-[0_0_0_1px_white]"
                onClick={() => openModal("login")}
              >
                {/* <Link href="/login" aria-label="Login">
                  Login
                </Link> */}
                Login
              </button>
              <button
                className="btn btn-lg bg-black text-white hover:bg-gray-800 border-none hover:cursor-pointer hover:bg-white hover:text-black hover:shadow-[0_0_0_1px_black]"
                onClick={() => openModal("registration")}
              >
                {/* <Link href="/register" aria-label="Register">
                  Sign Up
                </Link> */}
                Sign Up
              </button>
            </div>
          ) : (
            <button
              variant="outline"
              className="btn btn-lg bg-white text-[#FF9933] hover:bg-black hover:text-white hover:cursor-pointer border-none transition-all duration-200 ease-in-out hover:shadow-[0_0_0_1px_white]"
              onClick={handleLogout}
            >
              <Link href="/" aria-label="Logout">
                Logout
              </Link>
            </button>
          )}
        </div>

        {modalType && (
          <div
            className="fixed inset-0 bg-neutral-500/30 flex justify-center items-center text-black"
            onClick={handleOverlayClick}
          >
            <div className="bg-white relative rounded-xl max-w-md">
              <X
                className="absolute mt-5 right-8 cursor-pointer border-1"
                onClick={closeModal}
              />
              {modalType === "login" ? (
                <Login value={setModalType} />
              ) : (
                <Registration value={setModalType} />
              )}
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-[#FF9933] z-50 md:hidden">
            <div className="flex flex-col p-4 space-y-3">
              <Link
                href="/about"
                className="hover:bg-[#e68a2e] py-2 px-3 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                About US
              </Link>
              <Link
                href="/tutor"
                className="hover:bg-[#e68a2e] py-2 px-3 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Tutor
              </Link>
              <Link
                href="/dance-path"
                className="hover:bg-[#e68a2e] py-2 px-3 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Dance Path
              </Link>
              <Link
                href="/member-score"
                className="hover:bg-[#e68a2e] py-2 px-3 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Member Score
              </Link>
              <Link
                href="/danceClass/roomRental"
                className="hover:bg-[#e68a2e] py-2 px-3 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Rent
              </Link>
              <div className="flex items-center space-x-4 pt-2">
                <Link href="/favorites" aria-label="Favorites">
                  <Heart className="h-6 w-6" />
                </Link>
                <Link href="/cart" aria-label="Shopping Cart">
                  <ShoppingCart className="h-6 w-6" />
                </Link>
              </div>
              <div className="flex flex-col space-y-2 pt-2">
                <button
                  variant="outline"
                  className="btn btn-lg bg-white text-[#FF9933] hover:bg-black hover:text-white hover:cursor-pointer border-none transition-all duration-200 ease-in-out hover:shadow-[0_0_0_1px_white]"
                >
                  <Link href="/login" aria-label="Login">
                    Login
                  </Link>
                </button>

                <button className="btn btn-lg bg-black text-white hover:bg-gray-800 border-none hover:cursor-pointer hover:bg-white hover:text-black hover:shadow-[0_0_0_1px_black]">
                  <Link href="/register" aria-label="Register">
                    Sign Up
                  </Link>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
