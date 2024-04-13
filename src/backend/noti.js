// Initialize Web3
let web3;

// Check if Web3 is already available in the browser
if (window.ethereum) {
  web3 = new Web3(window.ethereum);
  try {
    // Request account access if needed
    await window.ethereum.enable();
  } catch (error) {
    // User denied account access...
    console.error("User denied account access");
  }
} else if (window.web3) {
  // Legacy dapp browsers...
  web3 = new Web3(window.web3.currentProvider);
} else {
  // Non-dapp browsers...
  console.error("Non-Ethereum browser detected. You should consider trying MetaMask!");
}

// Connect to the smart contract instance
const contractInstance = new web3.eth.Contract(contractABI, contractAddress);

// Function to create a notification element
function createNotification(title, time) {
  // Implement your notification creation logic here
}

// Function to display the notification and manage the notification count
function showNotification(title, time) {
  // Implement your notification display logic here
}

// Function to fetch report submission events from the smart contract
async function fetchReportSubmissionEvents() {
  const events = await contractInstance.getPastEvents('NewReportSubmitted', {
    fromBlock: 0,
    toBlock: 'latest'
  });

  events.forEach(event => {
    const reportId = event.returnValues.reportId;
    const timestamp = event.returnValues.timestamp * 1000; // Convert to milliseconds
    const formattedTime = new Date(timestamp).toLocaleString();
    showNotification(`New report submitted: ${reportId}`, formattedTime);
  });
}

// Fetch report submission events when the page loads
window.onload = async function() {
  await fetchReportSubmissionEvents();
};

// Example: Poll for new report submission events every 10 seconds
setInterval(async () => {
  await fetchReportSubmissionEvents();
}, 10000);
