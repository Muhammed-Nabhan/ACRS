import React, { useState, useEffect } from "react";
import Web3 from "web3";
import contractABI from "./Abi.json"; // Replace with your ABI file
const contractAddress = "0xf64160f40aEf834ACEc380476ddFe452643f2fA4"; // Replace with your contract address

const TotalContractsDeployed = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [totalContractsDeployed, setTotalContractsDeployed] = useState(0);

  useEffect(() => {
    const init = async () => {
      // Connect to Metamask
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        try {
          // Request account access
          const accs = await window.ethereum.request({ method: "eth_requestAccounts" });
          setAccounts(accs);
        } catch (error) {
          console.error("User denied account access");
        }
      } else {
        console.error("No Ethereum provider detected");
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (web3 !== null) {
      const contractInstance = new web3.eth.Contract(
        contractABI, // Use contract ABI
        contractAddress // Use contract address
      );
      setContract(contractInstance);
    }
  }, [web3]);

  useEffect(() => {
    const fetchTotalContractsDeployed = async () => {
      if (contract !== null) {
        try {
          const total = await contract.methods.getTotalContractsDeployed().call({ from: accounts[0] });
          setTotalContractsDeployed(total);
        } catch (error) {
          console.error("Error fetching total contracts deployed:", error);
        }
      }
    };
    fetchTotalContractsDeployed();
  }, [contract, accounts]);

  return (
    <div>
      <h2>Total Contracts Deployed:</h2>
      <p>{totalContractsDeployed}</p>
    </div>
  );
};

export default TotalContractsDeployed;
