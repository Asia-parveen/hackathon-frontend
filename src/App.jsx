import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
// import About from './pages/About';
import Navbar from './components/Navbar';
import Signup from './pages/Signup';
import Login from './pages/Login';

// import Dashboard from './pages/Dashboard';
import TaskBoard from './pages/TaskBoard';

const App = () => {
  return (
    <BrowserRouter>
      <Navbar /> {/* ✅ Ab yeh Router ke andar hai */}
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/about" element={<About />} /> */}
      
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/taskboard" element={<TaskBoard/>} />
        
       
      </Routes>
    </BrowserRouter>
  );
}

export default App;

