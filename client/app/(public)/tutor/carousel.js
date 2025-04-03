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

export default function InstructorShowcase({data}) {
  const [inputs, setInputs] = useState([]);
  const [formData, setFormData] = useState({});

  // Correct the ref creation syntax here
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  /** @type {Instructor[]} */
  const instructors = [
    {
      id: "1",
      name: "LEO ANGELO",
      imageUrl:
        "https://cdn.midjourney.com/4330b563-6a27-4da4-bd1f-c8d84ce90570/0_2.png",
    },
    {
      id: "2",
      name: "BIANCA",
      lastName: "CHEUNG",
      imageUrl:
        "https://cdn.midjourney.com/309e2e71-8303-45a1-8888-81efe5c5d2de/0_3.png",
    },
    {
      id: "3",
      name: "ALGO",
      imageUrl:
        "https://cdn.midjourney.com/fa6cd61d-87aa-4bee-842d-dc754f0cec68/0_3.png",
    },
    {
      id: "4",
      name: "ALGO",
      imageUrl:
        "https://cdn.midjourney.com/7a99320b-6641-4d32-8d08-e477b4f5aae5/0_2.png",
    },
    {
      id: "5",
      name: "ALGO",
      imageUrl:
        "https://cdn.midjourney.com/9aa7d052-e715-46aa-b007-8fa79d3fafe6/0_2.png",
    },
    {
      id: "6",
      name: "ALGO",
      imageUrl:
        "https://cdn.midjourney.com/f7dbfdbd-a499-447c-8ec5-e8bec82a8654/0_2.png",
    },
    {
      id: "7",
      name: "ALGO",
      imageUrl:
        "https://cdn.midjourney.com/a741690a-1a8d-47a2-988f-ff8c8b453c8e/0_3.png",
    },
    {
      id: "8",
      name: "ALGO",
      imageUrl:
        "https://cdn.midjourney.com/2b013286-3de0-40ca-a02a-7825aaec057f/0_1.png",
    },
    {
      id: "9",
      name: "ALGO",
      imageUrl:
        "https://cdn.midjourney.com/70545a32-d908-4f00-b105-b460f74ae875/0_2.png",
    },
  ];

console.log(Array.isArray(data))

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

  return (
    <div>
      <div className="min-h-screen bg-gray-700 text-white p-6 md:p-10">
        {/* Instructor Showcase Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-8">其他導師</h2>
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
