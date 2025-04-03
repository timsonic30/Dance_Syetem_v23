import React, { useEffect, useState } from "react";
import "./calendar2.css";
import Cookies from "js-cookie";

// Main Calendar2 Component
export default function Calendar2() {
  // Use it if you want to set the Sunday at the leftest column
  const getLastSunday = (date) => {
    const lastSunday = new Date(date); // get today value
    const dayOfWeek = lastSunday.getDay(); // get the 'day' of today (from 0 - 6)
    lastSunday.setDate(lastSunday.getDate() - dayOfWeek);
    return lastSunday;
  };

  const lastSundayDate = getLastSunday(new Date());

  // const [currentStartDate, setCurrentStartDate] = useState(lastSundayDate);
  const [currentStartDate, setCurrentStartDate] = useState(new Date());

  const [events, setEvents] = useState([]); // Store formatted events
  const [selectedEvent, setSelectedEvent] = useState(null); // Track selected event
  const [cartCount, setCartCount] = useState(); // Track the number of items in the cart
  const generateSessionId = () => {
    // 使用隨機數生成唯一的 Session ID
    return (
      "session-" + Math.random().toString(36).substr(2, 9) + "-" + Date.now()
    );
  };

  const checkShoppingCart = () => {
    // 檢查是否已經有 Session ID
    let sessionId = Cookies.get("session_id");
    if (sessionId) {
      // 如果有，則獲取購物車內容
      fetch(`http://localhost:3030/shoppingCart/getcart/${sessionId}`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("獲取購物車失敗");
          }
        })
        .then((data) => {
          Cookies.set("shoppinglength", length);
          setCartCount(data.length);
        })
        .catch((error) => {
          console.error("錯誤：", error);
          // 處理錯誤（如顯示錯誤訊息）
        });
    }
  };

  const handleAddToCart = (id, classprice) => {
    // 檢查是否已經有 Session ID
    let sessionId = Cookies.get("session_id");
    if (!sessionId) {
      // 如果沒有，則生成新的 Session ID 並存儲
      sessionId = generateSessionId();
      Cookies.set("session_id", sessionId);
    }
    //將資料存入購物車DB
    fetch("http://localhost:3030/shoppingCart/addtocart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // 設置內容類型為 JSON
      },
      body: JSON.stringify({
        productID: id,
        collectionName: "danceclasses",
        price: classprice,
        shoppingType: "class",
        sessionID: sessionId, // 傳送 Session ID
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("預訂課程失敗");
        }
      })
      .then((data) => {
        console.log("預訂成功：", data);
        // 成功後處理邏輯（如顯示成功訊息或更新畫面）
        alert("已加購物車！");
        checkShoppingCart(); // 確保更新購物車內容
        //=======================
        // 使用 window.dispatchEvent 觸發一個自定義事件
        const event = new CustomEvent("userAddedCart", {
          detail: { message: "refresh shopping Cart length" },
        });
        window.dispatchEvent(event);
        //=========================
      })
      .catch((error) => {
        console.error("錯誤：", error);
        // 處理錯誤（如顯示錯誤訊息）
      });
  };

  // Utility function for room colors
  const getRoomColor = (room) => {
    // Define colors for rooms
    const roomColors = {
      "Room X": { background: "#353535", text: "#ffffff" }, // Gray
      "Room L": { background: "#ffa500", text: "#000000" }, // Orange
      "Room XL": { background: "#FFFFFF", text: "#000000" }, // White
    };

    // Default colors for unknown rooms
    const defaultColors = { background: "#D3D3D3", text: "#000000" }; // Light gray with black text

    // Return specific room colors or default
    return roomColors[room] || defaultColors;
  };

  //lessonDuration
  const formatLessonDuration = (durationArray) => {
    if (!Array.isArray(durationArray) || durationArray.length !== 2) {
      return "TBC"; // Fallback for invalid data
    }

    const formatDateTime = (isoString) => {
      const dateObj = new Date(isoString);
      const day = dateObj.getDate();
      const month = dateObj.toLocaleString("en-US", { month: "short" }); // Short month (e.g., "Mar")
      const year = dateObj.getFullYear();
      const time = dateObj.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, // 24-hour format
      });
      return `${day}${month}${year} ${time}`;
    };

    return `${formatDateTime(durationArray[0])} - ${formatDateTime(
      durationArray[1]
    )}`;
  };

  // Timeline Component
  const Timeline = ({ startHour = 9, endHour = 24 }) => {
    // Generate the time markers based on start and end hours
    const timeMarkers = Array.from(
      { length: endHour - startHour + 1 },
      (_, i) => {
        const hour = startHour + i;
        if (hour === 24) {
          return "12 AM";
        } else if (hour < 12) {
          return `${hour} AM`;
        } else if (hour === 12) {
          return "12 PM";
        } else {
          return `${hour - 12} PM`;
        }
      }
    );

    return (
      <div className="timeline">
        {/* Spacer for alignment */}
        <div className="spacer"></div>
        {timeMarkers.map((time, index) => (
          <div key={index} className="time-marker">
            {time}
          </div>
        ))}
      </div>
    );
  };

  // BigClassDetailsContainer Component
  const BigClassDetailsContainer = ({ selectedEvent, userId }) => {
    if (!selectedEvent) {
      return <p>Please select an event to see its details.</p>;
    }

    // Destructure all properties from selectedEvent
    const {
      Img,
      date,
      title,
      tutor,
      tutorIG,
      level,
      room,
      time,
      status,
      price,
      performDay,
      ClassType,
      lessonDuration,
    } = selectedEvent;

    return (
      <div className="BigClassDetailsContainer">
        {/* Header Section */}
        <div className="header">
          {`${date || "N/A"} ${title || "N/A"} - ${tutor || "N/A"} - ${
            ClassType || "Type:TBC"
          }`}
        </div>

        {/* Content Section */}
        <div className="content">
          <div className="table-image-container">
            {/* Display Image or Fallback */}
            {Img ? (
              <img
                src={Img}
                className="tutorImg"
                alt={`Image of ${tutor || "Tutor"}`}
              />
            ) : (
              <p>No image available for the selected event.</p>
            )}

            {/* Event Details Table */}
            <table className="HCtable" id="HCtable">
              <thead>
                <tr>
                  <th>Tutor:{tutor || "N/A"}</th>
                  <th colSpan="3" className="th2">
                    TutorIG:
                    <a
                      className="th3"
                      href={`https://instagram.com/${
                        tutorIG || "defaultTutor"
                      }`}
                    >
                      {tutorIG || "N/A"}
                    </a>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Level: {level || "N/A"}</td>
                  <td>{room || "N/A"}</td>
                  <td>Status: {status || "N/A"}</td>
                </tr>
                <tr>
                  <td colSpan="3"> Time: {time || "N/A"}</td>
                </tr>
                <tr>
                  <td colSpan="3" className="">
                    Lesson Duration: {lessonDuration || "TBC"}
                  </td>
                </tr>
                <tr>
                  <td colSpan="3" className="">
                    Performance Day: {performDay || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="btn-BookClass w-full" colSpan="3">
                    <BookClass selectedEvent={selectedEvent} userId={userId} />{" "}
                    {/* Use the BookClass component */}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Book-class-BigClassDetailsContainer Component
  const BookClass = ({ selectedEvent, userId }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [cartCount, setCartCount] = useState();

    // Function to handle booking
    const handleBookClass = async () => {
      handleAddToCart(selectedEvent.ClassObjectId, selectedEvent.price);
      // if (!selectedEvent || !userId) {
      //   // Properly format and display the alert message
      //   alert(
      //     `Booking class:\nDetail: ${selectedEvent?.ClassObjectId || "N/A"}\nPrice: ${selectedEvent?.price || "N/A"}\nType: Class\nUserId: ${userId || "N/A"}`
      //   );
      //   return;
      // }

      const { ClassObjectId, price } = selectedEvent;

      // Construct the booking details
      // const bookingDetails = {
      //   detail: ClassObjectId,
      //   price: price || "N/A",
      //   type: "Class", // Must be "Class"
      //   userId, // User's ID
      // };

      // try {
      //   setIsLoading(true); // Start loading
      //   setMessage(""); // Clear previous messages

      //   // const response = await fetch("http://localhost:3030/danceClass/bookingClass", {
      //   //   method: "POST",
      //   //   headers: {
      //   //     "Content-Type": "application/json",
      //   //   },
      //   //   body: JSON.stringify(bookingDetails),
      //   // });

      //   if (!response.ok) {
      //     throw new Error("Booking failed. Please try again later.");
      //   }

      //   const data = await response.json();
      //   setMessage(`Booking Successful: ${data.message}`);
      // } catch (error) {
      //   console.error("Booking error:", error);
      //   setMessage("Error: Unable to book the class. Please try again.");
      // } finally {
      //   setIsLoading(false); // Stop loading
      // }
    };

    return (
      <div className="w-full">
        <button
          onClick={handleBookClass}
          disabled={isLoading}
          className="btn-BookClass w-full"
        >
          {isLoading ? "Booking..." : "Book This Class"}
        </button>

        {/* Display the success or error message */}
        {message && <p className="message">{message}</p>}
      </div>
    );
  };

  // Fetch events from the API
  useEffect(() => {
    const fetchEventsWithTutors = async () => {
      try {
        // Fetch events from the main API
        const eventResponse = await fetch("http://localhost:3030/danceClass");
        const eventData = await eventResponse.json();
        const eventsArray = Array.isArray(eventData)
          ? eventData
          : eventData.classData || [];

        // Fetch teacher data from the secondary API
        const teacherResponse = await fetch(
          "http://localhost:3030/danceclass/tutor"
        );
        const teacherData = await teacherResponse.json();
        const teachers = Array.isArray(teacherData.Teachers)
          ? teacherData.Teachers
          : [];

        // Combine event data with teacher nicknames and Instagram handles
        const formattedEvents = eventsArray.map((event) => {
          const matchingTeacher = teachers.find(
            (teacher) => teacher._id === event.teacher
          );

          return {
            ClassObjectId: event._id || "Unknown",
            price: event.price || "Unknown",
            title: event.style || "(TBA)",
            tutor: matchingTeacher?.nickname || "Unknown Tutor", // Use teacher's nickname
            tutorIG: matchingTeacher?.instagram || "Unknown IG", // Use teacher's Instagram
            level: event.level || "N/A",
            room: event.room || "Room TBA",
            date: event.date?.split("T")[0] || "N/A",
            time: `${event.startTime || "00:00"} to ${
              event.endTime || "00:00"
            }`,
            start: (parseInt(event.startTime.split(":")[0], 10) - 8).toString(),
            end: (parseInt(event.endTime.split(":")[0], 10) - 8).toString(),
            Img: event.img || "https://via.placeholder.com/150", // Fallback URL for missing images
            status: event.status || "Unknown",
            performDay: event.performanceDay
              ? event.performanceDay
                  .replace("T", " ")
                  .replace("Z", "")
                  .replace(".000", "")
                  .replace("00:00:00", " | Time:(TBC)")
              : "(TBC)",
            ClassType: event.type || "Type:TBC",
            lessonDuration: formatLessonDuration(event.lessonDuration) || "TBC",
          };
        });

        setEvents(formattedEvents); // Update state with enriched events
      } catch (error) {
        console.error("Error fetching events or tutors:", error);
      }
    };

    fetchEventsWithTutors();
  }, []);

  // Handle week navigation
  const changeWeek = (direction) => {
    setCurrentStartDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + direction * 7);
      return newDate;
    });
  };

  // Render calendar days
  const renderDays = () => {
    return Array.from({ length: 7 }, (_, i) => {
      const dayDate = new Date(currentStartDate);
      dayDate.setDate(currentStartDate.getDate() + i);
      const dayEvents = events.filter(
        (event) => event.date === dayDate.toISOString().split("T")[0]
      );

      return (
        <div key={dayDate.toISOString()} className="day">
          <div className="date">
            <span className="date-num">{dayDate.getDate()}</span>
            <span className="date-day">
              {dayDate.toLocaleDateString("en-US", { weekday: "short" })}
            </span>
          </div>
          <div className="events">
            {dayEvents.map((event, index) => (
              <div
                key={index}
                className="event"
                onClick={() => setSelectedEvent(event)}
                style={{
                  gridRow: `${event.start} / ${event.end}`,
                  backgroundColor: getRoomColor(event.room).background, // Apply background color
                  color: getRoomColor(event.room).text, // Apply text color
                }}
              >
                <p className="title">{`${event.title} - ${event.tutor} -  ${event.ClassType}`}</p>
                <p className="time">{event.time}</p>
                <p className="level">{event.level}</p>
              </div>
            ))}
          </div>
        </div>
      );
    });
  };

  return (
    <section id="calendarSection">
      <div
        className="WeekTTBSectioncalendarHead"
        id="WeekTTBSectioncalendarHead"
      >
        <h1>Weekly Class Schedule</h1>
        <p>Click on the event to see the details</p>{" "}
        {/* Legend on a new line */}
        <div
          className="WeekTTBcalendarlabelColor"
          id="WeekTTBcalendarlabelColor"
        >
          <div className="label">
            <div
              className="WeekTTBorange-square"
              id="WeekTTBorange-square"
            ></div>
            <p>Room X</p>
          </div>
          <div className="label">
            <div className="WeekTTBblack-square" id="WeekTTBblack-square"></div>
            <p>Room L</p>
          </div>
          <div className="label">
            <div className="WeekTTBwhite-square" id="WeekTTBwhite-square"></div>
            <p>Room XL</p>
          </div>
        </div>
      </div>
      <div className="calendar">
        <div className="controls">
          <button onClick={() => changeWeek(-1)} className="btn">
            Previous Week
          </button>
          <div id="calendarHeader" className="header">
            {currentStartDate.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
            })}
          </div>
          <button onClick={() => changeWeek(1)} className="btn">
            Next Week
          </button>
        </div>
        <Timeline />
        <div className="days">{renderDays()}</div>
      </div>

      {selectedEvent && (
        <BigClassDetailsContainer selectedEvent={selectedEvent} />
      )}
    </section>
  );
}
