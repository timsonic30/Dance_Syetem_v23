"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useAuth } from "@/app/components/AuthContext";
import Loading from "@/app/components/loading";

export default function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const [userErr, setUserErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const [, setIsLogin] = useAuth();

  async function handleSubmit(e) {
    e.preventDefault(); // Prevent the form from submitting

    if (!user) {
      setUserErr("*Please enter your phone number or email address");
    } else {
      setUserErr("");
    }

    if (!password) {
      setPasswordErr("Please enter your password");
    } else {
      setPasswordErr("");
    }

    if (user && password) {
      setIsLoading(true);
      try {
        const res = await fetch("http://localhost:3030/login", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            userDetail: user,
            password,
          }),
        });

        console.log("Response status:", res.status); // Log response status

        console.log(res);
        if (res.ok) {
          console.log("I am here2");
          const data = await res.json();
          localStorage.setItem("token", data.token);
          localStorage.setItem("role", data.role);
          setIsLogin(true);
          const redirectPath = Cookies.get("redirectPath");
          Cookies.remove("redirectPath");
          if (redirectPath) {
            router.push(redirectPath);
          } else {
            if (data.role === "member") {
              setTimeout(() => {
                router.push("/member/information");
              }, 100);
            } else if (data.role === "teacher")
              router.push("/teacher/information");
            else if (data.role === "staff") router.push("/staff/information");
          }
        } else {
          setPasswordErr("Wrong Password");
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
  }

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    if (name === "user") {
      setUser(value); // Update the user state
    } else if (name === "password") {
      setPassword(value); // Update the password state
    }
  };

  const handleGoogleLogin = () => {
    console.log("I am doing google login");
    window.location.href = "http://localhost:3030/auth/auth";
  };

  return (
    <div>
      <div className="flex flex-col justify-center items-center">
        <div className="border-amber-600 border-1 border-solid p-4 w-1/2">
          <h1 className="text-left text-xl font-bold ml-4 mt-4 mb-4">
            Sign In
          </h1>

          {/* Facebook */}
          {/* <div className="mb-2">
            <button className="btn bg-white text-black border-[#e5e5e5] w-full">
              <svg
                aria-label="Facebook logo"
                width="16"
                height="16"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
              >
                <path
                  fill="blue"
                  d="M8 12h5V8c0-6 4-7 11-6v5c-4 0-5 0-5 3v2h5l-1 6h-4v12h-6V18H8z"
                ></path>
              </svg>
              Login with Facebook
            </button>
          </div> */}
          {/* Google */}
          <div className="mb-3">
            <button
              className="btn bg-white text-black border-[#e5e5e5] w-full"
              onClick={handleGoogleLogin}
            >
              <svg
                aria-label="Google logo"
                width="16"
                height="16"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <g>
                  <path d="m0 0H512V512H0" fill="#fff"></path>
                  <path
                    fill="#34a853"
                    d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                  ></path>
                  <path
                    fill="#4285f4"
                    d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
                  ></path>
                  <path
                    fill="#fbbc02"
                    d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
                  ></path>
                  <path
                    fill="#ea4335"
                    d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                  ></path>
                </g>
              </svg>
              Login with Google
            </button>
          </div>

          <div className="mb-3">
            <p className="text-center font-semibold">Or login by phone/email</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* User field */}
            <div>
              <input
                type="text"
                name="user"
                placeholder="Phone number/Email address"
                value={user}
                onChange={handleOnChange}
                className="input w-full mb-2"
                style={{ width: "100%" }}
              />
            </div>
            <div className="h-6 mb-1">
              {userErr && (
                <p className="text-red-500 text-xs ml-2 mb-2">{`${userErr}`}</p>
              )}
            </div>
            {/* Password field */}
            <label className="input w-full mb-2">
              <svg
                className="h-[1em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                  <circle
                    cx="16.5"
                    cy="7.5"
                    r=".5"
                    fill="currentColor"
                  ></circle>
                </g>
              </svg>
              <input
                type="password"
                name="password"
                value={password}
                onChange={handleOnChange}
                placeholder="Password"
                className="w-full"
              />
            </label>
            <div className="h-6 mb-1">
              {passwordErr && (
                <p className="text-red-500 text-xs ml-2">{passwordErr}</p>
              )}
            </div>
            <div>
              <button
                type="submit"
                className={`btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl bg-amber-500
                text-white w-full rounded-4xl`}
                disabled={isLoading}
              >
                {isLoading ? <Loading /> : "Login"}
              </button>
            </div>
          </form>
          <div className="flex justify-between text-sm text-gray-500 mt-6 mb-10">
            <Link href="/register">
              <p className="cursor-pointer">
                Don't have an account? Register now
              </p>
            </Link>
            <Link href="/forget-password">
              <p className="cursor-pointer">Forgot password?</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
