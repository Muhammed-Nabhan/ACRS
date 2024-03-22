import React, { useState, useEffect } from "react";
import "../App.css";
import crimeImage from '../assets/crime-related-image.jpg'; // Import your crime-related image
import App from './App'; // Import your main React component

const Load = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay with setTimeout
    const timer = setTimeout(() => {
      setLoading(false); // Set loading to false after 2 seconds (you can adjust the delay as needed)
    }, 2000);

    // Cleanup function to clear the timer
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="loading-page-container">
      <img
        src={crimeImage}
        alt="Crime Related Image"
        className="crime-related-image"
      />
      {loading ? (
        <div className="loading-spinner">
          {/* You can use any loading animation or spinner here */}
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      ) : (
        <App /> // Render your main React component once loading is complete
      )}
    </div>
  );
};

export default Load;
