import React, { useState } from "react";
import "../App.css";

const StepIndicator = ({ step }) => (
  <div className="step-indicator">
    <div className={`step${step === 1 ? " active" : ""}`}>1</div>
    <div className="step-line" />
    <div className={`step${step === 2 ? " active" : ""}`}>2</div>
  </div>
);

const defaultBusyness = {
  Monday: 2,
  Tuesday: 2,
  Wednesday: 2,
  Thursday: 2,
  Friday: 2,
};
const defaultAvailability = {
  Monday: { morning: true, afternoon: true, evening: false },
  Tuesday: { morning: true, afternoon: true, evening: false },
  Wednesday: { morning: true, afternoon: true, evening: false },
  Thursday: { morning: true, afternoon: true, evening: false },
  Friday: { morning: true, afternoon: true, evening: false },
};

const defaultSectionTypes = {
  inPerson: true,
  online: true,
  hybrid: true,
  lecture: true,
  tutorial: false,
  lab: true
};

const busynessLabels = ["1 class/tutorial", "2 classes/tutorials", "3 classes/tutorials", "4 classes/tutorials", "5+ classes/tutorials"];
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const bufferOptions = ["No buffer", "30 minutes", "1 hour", "1+ hours"];

const CourseForm = ({ onNext }) => {
  const [courses, setCourses] = useState("");
  const [instructors, setInstructors] = useState("");
  const [error, setError] = useState("");
  const [busyness, setBusyness] = useState(defaultBusyness);
  const [availability, setAvailability] = useState(defaultAvailability);
  const [sectionTypes, setSectionTypes] = useState(defaultSectionTypes);
  const [timeBuffer, setTimeBuffer] = useState(1); // Default to 30 minutes

  const handleBusynessChange = (day, value) => {
    setBusyness({ ...busyness, [day]: value });
  };
  const handleAvailabilityChange = (day, period) => {
    setAvailability({
      ...availability,
      [day]: {
        ...availability[day],
        [period]: !availability[day][period],
      },
    });
  };
  
  const handleSectionTypeChange = (type) => {
    setSectionTypes({
      ...sectionTypes,
      [type]: !sectionTypes[type]
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!courses.trim()) {
      setError("Please enter at least one course code.");
      return;
    }
    setError("");
    
    // Format data according to expected structure
    const formData = {
      courses,
      instructors,
      sectionTypes: {
        ...sectionTypes,
        lecture: true,
        tutorial: false,
        lab: true,
      },
      timeBuffer,
      busyness: {
        monday: busyness.Monday,
        tuesday: busyness.Tuesday,
        wednesday: busyness.Wednesday,
        thursday: busyness.Thursday,
        friday: busyness.Friday,
      },
      availability: {
        monday: availability.Monday,
        tuesday: availability.Tuesday,
        wednesday: availability.Wednesday,
        thursday: availability.Thursday,
        friday: availability.Friday,
      },
    };
    
    onNext(formData); // send to parent
  };

  return (
    <div className="form-container">
      <StepIndicator step={1} />
      <div className="form-card large">
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
          
          <div className="form-section">
            <label className="form-label">
              <span role="img" aria-label="computer">💻</span> Section Type Preference
            </label>
            <div className="section-type-options">
              <label className="checkbox-container">
                <input 
                  type="checkbox" 
                  checked={sectionTypes.inPerson} 
                  onChange={() => handleSectionTypeChange('inPerson')}
                />
                <span className="checkbox-label">In-Person</span>
              </label>
              <label className="checkbox-container">
                <input 
                  type="checkbox" 
                  checked={sectionTypes.online} 
                  onChange={() => handleSectionTypeChange('online')}
                />
                <span className="checkbox-label">Online</span>
              </label>
              <label className="checkbox-container">
                <input 
                  type="checkbox" 
                  checked={sectionTypes.hybrid} 
                  onChange={() => handleSectionTypeChange('hybrid')}
                />
                <span className="checkbox-label">Hybrid</span>
              </label>
            </div>
          </div>
          
          <div className="form-section">
            <label className="form-label">
              <span role="img" aria-label="hourglass">⏳</span> Time Buffer Between Classes
            </label>
            <div className="buffer-options">
              {bufferOptions.map((option, index) => (
                <label 
                  key={index} 
                  className={`buffer-option ${timeBuffer === index ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="timeBuffer"
                    value={index}
                    checked={timeBuffer === index}
                    onChange={() => setTimeBuffer(index)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="form-section">
            <label className="form-label">
              <span role="img" aria-label="clock">⏰</span> How busy do you want your days?
            </label>
            <div className="busyness-table">
              {days.map(day => (
                <div key={day} className="day-busyness-row">
                  <span className="day-label left-align">{day}</span>
                  <input
                    type="range"
                    min={0}
                    max={4}
                    value={busyness[day]}
                    onChange={e => handleBusynessChange(day, Number(e.target.value))}
                    className="busyness-slider"
                  />
                  <span className="busyness-label">{busynessLabels[busyness[day]]}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="form-section">
            <label className="form-label">
              <span role="img" aria-label="availability">🕒</span> Your availability per day
            </label>
            <div className="availability-table">
              <div className="availability-header">
                <span className="left-align"></span>
                <span>Morning</span>
                <span>Afternoon</span>
                <span>Evening</span>
              </div>
              {days.map(day => (
                <div className="availability-row" key={day}>
                  <span className="day-label left-align">{day}</span>
                  {["morning", "afternoon", "evening"].map(period => (
                    <label key={period} className="availability-checkbox">
                      <input
                        type="checkbox"
                        checked={availability[day][period]}
                        onChange={() => handleAvailabilityChange(day, period)}
                      />
                    </label>
                  ))}
                </div>
              ))}
            </div>
          </div>
          {error && <div className="form-error">{error}</div>}
          <button className="form-btn" type="submit">
            <span role="img" aria-label="arrow">➡️</span> Generate schedules
          </button>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;
