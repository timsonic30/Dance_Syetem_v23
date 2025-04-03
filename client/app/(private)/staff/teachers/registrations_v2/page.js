"use client";
import { useState, useEffect } from "react";
import { UserPlus, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import Loading from "@/app/components/loading";

export default function TeacherDataEntry() {
  const [inputs, setInputs] = useState([]);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null

  // Helper function to get appropriate placeholder text
  const getPlaceholder = (fieldName) => {
    const placeholders = {
      name: "Enter full name",
      email: "email@example.com",
      phone: "Enter phone number",
      address: "Enter full address",
      city: "Enter city",
      state: "Enter state/province",
      zipCode: "Enter postal code",
      country: "Enter country",
      danceStyle: "e.g., Jazz, Ballet, Hip Hop",
      experience: "Years of teaching experience",
      certification: "Enter certification details",
      bio: "Brief professional biography",
      specialization: "Area of expertise",
      availability: "Available days and times",
      hourlyRate: "Hourly rate in $",
      preferredLocation: "Preferred teaching location",
      emergencyContact: "Emergency contact name and number",
      socialMedia: "Social media handles",
      website: "Personal or professional website",
      references: "Professional references",
      // Add more field-specific placeholders as needed
    };

    return (
      placeholders[fieldName] ||
      `Enter ${fieldName.replace(/([A-Z])/g, " $1").toLowerCase()}`
    );
  };

  const getData = async () => {
    try {
      const response = await fetch(
        "http://localhost:3030/danceclass/teacherDataEntry"
      );
      const res = await response.json();

      // Group fields by category (this is a simple example - adjust based on your schema)
      const fieldGroups = {
        "Personal Information": [
          "name",
          "email",
          "phone",
          "address",
          "city",
          "state",
          "zipCode",
          "country",
        ],
        "Professional Details": [
          "danceStyle",
          "experience",
          "certification",
          "bio",
          "specialization",
          "hourlyRate",
        ],
        "Additional Information": [], // All other fields will go here
      };

      // Track which fields have been assigned to groups
      const assignedFields = [
        ...fieldGroups["Personal Information"],
        ...fieldGroups["Professional Details"],
      ];

      // Create a map to store fields by group
      const groupedFields = {
        "Personal Information": [],
        "Professional Details": [],
        "Additional Information": [],
      };

      // Process schema and create form elements
      for (const [key, value] of Object.entries(res.schema)) {
        // Skip certain fields
        if (
          ["_id", "createdAt", "__v", "updatedAt", "role", "point"].includes(
            key
          )
        ) {
          continue;
        }

        // Determine which group this field belongs to
        let group = "Additional Information";
        if (fieldGroups["Personal Information"].includes(key)) {
          group = "Personal Information";
        } else if (fieldGroups["Professional Details"].includes(key)) {
          group = "Professional Details";
        }

        if (value.enumValues && value.enumValues.length !== 0) {
          // Create dropdown menu
          const selectTag = (
            <div key={key} className="mb-4">
              <label
                htmlFor={key}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {key.charAt(0).toUpperCase() +
                  key.slice(1).replace(/([A-Z])/g, " $1")}
              </label>
              <select
                id={key}
                name={key}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                onChange={(e) => handleInputChange(e, key)}
                value={formData[key] || ""}
              >
                <option value="" disabled>
                  Select {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                </option>
                {value.enumValues.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          );
          groupedFields[group].push(selectTag);
        } else {
          // Create text input field
          const inputTag = (
            <div key={key} className="mb-4">
              <label
                htmlFor={key}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {key.charAt(0).toUpperCase() +
                  key.slice(1).replace(/([A-Z])/g, " $1")}
              </label>
              <input
                id={key}
                type="text"
                name={key}
                placeholder={getPlaceholder(key)}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                onChange={(e) => handleInputChange(e, key)}
                value={formData[key] || ""}
              />
            </div>
          );
          groupedFields[group].push(inputTag);
        }
      }

      // Create final input array with section headers
      const finalInputs = [];
      for (const [groupName, fields] of Object.entries(groupedFields)) {
        if (fields.length > 0) {
          finalInputs.push(
            <div key={groupName} className="mb-8">
              <h3 className="text-lg font-medium text-gray-800 mb-4 pb-2 border-b border-gray-200">
                {groupName}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                {fields}
              </div>
            </div>
          );
        }
      }

      setInputs(finalInputs);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e, key) => {
    const value = e.target.value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [key]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch(
        "http://localhost:3030/danceclass/teacherDataEntry",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setSubmitStatus("success");

        // Clear the form after a delay to show success message
        setTimeout(() => {
          setFormData({});
          getData(); // Refresh the form
          setSubmitStatus(null);
        }, 2000);
      } else {
        setSubmitStatus("error");
      }
    } catch (err) {
      console.error(err);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    getData(); // Fetch data on component mount
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loading />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
            <div className="flex items-center space-x-3">
              <UserPlus className="h-8 w-8 text-white" />
              <h2 className="text-2xl font-bold text-white">
                Teacher Registration
              </h2>
            </div>
            <p className="mt-2 text-blue-100">
              Complete the form below to register as a dance teacher
            </p>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {inputs}

              <div className="pt-4 border-t border-gray-200">
                <button
                  className={`w-full md:w-auto px-6 py-3 rounded-md font-medium text-white 
                    ${
                      isSubmitting
                        ? "bg-gray-400"
                        : submitStatus === "success"
                        ? "bg-green-500"
                        : submitStatus === "error"
                        ? "bg-red-500"
                        : "bg-blue-600 hover:bg-blue-700"
                    } 
                    transition-colors duration-200 flex items-center justify-center`}
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-5 w-5" />
                      Submitting...
                    </>
                  ) : submitStatus === "success" ? (
                    <>
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Registration Successful!
                    </>
                  ) : submitStatus === "error" ? (
                    <>
                      <AlertCircle className="mr-2 h-5 w-5" />
                      Submission Failed
                    </>
                  ) : (
                    "Submit Registration"
                  )}
                </button>

                {submitStatus === "error" && (
                  <p className="mt-2 text-sm text-red-600">
                    There was an error submitting your registration. Please try
                    again.
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
