import React, { useState } from 'react';
import { getReportById } from './contractMethods'; // Import the function to interact with the contract

const SearchReport = () => {
  const [reportId, setReportId] = useState('');
  const [report, setReport] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fetchedReport = await getReportById(reportId);
      setReport(fetchedReport);
    } catch (error) {
      console.error('Error fetching report:', error);
      alert('Failed to fetch report');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={reportId}
          onChange={(e) => setReportId(e.target.value)}
          placeholder="Enter report ID"
          required
        />
        <button type="submit">Search</button>
      </form>
      {report && (
        <div>
          <h2>Report Details</h2>
          <p>District: {report.district}</p>
          <p>Area: {report.Area}</p>
          <p>Title: {report.title}</p>
          <p>Description: {report.description}</p>
          {/* Add more fields as needed */}
        </div>
      )}
    </div>
  );
};

export default SearchReport;
