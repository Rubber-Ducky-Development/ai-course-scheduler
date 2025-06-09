import { useState } from 'react';
import CourseForm from './components/CourseForm';

function App() {
  const [courseData, setCourseData] = useState([]);

  const handleCourseChange = (updatedCourses) => {
    setCourseData(updatedCourses);
    console.log('Updated:', updatedCourses); // just for testing
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Termwise</h1>
      <CourseForm onChange={handleCourseChange} />
    </div>
  );
}

export default App;
