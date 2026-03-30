import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import HowItWorks from "./HowItWorks";
import Contacts from "./Contacts"; 

const MainApp = () => (
  <Router>
    <Routes>
      <Route path="/" element={<App />} /> 
      <Route path="/how-it-works" element={<HowItWorks />} /> 
      <Route path="/contacts" element={<Contacts />} /> 
    </Routes>
  </Router>
);

export default MainApp;
