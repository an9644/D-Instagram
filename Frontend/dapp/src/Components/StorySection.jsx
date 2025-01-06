import React from 'react';

function StorySection() {
  return (
    <div className="flex space-x-4  mb-4 p-2  border-gray-700 ">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="flex-shrink-0 w-16 h-16 rounded-full bg-gray-600 flex items-center justify-center text-sm">
          Story {index + 1}
        </div>
      ))}
    </div>
  );}
export default StorySection;
