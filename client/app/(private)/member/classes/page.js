"use client";
import { useState, useEffect } from "react";
import { X, Search, Calendar } from "lucide-react";
import Loading from "@/app/components/loading";

export default function Classes() {
  const [showHistory, setShowHistory] = useState(false);

  const [regular, setRegular] = useState([]);
  const [workshop, setWorkshop] = useState([]);
  const [popUp, setPopUp] = useState([]);
  const [showCase, setShowCase] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const getClassList = async () => {
      try {
        const res = await fetch("http://localhost:3030/member/getClassList", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error("Failed to fetch");
        }
        // setPresentclassList(data.workshop);
        setRegular(data.regular);
        setWorkshop(data.workshop);
        setPopUp(data.popUp);
        setShowCase(data.showcase);
        // setPresentclassList(data.present);
        // setOldclassList(data.old);
        // console.log(data.regular);
        // console.log(data.workshop);
        // console.log(data.popUp);
        // console.log(data.showcase);
      } catch (err) {
        console.log(err.message);
      } finally {
        // It ensures that all the data is received completed before showing the records
        setIsLoading(false);
      }
    };
    getClassList();
  }, []);

  const handleOnDelete = async (transactionId) => {
    // console.log("I am going to delete", transactionId);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:3030/member/deleteClass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ transactionId }),
      });

      if (!res.ok) {
        throw new Error("Failed to delete class");
      }

      const data = await res.json();
      console.log(data);
      alert("Class has been deleted successfully");
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <>
      {isLoading ? (
        // Need to fix the position of the loading icon since it is not at the center for both directions
        <div>
          <Loading />
        </div>
      ) : (
        <div className="w-4/5">
          {/* Regular */}
          <div className="rounded-lg p-6 border-1 border-gray-400 mb-5 mt-2">
            <div className="p-1 bg-white">
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Regular Class
              </h2>
              <div className="border-t border-black-200 pt-4">
                {regular.length > 0 ? (
                  regular.map((classItem, index) => (
                    <div
                      key={classItem._id}
                      className="border-b border-gray-200 py-4 last:border-b-0"
                    >
                      <div className="flex item-start ">
                        <div className="box-2 flex-shrink mr-2 justify-center items-center">
                          <img
                            className="w-24 h-24 object-cover rounded-md"
                            src={classItem.classImage}
                            alt="Class Image"
                          />
                        </div>
                        <div className="box-1 flex-grow ml-2">
                          <p className="text-sm">
                            {"Code: "}
                            <span className="text-gray-500 font-medium">
                              {classItem.classCode}
                            </span>
                          </p>
                          <p className="text-sm">
                            <span className="text-gray-500">
                              {classItem.classStyle}
                            </span>
                          </p>
                          <p className="text-sm">
                            <span className="text-gray-500">
                              Level: {classItem.classLevel}
                            </span>
                          </p>
                          <p className="text-sm text-gray-500">
                            Date: {classItem.classDate.slice(0, 10)}
                          </p>
                          <p className="text-sm text-gray-500">
                            Time: {classItem.classStartTime} -{" "}
                            {classItem.classEndTime}
                          </p>
                          <p className="text-sm text-gray-500">
                            Room: {classItem.classRoom.split(" ")[1]}
                          </p>
                        </div>

                        <div className="box-3 flex-shrink mr-2">
                          <div className="w-6 h-6 bg-red-100 rounded-full flex justify-center items-center cursor-pointer">
                            <X
                              className="w-5 h-5 text-red-500"
                              onClick={() => handleOnDelete(classItem._id)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 bg-white flex flex-col items-center justify-center py-6">
                    <div className="text-center mb-4">
                      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-4">
                        <Calendar className="h-8 w-8 text-gray-400" />
                      </div>
                      <h2 className="text-xl font-medium text-gray-900 mb-2">
                        No Regular Class Found
                      </h2>
                      <p className="text-gray-500 max-w-md">
                        There are currently no active regular classes scheduled.
                        Regular classes will appear here once you've enrolled.
                      </p>
                    </div>
                    <div className="border-t border-gray-200 w-full max-w-sm pt-4 mt-2">
                      <p className="text-sm text-center text-gray-500">
                        Check back later or contact an administrator if you
                        believe this is an error.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pop Up */}
          <div className="rounded-lg p-6 border-1 border-gray-400 mb-5 mt-2">
            <div className="p-1 bg-white">
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Pop Up Class
              </h2>
              <div className="border-t border-black-200 pt-4">
                {popUp.length > 0 ? (
                  popUp.map((classItem, index) => (
                    <div
                      key={classItem._id}
                      className="border-b border-gray-200 py-4 last:border-b-0"
                    >
                      <div className="flex item-start ">
                        <div className="box-2 flex-shrink mr-2 justify-center items-center">
                          <img
                            className="w-24 h-24 object-cover rounded-md"
                            src={classItem.classImage}
                            alt="Class Image"
                          />
                        </div>
                        <div className="box-1 flex-grow ml-2">
                          <p className="text-sm">
                            {"Code: "}
                            <span className="text-gray-500 font-medium">
                              {classItem.classCode}
                            </span>
                          </p>
                          <p className="text-sm">
                            <span className="text-gray-500">
                              {classItem.classStyle}
                            </span>
                          </p>
                          <p className="text-sm">
                            <span className="text-gray-500">
                              Level: {classItem.classLevel}
                            </span>
                          </p>
                          <p className="text-sm text-gray-500">
                            Date: {classItem.classDate.slice(0, 10)}
                          </p>
                          <p className="text-sm text-gray-500">
                            Time: {classItem.classStartTime} -{" "}
                            {classItem.classEndTime}
                          </p>
                          <p className="text-sm text-gray-500">
                            Room: {classItem.classRoom.split(" ")[1]}
                          </p>
                        </div>

                        <div className="box-3 flex-shrink mr-2">
                          <div className="w-6 h-6 bg-red-100 rounded-full flex justify-center items-center cursor-pointer">
                            <X
                              className="w-5 h-5 text-red-500"
                              onClick={() => handleOnDelete(classItem._id)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 bg-white flex flex-col items-center justify-center py-6">
                    <div className="text-center mb-4">
                      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-4">
                        <Calendar className="h-8 w-8 text-gray-400" />
                      </div>
                      <h2 className="text-xl font-medium text-gray-900 mb-2">
                        No Pop Up Class Found
                      </h2>
                      <p className="text-gray-500 max-w-md">
                        There are currently no active pop up classes scheduled.
                        Pop Up classes will appear here once you've enrolled.
                      </p>
                    </div>
                    <div className="border-t border-gray-200 w-full max-w-sm pt-4 mt-2">
                      <p className="text-sm text-center text-gray-500">
                        Check back later or contact an administrator if you
                        believe this is an error.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Workshop */}
          <div className="rounded-lg p-6 border-1 border-gray-400 mb-5 mt-2">
            <div className="p-1 bg-white">
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Workshop Class
              </h2>
              <div className="border-t border-black-200 pt-4">
                {workshop.length > 0 ? (
                  workshop.map((classItem, index) => (
                    <div
                      key={classItem._id}
                      className="border-b border-gray-200 py-4 last:border-b-0"
                    >
                      <div className="flex item-start ">
                        <div className="box-2 flex-shrink mr-2 justify-center items-center">
                          <img
                            className="w-24 h-24 object-cover rounded-md"
                            src={classItem.classImage}
                            alt="Class Image"
                          />
                        </div>
                        <div className="box-1 flex-grow ml-2">
                          <p className="text-sm">
                            {"Code: "}
                            <span className="text-gray-500 font-medium">
                              {classItem.classCode}
                            </span>
                          </p>
                          <p className="text-sm">
                            <span className="text-gray-500">
                              {classItem.classStyle}
                            </span>
                          </p>
                          <p className="text-sm">
                            <span className="text-gray-500">
                              Level: {classItem.classLevel}
                            </span>
                          </p>
                          <p className="text-sm text-gray-500">
                            Date: {classItem.classDate.slice(0, 10)}
                          </p>
                          <p className="text-sm text-gray-500">
                            Time: {classItem.classStartTime} -{" "}
                            {classItem.classEndTime}
                          </p>
                          <p className="text-sm text-gray-500">
                            Room: {classItem.classRoom.split(" ")[1]}
                          </p>
                        </div>

                        <div className="box-3 flex-shrink mr-2">
                          <div className="w-6 h-6 bg-red-100 rounded-full flex justify-center items-center cursor-pointer">
                            <X
                              className="w-5 h-5 text-red-500"
                              onClick={() => handleOnDelete(classItem._id)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 bg-white flex flex-col items-center justify-center py-6">
                    <div className="text-center mb-4">
                      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-4">
                        <Calendar className="h-8 w-8 text-gray-400" />
                      </div>
                      <h2 className="text-xl font-medium text-gray-900 mb-2">
                        No Workshop Class Found
                      </h2>
                      <p className="text-gray-500 max-w-md">
                        There are currently no active workshop classes
                        scheduled. Pop Up classes will appear here once you've
                        enrolled.
                      </p>
                    </div>
                    <div className="border-t border-gray-200 w-full max-w-sm pt-4 mt-2">
                      <p className="text-sm text-center text-gray-500">
                        Check back later or contact an administrator if you
                        believe this is an error.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Showcase */}
          <div className="rounded-lg p-6 border-1 border-gray-400 mb-5 mt-2">
            <div className="p-1 bg-white">
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Showcase Class
              </h2>
              <div className="border-t border-black-200 pt-4">
                {showCase.length > 0 ? (
                  showCase.map((classItem, index) => (
                    <div
                      key={classItem._id}
                      className="border-b border-gray-200 py-4 last:border-b-0"
                    >
                      <div className="flex item-start ">
                        <div className="box-2 flex-shrink mr-2 justify-center items-center">
                          <img
                            className="w-24 h-24 object-cover rounded-md"
                            src={classItem.classImage}
                            alt="Class Image"
                          />
                        </div>
                        <div className="box-1 flex-grow ml-2">
                          <p className="text-sm">
                            {"Code: "}
                            <span className="text-gray-500 font-medium">
                              {classItem.classCode}
                            </span>
                          </p>
                          <p className="text-sm">
                            <span className="text-gray-500">
                              {classItem.classStyle}
                            </span>
                          </p>
                          <p className="text-sm">
                            <span className="text-gray-500">
                              Level: {classItem.classLevel}
                            </span>
                          </p>
                          <p className="text-sm text-gray-500">
                            Date: {classItem.classDate.slice(0, 10)}
                          </p>
                          <p className="text-sm text-gray-500">
                            Time: {classItem.classStartTime} -{" "}
                            {classItem.classEndTime}
                          </p>
                          <p className="text-sm text-gray-500">
                            Room: {classItem.classRoom.split(" ")[1]}
                          </p>
                        </div>

                        <div className="box-3 flex-shrink mr-2">
                          <div className="w-6 h-6 bg-red-100 rounded-full flex justify-center items-center cursor-pointer">
                            <X
                              className="w-5 h-5 text-red-500"
                              onClick={() => handleOnDelete(classItem._id)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 bg-white flex flex-col items-center justify-center py-6">
                    <div className="text-center mb-4">
                      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-4">
                        <Calendar className="h-8 w-8 text-gray-400" />
                      </div>
                      <h2 className="text-xl font-medium text-gray-900 mb-2">
                        No Showcase Class Found
                      </h2>
                      <p className="text-gray-500 max-w-md">
                        There are currently no active showcase classes
                        scheduled. Pop Up classes will appear here once you've
                        enrolled.
                      </p>
                    </div>
                    <div className="border-t border-gray-200 w-full max-w-sm pt-4 mt-2">
                      <p className="text-sm text-center text-gray-500">
                        Check back later or contact an administrator if you
                        believe this is an error.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
