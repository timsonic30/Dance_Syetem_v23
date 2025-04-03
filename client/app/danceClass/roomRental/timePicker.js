"use client";

import { useState } from "react";

export default function TimePicker({
  date = new Date(2025, 2, 31), // March 31, 2025
  onTimeSelect,
  className,
  excludedTimes = ["09:00", "09:30"], // 新增陣列參數，包含要排除的時間
}) {
  const [selectedTime, setSelectedTime] = useState(null);

  // 自訂日期格式化
  const formatDate = (date) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayOfWeek = days[date.getDay()];
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份從 0 開始
    const year = date.getFullYear();
    return `${dayOfWeek}— ${day}/${month}/${year}`;
  };

  // 生成所有以 30 分鐘為增量的時間段
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        slots.push(
          `${hour.toString().padStart(2, "0")}:${minute
            .toString()
            .padStart(2, "0")}`
        );
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // 過濾掉不需要顯示的時間
  const filteredTimeSlots = timeSlots.filter(
    (time) => !excludedTimes.includes(time)
  );

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    if (onTimeSelect) {
      onTimeSelect(time);
    }
  };

  const formattedDate = formatDate(date); // 使用自訂的格式化函數

  return (
    <div className={`${className} w-full max-w-4xl mx-auto p-4`}>
      <h2 className="text-xl font-medium mb-2">{formattedDate}</h2>
      <p className="mb-4 text-muted-foreground">請選擇開始時間</p>

      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
        {filteredTimeSlots.map((time) => (
          <button
            key={time}
            onClick={() => handleTimeSelect(time)}
            className={`py-2 px-3 border rounded-md transition-all ${
              selectedTime === time
                ? "bg-primary text-primary-foreground"
                : "bg-background"
            } hover:bg-secondary hover:text-secondary-foreground hover:scale-105`}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );
}
