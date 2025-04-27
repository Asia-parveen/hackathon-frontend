import React from 'react';
import { useNavigate } from 'react-router-dom'; // React Router navigation

import TopSection from '../components/TopSection';

const Home = () => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/signup');  // Navigate to SignUp page
  };

  const handleLogin = () => {
    navigate('/login');  // Navigate to Login page
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex flex-col justify-center items-center text-white">
      <div className="text-center mb-10 max-w-xl mx-auto">
        <h1 className="text-5xl font-bold">Welcome to Task Management</h1>
        <p className="text-xl mt-4">Organize your tasks and stay productive with ease.</p>
      </div>

      {/* Top Section */}
      <TopSection />

      <div className="flex justify-center space-x-6 mt-8">
        <button 
          onClick={handleSignUp} 
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg transition transform hover:scale-105 hover:bg-blue-700"
        >
          Sign Up
        </button>

        <button 
          onClick={handleLogin} 
          className="px-8 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-lg transition transform hover:scale-105 hover:bg-gray-700"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Home;




