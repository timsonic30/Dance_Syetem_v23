"use client";
import { useState, useEffect, useRef } from "react";
import InstructorShowcase from "./instructorShowcase";
import DanceInstructorProfile from "./danceInstructorProfile";

export default function TutorShowcase() {
  const [data, setData] = useState(null);
  const [oneTeacherdata, setoneTeacherData] = useState(null);
  const [showcaseData, setShowcaseData] = useState(null);
  const [showTeacherClassData, setshowTeacherClassData] = useState(null);

  const handleDataChange = (instructorShowCasedata) => {
    setShowcaseData(instructorShowCasedata); // 更新父組件的 state
  };
  const handleTeacherClassData = (instructorShowCasedata) => {
    setshowTeacherClassData(instructorShowCasedata);
  };

  const getData = async () => {
    try {
      const response = await fetch("http://localhost:3030/danceclass/tutor");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const res = await response.json();
      setData(res);
      const oneTeacher = await fetch(
        "http://localhost:3030/danceclass/tutorOne"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const oneTeacherRes = await oneTeacher.json();
      setoneTeacherData(oneTeacherRes);
    } catch (err) {
      console.error("Error fetching tutor data:", err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <DanceInstructorProfile
        oneTeacherdata={oneTeacherdata}
        showcaseData={showcaseData}
        showTeacherClassData={showTeacherClassData}
      />
      <InstructorShowcase
        data={data}
        onDataChange={handleDataChange}
        teacherClassFromDB={handleTeacherClassData}
      />
    </div>
  );
}
