import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import './ReportForm.css';
import { AES } from 'crypto-js';
import contractABI from './Abi.json';
import axios from 'axios';

const encryptionKey = process.env.REACT_APP_ENCRYPTION_KEY;
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
const districtOptions = [
  'Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod',
  'Kollam', 'Kottayam', 'Kozhikode', 'Malappuram', 'Palakkad',
  'Pathanamthitta', 'Thiruvananthapuram', 'Thrissur', 'Wayanad'
];

const ReportForm = () => {
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [district, setDistrict] = useState('');
  const [exciseZone, setExciseZone] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    const initializeWeb3 = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const web3Instance = new Web3(window.ethereum);

          const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
          setContract(contractInstance);

          const accounts = await web3Instance.eth.getAccounts();
          setAccounts(accounts);

          contractInstance.events.ReportSubmitted((error, event) => {
            if (error) {
              console.error('Error processing event:', error);
            } else {
              const reportId = event.returnValues.reportId;
              console.log('Report submitted with ID:', reportId);
              // Perform any necessary actions with the submitted report
              // You can update the UI or fetch the report details using `getReport` function
            }
          });
        } catch (error) {
          console.error('Failed to connect to MetaMask:', error);
        }
      } else {
        console.error('Web3 not found. Please install MetaMask to interact with the Ethereum network.');
      }
    };

    initializeWeb3();
  }, []);

  const encryptData = (data) => {
    const encryptedData = AES.encrypt(data, encryptionKey).toString();
    return encryptedData;
  };

  const uploadToPinata = async (file) => {
    try {
      const fileData = new FormData();
      fileData.append("file", file);

      const responseData = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: fileData,
        headers: {
          pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
          pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_KEY,
          "Content-Type": "multipart/form-data",
        },
      });

      return responseData.data.IpfsHash;
    } catch (err) {
      console.log(err);
      throw new Error('Error uploading file to Pinata');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const submitter = accounts[0];

      const photoHash = photoUrl ? await uploadToPinata(photoUrl) : null;
      const videoHash = videoUrl ? await uploadToPinata(videoUrl) : null;

      await contract.methods
        .submitReport(
          encryptData(district),
          encryptData(exciseZone),
          encryptData(title),
          encryptData(description),
          encryptData(photoHash),
          encryptData(videoHash)
        )
        .send({ from: submitter });

      setDistrict('');
      setExciseZone('');
      setTitle('');
      setDescription('');
      setPhotoUrl('');
      setVideoUrl('');

      alert('Report submitted successfully!');
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('An error occurred while submitting the report. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="report-form-container">
      <div className="report-form">
        <h1 className="report-form-heading">Submit Report</h1>
        <div className="input-container">
          {/* Existing form fields */}
          {/* Existing form fields */}
          <label>
            Photo:
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhotoUrl(e.target.files[0])}
              className="report-form-input"
            />
          </label>
          <label>
            Video:
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoUrl(e.target.files[0])}
              className="report-form-input"
            />
          </label>
        </div>
        <button type="submit" className="report-form-button">
          Submit Report
        </button>
      </div>
    </form>
  );
};

export default ReportForm;
