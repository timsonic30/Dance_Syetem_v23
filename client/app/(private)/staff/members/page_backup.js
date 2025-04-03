"use client";
import { useState, useEffect } from "react";
import Loading from "@/app/components/loading";

export default function Members() {
  const [memberInfo, setmemberInfo] = useState({
    usernames: [],
    emails: [],
    phones: [],
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [displayedMembers, setdisplayedMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all the member at the start
  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const res = await fetch("http://localhost:3030/staff/members");
        if (res.ok) {
          const data = await res.json();
          data.result["username"];
          const nameArr = data.result.map(
            (member) => member["username"] || "Not set"
          );
          const emailArr = data.result.map(
            (member) => member["email"] || "Not set"
          );
          const phoneArr = data.result.map(
            (member) => member["phone"] || "Not set"
          );

          setmemberInfo({
            usernames: nameArr,
            emails: emailArr,
            phones: phoneArr,
          });
          console.log(memberInfo);
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
    const combinedMembers = memberInfo.usernames.map((username, index) => ({
      username,
      email: memberInfo.emails[index],
      phone: memberInfo.phones[index],
    }));

    combinedMembers.forEach((e) => console.log(e));

    if (!searchTerm.trim()) {
      // If search term is empty, show all members info
      setdisplayedMembers(combinedMembers);
    } else {
      // Filter members based on search term
      const filtered = combinedMembers?.filter((member) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          member.username?.toLowerCase().includes(searchLower) ||
          member.email?.toLowerCase().includes(searchLower) ||
          member.phone.includes(searchLower)
        );
      });
      setdisplayedMembers(filtered);
    }
  }, [searchTerm, memberInfo]);

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
                  <th>Username</th>
                  <th>Email</th>
                  <th>Phone</th>
                </tr>
              </thead>

              {/* body */}
              <tbody>
                <>
                  {/* No records */}
                  {displayedMembers.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4">
                        No result is found
                      </td>
                    </tr>
                  ) : (
                    // With records
                    displayedMembers.map((member, index) => (
                      <tr key={index}>
                        <td>{`${index + 1}`}</td>
                        <td>{member.username}</td>
                        <td>{member.email}</td>
                        <td>+852 {member.phone}</td>
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
