import React, { useState, useEffect } from 'react';
import StorySection from './StorySection';
import {ethers} from 'ethers';
import contractAddress from '../assets/deployed_addresses.json'
import contractABI from '../assets/Decentragram.json'
import { Web3Provider } from '@ethersproject/providers';

function MainFeed(props) {
  const initialImages = props.images;
  const { parseEther } = ethers;
  const [likes, setLikes] = useState({});
  const [liked, setLiked] = useState({});
  const [localImages, setLocalImages] = useState([]);
  const [owners, setOwners] = useState({});

  useEffect(() => {
    const storedImages = localStorage.getItem('images');
    if (storedImages) {
      const images = JSON.parse(storedImages);
      const likesObject = {};
      images.forEach((image) => {
        likesObject[image.id] = 0;
      });
      setLocalImages(images);
      setLikes(likesObject);
    }
  }, []);

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const provider = new Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(contractAddress["DinstaModule#Decentragram"], contractABI.abi, signer);
    
        const owners = await Promise.all(localImages.map(async (image) => {
          try {
            const owner = await contractInstance.getImageOwner(image.id);
            return { id: image.id, owner };
          } catch (error) {
            console.error(`Error fetching owner for image ${image.id}:`, error);
            return { id: image.id, owner: null };
          }
        }));
    
        const ownersObject = owners.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.owner }), {});
        setOwners(ownersObject);
      } catch (error) {
        console.error('Error fetching owners:', error);
      }
    };
    fetchOwners();
  }, [localImages]);

  const handleLike = (imageId) => {
    try {
      if (!liked[imageId]) {
        setLikes((prevLikes) => ({ ...prevLikes, [imageId]: prevLikes[imageId] + 1 }));
        setLiked((prevLiked) => ({ ...prevLiked, [imageId]: true }));
      } else {
        setLikes((prevLikes) => ({ ...prevLikes, [imageId]: prevLikes[imageId] - 1 }));
        setLiked((prevLiked) => ({ ...prevLiked, [imageId]: false }));
      }
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };

  const handleTip = async (image) => {
    try {
      const provider = new Web3Provider(window.ethereum);
      const signer = provider.getSigner();
  
      const ownerAddress = image.author;
      const tipAmount = ethers.parseEther("0.01");
  
      const tx = await signer.sendTransaction({
        to: ownerAddress,
        value: tipAmount,
      });
  
      await tx.wait();
  
      console.log('Transaction receipt:', tx);
  
      // Update the tip amount in local storage
      if (!images || !Array.isArray(images)) {
        console.error('Error: images is not an array');
        return;
      }  
      const updatedImages = [...images].map((img) => {
        if (img.id === image.id) {
          return { ...img, tipAmount: img.tipAmount + 0.01 };
        }
        return img;
      });
  
      setImages(updatedImages);
      localStorage.setItem('images', JSON.stringify(updatedImages));
  
      alert("Tip sent successfully!");
    } catch (error) {
      console.error('Error handling tip:', error);
    }
  };

  return (
    <div className="flex-1 p-4 ml-[50vh]">
      <StorySection />
      <div className="overflow-y-auto  scroll  flex-1">
        {localImages.length > 0 ? (
          localImages.map((image) => (
            <div key={image.id} className="border-2 ml-24 bg-slate-800 w-[460px] rounded-lg ml-2 mt-2 shadow-md">
         < div className="text-gray-500 text-lg text-white ml-2 mt-2">Posted by: {image.author}</div>       
       <img src={image.url} alt="Uploaded Image" className="ml-20 rounded-xl mt-5" width="300px" height="100px" />
              <div className="mr-2 mt-3 text-lg ml-2 text-white">{image.description}</div>
              <div className="flex mt-2 ml-2">
                <button onClick={() => handleLike(image.id)} className="text-blue-500 hover:text-blue-700">
                  {liked[image.id] ? 'Unlike' : 'Like'}
                </button>
                <span> {likes[image.id] || 0}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2 mx-2 my-2 bg-slate-400 p-2 h-12">
                <div className="mt-1 ml-2">TIPS: {image.tipAmount} ETH</div>
                <button className="hover:border-2 hover:border-slate-300 p-1 ml-16" onClick={() => handleTip(image)}>Tip: 0.01 ETH</button>
              </div>
            </div>
          ))
        ) : (
          <h1 className="text-gray-500 ml-44  mt-4">No Posts available. Add some Posts!</h1>
        )}
      </div>
    </div>
  );
}
export default MainFeed;