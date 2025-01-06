import React, { useState, useEffect } from 'react';
import MainLayout from '../Layout/MainLayout';
import { ethers } from 'ethers';
import contractAddress from '../assets/deployed_addresses.json'
import contractABI from '../assets/Decentragram.json'
import { Web3Provider } from '@ethersproject/providers';

const Profile = () => {
  const [address, setAddress] = useState(null);
  const [images, setImages] = useState([]);
  const [contract, setContract] = useState('');

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const provider = new Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const addr = await signer.getAddress();
        setAddress(addr);

        // Initialize contract instance
        const contractInstance = new ethers.Contract(contractAddress["DinstaModule#Decentragram"],contractABI.abi, signer);
        setContract(contractInstance);

        // Fetch images from the contract
        const allImages = await contractInstance.viewImages();
        const userImages = allImages.filter((image) => image.author === addr);
        setImages(userImages);
      }
    };
    init();
  }, []);

  return (
    <MainLayout>
      <div className=" mx-[50vh] mt-24    mb-[80vh] h-screen">
        <h1 className="text-3xl font-bold text-center mb-4">Profile</h1>
        <span className="text-lg mb-4">Address: {address}</span>
        <h2 className="text-2xl font-bold mb-4">Posts:</h2>
        <div className="grid grid-cols-1 text-black gap-4">
          {images.map((image, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded-lg">
              <span className="text-lg font-bold mb-2">Post {index + 1}</span>
              <img src={`${image.hash}`} alt="Uploaded Image" className="ml-8 rounded-xl mt-5" width="300px" height="100px" />
              <span className="text-lg mb-2 mt-2">Description: {image.description}</span><br />
              <span className="text-lg mb-2">Tip Amount: {image.tipAmount} ETH</span>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;