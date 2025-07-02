// Simple test file to verify MetaMask connection
import React from 'react';
import ReactDOM from 'react-dom/client';

// Test if we can connect to MetaMask directly
async function testMetaMask() {
  if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log('Connected account:', accounts[0]);
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
    }
  } else {
    console.log('MetaMask is NOT installed!');
  }
}

function TestApp() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>MetaMask Connection Test</h1>
      <button 
        onClick={testMetaMask}
        style={{ 
          padding: '10px 20px', 
          fontSize: '16px',
          backgroundColor: '#037DD6',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Test MetaMask Connection
      </button>
      <p>Check the browser console (F12) for results</p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<TestApp />);
