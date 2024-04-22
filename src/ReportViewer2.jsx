import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import contractABI from './Abi.json';

function App({userAccount}) {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [reportIds, setReportIds] = useState([]);
  const [selectedReportId, setSelectedReportId] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    async function init() {
      // Connect to MetaMask provider
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);
          const contractInstance = new web3Instance.eth.Contract(
            contractABI,
             '0xf64160f40aEf834ACEc380476ddFe452643f2fA4'
            
          );
          setContract(contractInstance);
        } catch (error) {
          console.error(error);
          setError("Please connect to MetaMask and switch to the correct network.");
        }
      }
    }
    init();
  }, []);

  useEffect(() => {
    async function fetchReportIds() {
      if (contract) {
        try {
          const ids = await contract.methods.getAllReportIds().call({ from: userAccount });
          setReportIds(ids);
          setError(null); // Reset error if fetching succeeds
        } catch (error) {
          console.error(error);
          setError("Failed to fetch report IDs. Ensure you're an admin.");
        }
      }
    }
    fetchReportIds();
  }, [contract]);

  const handleSelectChange = (e) => {
    setSelectedReportId(e.target.value);
  };

  return (
    <div>
      <h1>Select Report ID</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <select value={selectedReportId} onChange={handleSelectChange}>
        <option value="">Select a report ID</option>
        {reportIds.map((id, index) => (
          <option key={index} value={id}>
            {id}
          </option>
        ))}
      </select>
    </div>
  );
}

export default App;
