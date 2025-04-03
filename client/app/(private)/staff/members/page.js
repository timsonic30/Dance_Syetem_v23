"use client";
import { useState, useEffect } from "react";
import Loading from "@/app/components/loading";
import "./memberList.css";

export default function MembListMembers() {
  const [memberInfo, setMemberInfo] = useState({
    usernames: [],
    emails: [],
    phones: [],
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [displayedMembers, setDisplayedMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editField, setEditField] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [email, setEmail] = useState(null);
  const [phone, setPhone] = useState(null);
  const [identify, setIdentify] = useState(null);

  // Fetch all the members at the start
  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const res = await fetch("http://localhost:3030/staff/members");
        if (res.ok) {
          const data = await res.json();
          const nameArr = data.result.map(
            (member) => member["username"] || "Not set"
          );
          const emailArr = data.result.map(
            (member) => member["email"] || "Not set"
          );
          const phoneArr = data.result.map(
            (member) => member["phone"] || "Not set"
          );

          setMemberInfo({
            usernames: nameArr,
            emails: emailArr,
            phones: phoneArr,
          });
          setLoading(false);
        }
      } catch (err) {
        console.error("Database Error:", err);
      }
    };

    fetchTeacher();
  }, []);

  // Find records whenever the value in the search bar changes
  useEffect(() => {
    const combinedMembers = memberInfo.usernames.map((username, index) => ({
      username,
      email: memberInfo.emails[index],
      phone: memberInfo.phones[index],
    }));

    if (!searchTerm.trim()) {
      // If search term is empty, show all members info
      setDisplayedMembers(combinedMembers);
    } else {
      // Filter members based on the search term
      const filtered = combinedMembers.filter((member) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          member.username?.toLowerCase().includes(searchLower) ||
          member.email?.toLowerCase().includes(searchLower) ||
          member.phone.includes(searchLower)
        );
      });
      setDisplayedMembers(filtered);
    }
  }, [searchTerm, memberInfo]);

  // Edit Part
  const handleEdit = (field, value) => {
    setIdentify(value);
    setEditField(field);
    setEditValue(field === "email" ? email : field === "phone" ? phone : "");
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    // console.log(editValue, editField);

    // Didn't call the backend if the input is empty
    if (!editValue) {
      setEditField(null);
      setIsModalOpen(false);
      setIdentify(null);
      return;
    }

    try {
      const res = await fetch("http://localhost:3030/staff/members/edit", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          editField,
          editValue,
          identify,
        }),
      });

      if (!res.ok) {
        throw new Error("Server Error");
      }

      const data = res.json();

      // Update local state immediately
      setMemberInfo((prev) => {
        const updatedEmails = [...prev.emails];
        const updatedPhones = [...prev.phones];

        let index;
        if (editField === "email") {
          index = prev.phones.indexOf(identify);
          if (index !== -1) {
            updatedEmails[index] = editValue; // Update email
          }
        } else if (editField === "phone") {
          index = prev.emails.indexOf(identify);
          if (index !== -1) {
            updatedPhones[index] = editValue; // Update phone
          }
        }

        return {
          ...prev,
          emails: updatedEmails,
          phones: updatedPhones,
        };
      });
    } catch (err) {
      console.log(err.message);
    }

    setIsModalOpen(false);
    setEditField(null);
    setEditValue("");
    setIdentify(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const renderFieldInput = () => {
    switch (editField) {
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
      case "phone":
        return (
          <input
            type="tel"
            value={editValue || ""}
            onChange={(e) => {
              // Remove all non-numeric characters
              const telephone = e.target.value.replace(/\D/g, "");
              // Only accept at most 8 numbers
              if (telephone.length <= 8) {
                setEditValue(telephone);
              }
            }}
            className="input input-bordered w-full"
            placeholder="Enter your phone number"
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="memberList-container">
          {/* Search Bar */}
          <label
            className="memberList-input memberList-gap-2 memberList-mt-3 memberList-w-full"
            id="memberList-searchBar"
          >
            <input
              type="text"
              className="memberList-grow"
              id="memberList-searchInput"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="memberList-icon"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </label>

          {/* Divider */}
          <div className="memberList-dividerContainer memberList-w-full memberList-flex-col">
            <div className="memberList-divider memberList-mt-1 memberList-mb-1"></div>
          </div>

          {/* Members List */}
          <div
            className="memberList-overflow-x-auto"
            id="memberList-tableContainer"
          >
            <table className="memberList-table" id="memberList-table">
              {/* Table Head */}
              <thead>
                <tr>
                  <th id="memberList-indexHeader"></th>
                  <th id="memberList-usernameHeader">Username</th>
                  <th id="memberList-emailHeader">Email</th>
                  <th id="memberList-phoneHeader">Phone</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody id="memberList-tableBody">
                {displayedMembers.length === 0 ? (
                  <tr id="memberList-noResultRow">
                    <td
                      colSpan="4"
                      className="memberList-noResult"
                      id="memberList-noResultMessage"
                    >
                      No result is found
                    </td>
                  </tr>
                ) : (
                  displayedMembers.map((member, index) => (
                    <tr
                      key={index}
                      className="memberList-row"
                      id={`memberList-row-${index}`}
                    >
                      <td className="memberList-cell">{index + 1}</td>
                      <td className="memberList-cell">{member.username}</td>
                      <td className="memberList-cell">
                        <span onClick={() => handleEdit("email", member.phone)}>
                          {member.email}
                        </span>
                      </td>
                      <td className="memberList-cell">
                        <span onClick={() => handleEdit("phone", member.email)}>
                          +852 {member.phone}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Modal for Editing */}
          {isModalOpen && (
            <div className="fixed inset-0 flex justify-center items-center bg-gray bg-opacity-50">
              <div className="bg-white p-6 rounded shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Edit {editField}</h3>
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
