"use client";

import React, { useState, useEffect } from "react";
import "./StaffAllClassList.css";

export default function DanceClassList() {
    const [danceClasses, setDanceClasses] = useState([]);
    const [filteredClasses, setFilteredClasses] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editFormData, setEditFormData] = useState({});

    useEffect(() => {
        const fetchDanceClassesWithTutors = async () => {
            try {
                const classResponse = await fetch("http://localhost:3030/danceClass");
                const classData = await classResponse.json();
                const classesArray = Array.isArray(classData) ? classData : classData.classData || [];

                const tutorResponse = await fetch("http://localhost:3030/danceclass/tutor");
                const tutorData = await tutorResponse.json();
                const tutors = Array.isArray(tutorData.Teachers) ? tutorData.Teachers : [];

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
                setFilteredClasses(formattedClasses);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching dance classes or tutors:", error);
                setErrorMessage("Unable to load dance classes. Please try again later.");
                setIsLoading(false);
            }
        };

        fetchDanceClassesWithTutors();
    }, []);

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = danceClasses.filter((danceClass) =>
            (danceClass.code && danceClass.code.toLowerCase().includes(query)) ||
            (danceClass.price && danceClass.price.toString().toLowerCase().includes(query)) ||
            (danceClass.type && danceClass.type.toLowerCase().includes(query)) ||
            (danceClass.style && danceClass.style.toLowerCase().includes(query)) ||
            (danceClass.tutor && danceClass.tutor.toLowerCase().includes(query)) ||
            (danceClass.level && danceClass.level.toLowerCase().includes(query)) ||
            (danceClass.room && danceClass.room.toLowerCase().includes(query)) ||
            (danceClass.date && danceClass.date.toLowerCase().includes(query)) ||
            (danceClass.time && danceClass.time.toLowerCase().includes(query)) ||
            (danceClass.status && danceClass.status.toLowerCase().includes(query)) ||
            (danceClass.performanceDay && danceClass.performanceDay.toLowerCase().includes(query)) ||
            (danceClass.vacancy && danceClass.vacancy.toString().toLowerCase().includes(query))
        );

        setFilteredClasses(filtered);
    };

    const handleEditClick = (danceClass) => {
        setEditingId(danceClass.id);
        setEditFormData(danceClass);
    };

    const handleCellChange = (e, key) => {
        setEditFormData({ ...editFormData, [key]: e.target.value });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
    };

    const handleSaveEdit = async (id) => {
        try {
            const response = await fetch(`http://localhost:3030/danceclass/classEdit/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editFormData),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const updatedData = await response.json();
            setDanceClasses(danceClasses.map((danceClass) =>
                danceClass.id === id ? updatedData.updatedClass : danceClass
            ));
            setFilteredClasses(filteredClasses.map((danceClass) =>
                danceClass.id === id ? updatedData.updatedClass : danceClass
            ));
    
            setEditingId(null);
        } catch (error) {
            console.error("Error updating class:", error);
            alert("Failed to update class. Please try again.");
        }
    };
    
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this class?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:3030/danceclass/classDelete/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete the class.");
            }

            alert(`Deleted Class with ID: ${id}`);

            setDanceClasses(danceClasses.filter((danceClass) => danceClass.id !== id));
            setFilteredClasses(filteredClasses.filter((danceClass) => danceClass.id !== id));
        } catch (error) {
            console.error("Error deleting class:", error);
            alert("An error occurred while deleting the class.");
        }
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
                        placeholder="Search by Class Code, Type, Style, Tutor, Vacancy, Level, Date, Time, Performance Day, Price, Room, or State..."
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

            {isLoading ? <p>Loading...</p> : errorMessage ? <p>{errorMessage}</p> : (
                <table className="SACL-table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Class Code</th>
                            <th>Type</th>
                            <th>Style</th>
                            <th>Tutor</th>
                            <th>Vacancy</th>
                            <th>Level</th>
                            <th>Date</th>
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
                                <td onDoubleClick={() => setEditingId(danceClass.id)}>
                                    {editingId === danceClass.id ? (
                                        <input
                                            type="String"
                                            value={editFormData.code || danceClass.code}
                                            onChange={(e) => handleCellChange(e, "code")}
                                            autoFocus
                                        />
                                    ) : (
                                        danceClass.code
                                    )}
                                </td>
                                <td onDoubleClick={() => setEditingId(danceClass.id)}>
                                    {editingId === danceClass.id ? (
                                        <input
                                            type="String"
                                            value={editFormData.type || danceClass.type}
                                            onChange={(e) => handleCellChange(e, "type")}
                                        />
                                    ) : (
                                        danceClass.type
                                    )}
                                </td>
                                <td onDoubleClick={() => setEditingId(danceClass.id)}>
                                    {editingId === danceClass.id ? (
                                        <input
                                            type="String"
                                            value={editFormData.style || danceClass.style}
                                            onChange={(e) => handleCellChange(e, "style")}
                                        />
                                    ) : (
                                        danceClass.style
                                    )}
                                </td>
                                <td>{danceClass.tutor}</td>
                                <td onDoubleClick={() => setEditingId(danceClass.id)}>
                                    {editingId === danceClass.id ? (
                                        <input
                                            type="String"
                                            value={editFormData.vacancy || danceClass.vacancy}
                                            onChange={(e) => handleCellChange(e, "vacancy")}
                                        />
                                    ) : (
                                        danceClass.vacancy
                                    )}
                                </td>
                                <td onDoubleClick={() => setEditingId(danceClass.id)}>
                                    {editingId === danceClass.id ? (
                                        <input
                                            type="String"
                                            value={editFormData.level || danceClass.level}
                                            onChange={(e) => handleCellChange(e, "level")}
                                        />
                                    ) : (
                                        danceClass.level
                                    )}
                                </td>
                                <td onDoubleClick={() => setEditingId(danceClass.id)}>
                                    {editingId === danceClass.id ? (
                                        <input
                                            type="date"
                                            value={editFormData.date || danceClass.date}
                                            onChange={(e) => handleCellChange(e, "date")}
                                        />
                                    ) : (
                                        danceClass.date
                                    )}
                                </td>
                                <td>{danceClass.time.split(" - ")[0]}</td>
                                <td>{danceClass.time.split(" - ")[1]}</td>
                                <td>{danceClass.performanceDay}</td>
                                <td onDoubleClick={() => setEditingId(danceClass.id)}>
                                    {editingId === danceClass.id ? (
                                        <input
                                            type="number"
                                            value={editFormData.price || danceClass.price}
                                            onChange={(e) => handleCellChange(e, "price")}
                                        />
                                    ) : (
                                        danceClass.price
                                    )}
                                </td>
                                <td onDoubleClick={() => setEditingId(danceClass.id)}>
                                    {editingId === danceClass.id ? (
                                        <input
                                            type="text"
                                            value={editFormData.room || danceClass.room}
                                            onChange={(e) => handleCellChange(e, "room")}
                                        />
                                    ) : (
                                        danceClass.room
                                    )}
                                </td>
                                <td onDoubleClick={() => setEditingId(danceClass.id)}>
                                    {editingId === danceClass.id ? (
                                        <input
                                            type="text"
                                            value={editFormData.status || danceClass.status}
                                            onChange={(e) => handleCellChange(e, "status")}
                                        />
                                    ) : (
                                        danceClass.status
                                    )}
                                </td>
                                <td>
                                    {danceClass.image ? (
                                        <img
                                            src={danceClass.image}
                                            alt="Class Image"
                                            className="SACL-class-image"
                                        />
                                    ) : (
                                        "No image available"
                                    )}</td>
                                <td>
                                    {editingId === danceClass.id ? (
                                        <>
                                            <button onClick={() => handleSaveEdit(danceClass.id)}>Update</button>
                                            <button onClick={() => setEditingId(null)}>Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => handleEditClick(danceClass)}>Edit</button>
                                            <button onClick={() => handleDelete(danceClass.id)} className="SACL-delete-btn">Delete</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
