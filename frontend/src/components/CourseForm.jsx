import React, { useState } from "react";
import "../App.css";

const StepIndicator = ({ step }) => (
  <div className="step-indicator">
    <div className={`step${step === 1 ? " active" : ""}`}>1</div>
    <div className="step-line" />
    <div className={`step${step === 2 ? " active" : ""}`}>2</div>
    <div className="step-line" />
    <div className={`step${step === 3 ? " active" : ""}`}>3</div>
  </div>
);

const CourseForm = ({ onNext }) => {
  const [courses, setCourses] = useState("");
  const [instructors, setInstructors] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!courses.trim()) {
      setError("Please enter at least one course code.");
      return;
    }
    setError("");
    onNext({ courses, instructors });
  };

  return (
    <div className="form-container">
      <StepIndicator step={1} />
      <div className="form-card">
        <h2 className="form-title">
          <span role="img" aria-label="calendar">📅</span> Create Your Schedule
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <label htmlFor="courses" className="form-label">
              <span role="img" aria-label="book">📚</span> Course Codes <span className="required">*</span>
            </label>
            <input
              id="courses"
              className="form-input"
              type="text"
              placeholder="e.g. COMP 1405, MATH 1007"
              value={courses}
              onChange={e => setCourses(e.target.value)}
              required
            />
            <div className="form-hint">Enter course codes separated by commas.</div>
          </div>
          <div className="form-section">
            <label htmlFor="instructors" className="form-label">
              <span role="img" aria-label="teacher">👨‍🏫</span> Preferred Instructors (Optional)
            </label>
            <input
              id="instructors"
              className="form-input"
              type="text"
              placeholder="Type an instructor name and press comma or Enter"
              value={instructors}
              onChange={e => setInstructors(e.target.value)}
            />
            <div className="form-hint">Enter instructor names separated by commas.</div>
          </div>
          {error && <div className="form-error">{error}</div>}
          <button className="form-btn" type="submit">
            <span role="img" aria-label="arrow">➡️</span> Next: Preferences
          </button>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;
