import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import OuterNavbar from './Components/Outernavbar';
import MainPage from './Components/MainPage';  // spelling fix from Minpage to MainPage
import LoginPage from './Components/LoginPage';   // Make sure ye component bana hua ho
import Signup from './Components/Signup';
import Dashboard from './Components/Dashboard';
import AddEmployee from './Components/AddEmployee';
import ManageEmployee from './Components/ManageEmployee';
import EditEmployee from './Components/EditEmployee';
// import SignupPage from './Components/SignupPage'; // Make sure ye component bana hua ho

function App() {
  return (
    <Router>
      <OuterNavbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/add-employee" element={<AddEmployee/>} />
        <Route path="/manage-employee/:id" element={<ManageEmployee />} />
        <Route path="/edit-employee/:id" element={<EditEmployee />}/>

      </Routes>
    </Router>
  );
}

export default App;
