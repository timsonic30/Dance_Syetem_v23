"use client";
import { useState, useEffect } from "react";
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
      const res = await fetch("http://localhost:3030/member/getClassList", {
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
    };
    getClassList();
  }, []);

  useEffect(() => {
    console.log(regular.length);
    setIsLoading(false);
  }, [regular]);

  return (
    <>
      {isLoading ? (
        // Need to fix the position of the loading icon since it is not at the center for both directions
        <div>
          <Loading />
        </div>
      ) : regular.length > 0 ? (
        regular.map((classItem) => (
          <div
            key={classItem._id}
            className=" rounded-lg p-6 border-1 border-gray-400 mb-5"
          >
            <div className="p-4 bg-white">
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Regular Class
              </h2>
              <div className="border-t border-black-200 pt-2">
                <div className="flex ">
                  <div className="box-2 justift-center item-center">
                    <img
                      className="w-24 h-24 object-contain"
                      src={classItem.classImage}
                      alt="Class Image"
                    />
                  </div>
                  <div className="box-1">
                    <p className="text-sm">
                      Code:
                      <span className="text-gray-500">
                        {" "}
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
                      {classItem.classEndTime}{" "}
                    </p>
                    <p className="text-sm text-gray-500">
                      Room: {classItem.classRoom.split(" ")[1]}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        "This is the member class 2"
      )}
    </>
  );
}
