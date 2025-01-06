import React, { useState ,useEffect} from 'react';
import axios from 'axios';
import ABI from '../assets/Decentragram.json';
import address from '../assets/deployed_addresses.json';
import * as ethers from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import MainLayout from '../Layout/MainLayout';
import {  useNavigate } from 'react-router-dom';

const AddPost = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState(() => {
    const storedImages = localStorage.getItem('images');
    return storedImages ? JSON.parse(storedImages) : [];
  });

  useEffect(() => {
    localStorage.setItem('images', JSON.stringify(images));
  }, [images]); 

  const handleChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fileData = new window.FormData();
      fileData.append("file", file);

      const responseData = await axios({
        method: 'POST',
        url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
        data: fileData,
        headers: {
          pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
          pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET_KEY,
          "Content-Type": "multipart/form-data",
        }
      });
      const hash = "https://gateway.pinata.cloud/ipfs/" + responseData.data.IpfsHash;
      setFileUrl(hash);

      const provider = new Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress(); 
      const contractInstance = new ethers.Contract(address["DinstaModule#Decentragram"], ABI.abi, signer);

      const transaction = await contractInstance.uploadImage(
        hash,
        description,
        {
          gasLimit: 7920027,
        },
      );

      console.log('Transaction receipt:', transaction);
      alert('Image added successfully!');

      const newImage = {
        id: Date.now(),
        url: hash,
        description: description,
        tipAmount: 0,
        author: userAddress, 
      };

      setImages((prevState) => [...prevState, newImage]);
    navigate('/', { state: { images: [...images, newImage] } });
    } catch (error) {
      console.error('Error interacting with the contract:', error);
    }
  };

  return (
    <MainLayout>
      <div className='border-2 border-slate-900 mr-28 bg-slate-700 ml-[55vh] rounded-xl h-72 mt-56 w-[90vh]'>
        <form action="" onSubmit={handleSubmit} className='flex justify-center'>
          <div className="bg-slate-700 p-4  rounded-lg w-[500px]">
            <label className='rounded-md cursor-pointer'>
              <div className="text-center border-2 border-slate-400 text-slate-900 shadow-xl h-10 p-1 text-2xl font-bold ml-2 rounded-xl bg-slate-400 w-full">Select Picture..</div>
              <input type="file" style={{ display: "none" }} id='image' accept='.jpg, .jpeg, .png, .bmp, .gif' required onChange={(e) => setFile(e.target.files[0])} />
            </label>
            <br />

            <input type="text" id="description" value={description} onChange={handleChange} className='mt-3 w-full h-10 mb-2 text-black rounded-xl' placeholder='  Post Description..' required />
            <button type='submit' className='bg-slate-400 w-32 ml-44 rounded-lg p-1 text-xl mb-2 mt-16'>Upload!!</button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default AddPost;