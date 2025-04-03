"use client";

import { useEffect, useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Clock,
  CircleMinus,
} from "lucide-react";
import Loading from "@/app/components/loading";

export default function ClassManagement() {
  const [searchQuery, setSearchQuery] = useState("");

  const [showHistory, setShowHistory] = useState(false);

  const [showStudentLists, setShowStudentLists] = useState({});
  const [presentClassesList, setPresentclassList] = useState([]);
  const [oldclassList, setOldclassList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [attendanceUpdates, setAttendanceUpdates] = useState({});
  const [attendanceDropdown, setAttendanceDropdown] = useState(null);

  // Empty search function - you can connect to your database
  const handleSearch = (query) => {
    console.log("Searching for:", query);
    // Your database search logic will go here
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const getClassList = async () => {
      const res = await fetch("http://localhost:3030/teacher/getClassList", {
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
      // setPresentclassList(data.workshop);
      setPresentclassList(data.present);
      setOldclassList(data.old);
      setLoading(false);
    };
    getClassList();
  }, []);

  // useEffect(() => {
  //   // console.log("Updated classList:", presentClassesList);
  //   setLoading(false);
  // }, [presentClassesList, OldclassList]);

  const toggleAttendanceDropdown = (studentId) => {
    setAttendanceDropdown((prev) => (prev === studentId ? null : studentId));
  };

  const handleAttendanceChange = async (
    studentId,
    transactionId,
    attendance,
    newStatus
  ) => {
    // Update the local state for attendance
    const token = localStorage.getItem("token");
    setAttendanceUpdates((prev) => ({
      ...prev,
      [transactionId]: newStatus,
    }));
    console.log("I am here");
    console.log("Student ID:", studentId);
    console.log("Transaction ID:", transactionId);
    console.log("Current Attendance:", attendance);
    console.log("New Status:", newStatus);

    try {
      const res = await fetch(
        `http://localhost:3030/teacher/attendance-update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ transactionId, status: newStatus }),
        }
      );

      if (res.ok) window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // Fetch class list...
    // console.log("Fetched presentClassesList:", presentClassesList);
  }, [presentClassesList]);

  const toggleStudentList = (classId) => {
    setShowStudentLists((prev) => ({
      ...prev,
      [classId]: !prev[classId],
    }));
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="w-4/5">
          {/* Search Bar */}
          <div className="p-2 sticky top-0 z-10">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="input input-bordered w-full pr-10"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearch(e.target.value);
                }}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Current Class */}
          {!loading &&
            Object.keys(presentClassesList).length > 0 &&
            presentClassesList.map((classItem, index) => (
              <div
                key={classItem._id}
                className=" rounded-lg p-6 border-1 border-gray-400 mb-5"
              >
                <div className="p-4 bg-white">
                  <h2 className="text-lg font-medium text-gray-900 mb-2">
                    Workshop Class
                  </h2>
                  <div className="border-t border-black-200 pt-2">
                    <p className="text-sm">
                      Code:{" "}
                      <span className="text-gray-500">{classItem.code}</span>
                    </p>
                    <p className="text-sm">
                      {classItem.style} -{" "}
                      <span className="text-gray-500">
                        Level: {classItem.level}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Time: {classItem.startTime} - {classItem.endTime} Room:{" "}
                      {classItem.room.split(" ")[1]}
                    </p>
                    <p className="text-sm text-gray-500">
                      Date: {classItem.date.slice(0, 10)}
                    </p>
                  </div>
                </div>

                {/* Student List Toggle */}
                <div className="p-4 bg-gray-100 flex justify-center">
                  <button
                    className="flex items-center text-gray-700"
                    onClick={() => toggleStudentList(classItem._id)}
                  >
                    <p className="font-semibold">Student Name List</p>
                    {showStudentLists[classItem._id] ? (
                      <ChevronUp className="ml-1 w-4 h-4" />
                    ) : (
                      <ChevronDown className="ml-1 w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Student List */}
                {showStudentLists[classItem._id] && (
                  <div className="bg-white mt-3">
                    <div className="px-4 py-2 flex justify-between items-center border-t border-b border-gray-200 bg-gray-50">
                      <div className="text-sm font-medium w-3/7">Email</div>
                      <div className="text-sm font-medium w-3/7">Tel/Phone</div>
                      <div className="text-sm font-medium w-1/7">
                        Attendance
                      </div>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {classItem.students &&
                        classItem.students.map((student, index) => (
                          <div
                            key={index + 1}
                            className="px-4 py-3 flex justify-between items-center"
                          >
                            <div className="text-sm w-3/7">
                              {index + 1}. {student.email}
                            </div>
                            <div className="text-sm text-gray-800 w-3/7">
                              {student.phone}
                            </div>
                            <div className="flex justify-center w-1/7">
                              {/* Attendance Icon */}
                              {(student.attendance === "None" ||
                                !student.attendance) && (
                                <div
                                  className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer"
                                  onClick={() =>
                                    toggleAttendanceDropdown(student._id)
                                  }
                                >
                                  <CircleMinus className="w-4 h-4 text-gray-500" />
                                </div>
                              )}
                              {student.attendance === "Attended" && (
                                <div
                                  className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center cursor-pointer"
                                  onClick={() =>
                                    toggleAttendanceDropdown(student._id)
                                  }
                                >
                                  <Check className="w-4 h-4 text-green-500" />
                                </div>
                              )}
                              {student.attendance === "Absent" && (
                                <div
                                  className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center cursor-pointer"
                                  onClick={() =>
                                    toggleAttendanceDropdown(student._id)
                                  }
                                >
                                  <X className="w-4 h-4 text-red-500" />
                                </div>
                              )}
                              {student.attendance === "Sick Leave" && (
                                <div
                                  className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center cursor-pointer"
                                  onClick={() =>
                                    toggleAttendanceDropdown(student._id)
                                  }
                                >
                                  <Clock className="w-4 h-4 text-yellow-500" />
                                </div>
                              )}

                              {/* Attendance Dropdown */}
                              {attendanceDropdown === student._id && (
                                <select
                                  value={
                                    attendanceUpdates[student.transactionId] ||
                                    student.attendance
                                  }
                                  onChange={(e) =>
                                    handleAttendanceChange(
                                      student._id,
                                      student.transactionId,
                                      student.attendance,
                                      e.target.value
                                    )
                                  }
                                  className="border rounded p-1 ml-2"
                                >
                                  <option value="None">None</option>
                                  <option value="Attended">Attended</option>
                                  <option value="Absent">Absent</option>
                                  <option value="Sick Leave">Sick Leave</option>
                                </select>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

          {/* History Toggle */}
          <div className="p-4 bg-gray-100 mt-3 mb-3 border-t border-gray-200 flex justify-center">
            <button
              className="flex items-center text-gray-700"
              onClick={() => setShowHistory(!showHistory)}
            >
              <p className="font-semibold">History</p>

              {showHistory ? (
                <ChevronUp className="ml-1 w-4 h-4" />
              ) : (
                <ChevronDown className="ml-1 w-4 h-4" />
              )}
            </button>
          </div>

          {/* ------------------------------------------------------History Classes */}
          {showHistory &&
            !loading &&
            Object.keys(oldclassList).length > 0 &&
            oldclassList.map((classItem, index) => (
              <div
                key={classItem._id}
                className=" rounded-lg p-6 border-1 border-gray-400 mb-5"
              >
                <div className="p-4 bg-white">
                  <h2 className="text-lg font-medium text-gray-900 mb-2">
                    Workshop Class
                  </h2>
                  <div className="border-t border-black-200 pt-2">
                    <p className="text-sm">
                      Code:{" "}
                      <span className="text-gray-500">{classItem.code}</span>
                    </p>
                    <p className="text-sm">
                      {classItem.style} -{" "}
                      <span className="text-gray-500">
                        Level: {classItem.level}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Time: {classItem.startTime} - {classItem.endTime} Room:{" "}
                      {classItem.room.split(" ")[1]}
                    </p>
                    <p className="text-sm text-gray-500">
                      Date: {classItem.date.slice(0, 10)}
                    </p>
                  </div>
                </div>

                {/* Student List Toggle */}
                <div className="p-4 bg-gray-100 flex justify-center">
                  <button
                    className="flex items-center text-gray-700"
                    onClick={() => toggleStudentList(classItem._id)}
                  >
                    <p className="font-semibold">Student Name List</p>
                    {showStudentLists[classItem._id] ? (
                      <ChevronUp className="ml-1 w-4 h-4" />
                    ) : (
                      <ChevronDown className="ml-1 w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Student List */}
                {showStudentLists[classItem._id] && (
                  <div className="bg-white mt-3">
                    <div className="px-4 py-2 flex justify-between items-center border-t border-b border-gray-200 bg-gray-50">
                      <div className="text-sm font-medium w-3/7">Email</div>
                      <div className="text-sm font-medium w-3/7">Tel/Phone</div>
                      <div className="text-sm font-medium w-1/7">
                        Attendance
                      </div>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {classItem.students &&
                        classItem.students.map((student, index) => (
                          <div
                            key={index + 1}
                            className="px-4 py-3 flex justify-between items-center"
                          >
                            <div className="text-sm w-3/7">
                              {index + 1}. {student.email}
                            </div>
                            <div className="text-sm text-gray-500 w-3/7">
                              {student.phone}
                            </div>
                            <div className="flex justify-center w-1/7">
                              {(student.attendance === "None" ||
                                !student.attendance) && (
                                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                                  <CircleMinus className="w-4 h-4 text-gray-500" />
                                </div>
                              )}
                              {student.attendance === "Attended" && (
                                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                  <Check className="w-4 h-4 text-green-500" />
                                </div>
                              )}
                              {student.attendance === "Absent" && (
                                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                                  <X className="w-4 h-4 text-red-500" />
                                </div>
                              )}
                              {student.attendance === "Sick Leaves " && (
                                <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                                  <Clock className="w-4 h-4 text-yellow-500" />
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      )}
    </>
  );
}
