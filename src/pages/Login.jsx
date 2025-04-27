import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const myapiUrl = import.meta.env.VITE_API_URL;

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${myapiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Login successful!");
        localStorage.setItem("token", data.token);
        navigate("/taskboard"); // Bas ek simple page par redirect kar diya
      } else {
        alert(data.message || "Login failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Login to Your Account</h2>

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
          Login
        </button>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 font-medium hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;




// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';

// const myapiUrl = import.meta.env.VITE_API_URL;

// const Login = () => {
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const navigate = useNavigate(); // Hook to programmatically navigate

//   // Handle change in form inputs
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await fetch(`${ myapiUrl }/api/auth/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });
  
//       const data = await res.json();
  
//       console.log('Response Data:', data); // Log the response data
  
//       if (res.ok) {
//         alert("Login successful!");
//         localStorage.setItem("token", data.token); // Store the token in local storage
  
//         // Log the role to check what we are receiving
//         console.log('User Role:', data.role);
  
//         // Redirect based on user role
//         if (data.role === 'admin') {
//           console.log('Redirecting to admin page');
//           navigate("/admin"); // Navigate to admin page
//         } else if (data.role === 'user') {
//           console.log('Redirecting to taskboard');
//           navigate("/taskboard"); // Navigate to taskboard page
//         } else {
//           alert("Role not recognized.");
//         }
//       } else {
//         alert(data.message || "Login failed.");
//       }
//     } catch (err) {
//       alert("Something went wrong!");
//       console.error(err);
//     }
//   };
  

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6"
//       >
//         <h2 className="text-2xl font-bold text-center text-gray-800">Login to Your Account</h2>

//         <input
//           type="email"
//           name="email"
//           placeholder="Email Address"
//           value={formData.email}
//           onChange={handleChange}
//           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           required
//         />

//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={handleChange}
//           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           required
//         />

//         <button
//           type="submit"
//           className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300"
//         >
//           Login
//         </button>

//         <p className="text-center text-sm text-gray-600">
//           Don't have an account?{' '}
//           <Link to="/signup" className="text-blue-600 font-medium hover:underline">
//             Sign Up
//           </Link>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default Login;


