"use client";
import { useState, useEffect } from "react";
import Loading from "@/app/components/loading";

export default function Teachers() {
  const [teacherInfo, setTeacherInfo] = useState({
    nicknames: [],
    emails: [],
    phones: [],
    styles: [],
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [displayedTeachers, setDisplayedTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all the teacher at the start
  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const res = await fetch("http://localhost:3030/staff/teachers");
        if (res.ok) {
          const data = await res.json();
          const nameArr = data.result.map(
            (teacher) => teacher["nickname"] || "Not set"
          );
          const emailArr = data.result.map(
            (teacher) => teacher["email"] || "Not set"
          );
          const phoneArr = data.result.map(
            (teacher) => teacher["phone"] || "Not set"
          );
          const styleArr = data.result.map(
            (teacher) => teacher["style"] || "Not set"
          );

          setTeacherInfo({
            nicknames: nameArr,
            emails: emailArr,
            phones: phoneArr,
            styles: styleArr,
          });
          console.log(teacherInfo);
          setLoading(false);
        }
      } catch (err) {
        throw new Error("Database Error");
      }
    };

    fetchTeacher();
  }, []);

  // find the records whenever the value in the search bar is changed
  useEffect(() => {
    // Convert into array for searching
    const combinedTeachers = teacherInfo.nicknames.map((nickname, index) => ({
      nickname,
      email: teacherInfo.emails[index],
      phone: teacherInfo.phones[index],
      style: teacherInfo.styles[index],
    }));
    console.log(combinedTeachers);

    if (!searchTerm.trim()) {
      // If search term is empty, show all teachers info
      setDisplayedTeachers(combinedTeachers);
    } else {
      // Filter teachers based on search term
      const filtered = combinedTeachers?.filter((teacher) => {
        const searchLower = searchTerm.toLowerCase();
        console.log(searchLower);
        return (
          teacher.nickname?.toLowerCase().includes(searchLower) ||
          teacher.email?.toLowerCase().includes(searchLower) ||
          teacher.phone.includes(searchLower) ||
          teacher.style.toLowerCase().includes(searchLower)
        );
      });
      setDisplayedTeachers(filtered);
    }
  }, [searchTerm, teacherInfo]);

  // return <>{loading ? <Loading /> : <>This is the teacher result page</>}</>;
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="w-4/5">
          {/* --------------------- search bar --------------------- */}
          <label className="input input-bordered gap-2 mt-3 w-full">
            <input
              type="text"
              className="grow"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </label>

          {/* --------------------- divider --------------------- */}
          <div className="flex w-full flex-col">
            <div className="divider divider-warning mt-1 mb-1"></div>
          </div>

          {/* --------------------- list of the teachers --------------------- */}
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              {/* head */}
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Style</th>
                </tr>
              </thead>

              {/* body */}
              <tbody>
                <>
                  {/* No records */}
                  {displayedTeachers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4">
                        No result is found
                      </td>
                    </tr>
                  ) : (
                    // With records
                    displayedTeachers.map((teacher, index) => (
                      <tr key={index}>
                        <td>{`${index + 1}`}</td>
                        <td>{teacher.nickname}</td>
                        <td>{teacher.email}</td>
                        <td>+852 {teacher.phone}</td>
                        <td>{teacher.style}</td>
                      </tr>
                    ))
                  )}
                </>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
