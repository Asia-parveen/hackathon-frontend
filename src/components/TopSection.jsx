import React from 'react';

const TopSection = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mt-8 max-w-3xl mx-auto">
      <h2 className="text-3xl font-semibold text-gray-800">Your Current Tasks</h2>
      <div className="mt-4">
        <ul className="space-y-4">
          {/* Task Items */}
          <li className="text-lg text-gray-700 border-l-4 border-blue-500 pl-4">
            Task 1: Complete project documentation
          </li>
          <li className="text-lg text-gray-700 border-l-4 border-blue-500 pl-4">
            Task 2: Attend team meeting at 2 PM
          </li>
          <li className="text-lg text-gray-700 border-l-4 border-blue-500 pl-4">
            Task 3: Review pull requests
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TopSection;
