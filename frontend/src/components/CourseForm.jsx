import { useState } from 'react';

function CourseForm({ onChange }) {
  const [courses, setCourses] = useState([{ code: '', instructor: '' }]);

  const handleChange = (index, field, value) => {
    const updated = [...courses];
    updated[index][field] = value;
    setCourses(updated);
    onChange(updated); // send data to parent
  };

  const addCourse = () => {
    if (courses.length < 7) {
      setCourses([...courses, { code: '', instructor: '' }]);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Courses</h2>
      {courses.map((course, index) => (
        <div key={index} className="mb-2">
          <input
            type="text"
            placeholder="Course Code"
            value={course.code}
            onChange={(e) => handleChange(index, 'code', e.target.value)}
            className="border px-2 py-1 rounded mr-2"
          />
          <input
            type="text"
            placeholder="Instructor (optional)"
            value={course.instructor}
            onChange={(e) => handleChange(index, 'instructor', e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>
      ))}
      <button onClick={addCourse} className="bg-blue-600 text-white px-3 py-1 mt-2 rounded">
        Add Course
      </button>
    </div>
  );
}

export default CourseForm;
