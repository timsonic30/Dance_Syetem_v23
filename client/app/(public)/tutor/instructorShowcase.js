"use client";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * @typedef {Object} Instructor
 * @property {string} id
 * @property {string} name
 * @property {string} [lastName]
 * @property {string} [position]
 * @property {string} imageUrl
 */

export default function InstructorShowcase({
  data,
  onDataChange,
  teacherClassFromDB,
}) {
  const [inputs, setInputs] = useState([]);
  const [formData, setFormData] = useState({});

  /** @type {Instructor[]} */
  //此array提供資料製作左右搖動的相片
  const instructors = [
    /* { id: "1", name: "test", imageUrl: "testpic", },*/
  ];

  //從api得來的data製作instructors array
  if (data && Array.isArray(data.Teachers)) {
    data.Teachers.forEach((item) => {
      let temp = {};
      Object.keys(item).forEach((key) => {
        if (key === "_id") {
          temp.id = item[key];
        } else if (key === "nickname") {
          temp.name = item[key];
        } else if (key === "profilePic") {
          temp.imageUrl = item[key];
        }
      });
      instructors.push(temp);
    });
  } else {
    console.log("no data form instructor Show Case");
  }

  // Correct the ref creation syntax here
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const getData = async () => "this is tutor";

  useEffect(() => {
    getData();
  }, []);

  const checkScrollability = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft <
          container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  /**
   * @param {"left" | "right"} direction
   */
  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === "left" ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleInstructorClick = async (id) => {
    try {
      // 動態將 id 傳遞給 API，替換路徑參數 :prarms
      const response = await fetch(
        `http://localhost:3030/danceclass/tutor/${id}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const res = await response.json();

      const danceClassResponse = fetch(`http://localhost:3030/danceclass/${id}`)
        .then((response) => {
          return response.json();
        })
        .then((teacherDanceClass) => {
          //console.log("用老師的id,找出屬於老師的class", teacherDanceClass);
          teacherClassFromDB(teacherDanceClass);
        })
        .catch((error) => {
          console.error("Error fetching dance class details:", error); // 捕獲並處理錯誤
        });

      onDataChange(res);
    } catch (err) {
      console.error("Error fetching tutor data:", err);
    }
  };

  return (
    <div>
      <div className="min-h-screen bg-white text-zinc-700 p-6 md:p-10">
        {/* Instructor Showcase Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-8">All Teachers</h2>
          <div className="relative">
            <button
              variant="ghost"
              size="icon"
              className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white rounded-full ${
                !canScrollLeft ? "opacity-50 cursor-not-allowed" : "opacity-100"
              }`}
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
            >
              <ChevronLeft className="h-8 w-8" />
            </button>

            <button
              variant="ghost"
              size="icon"
              className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white rounded-full ${
                !canScrollRight
                  ? "opacity-50 cursor-not-allowed"
                  : "opacity-100"
              }`}
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
            >
              <ChevronRight className="h-8 w-8" />
            </button>

            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto scrollbar-hide gap-1 pb-4"
              onScroll={checkScrollability}
            >
              {instructors.map((instructor) => (
                <div
                  key={instructor.id}
                  className="flex-shrink-0 w-[150px] md:w-[200px] lg:w-[250px] relative group cursor-pointer"
                  onClick={() => handleInstructorClick(instructor.id)} // 加入 onClick 事件
                >
                  <div className="relative h-[200px] md:h-[300px] lg:h-[350px] overflow-hidden">
                    <img
                      src={instructor.imageUrl || "/placeholder.svg"}
                      alt={`${instructor.name} ${instructor.lastName || ""}`}
                      className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
