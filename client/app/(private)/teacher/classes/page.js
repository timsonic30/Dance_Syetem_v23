"use client";
import { useState, useEffect } from "react";
import {
  X,
  Search,
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
} from "lucide-react";
import Loading from "@/app/components/loading";

export default function Classes() {
  const [showHistory, setShowHistory] = useState(false);

  const [presentClassesList, setPresentclassList] = useState([]);
  const [oldclassList, setOldclassList] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getBookingClassList = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(
          "http://localhost:3030/teacher/getBookingClassList",
          {
            method: "POST",
            headers: {
              "Content-type": "application/json",
              authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error("Failed to fetch");
        }

        setPresentclassList(data.present);
        setOldclassList(data.old);
      } catch (err) {
        console.log(err.message);
      } finally {
        // It ensures that all the data is received completed before showing the records
        setIsLoading(false);
      }
    };
    getBookingClassList();
  }, []);

  return (
    <>
      {isLoading ? (
        // Center the loading icon both vertically and horizontally
        <div className="flex justify-center items-center h-screen">
          <Loading />
        </div>
      ) : (
        <div className="w-4/5">
          {/* Current Classes */}
          {presentClassesList.length > 0 ? (
            presentClassesList.map((classItem) => (
              <div
                key={classItem._id}
                className="rounded-lg p-6 border-1 border-gray-400 mb-5 mt-2"
              >
                <div className="p-1 bg-white">
                  <h2 className="text-lg font-medium text-gray-900 mb-2">
                    {classItem.type}
                  </h2>
                  <div className="border-t border-black-200 pt-4" />
                </div>
                <div className="border-b border-gray-200 py-4 last:border-b-0">
                  <div className="flex item-start">
                    <div className="box-2 flex mr-50 justify-center items-center">
                      <img
                        className="w-36 h-36 object-cover rounded-md"
                        src={classItem.img}
                        alt="Class Image"
                      />
                    </div>
                    <div className="box-1 flex-grow ml-2">
                      <p className="text-base">
                        Code:{" "}
                        <span className="text-gray-500 font-medium">
                          {classItem.code}
                        </span>
                      </p>
                      <p className="text-base">
                        <span className="text-gray-500">{classItem.style}</span>
                      </p>
                      <p className="text-base">
                        <span className="text-gray-500">
                          Level: {classItem.level || "Not Specified"}
                        </span>
                      </p>
                      <p className="text-base text-gray-500">
                        Date: {classItem.date.slice(0, 10)}
                      </p>
                      <p className="text-base text-gray-500">
                        Time: {classItem.startTime} - {classItem.endTime}
                      </p>
                      <p className="text-base text-gray-500">
                        Room: {classItem.room.split(" ")[1]}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-lg p-6 border-1 border-gray-400 mb-5 mt-2">
              <div className="p-4 bg-white flex flex-col items-center justify-center py-6">
                <div className="text-center mb-4">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-4">
                    <Calendar className="h-8 w-8 text-gray-400" />
                  </div>
                  <h2 className="text-xl font-medium text-gray-900 mb-2">
                    No Classes Found
                  </h2>
                  <p className="text-gray-500 max-w-md">
                    There are currently no active classes scheduled. The classes
                    will appear here once you've enrolled.
                  </p>
                </div>
                <div className="border-t border-gray-200 w-full max-w-sm pt-4 mt-2">
                  <p className="text-sm text-center text-gray-500">
                    Check back later or contact an administrator if you believe
                    this is an error.
                  </p>
                </div>
              </div>
            </div>
          )}

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

          {/* History Classes */}
          {showHistory && !isLoading ? (
            oldclassList.length > 0 ? (
              oldclassList.map((classItem) => (
                <div
                  key={classItem._id}
                  className="rounded-lg p-6 border-1 border-gray-400 mb-5 mt-2"
                >
                  <div className="p-1 bg-white">
                    <h2 className="text-lg font-medium text-gray-900 mb-2">
                      {classItem.type || "Not Specified"}
                    </h2>
                    <div className="border-t border-black-200 pt-4" />
                  </div>
                  <div className="border-b border-gray-200 py-4 last:border-b-0">
                    <div className="flex item-start">
                      <div className="box-2 flex mr-50 justify-center items-center">
                        <img
                          className="w-36 h-36 object-cover rounded-md"
                          src={classItem.img}
                          alt="Class Image"
                        />
                      </div>
                      <div className="box-1 flex-grow ml-2">
                        <p className="text-base">
                          Code:{" "}
                          <span className="text-gray-500 font-medium">
                            {classItem.code}
                          </span>
                        </p>
                        <p className="text-base">
                          <span className="text-gray-500">
                            {classItem.style}
                          </span>
                        </p>
                        <p className="text-base">
                          <span className="text-gray-500">
                            Level: {classItem.level || "Not Specified"}
                          </span>
                        </p>
                        <p className="text-base text-gray-500">
                          Date: {classItem.date.slice(0, 10)}
                        </p>
                        <p className="text-base text-gray-500">
                          Time: {classItem.startTime} - {classItem.endTime}
                        </p>
                        <p className="text-base text-gray-500">
                          Room: {classItem.room.split(" ")[1]}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-lg p-6 border-1 border-gray-400 mb-5 mt-2">
                <div className="p-4 bg-white flex flex-col items-center justify-center py-6">
                  <div className="text-center mb-4">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-4">
                      <Calendar className="h-8 w-8 text-gray-400" />
                    </div>
                    <h2 className="text-xl font-medium text-gray-900 mb-2">
                      No Classes Found
                    </h2>
                    <p className="text-gray-500 max-w-md">
                      There are currently no active classes scheduled. The
                      classes will appear here once you've enrolled.
                    </p>
                  </div>
                  <div className="border-t border-gray-200 w-full max-w-sm pt-4 mt-2">
                    <p className="text-sm text-center text-gray-500">
                      Check back later or contact an administrator if you
                      believe this is an error.
                    </p>
                  </div>
                </div>
              </div>
            )
          ) : null}
        </div>
      )}
    </>
  );
}
