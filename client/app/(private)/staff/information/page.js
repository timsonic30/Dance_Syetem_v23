"use client";
import { useState, useEffect } from "react";
import Loading from "@/app/components/loading";

export default function Profile() {
  const [username, setUserName] = useState(null);
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [email, setEmail] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editField, setEditField] = useState(null);
  const [editValue, setEditValue] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const handleEdit = (field) => {
    setEditField(field);
    setEditValue(
      field === "username" ? username : field === "email" ? email : ""
    );
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");

    console.log(editValue, editField);
    try {
      const res = await fetch("http://localhost:3030/staff/profit/edit", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          editField,
          editValue,
        }),
      });

      if (!res.ok) {
        throw new Error("Server Error");
      }

      editField === "username"
        ? setUserName(editValue)
        : editField === "email"
        ? setEmail(editValue)
        : "";
    } catch (err) {
      console.log(err.message);
    }

    setIsModalOpen(false);
    setEditField(null);
    setEditValue("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const renderFieldInput = () => {
    switch (editField) {
      case "username":
        return (
          <input
            type="text"
            value={editValue || ""}
            onChange={(e) => setEditValue(e.target.value)}
            className="input input-bordered w-full"
            placeholder="Enter your username"
          />
        );
      case "email":
        return (
          <input
            type="email"
            value={editValue || ""}
            onChange={(e) => setEditValue(e.target.value)}
            className="input input-bordered w-full"
            placeholder="Enter your email"
          />
        );
      case "picture":
        return (
          <input
            type="picture"
            value={editValue || ""}
            onChange={(e) => setEditValue(e.target.value)}
            className="input input-bordered w-full"
            placeholder="Enter the URL"
          />
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    async function fetchUser() {
      try {
        const res = await fetch("http://localhost:3030/staff/profile", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch");
        }

        const data = await res.json();
        setUserName(data.username);
        setEmail(data.email);
        setIsLoading(false);
      } catch (err) {
        console.log(err.message);
      }
    }

    // dummy code
    async function regUser() {
      try {
        const res = await fetch("http://localhost:3030/staff/reg", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            username: "admin",
            email: "admin@gmail.com",
            password: "Ab12",
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to fetch");
        }

        const data = await res.json();
        console.log("Staff register OK");
      } catch (err) {
        console.log(err.message);
      }
    }

    // regUser();
    fetchUser();
  }, []);

  const handleChangePic = async () => {
    console.log("I am here");
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="w-full max-w-2xl mx-auto p-4 space-y-4 border-amber-2">
          {/* Basic Information */}
          <div className="bg-white rounded-lg p-6 border-2 border-gray-400">
            <h2 className="text-xl font-semibold mb-6">Basic Information</h2>
            <div className="flex items-center justify-center mb-4 p-4 border-b-2 border-gray-300">
              <div className="avatar">
                <div
                  className="w-24 rounded-full hover:cursor-pointer"
                  onClick={() => handleEdit("picture")}
                >
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
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg p-6 border-2 border-gray-400">
            <h2 className="text-xl font-semibold mb-6 border-b-2 border-gray-300 pb-2">
              Contact Information
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
            </div>
          </div>

          {/* Modal for Editing */}
          {isModalOpen && (
            <div className="fixed inset-0 flex justify-center items-center bg-gray bg-opacity-50">
              <div className="bg-white p-6 rounded shadow-lg">
                <h3 className="text-lg font-semibold mb-4">
                  Edit {editField === "dateOfBirth" ? "Birthday" : editField}
                </h3>
                {renderFieldInput()}
                <div className="flex justify-end mt-4">
                  <button
                    className="btn btn-sm bg-gray-500 hover:bg-gray-600 text-white rounded mr-2"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-sm bg-blue-500 hover:bg-blue-600 text-white rounded"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
