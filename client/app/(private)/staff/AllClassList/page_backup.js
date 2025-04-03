"use client";

import React, { useState, useEffect } from "react";
import "./StaffAllClassList.css";

export default function DanceClassList() {
    const [danceClasses, setDanceClasses] = useState([]); // State for dance class data
    const [filteredClasses, setFilteredClasses] = useState([]); // State for filtered data
    const [searchQuery, setSearchQuery] = useState(""); // State for search input
    const [isLoading, setIsLoading] = useState(true); // State for loading indicator
    const [errorMessage, setErrorMessage] = useState(""); // State for error messages

    // Fetch dance class and tutor data
    useEffect(() => {
        const fetchDanceClassesWithTutors = async () => {
            try {
                const classResponse = await fetch("http://localhost:3030/danceClass");
                const classData = await classResponse.json();
                const classesArray = Array.isArray(classData) ? classData : classData.classData || [];

                const tutorResponse = await fetch("http://localhost:3030/danceclass/tutor");
                const tutorData = await tutorResponse.json();
                const tutors = Array.isArray(tutorData.Teachers) ? tutorData.Teachers : [];

                // Merge class data with tutor details
                const formattedClasses = classesArray.map((danceClass) => {
                    const matchingTutor = tutors.find((tutor) => tutor._id === danceClass.teacher);

                    return {
                        id: danceClass._id || "Unknown",
                        code: danceClass.code || "N/A",
                        price: danceClass.price || "Unknown",
                        style: danceClass.style || "(TBA)",
                        tutor: matchingTutor?.nickname || "Unknown Tutor",
                        tutorIG: matchingTutor?.instagram || "Unknown IG",
                        level: danceClass.level || "N/A",
                        room: danceClass.room || "Room TBA",
                        date: danceClass.date?.split("T")[0] || "N/A",
                        time: `${danceClass.startTime || "00:00"} - ${danceClass.endTime || "00:00"}`,
                        image: danceClass.img || "https://via.placeholder.com/150",
                        status: danceClass.status || "Unknown",
                        performanceDay: danceClass.performanceDay
                            ? danceClass.performanceDay.replace("T", " ").replace("Z", "").replace(".000", "").replace("00:00:00", " | Time:(TBC)")
                            : "(TBC)",
                        type: danceClass.type || "Type:TBC",
                        vacancy: danceClass.vacancy || "N/A",
                    };
                });

                setDanceClasses(formattedClasses);
                setFilteredClasses(formattedClasses); // Initialize filtered list
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching dance classes or tutors:", error);
                setErrorMessage("Unable to load dance classes. Please try again later.");
                setIsLoading(false);
            }
        };

        fetchDanceClassesWithTutors();
    }, []);

    // Handle search input changes
    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);

        // Filter classes based on search query
        const filtered = danceClasses.filter((danceClass) =>
            danceClass.code.toLowerCase().includes(query) ||
            danceClass.style.toLowerCase().includes(query) ||
            danceClass.tutor.toLowerCase().includes(query) ||
            danceClass.level.toLowerCase().includes(query)
        );

        setFilteredClasses(filtered);
    };

    return (
        <div className="SACL-dance-class-list-container">
            <header className="SACL-dance-class-list-header">
                <h2 className="SACL-dance-class-list-title">Dance Class List</h2>
                {/* Search Bar */}
                <div className="SACL-search-container">
                <label className="SACLList-input SACLList-gap-2 SACLList-mt-3 SACLList-w-full" id="SACLList-searchBar">
                    <input
                        type="text"
                        className="SACL-search-input"
                        placeholder="Search by Class Code, Style, Tutor, or Level..."
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="SACLList-icon"
                    >
                        <path
                            fillRule="evenodd"
                            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                            clipRule="evenodd"
                        />
                    </svg>
                    </label>
                </div>
      
            </header>
            {isLoading ? (
                <p className="SACL-loading-message">Loading dance classes...</p>
            ) : errorMessage ? (
                <p className="SACL-error-message">{errorMessage}</p>
            ) : filteredClasses.length > 0 ? (
                <table className="SACL-table">
                    <thead className="SACL-table-header">
                        <tr>
                            <th></th>
                            <th>Class Code</th>
                            <th>Type</th>
                            <th>Style</th>
                            <th>Tutor</th>
                            <th>Tutor Instagram</th>
                            <th>Vacancy</th>
                            <th>Level</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Performance Day</th>
                            <th>Price</th>
                            <th>Room</th>
                            <th>Status</th>
                            <th>Image</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredClasses.map((danceClass, index) => (
                            <tr key={danceClass.id}>
                                <td>{index + 1}</td>
                                <td>{danceClass.code}</td>
                                <td>{danceClass.type}</td>
                                <td>{danceClass.style}</td>
                                <td>{danceClass.tutor}</td>
                                <td>{danceClass.tutorIG}</td>
                                <td>{danceClass.vacancy}</td>
                                <td>{danceClass.level}</td>
                                <td>{danceClass.time.split(" - ")[0]}</td>
                                <td>{danceClass.time.split(" - ")[1]}</td>
                                <td>{danceClass.performanceDay}</td>
                                <td>{danceClass.price}</td>
                                <td>{danceClass.room}</td>
                                <td>{danceClass.status}</td>
                                <td>
                                    {danceClass.image ? (
                                        <img
                                            src={danceClass.image}
                                            alt="Class Image"
                                            className="SACL-class-image"
                                        />
                                    ) : (
                                        "No image available"
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="SACL-error-message">No matching dance classes found.</p>
            )}
        </div>
    );
}
