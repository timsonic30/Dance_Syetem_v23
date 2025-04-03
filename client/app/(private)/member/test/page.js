"use client";
import { useState, useEffect } from "react";
import Loading from "@/app/components/loading";

export default function Classes() {
  const [classes, setClasses] = useState(null);

  //   useEffect(() => {
  //     const token = localStorage.getItem("token");

  //     async function fetchClasses() {
  //       try {
  //         const res = await fetch("http://localhost:3030/member/classes", {
  //           method: "POST",
  //           headers: {
  //             "Content-type": "application/json",
  //             Authorization: `Bearer ${token}`,
  //           },
  //           body: JSON.stringify({
  //             objectId: "67d1257e4d1fcb94294fb6af",
  //           }),
  //         });

  //         if (!res.ok) {
  //           throw new Error("Failed to fetch");
  //         }

  //         const data = await res.json();
  //         // Assuming the API returns the class data in a structured format
  //         setClasses(data);
  //       } catch (err) {
  //         console.log(err.message);
  //       }
  //     }

  //     fetchClasses();
  //   }, []);

  // Sample data structure to mimic the API response (replace with actual API data)
  const classData = {
    regularClasses: [
      {
        title: "Hip Hop - Regent",
        level: "Ads. Beginner",
        date: "2025/4/4 (Fri)",
        time: "7:30PM - 9:00PM",
        room: "X",
        price: "$200",
        package: "6/10",
        image:
          "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
      },
      {
        title: "Sexy Jazz - Carrie",
        level: "Ads. Beginner",
        date: "2025/3/31 (Mon)",
        time: "7:30PM - 9:00PM",
        room: "X",
        package: "10/10",
        image:
          "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
      },
    ],
    popUpClasses: [
      {
        title: "Hip Hop - Regent & SZE DAN",
        level: "Ads. Beginner",
        date: "2025/4/4 (Fri)",
        time: "9:00PM - 10:00PM",
        room: "X",
        package: "9/10",
        image:
          "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
      },
    ],
    workshopClasses: [
      {
        title: "Aric Private Workshop",
        level: "Ads. Beginner",
        date: "2025/4/2 (Wed)",
        time: "8:45PM-10:15PM",
        room: "X",
        package: "6/10",
        image:
          "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
      },
    ],
    showcaseClasses: [
      {
        title: "Carrie Team - Chair Dance",
        level: "Ads. Beginner",
        date: ["Feb 3, 10, 17, 24", "Mar 3, 10, 17, 24"],
        time: "7:00PM - 8:30PM",
        room: "XL",
        prices: ["$1800 / Piece", "$3200 / 2 Pieces", "$3800 / 3 Pieces"],
        image:
          "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
      },
    ],
    adsDayRemark: [
      {
        title: "NOK Team - Choreography",
        level: "Ads. Beginner",
        date: ["Feb 5, 12, 19, 26", "Mar 5, 12, 19, 26"],
        time: "7:15PM - 8:45PM",
        room: "XL",
        image:
          "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
      },
    ],
  };

  //   if (!classes) {
  //     return <Loading />;
  //   }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-6">
      {/* Regular Classes */}
      <div className="bg-gray-100 rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Regular Class</h2>
        {classData.regularClasses.map((classItem, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-4 mb-4 flex items-center space-x-4"
          >
            <div className="w-24 h-24 rounded-lg overflow-hidden">
              <img
                src={classItem.image}
                alt={classItem.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium">{classItem.title}</h3>
              <p className="text-sm text-gray-600">Level: {classItem.level}</p>
              <p className="text-sm text-gray-600">Date: {classItem.date}</p>
              <p className="text-sm text-gray-600">Time: {classItem.time}</p>
              <p className="text-sm text-gray-600">Room: {classItem.room}</p>
              <div className="flex items-center justify-between mt-2">
                {classItem.price && (
                  <span className="text-lg font-semibold">
                    {classItem.price}
                  </span>
                )}
                <span className="text-sm text-gray-500">
                  Package: {classItem.package}
                </span>
              </div>
            </div>
            <button className="btn btn-sm btn-circle btn-ghost">✕</button>
          </div>
        ))}
      </div>

      {/* Pop Up Class */}
      <div className="bg-gray-100 rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Pop Up Class</h2>
        {classData.popUpClasses.map((classItem, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-4 mb-4 flex items-center space-x-4"
          >
            <div className="w-24 h-24 rounded-lg overflow-hidden">
              <img
                src={classItem.image}
                alt={classItem.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium">{classItem.title}</h3>
              <p className="text-sm text-gray-600">Level: {classItem.level}</p>
              <p className="text-sm text-gray-600">Date: {classItem.date}</p>
              <p className="text-sm text-gray-600">Time: {classItem.time}</p>
              <p className="text-sm text-gray-600">Room: {classItem.room}</p>
              <div className="flex items-center justify-end mt-2">
                <span className="text-sm text-gray-500">
                  Package: {classItem.package}
                </span>
              </div>
            </div>
            <button className="btn btn-sm btn-circle btn-ghost">✕</button>
          </div>
        ))}
      </div>

      {/* Workshop Class */}
      <div className="bg-gray-100 rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Workshop Class</h2>
        {classData.workshopClasses.map((classItem, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-4 mb-4 flex items-center space-x-4"
          >
            <div className="w-24 h-24 rounded-lg overflow-hidden">
              <img
                src={classItem.image}
                alt={classItem.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium">{classItem.title}</h3>
              <p className="text-sm text-gray-600">Level: {classItem.level}</p>
              <p className="text-sm text-gray-600">Date: {classItem.date}</p>
              <p className="text-sm text-gray-600">Time: {classItem.time}</p>
              <p className="text-sm text-gray-600">Room: {classItem.room}</p>
              <div className="flex items-center justify-end mt-2">
                <span className="text-sm text-gray-500">
                  Package: {classItem.package}
                </span>
              </div>
            </div>
            <button className="btn btn-sm btn-circle btn-ghost">✕</button>
          </div>
        ))}
      </div>

      {/* Showcase Class */}
      <div className="bg-gray-100 rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Showcase Class</h2>
        {classData.showcaseClasses.map((classItem, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-4 mb-4 flex items-center space-x-4"
          >
            <div className="w-24 h-24 rounded-lg overflow-hidden">
              <img
                src={classItem.image}
                alt={classItem.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium">{classItem.title}</h3>
              <p className="text-sm text-gray-600">Level: {classItem.level}</p>
              <p className="text-sm text-gray-600">
                Date: {classItem.date.join(", ")}
              </p>
              <p className="text-sm text-gray-600">Time: {classItem.time}</p>
              <p className="text-sm text-gray-600">Room: {classItem.room}</p>
              <div className="flex space-x-2 mt-2">
                {classItem.prices.map((price, idx) => (
                  <span
                    key={idx}
                    className="btn btn-sm btn-outline btn-primary rounded-full"
                  >
                    {price}
                  </span>
                ))}
              </div>
            </div>
            <button className="btn btn-sm btn-circle btn-ghost">✕</button>
          </div>
        ))}
      </div>

      {/* Ads Day Remark */}
      <div className="bg-gray-100 rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Ads Day Remark</h2>
        {classData.adsDayRemark.map((classItem, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-4 mb-4 flex items-center space-x-4"
          >
            <div className="w-24 h-24 rounded-lg overflow-hidden">
              <img
                src={classItem.image}
                alt={classItem.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium">{classItem.title}</h3>
              <p className="text-sm text-gray-600">Level: {classItem.level}</p>
              <p className="text-sm text-gray-600">
                Date: {classItem.date.join(", ")}
              </p>
              <p className="text-sm text-gray-600">Time: {classItem.time}</p>
              <p className="text-sm text-gray-600">Room: {classItem.room}</p>
            </div>
            <button className="btn btn-sm btn-circle btn-ghost">✕</button>
          </div>
        ))}
        <p className="text-xs text-gray-500 mt-4">
          * 75% attendance is needed in order to perform unless permission given
          by choreographer(s) <br />
          ** Paid fee is non-refundable nor transferable
        </p>
      </div>
    </div>
  );
}
