import React from 'react';
import {Link} from 'react-router-dom'

function Sidebar({ connectToMetamask, disconnectFromMetamask, connected }) {
  return (
    <div className="w-1/6 p-4 border-r border-gray-700 fixed">
      <h2 className="text-xl font-bold mb-4">Instagram</h2>
      <ul className="space-y-4">
      <div className=' w-screen  h-16 '>
    {connected ? (
      <button onClick={disconnectFromMetamask} className='border-2 border-slate-200 mt-2 p-2 rounded-xl text-xl text-white font-bold shadow-lg shadow-slate-200 bg-slate-700  '>Disconnect</button>
    ) : (
      <button onClick={connectToMetamask} className='border-2 border-slate-700 mt-2 p-2 rounded-xl text-xl text-white font-bold shadow-lg shadow-slate-200 bg-slate-700  '>Connect to MetaMask</button>
    )}
    </div>
        <div className='flex flex-col justify-center gap-4 '>
        <Link to='/' className="hover:shadow-sm hover:shadow-slate-500 rounded-xl w-44  p-1 cursor-pointer hover:text-gray-400">🏠 Home</Link>
        <Link className="hover:shadow-sm hover:shadow-slate-500 rounded-xl w-44  p-1 cursor-pointer hover:text-gray-400">🔍 Search</Link>
        <Link className="hover:shadow-sm hover:shadow-slate-500 rounded-xl w-44  p-1 cursor-pointer hover:text-gray-400">🧭 Explore</Link>
        <Link className="hover:shadow-sm hover:shadow-slate-500 rounded-xl w-44 p-1 cursor-pointer hover:text-gray-400">🎥 Reels</Link>
        <Link className="hover:shadow-sm hover:shadow-slate-500 rounded-xl w-44  p-1 cursor-pointer hover:text-gray-400">✉️ Messages</Link>
        <Link className="hover:shadow-sm hover:shadow-slate-500 rounded-xl w-44  p-1 cursor-pointer hover:text-gray-400">❤️ Notifications</Link>
        <Link to='/addpost' className="hover:shadow-sm hover:shadow-slate-500 rounded-xl w-44  p-1 cursor-pointer hover:text-gray-400">➕ Create</Link>
        <Link to='/profile' className="hover:shadow-sm hover:shadow-slate-500 rounded-xl w-44  p-1 cursor-pointer hover:text-gray-400">👤 Profile</Link>
        </div>
      </ul>
      
  
    </div>
  );
}

export default Sidebar;