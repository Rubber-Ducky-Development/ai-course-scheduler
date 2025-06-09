import React, { useState } from "react";
import CourseForm from "../components/CourseForm";
import parseScheduleText from "../utils/parseScheduleText";

export default function SchedulePage() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:5000/api/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const text = await res.text(); // backend sends plain text
      const parsed = parseScheduleText(text); // convert to arrays
      setSchedules(parsed);
    } catch (err) {
      setError("Could not get schedule.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <CourseForm onNext={handleFormSubmit} />

      {loading && <p className="text-blue-500 mt-4">Loading schedules...</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {schedules.map((schedule, idx) => (
        <div key={idx} className="mt-6 border p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Schedule {idx + 1}</h3>
          <ul className="mt-2 list-disc list-inside">
            {schedule.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
