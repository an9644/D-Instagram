import React, { useEffect, useState } from 'react';
import Sidebar from '../Components/Sidebar';
import RightSidebar from '../Components/RightSidebar';
import { ethers } from 'ethers';

const MainLayout = ({ children }) => {
  const [address, setAddress] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const storedAddress = localStorage.getItem('address');
    const storedConnected = localStorage.getItem('connected');

    if (storedAddress && storedConnected) {
      setAddress(JSON.parse(storedAddress));
      setConnected(storedConnected === 'true');
    }

    const checkConnection = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();

        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setConnected(true);
        }
      }
    };

    checkConnection();
  }, []);

  useEffect(() => {
    if (address !== null) {
      localStorage.setItem('address', JSON.stringify(address));
    }
    localStorage.setItem('connected', connected.toString());
  }, [address, connected]);

  const connectToMetamask = async (e) => {
    e.preventDefault();
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask.");
        return;
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      console.log(signer);
      setAddress(signer.address.toString());
      setConnected(true);
      alert(`${signer.address} is logged in`);
    } catch (error) {
      if (error.code === 4001) {
        // User rejected access, handle accordingly
        alert("Please grant access to your MetaMask account.");
      } else {
        // Handle other errors, potentially with a retry mechanism
        console.error("Error connecting to MetaMask:", error);
      }
    }
  };

  const disconnectFromMetamask = () => {
    setAddress(null);
    setConnected(false);
    alert("Disconnected from MetaMask");
  };

  return (
    <div className="flex h-screen bg-black text-white">
      <Sidebar
        connectToMetamask={connectToMetamask}
        disconnectFromMetamask={disconnectFromMetamask}
        connected={connected}
      />
      {children}
      {address !== null ? (
        <RightSidebar address={address.toString()} connected={connected} />
      ) : (
        <RightSidebar connected={connected} />
      )}
    </div>
  );
};

export default MainLayout;