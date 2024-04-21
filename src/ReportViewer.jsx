import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import axios from 'axios';
import { AES } from 'crypto-js';

const pinataApiKey = import.meta.env.VITE_PINATA_API_KEY;
const pinataSecretApiKey = import.meta.env.VITE_PINATA_SECRET_KEY;

const contractABI = [
  {
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "AccessGranted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "AccessRevoked",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			}
		],
		"name": "grantAccess",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "reportId",
				"type": "string"
			}
		],
		"name": "NewReportSubmitted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "caller",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "reportId",
				"type": "string"
			}
		],
		"name": "OnlyAllowedReportSubmitted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "reportId",
				"type": "string"
			}
		],
		"name": "ReportReceived",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "reportId",
				"type": "string"
			}
		],
		"name": "ReportSubmitted",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			}
		],
		"name": "revokeAccess",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_district",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_Area",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_title",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_description",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_photoHash",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_videoHash",
				"type": "string"
			}
		],
		"name": "submitReport",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "addressesWithAccess",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "allReportIds",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllReportIds",
		"outputs": [
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_reportId",
				"type": "string"
			}
		],
		"name": "getReportById",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_reportId",
				"type": "string"
			}
		],
		"name": "getSenderByReportId",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getTotalContractsDeployed",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "reports",
		"outputs": [
			{
				"internalType": "string",
				"name": "district",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "Area",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "title",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "photoHash",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "videoHash",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "reportSenders",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalContractsDeployed",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const contractAddress = '0xf64160f40aEf834ACEc380476ddFe452643f2fA4';
const encryptionKey = import.meta.env.VITE_REACT_APP_ENCRYPTION_KEY;

const ReportViewer = () => {
  const [web3, setWeb3] = useState(null);
  const [contractInstance, setContractInstance] = useState(null);
  const [allReportIds, setAllReportIds] = useState([]);
  const [reportsData, setReportsData] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  const decryptData = (encryptedData) => {
    return AES.decrypt(encryptedData, encryptionKey).toString();
  };

  const fetchMultimediaContent = async (photoHash, videoHash) => {
    try {
      const photoResponse = await axios.get(photoHash, {
        headers: {
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretApiKey,
        },
      });

      const videoResponse = await axios.get(videoHash, {
        headers: {
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretApiKey,
        },
      });

      return {
        photoUrl: photoResponse.data.url,
        videoUrl: videoResponse.data.url,
      };
    } catch (error) {
      console.error('Error fetching multimedia content:', error);
      return {
        photoUrl: null,
        videoUrl: null,
      };
    }
  };

  console.log('reportsData:', reportsData);
  console.log('selectedReport:', selectedReport);

  const handleNewReportEvent = async (event) => {
	try {
	  const reportId = event.returnValues.reportId;
	  console.log("New report ID submitted:", reportId);
  
	  const latestReportIds = await contractInstance.methods.getAllReportIds().call();
	  setAllReportIds(latestReportIds);
  
	  const fetchedReportsData = [];
  
	  for (const reportId of latestReportIds) {
		const report = await contractInstance.methods.getReportById(reportId).call();
		const decryptedData = {
		  district: decryptData(report[0]),
		  Area: decryptData(report[1]),
		  title: decryptData(report[2]),
		  description: decryptData(report[3]),
		  photoHash: report[4],
		  videoHash: report[5],
		};
  
		const multimediaContent = await fetchMultimediaContent(decryptedData.photoHash, decryptedData.videoHash);
  
		fetchedReportsData.push({
		  reportId: reportId,
		  district: decryptedData.district,
		  Area: decryptedData.Area,
		  title: decryptedData.title,
		  description: decryptedData.description,
		  photoUrl: multimediaContent.photoUrl,
		  videoUrl: multimediaContent.videoUrl,
		});
		console.log("Fetched report data:", decryptedData);
		console.log("Fetched multimedia content:", multimediaContent);
	  
	  }
  
	  setReportsData(fetchedReportsData);
	  console.log("Updated reportsData:", fetchedReportsData);
  
	} catch (error) {
	  console.error('Error handling new report event:', error);
	}
  };

  const handleReportClick = (report) => {
	setSelectedReport(report);
  };

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        if (window.ethereum) {
          const newWeb3 = new Web3(window.ethereum);
          await window.ethereum.enable();
          setWeb3(newWeb3);
        } else if (window.web3) {
          const newWeb3 = new Web3(window.web3.currentProvider);
          setWeb3(newWeb3);
        } else {
          console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
        }

        if (web3) {
          const instance = new web3.eth.Contract(contractABI, contractAddress);
          setContractInstance(instance);
        }
      } catch (error) {
        console.error('Error initializing Web3:', error);
      }
    };

    initWeb3();

    if (contractInstance) {
      const newReportEvent = contractInstance.events.NewReportSubmitted();
      newReportEvent.on('data', handleNewReportEvent);

      return () => {
        newReportEvent.removeAllListeners();
      };
    }
  }, [contractInstance]);

  return (
    <div>
      <h1>All Reports today</h1>
      <ul>
        {reportsData.map((report, index) => (
          <li key={index} onClick={() => handleReportClick(report.reportId)}>
            <p>Report ID: {report.reportId}</p>
            <p>District: {report.district}</p>
            <p>Area: {report.Area}</p>
            <p>Title: {report.title}</p>
          </li>
        ))}
      </ul>
      {selectedReport && (
        <div>
          <h2>Selected Report</h2>
          <p>Report ID: {selectedReport.reportId}</p>
          <p>District: {selectedReport.district}</p>
          <p>Area: {selectedReport.Area}</p>
          <p>Title: {selectedReport.title}</p>
          <p>Description: {selectedReport.description}</p>
          {selectedReport.photoUrl && <img src={selectedReport.photoUrl} alt="Photo" />}
          {selectedReport.videoUrl && (
            <video controls>
              <source src={selectedReport.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportViewer;
