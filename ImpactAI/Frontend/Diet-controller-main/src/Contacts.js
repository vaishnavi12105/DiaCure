import React from "react";
import "./Contacts.css";
import logo from "./assets/logo.png"; 

const Contacts = () => (
  <div className="app">
    {/* Navbar */}
    <nav className="navbar">
      <img src={logo} alt="Logo" className="logo" />
      <div className="nav-links">
        <a href="/">Home</a>
        <a href="how-it-works">How it works?</a>
      </div>
    </nav>

    {/* Main Content */}
    <div className="contacts-container">
      <h1 className="contacts-title">Our Team</h1>
      <div className="contacts-grid">
        {[
          { 
            name: "", 
            linkedin: "" 
          },
          { 
            name: "", 
            linkedin: "" 
          },
          { 
            name: "", 
            linkedin: "" 
          },
          { 
            name: "", 
            linkedin: "" 
          },
          { 
            name: "", 
            linkedin: "" 
          },
          { 
            name: "", 
            linkedin: "" 
          },
        ].map((contact, index) => (
          <div className="contact-card" key={index}>
            <a 
              href={contact.linkedin} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="contact-name-link"
            >
              {contact.name}
            </a>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Contacts;
