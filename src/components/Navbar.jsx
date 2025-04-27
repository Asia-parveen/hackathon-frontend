import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa'; // FaShoppingCart hata diya
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/images/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logged out successfully!");
    closeMenu();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 shadow-md">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">

        {/* Left - Logo */}
        <div className="flex items-center space-x-2">
          <img src={Logo} alt="Food Logo" className="h-10 w-10 object-cover rounded-full" />
          <span className="text-lg font-semibold">A MERN Stack Task Management Challenge</span>
        </div>

        {/* Hamburger Icon - Mobile Only */}
        <div className="md:hidden text-2xl cursor-pointer" onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* Center - Links (Desktop) */}
        <div className="hidden md:flex space-x-8 items-center">
          <Link to="/" className="hover:underline">Home</Link>
       

         

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-100 transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/signup" className="hover:underline">Signup</Link>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/taskboard" className="hover:underline">TaskBoard</Link>
            </>
          )}
        </div>

        {/* Right - (Cart Icon removed) */}
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-700 p-4 space-y-4 mt-2 rounded-md text-center">
          <Link to="/" className="block hover:underline" onClick={closeMenu}>Home</Link>
         

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="w-full text-center text-blue-600 bg-white px-4 py-2 rounded hover:bg-gray-100 transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/signup" className="block hover:underline" onClick={closeMenu}>Signup</Link>
              <Link to="/login" className="block hover:underline" onClick={closeMenu}>Login</Link>
              <Link to="/taskboard" className="hover:underline">TaskBoard</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;




// import React, { useState } from 'react';
// import { FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';
// import { Link, useNavigate } from 'react-router-dom';
// import Logo from '../assets/images/logo.png';

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const navigate = useNavigate();
//   const isLoggedIn = !!localStorage.getItem("token");

//   const toggleMenu = () => setIsOpen(!isOpen);
//   const closeMenu = () => setIsOpen(false);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     alert("Logged out successfully!");
//     closeMenu();
//     navigate("/login");
//   };

//   return (
//     <nav className="bg-blue-600 text-white px-6 py-4 shadow-md">
//       <div className="max-w-screen-xl mx-auto flex items-center justify-between">

//         {/* Left - Logo */}
//         <div className="flex items-center space-x-2">
//           <img src={Logo} alt="Food Logo" className="h-10 w-10 object-cover rounded-full" />
//           <span className="text-lg font-semibold">LoanPortal</span>
//         </div>

//         {/* Hamburger Icon - Mobile Only */}
//         <div className="md:hidden text-2xl cursor-pointer" onClick={toggleMenu}>
//           {isOpen ? <FaTimes /> : <FaBars />}
//         </div>

//         {/* Center - Links (Desktop) */}
//         <div className="hidden md:flex space-x-8 items-center">
//           <Link to="/" className="hover:underline">Home</Link>
//           {/* <Link to="/about" className="hover:underline">About</Link> */}
//           {/* <Link to="/product" className="hover:underline">Product</Link> */}
//           <Link to="/admin" className="hover:underline">AdmonDashboard</Link>

//           {isLoggedIn ? (
//             <button
//               onClick={handleLogout}
//               className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-100 transition"
//             >
//               Logout
//             </button>
//           ) : (
//             <>
//               <Link to="/signup" className="hover:underline">Signup</Link>
//               <Link to="/login" className="hover:underline">Login</Link>
//             </>
//           )}
//         </div>

//         {/* Right - Cart Icon (Desktop) */}
//         <div className="hidden md:block text-2xl">
//           <FaShoppingCart className="cursor-pointer" />
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {isOpen && (
//         <div className="md:hidden bg-blue-700 p-4 space-y-4 mt-2 rounded-md text-center">
//           <Link to="/" className="block hover:underline" onClick={closeMenu}>Home</Link>
//           {/* <Link to="/about" className="block hover:underline" onClick={closeMenu}>About</Link> */}

//           {isLoggedIn ? (
//             <button
//               onClick={handleLogout}
//               className="w-full text-center text-blue-600 bg-white px-4 py-2 rounded hover:bg-gray-100 transition"
//             >
//               Logout
//             </button>
//           ) : (
//             <>
//               <Link to="/signup" className="block hover:underline" onClick={closeMenu}>Signup</Link>
//               <Link to="/login" className="block hover:underline" onClick={closeMenu}>Login</Link>
//             </>
//           )}

//           <FaShoppingCart className="mx-auto text-2xl mt-2 cursor-pointer" />
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;




