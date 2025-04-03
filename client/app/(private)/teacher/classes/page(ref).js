"use client";
import { useState, useEffect } from "react";
import { X, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import Loading from "@/app/components/loading";

export default function Classes() {
  const [showHistory, setShowHistory] = useState(false);

  const [presentClassesList, setPresentclassList] = useState([]);
  const [oldclassList, setOldclassList] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const getClassList = async () => {
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

        if (!res.ok) {
          throw new Error("Failed to fetch");
        }
        const data = await res.json();
        setPresentclassList(data.present);
        setOldclassList(data.old);
        console.log(data.old);
      } catch (err) {
        console.log(err.message);
      } finally {
        // It ensures that all the data is received completed before showing the records
        setIsLoading(false);
      }
    };
    getClassList();

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

        if (!res.ok) {
          throw new Error("Failed to fetch");
        }
        const data = await res.json();
        console.log("OKOK");
        // Commented code removed for brevity
      } catch (err) {
        console.log(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    getBookingClassList();
  }, []);

  const handleOnDelete = async () => {
    console.log("I am going to delete");
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Loading />
        </div>
      ) : (
        <div className="w-full max-w-3xl mx-auto px-4 pb-8">
          {/* Current Classes */}
          {presentClassesList.length > 0 ? (
            presentClassesList.map((classItem) => (
              <div
                key={classItem._id}
                className="rounded-lg border border-gray-200 mb-6 overflow-hidden bg-white shadow-sm"
              >
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold">
                    {classItem.type} Class
                  </h2>
                </div>
                <div className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-1/3 flex-shrink-0">
                      <img
                        className="w-full aspect-square object-cover rounded-md"
                        src={
                          classItem.img ||
                          "/placeholder.svg?height=200&width=200"
                        }
                        alt={`${classItem.style} class`}
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="text-lg font-medium">{classItem.style}</h3>
                      <p className="text-base">
                        Level:{" "}
                        <span className="font-medium">
                          {classItem.level || "Not Specified"}
                        </span>
                      </p>
                      <p className="text-base">
                        Date:{" "}
                        <span className="font-medium">
                          {classItem.date.slice(0, 10)}
                        </span>
                      </p>
                      <p className="text-base">
                        Time:{" "}
                        <span className="font-medium">
                          {classItem.startTime} - {classItem.endTime}
                        </span>
                      </p>
                      <p className="text-base">
                        Room:{" "}
                        <span className="font-medium">
                          {classItem.room.split(" ")[1] || "X"}
                        </span>
                      </p>
                      <p className="text-sm text-gray-500">
                        Code: {classItem.code}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-lg border border-gray-200 mb-6 overflow-hidden bg-white shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold">Classes</h2>
              </div>
              <div className="p-8 flex flex-col items-center justify-center text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-4">
                  <Calendar className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No Classes Found
                </h3>
                <p className="text-gray-500 max-w-md mb-4">
                  There are currently no active classes scheduled. The classes
                  will appear here once you've enrolled.
                </p>
                <p className="text-sm text-gray-500">
                  Check back later or contact an administrator if you believe
                  this is an error.
                </p>
              </div>
            </div>
          )}

          {/* History Toggle */}
          <div className="rounded-lg border border-gray-200 mb-6 overflow-hidden bg-white shadow-sm">
            <button
              className="w-full p-4 flex items-center justify-center gap-2 text-gray-700 font-medium"
              onClick={() => setShowHistory(!showHistory)}
            >
              History
              {showHistory ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* History Classes */}
          {showHistory && !isLoading && (
            <>
              {oldclassList.length > 0 ? (
                oldclassList.map((classItem) => (
                  <div
                    key={classItem._id}
                    className="rounded-lg border border-gray-200 mb-6 overflow-hidden bg-white shadow-sm"
                  >
                    <div className="p-4 border-b border-gray-200">
                      <h2 className="text-xl font-semibold">
                        {classItem.type || "Workshop"} Class
                      </h2>
                    </div>
                    <div className="p-4">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-1/3 flex-shrink-0">
                          <img
                            className="w-full aspect-square object-cover rounded-md"
                            src={
                              classItem.img ||
                              "/placeholder.svg?height=200&width=200"
                            }
                            alt={`${classItem.style} class`}
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-medium">
                              {classItem.style}
                            </h3>
                            <button
                              className="w-8 h-8 bg-red-100 rounded-full flex justify-center items-center"
                              onClick={handleOnDelete}
                            >
                              <X className="w-5 h-5 text-red-500" />
                            </button>
                          </div>
                          <p className="text-base">
                            Level:{" "}
                            <span className="font-medium">
                              {classItem.level || "Not Specified"}
                            </span>
                          </p>
                          <p className="text-base">
                            Date:{" "}
                            <span className="font-medium">
                              {classItem.date.slice(0, 10)}
                            </span>
                          </p>
                          <p className="text-base">
                            Time:{" "}
                            <span className="font-medium">
                              {classItem.startTime} - {classItem.endTime}
                            </span>
                          </p>
                          <p className="text-base">
                            Room:{" "}
                            <span className="font-medium">
                              {classItem.room.split(" ")[1] || "X"}
                            </span>
                          </p>
                          <p className="text-sm text-gray-500">
                            Code: {classItem.code}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-lg border border-gray-200 mb-6 overflow-hidden bg-white shadow-sm">
                  <div className="p-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold">History</h2>
                  </div>
                  <div className="p-8 flex flex-col items-center justify-center text-center">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-4">
                      <Calendar className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                      No Past Classes Found
                    </h3>
                    <p className="text-gray-500 max-w-md mb-4">
                      You don't have any past classes in your history yet.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}
