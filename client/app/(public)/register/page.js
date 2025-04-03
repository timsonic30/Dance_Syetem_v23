"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import Loading from "@/app/components/loading";

export default function Register() {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPW, setRepeatPW] = useState("");

  const [phoneErr, setPhoneErr] = useState(null);
  const [emailErr, setEmailErr] = useState(null);
  const [passwordErr, setPasswordErr] = useState(null);
  const [repeatPWErr, setRepeatPWErr] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
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
      setIsLoading(true);
      try {
        const res = await fetch("http://localhost:3030/register", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            phone,
            email,
            password,
          }),
        });

        const data = await res.json();
        console.log(res);
        console.log();

        setIsLoading(false);
        if (!res.ok) {
          if (data.errors) {
            // Handle the error messages returned by the server
            console.log("Error array:", data.errors);
            for (let err of data.errors) {
              if (err.includes("Duplicated phone number")) {
                setPhoneErr(
                  "Duplicated phone number. Please choose a different number."
                );
              }
              if (err.includes("Duplicated email")) {
                setEmailErr(
                  "Duplicated email address. Please provide a new one."
                );
              }
            }
          }
        } else {
          console.log("Registration successful:", data.message);
          setIsSubmit(true);
          // setShowAlert(true);
          setTimeout(() => {
            router.push("/login");
          }, 1500);
        }
      } catch (err) {
        setIsLoading(false);
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

  const handleGoogleSignUp = () => {
    window.location.href = "http://localhost:3030/auth/auth";
  };

  // Function to handle alert confirmation
  const [showAlert, setShowAlert] = useState(false); // Alert state
  const handleAlertConfirm = () => {
    setShowAlert(false); // Hide alert
    router.push("/login"); // Redirect after confirmation
  };

  return (
    <div>
      <div className="flex flex-col justify-center items-center">
        <div className="border-amber-600 border-1 border-solid p-4 w-1/2 max-w-md">
          <h1 className="text-left text-xl font-bold ml-4 mt-4 mb-4">
            Become a member now
          </h1>

          {/* Alert component */}
          {/* {showAlert && (
            <div role="alert" className="alert alert-success">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                Your registration was successful! Please verify your email.
              </span>
              <button onClick={handleAlertConfirm} className="btn">
                OK
              </button>
            </div>
          )} */}

          {/* Facebook -> not enough time*/}
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
              Log in with Facebook
            </button>
          </div> */}
          {/* Google */}
          <div className="mb-3">
            <button
              className="btn bg-white text-black border-[#e5e5e5] w-full"
              onClick={handleGoogleSignUp}
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
              Sign Up with Google
            </button>
          </div>

          <div className="mb-3">
            <p className="text-center font-semibold">
              Or sign up by phone/email
            </p>
          </div>

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
            {/* <div className="h-6 mb-1">
              {emailErr && (
                <p className="text-red-500 text-xs ml-2 mb-2">{`${emailErr}`}</p>
              )}
            </div> */}
            {/* version 2 */}
            {/* <div className="h-6 mb-1">
              {emailErr ? (
                <div className="flex justify-between">
                  <p className="text-red-500 text-xs ml-2 mb-2">{`${emailErr}`}</p>
                  <X className="h-4 w-4 text-red-500" />
                </div>
              ) : (
                <div className="flex justify-end">
                  <Check className="h-4 w-4 text-green-500" />
                </div>
              )}
            </div> */}
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

            {/* Phone field */}
            <div className="mb-2">
              <div className="flex">
                <div className="input flex items-center justify-center w-20 bg-white border-r-0 rounded-r-none">
                  <span className="text-gray-500">+852</span>
                </div>
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone number"
                  value={phone}
                  onChange={handleOnChange}
                  className="input w-full rounded-l-none"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="h-6 mb-1">
              {phoneErr !== null &&
                (phoneErr ? (
                  <div className="flex justify-between">
                    <p className="text-red-500 text-xs ml-2 mb-2">{`${phoneErr}`}</p>
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
                placeholder="Confirm password"
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
                className={`btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl  ${
                  isLoading
                    ? "bg-gray-400"
                    : isSubmit
                    ? "bg-amber-500"
                    : "bg-amber-500"
                } text-white w-full rounded-4xl`}
                disabled={isLoading || isSubmit} // When it is loading or the form is being submitted, user cannot click the button
              >
                {isLoading ? (
                  <Loading />
                ) : isSubmit ? (
                  <Check className="h-6 w-6 text-white transition-opacity duration-300" />
                ) : (
                  "Create an account"
                )}
              </button>
            </div>
          </form>
          <div className="flex justify-center text-sm text-gray-500 mt-6 text-center">
            <p>
              Creating an account means you agree to XtraLab's{" "}
              <span className="underline">terms of use</span>
              <span> and </span>
              <span className="underline">privacy policy</span>
            </p>
          </div>
          <div className="flex justify-center text-sm text-gray-500 mt-5 text-center">
            <p className="cursor-pointer">
              <a href="/login">Already have an account? Log in here</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
