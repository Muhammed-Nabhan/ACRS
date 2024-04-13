import React from 'react';
import loadingImage from './CR.png'; // Import the image

const LoadingPage = () => (
  <div className="loading-page">
    {/* Use the img tag to display the image */}
    <img src={loadingImage} alt="Loading" />
    <p>Loading...</p>
  </div>
);

export default LoadingPage;
