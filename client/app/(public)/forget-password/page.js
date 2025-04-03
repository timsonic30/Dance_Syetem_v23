"use client";
import { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { useRouter } from "next/navigation";
export default function ForgetPassword() {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPW, setRepeatPW] = useState("");

  const [phoneErr, setPhoneErr] = useState(null);
  const [emailErr, setEmailErr] = useState(null);
  const [passwordErr, setPasswordErr] = useState(null);
  const [repeatPWErr, setRepeatPWErr] = useState(null);

  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault(); // Prevent the form from submitting

    setPhoneErr(null);
    setEmailErr(null);
    setPasswordErr(null);
    setRepeatPWErr(null);

    if (!phone) {
      setPhoneErr("Please enter a phone number");
    } else if (
      phone.slice(0, 3) === "999" ||
      phone[0] === "0" ||
      phone[0] === "1" ||
      phone.length !== 8
    ) {
      setPhoneErr("Invalid phone number format");
    } else {
      setPhoneErr("");
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
      setEmailErr("Please enter an email");
    } else if (!emailRegex.test(email)) {
      setEmailErr("Invalid email format");
    } else {
      setEmailErr("");
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{4,}$/; // 4-digit for testing
    if (!password) {
      setPasswordErr("Please enter a password");
    } else if (!passwordRegex.test(password)) {
      setPasswordErr(
        "Password must be at least 12 characters long and contain one number, one lowercase letter, and one uppercase letter"
      );
    } else if (!repeatPW) {
      setPasswordErr("");
      setRepeatPWErr("Please enter the password");
    } else if (password !== repeatPW) {
      setPasswordErr("");
      setRepeatPWErr("The two passwords do not match");
    } else {
      setPasswordErr("");
      setRepeatPWErr("");
    }

    // Send the registration details to the backend
    if (!phoneErr && !emailErr && !passwordErr && !repeatPWErr) {
      try {
        const res = await fetch("http://localhost:3030/reset-password", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        const data = await res.json();
        console.log(res);

        if (!res.ok) {
          console.log("Fail");
        } else {
          console.log("Reset successfully:", data.message);
          router.push("/login");
        }
      } catch (err) {
        console.log(err.message);
      }
    }
  }

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const telephone = value.replace(/\D/g, "");
      setPhone(telephone);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "repeated-password") {
      setRepeatPW(value);
    }
  };

  return (
    <>
      <div>
        <div className="flex flex-col justify-center items-center">
          <div className="border-amber-600 border-1 border-solid p-4 w-1/2 max-w-md">
            <h1 className="text-left text-xl font-bold ml-4 mt-4 mb-4">
              Reset Password
            </h1>

            <form onSubmit={handleSubmit}>
              {/* Email field */}
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
                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </g>
                </svg>
                <input
                  type="text"
                  name="email"
                  value={email}
                  onChange={handleOnChange}
                  placeholder="Email"
                  className="w-full"
                />
              </label>

              <div className="h-6 mb-1">
                {emailErr !== null &&
                  (emailErr ? (
                    <div className="flex justify-between">
                      <p className="text-red-500 text-xs ml-2 mb-2">{`${emailErr}`}</p>
                      <X className="h-4 w-4 text-red-500" />
                    </div>
                  ) : (
                    <div className="flex justify-end">
                      <Check className="h-4 w-4 text-green-500" />
                    </div>
                  ))}
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
              {/* <div className="h-6 mb-1">
                {passwordErr && (
                  <p className="text-red-500 text-xs ml-2">{passwordErr}</p>
                )}
              </div> */}
              <div className="h-6 mb-1">
                {passwordErr !== null &&
                  (passwordErr ? (
                    <div className="flex justify-between">
                      <p className="text-red-500 text-xs ml-2 mb-2">{`${passwordErr}`}</p>
                      <X className="h-4 w-4 text-red-500" />
                    </div>
                  ) : (
                    <div className="flex justify-end">
                      <Check className="h-4 w-4 text-green-500" />
                    </div>
                  ))}
              </div>
              {/* Repeated Password field */}
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
                  name="repeated-password"
                  value={repeatPW}
                  onChange={handleOnChange}
                  placeholder="Re-enter Password"
                  className="w-full"
                />
              </label>
              {/* <div className="h-6 mb-1">
                {repeatPWErr && (
                  <p className="text-red-500 text-xs ml-2">{repeatPWErr}</p>
                )}
              </div> */}
              <div className="h-6 mb-1">
                {repeatPWErr !== null &&
                  (repeatPWErr ? (
                    <div className="flex justify-between">
                      <p className="text-red-500 text-xs ml-2 mb-2">{`${repeatPWErr}`}</p>
                      <X className="h-4 w-4 text-red-500" />
                    </div>
                  ) : (
                    <div className="flex justify-end">
                      <Check className="h-4 w-4 text-green-500" />
                    </div>
                  ))}
              </div>

              <div>
                <button
                  type="submit"
                  className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl bg-amber-500 text-white w-full rounded-4xl"
                >
                  Reset
                </button>
              </div>
            </form>
            <div className="flex justify-center text-sm text-gray-500 mt-5 text-center">
              <p className="cursor-pointer">
                <a href="/login">
                  Remember your password? Return to the login page
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
