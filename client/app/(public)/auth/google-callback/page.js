"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/components/AuthContext";
import Loading from "@/app/components/loading";

export default function callback() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const role = urlParams.get("role");
    const status = urlParams.get("status");

    if (status === "login") {
      setIsLogin(true);
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      router.push("/member/information");
    } else {
      router.push("/login");
    }

    console.log(token, role, status);
  }, []);
  return (
    <div className="flex justify-center item-center h-full">
      <Loading />
    </div>
  );
}
