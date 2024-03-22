import { useState,useEffect } from 'react'
import Web3 from 'web3';
import axios from 'axios';
import { AES } from 'crypto-js';
import contractABI from './Abi.json';

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

function App() {
  const [count, setCount] = useState(0);
  const [file , setFile] =useState("");

  const handleSubmit = async (e) =>{
    e.preventDefault();
   try{
      const fileData = new FormData();
      fileData.append("file",file);

      const responseData= await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data:fileData,
        headers: {
          pinata_api_key:import.meta.env.VITE_PINATA_API_KEY,
          pinata_secret_api_key:import.meta.env.VITE_PINATA_SECRET_KEY,
          "Content-Type":"multipart/form-data",
        },
      });
      const fileUrl = "https://gateway.pinata.cloud/ipfs/" + responseData.data.IpfsHash;
      console.log(fileUrl);
   }catch(err){
    console.log(err);
   }
  }

  return (
    <div>
      <h1>IPFS</h1>
      <form>
        <input type='file' onChange={(e)=>setFile(e.target.files[0])}/>
        <button type='submit' onClick={handleSubmit}>UPLOAD</button>
      </form>
    </div>
     
  )
}

export default App
