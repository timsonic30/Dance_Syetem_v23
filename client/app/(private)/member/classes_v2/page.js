"use client";
import { useState, useEffect } from "react";
import { X, Calendar, Sparkles, Briefcase, Megaphone } from "lucide-react";
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
      setRegular(data.regular);
      setWorkshop(data.workshop);
      setPopUp(data.popUp);
      setShowCase(data.showcase);
    };
    getClassList();
  }, []);

  useEffect(() => {
    console.log(regular.length);
    setIsLoading(false);
  }, [regular]);

  const handleOnDelete = async () => {
    console.log("I am going to delete");
  };

  // Empty state component with customizable icon and message
  const EmptyState = ({ icon: Icon, title, message }) => (
    <div className="p-4 bg-white flex flex-col items-center justify-center py-6">
      <div className="text-center mb-4">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-4">
          <Icon className="h-8 w-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-medium text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-500 max-w-md">{message}</p>
      </div>
      <div className="border-t border-gray-200 w-full max-w-sm pt-4 mt-2">
        <p className="text-sm text-center text-gray-500">
          Check back later or contact an administrator if you believe this is an
          error.
        </p>
      </div>
    </div>
  );

  // Class item component
  const ClassItem = ({ classItem, type }) => (
    <div className="py-4 border-b border-gray-200 last:border-b-0">
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-4">
          <img
            className="w-24 h-24 object-cover rounded-md"
            src={classItem.classImage || "/placeholder.svg"}
            alt={`${classItem.classStyle} class`}
          />
        </div>
        <div className="flex-grow">
          <div className="flex flex-col">
            <h3 className="font-medium">{classItem.classStyle}</h3>
            <p className="text-sm text-gray-700">
              Level: {classItem.classLevel}
            </p>
            <p className="text-sm text-gray-700">
              Date: {classItem.classDate.slice(0, 10)}
            </p>
            <p className="text-sm text-gray-700">
              Time: {classItem.classStartTime} - {classItem.classEndTime}
            </p>
            <p className="text-sm text-gray-700">
              Room: {classItem.classRoom.split(" ")[1]}
            </p>
          </div>
        </div>
        <div className="flex-shrink-0 ml-4">
          <button
            className="w-8 h-8 bg-red-100 rounded-full flex justify-center items-center cursor-pointer hover:bg-red-200 transition-colors"
            onClick={handleOnDelete}
          >
            <X className="w-5 h-5 text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );

  // Class section component
  const ClassSection = ({ title, classes, icon, emptyMessage }) => (
    <div className="rounded-lg border border-gray-200 mb-5 overflow-hidden">
      <div className="p-4 bg-white">
        <h2 className="text-lg font-medium text-gray-900 mb-2">{title}</h2>
        <div className="border-t border-gray-200">
          {classes.length > 0 ? (
            classes.map((classItem, index) => (
              <ClassItem
                key={classItem._id}
                classItem={classItem}
                type={title}
              />
            ))
          ) : (
            <EmptyState
              icon={icon}
              title={`No ${title} Found`}
              message={emptyMessage}
            />
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Loading />
        </div>
      ) : (
        <div className="w-full max-w-4xl mx-auto px-4">
          {/* Regular Class Section */}
          <ClassSection
            title="Regular Class"
            classes={regular}
            icon={Calendar}
            emptyMessage="There are currently no active regular classes scheduled. Regular classes will appear here once you've enrolled."
          />

          {/* Pop Up Class Section */}
          <ClassSection
            title="Pop Up Class"
            classes={popUp}
            icon={Sparkles}
            emptyMessage="There are currently no pop up classes in your schedule. Pop up classes are special one-time events that will appear here after enrollment."
          />

          {/* Workshop Class Section */}
          <ClassSection
            title="Workshop Class"
            classes={workshop}
            icon={Briefcase}
            emptyMessage="You haven't enrolled in any workshop classes yet. Workshops are intensive learning sessions that will be listed here after registration."
          />

          {/* Showcase Class Section */}
          <ClassSection
            title="Showcase Class"
            classes={showCase}
            icon={Megaphone}
            emptyMessage="No showcase classes found in your schedule. Showcase classes are performance-oriented sessions that will appear here once you've registered."
          />
        </div>
      )}
    </>
  );
}
