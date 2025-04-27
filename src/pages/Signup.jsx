import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const myapiUrl = import.meta.env.VITE_API_URL;

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await fetch(`${myapiUrl}/api/auth/signup`, { // No space here!
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      if (!res.ok) {
        const errorData = await res.json(); // Capture the error details
        alert(errorData.message || "Signup failed.");
        return;
      }
  
      const data = await res.json();
      alert("Signup successful!");
      window.location.href = "/login";
    } catch (err) {
      console.error("Error during fetch:", err); // Log detailed error
      alert("Something went wrong! Please try again.");
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Create an Account</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300"
        >
          Sign Up
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;




// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';

// const myapiUrl = import.meta.env.VITE_API_URL;
// const Signup = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     role: 'user'
//   });

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value // Dynamically update the specific field
//     });
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log(formData); // This will help you confirm if the data is correct.
//     try {
//       const res = await fetch(`${ myapiUrl}/api/auth/signup`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         alert("Signup successful!");
//         window.location.href = "/login";
//       } else {
//         alert(data.message || "Signup failed.");
//       }
//     } catch (err) {
//       console.error(err); // This will help catch any errors during the fetch
//       alert("Something went wrong!");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6"
//       >
//         <h2 className="text-2xl font-bold text-center text-gray-800">Create an Account</h2>

//         <input
//           type="text"
//           name="name"
//           placeholder="Name"
//           value={formData.name}
//           onChange={handleChange} // Handle change for name input
//           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           required
//         />

//         <input
//           type="email"
//           name="email"
//           placeholder="Email Address"
//           value={formData.email}
//           onChange={handleChange} // Handle change for email input
//           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           required
//         />

//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={handleChange} // Handle change for password input
//           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           required
//         />

//         <select
//           name="role"
//           value={formData.role}
//           onChange={handleChange} // Handle change for role selection
//           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           <option value="user">User</option>
//           <option value="admin">Admin</option>
//         </select>

//         <button
//           type="submit"
//           className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300"
//         >
//           Sign Up
//         </button>

//         <p className="text-center text-sm text-gray-600">
//           Already have an account?{' '}
//           <Link to="/login" className="text-blue-600 font-medium hover:underline">
//             Login
//           </Link>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default Signup;




