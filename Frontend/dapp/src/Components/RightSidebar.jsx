import React from 'react';

function RightSidebar({  connected }) {
  const storedAddress = localStorage.getItem('address');
  const parsedAddress = storedAddress ? JSON.parse(storedAddress) : null;

  return (
    <div className="ml-[0vw] text-center w-[58vh] p-4 border-l border-gray-700">
      {connected ? (
        <div className='mr-12 flex justify-end mt-3 text-lg text-white'>
          {parsedAddress ? parsedAddress.address : 'No address'}
        </div>
      ) : (
        <div className="mr-7 text-center mt-3 text-2xl">Address</div>
      )}
    </div>
  );
}

export default RightSidebar;