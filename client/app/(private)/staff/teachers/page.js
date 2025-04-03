"use client";

import { useState, useEffect } from "react";
import Loading from "@/app/components/loading";
import "./TeacherListStaff.css";

export default function Teachers() {
  const [teacherInfo, setTeacherInfo] = useState({
    nicknames: [],
    emails: [],
    phones: [],
    styles: [],
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [displayedTeachers, setDisplayedTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all teachers at the start
  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const res = await fetch("http://localhost:3030/staff/teachers");
        if (res.ok) {
          const data = await res.json();
          const nameArr = data.result.map(
            (teacher) => teacher["nickname"] || "Not set"
          );
          const emailArr = data.result.map(
            (teacher) => teacher["email"] || "Not set"
          );
          const phoneArr = data.result.map(
            (teacher) => teacher["phone"] || "Not set"
          );
          const styleArr = data.result.map(
            (teacher) => teacher["style"] || "Not set"
          );

          setTeacherInfo({
            nicknames: nameArr,
            emails: emailArr,
            phones: phoneArr,
            styles: styleArr,
          });
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching teachers:", err);
      }
    };

    fetchTeacher();
  }, []);

  // Update displayed teachers based on the search term
  useEffect(() => {
    const combinedTeachers = teacherInfo.nicknames.map((nickname, index) => ({
      nickname,
      email: teacherInfo.emails[index],
      phone: teacherInfo.phones[index],
      style: teacherInfo.styles[index],
    }));

    if (!searchTerm.trim()) {
      // Show all teachers if no search term
      setDisplayedTeachers(combinedTeachers);
    } else {
      // Filter based on the search term
      const filtered = combinedTeachers.filter((teacher) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          teacher.nickname?.toLowerCase().includes(searchLower) ||
          teacher.email?.toLowerCase().includes(searchLower) ||
          teacher.phone.includes(searchLower) ||
          teacher.style.toLowerCase().includes(searchLower)
        );
      });
      setDisplayedTeachers(filtered);
    }
  }, [searchTerm, teacherInfo]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="TeachList-container" id="TeachList-container">
          {/* Search Bar */}
          <label className="TeachList-input" id="TeachList-searchBar">
            <input
              type="text"
              className="TeachList-inputField"
              id="TeachList-searchInput"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="TeachList-icon"
              id="TeachList-icon"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </label>

          {/* Divider */}
          {/* <div className="TeachList-dividerContainer" id="TeachList-dividerContainer">
            <div className="TeachList-divider" id="TeachList-divider"></div>
          </div> */}

          {/* List of Teachers */}
          <div
            className="TeachList-tableContainer"
            id="TeachList-tableContainer"
          >
            <table className="TeachList-table" id="TeachList-table">
              {/* Table Head */}
              <thead
                className="TeachList-tableHeader"
                id="TeachList-tableHeader"
              >
                <tr className="TeachList-headerRow" id="TeachList-headerRow">
                  <th id="TeachList-indexHeader">S.No.</th>
                  <th id="TeachList-nameHeader">Name</th>
                  <th id="TeachList-emailHeader">Email</th>
                  <th id="TeachList-phoneHeader">Phone</th>
                  <th id="TeachList-styleHeader">Style</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="TeachList-tableBody" id="TeachList-tableBody">
                {displayedTeachers.length === 0 ? (
                  <tr
                    className="TeachList-noResultRow"
                    id="TeachList-noResultRow"
                  >
                    <td colSpan="5" id="TeachList-noResultMessage">
                      No result is found
                    </td>
                  </tr>
                ) : (
                  displayedTeachers.map((teacher, index) => (
                    <tr
                      key={index}
                      className="TeachList-row"
                      id={`TeachList-row-${index}`}
                    >
                      <td
                        className="TeachList-cell"
                        id={`TeachList-index-${index}`}
                      >
                        {index + 1}
                      </td>
                      <td
                        className="TeachList-cell"
                        id={`TeachList-nickname-${index}`}
                      >
                        {teacher.nickname}
                      </td>
                      <td
                        className="TeachList-cell"
                        id={`TeachList-email-${index}`}
                      >
                        {teacher.email}
                      </td>
                      <td
                        className="TeachList-cell"
                        id={`TeachList-phone-${index}`}
                      >
                        +852 {teacher.phone}
                      </td>
                      <td
                        className="TeachList-cell"
                        id={`TeachList-style-${index}`}
                      >
                        {teacher.style}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
