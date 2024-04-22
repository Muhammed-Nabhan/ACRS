import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import CryptoJS from 'crypto-js';
import contractABI from './Abi.json';

const KEY = '62aee9049843d4979d9c55a2909981429cd3ca2234fbbb6595bd0cd27d95a017f3663ec5add807e8da44d2098801d370e56b0ba6d03431696feb19b4225d596d4ebb78a412b76971c0f2957ed35133c637612fa89a9c5d7c61c636c98a98150d514ab6322cd5a8d24db85ff9f1988de9cd657a88b510ec241b8d3de4a3d4d6edc953658d5a8b8de9627f7d50062503a9197d1bbbfc94b129d044661248ec0102184753b4cd02c30c70b0ff972ebaa1bd30bc66cb9261e1e153c5cba5739094b9a79d53ca80ccb10d661d5bf2564bd07212e80a4d58ae41866069520b7d5883151d51a5c11055266bd0866d1ce974b6f492f013fb7b2370979afd91bbe1a8fa91';
const contractAddress = '0xf64160f40aEf834ACEc380476ddFe452643f2fA4';
const decryptData = (data) => {
  try {
    const decryptedBytes = CryptoJS.AES.decrypt(data, KEY);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    return decryptedText;
  } catch (error) {
    console.error('Error decrypting data:', error);
    return '';
  }
};

const ReportViewer = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [reportIds, setReportIds] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [error, setError] = useState(null);
  const [selectedReportId, setSelectedReportId] = useState('');

  useEffect(() => {
    const initializeWeb3 = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);

          const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
          setContract(contractInstance);

          const accounts = await web3Instance.eth.getAccounts();
          setAccounts(accounts);

          // Check user's role
          const owner = await contractInstance.methods.owner().call();
          if (accounts[0] === owner) {
            setUserRole('admin');
          } else {
            const isAdmin = await contractInstance.methods.addressesWithAccess(accounts[0]).call();
            if (isAdmin) {
              setUserRole('admin');
            } else {
              setUserRole('user');
            }
          }

          // Fetch report IDs if user is admin
          if (userRole === 'admin') {
            try {
              const reportIds = await contractInstance.methods.getAllReportIds().call({ from: accounts[0] });
              console.log('Report IDs fetched:', reportIds);
              setReportIds(reportIds);

              // Fetch details for the first report initially
              if (reportIds.length > 0) {
                await fetchReportById(reportIds[0]);
              }
            } catch (error) {
              console.error('Error fetching report IDs:', error);
              setError('Failed to fetch report IDs.');
            }
          }
        } catch (error) {
          console.error('Error initializing Web3:', error);
          setError('Failed to initialize Web3.');
        }
      } else {
        setError('MetaMask not found. Please install MetaMask to interact with the Ethereum network.');
      }
    };

    initializeWeb3();
  }, []);

  const fetchReportById = async (reportId) => {
    try {
      const report = await contract.methods.getReportById(reportId).call();
      setSelectedReport(report);
    } catch (error) {
      console.error('Error fetching report data:', error);
      setError('Failed to fetch report data.');
    }
  };

  const handleReportSelection = async (event) => {
    const reportId = event.target.value;
    setSelectedReportId(reportId);
    await fetchReportById(reportId);
  };

  return (
    <div>
      {error && <p>{error}</p>}
      {userRole === 'admin' ? (
        <div>
          <select value={selectedReportId} onChange={handleReportSelection}>
            <option value="" disabled>Select a report</option>
            {reportIds.map((reportId, index) => (
              <option key={index} value={reportId}>{reportId}</option>
            ))}
          </select>

          {selectedReport && (
            <div>
              <p>District: {decryptData(selectedReport.district)}</p>
              <p>Area: {decryptData(selectedReport.Area)}</p>
              <p>Title: {decryptData(selectedReport.title)}</p>
              <p>Description: {decryptData(selectedReport.description)}</p>
              <video controls>
                <source src={decryptData(selectedReport.videoHash)} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <img src={decryptData(selectedReport.photoHash)} alt="Report" />
            </div>
          )}
        </div>
      ) : (
        <p>You are not authorized to view reports.</p>
      )}
    </div>
  );
};

export default ReportViewer;
