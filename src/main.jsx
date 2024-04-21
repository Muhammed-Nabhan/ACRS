import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Web3 from 'web3';
import contractABI from './Abi.json';
import ReportForm from './ReportForm';
import Dashboard from './Dashboard';
import LoadingPage from './LoadingPage'; // Import the LoadingPage component
import SignInButton from './SignInButton'; // Assuming you have a component for sign-in button
import './App.css';

const contractAddress = import.meta.env.VITE_REACT_APP_CONTRACT_ADDRESS;

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

          setIsLoading(false); // Set isLoading to false after everything is initialized
        } catch (error) {
          console.error('Failed to connect to MetaMask:', error);
        }
      } else {
        console.error('MetaMask not found. Please install MetaMask to interact with the Ethereum network.');
      }
    };

    initializeWeb3();
  }, []);

  const grantAccess = async () => {
    try {
      await contract.methods.grantAccess(accounts[0]).send({ from: accounts[0] });
      setUserRole('admin'); // Set userRole to 'admin' after granting access
    } catch (error) {
      console.error('Error granting access:', error);
    }
  };

  return (
    <div className="app">
      {isLoading ? (
        <LoadingPage />
      ) : (
        <>
          {userRole === 'admin' ? (
            <Dashboard />
          ) : (
            <ReportForm />
          )}
        </>
      )}
      {!isLoading && userRole !== 'admin' && (
        <SignInButton onGrantAccess={grantAccess} />
      )}
    </div>
  );
};

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

export default App;
