"use client";
import { useState, useEffect } from "react";
import Loading from "@/app/components/loading";

export default function Classes() {
  const [username, setUserName] = useState(null);
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState(null);
  const [phone, setPhone] = useState(null);
  const [point, setPoint] = useState(null);

  // dummy code
  const handleEdit = () => {
    console.log("Test");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    async function fetchUser() {
      try {
        const res = await fetch("http://localhost:3030/member/classes", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            objectId: "67d1257e4d1fcb94294fb6af",
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to fetch");
        }

        const data = await res.json();
      } catch (err) {
        console.log(err.message);
      }
    }

    fetchUser();
  }, []);

  return (
    <>
      <div className="w-full max-w-2xl mx-auto p-4 space-y-4 border-amber-2">
        {/* Regular Classes */}
        <div className="bg-white rounded-lg p-6 border-2 border-gray-400">
          <h2 className="text-xl font-semibold mb-6">Regular Class</h2>
          <div className="flex items-center justify-center mb-4 p-4 border-b-2 border-gray-300">
            <div className="avatar">
              <div className="w-24 rounded-full">
                <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex items-center border-b-2 border-gray-300 pb-4 pl-3 pr-3">
              <span className="w-28">Username:</span>
              <span className="flex-grow px-4">
                {username ? username : "Not yet set"}
              </span>
              <button
                className="btn btn-sm normal-case bg-gray-500 hover:bg-gray-600 text-white border-none rounded-xl"
                onClick={() => handleEdit("username")}
              >
                Edit
              </button>
            </div>

            <div className="flex items-center border-b-2 border-gray-300 pb-4 pl-3 pr-3">
              <span className="w-28">Date of Birth:</span>
              <span className="flex-grow px-4">
                {dateOfBirth ? dateOfBirth : "Not yet set"}
              </span>
              <button
                className="btn btn-sm normal-case bg-gray-500 hover:bg-gray-600 text-white border-none rounded-xl"
                onClick={() => handleEdit("dateOfBirth")}
              >
                Edit
              </button>
            </div>

            <div className="flex items-center pb-2 pl-3 pr-3">
              <span className="w-28">Gender:</span>
              <span className="flex-grow px-4">
                {gender ? gender : "Not yet set"}
              </span>
              <button
                className="btn btn-sm normal-case bg-gray-500 hover:bg-gray-600 text-white border-none rounded-xl"
                onClick={() => handleEdit("gender")}
              >
                Edit
              </button>
            </div>
          </div>
        </div>

        {/* Pop Up Class */}
        <div className="bg-white rounded-lg p-6 border-2 border-gray-400">
          <h2 className="text-xl font-semibold mb-6 border-b-2 border-gray-300 pb-2">
            Pop Up Class
          </h2>
          <div className="space-y-6">
            <div className="flex items-center border-b-2 border-gray-300 pb-4 pl-3 pr-3">
              <span className="w-28">Email:</span>
              <span className="flex-grow px-4">
                {email ? email : "Not yet set"}
              </span>
              <button
                className="btn btn-sm normal-case bg-gray-500 hover:bg-gray-600 text-white border-none rounded-xl"
                onClick={() => handleEdit("email")}
              >
                Edit
              </button>
            </div>

            <div className="flex items-center pb-2 pl-3 pr-3">
              <span className="w-28">Phone:</span>
              <span className="flex-grow px-4">
                {phone ? phone : "Not yet set"}
              </span>
              <button
                className="btn btn-sm normal-case bg-gray-500 hover:bg-gray-600 text-white border-none rounded-xl"
                onClick={() => handleEdit("phone")}
              >
                Edit
              </button>
            </div>
          </div>
        </div>

        {/* Workshop Class */}
        <div className="bg-white rounded-lg p-6 border-2 border-gray-400">
          <h2 className="text-xl font-semibold mb-6 border-b-2 border-gray-300 pb-2">
            Workshop Class
          </h2>
          <div className="space-y-6">
            <div className="flex items-center border-b-2 border-gray-300 pb-4 pl-3 pr-3">
              <span className="w-28">Email:</span>
              <span className="flex-grow px-4">
                {email ? email : "Not yet set"}
              </span>
              <button
                className="btn btn-sm normal-case bg-gray-500 hover:bg-gray-600 text-white border-none rounded-xl"
                onClick={() => handleEdit("email")}
              >
                Edit
              </button>
            </div>

            <div className="flex items-center pb-2 pl-3 pr-3">
              <span className="w-28">Phone:</span>
              <span className="flex-grow px-4">
                {phone ? phone : "Not yet set"}
              </span>
              <button
                className="btn btn-sm normal-case bg-gray-500 hover:bg-gray-600 text-white border-none rounded-xl"
                onClick={() => handleEdit("phone")}
              >
                Edit
              </button>
            </div>
          </div>
        </div>

        {/* Showcase Class */}
        <div className="bg-white rounded-lg p-6 border-2 border-gray-400">
          <h2 className="text-xl font-semibold mb-6 border-b-2 border-gray-300 pb-2">
            Workshop Class
          </h2>
          <div className="space-y-6">
            <div className="flex items-center border-b-2 border-gray-300 pb-4 pl-3 pr-3">
              <span className="w-28">Email:</span>
              <span className="flex-grow px-4">
                {email ? email : "Not yet set"}
              </span>
              <button
                className="btn btn-sm normal-case bg-gray-500 hover:bg-gray-600 text-white border-none rounded-xl"
                onClick={() => handleEdit("email")}
              >
                Edit
              </button>
            </div>

            <div className="flex items-center pb-2 pl-3 pr-3">
              <span className="w-28">Phone:</span>
              <span className="flex-grow px-4">
                {phone ? phone : "Not yet set"}
              </span>
              <button
                className="btn btn-sm normal-case bg-gray-500 hover:bg-gray-600 text-white border-none rounded-xl"
                onClick={() => handleEdit("phone")}
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
