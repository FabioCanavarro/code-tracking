// Navbar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react'; 
import './styles/navstyle.css';
import "./styles/homestyle.css";
import "./styles/pagestyle.css";

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <motion.nav 
      className="nav-container"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="nav-content">
        <div className="nav-wrapper">
          <Link to="/" className="logo">
            <span className="logo-text">AgroBioSync</span>
          </Link>
          
          <button className="mobile-menu-btn" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
            {[
              { name: 'Home', path: '/' },
              { name: 'About', path: '/about' },
              { name: 'Contact', path: '/contact' },
              { name: 'Dashboard', path: '/dashboard' }
            ].map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
                {location.pathname === item.path && (
                  <motion.div
                    className="nav-link-underline"
                    layoutId="underline"
                  />
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

// HomePage.jsx


const HomePage = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <motion.section 
        className="hero-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="hero-content">
          <motion.h1 
            className="hero-title fade-in"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Transform Your Farming with
            <span>AgroBioSync Today</span>
          </motion.h1>
          <motion.p 
            className="hero-description fade-in fade-in-delay-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            AgroBioSync revolutionizes agriculture by automating farming processes and promoting eco-friendly practices with our innovative organic fertilizer. Experience real-time analytics from anywhere, ensuring your farm operates at peak efficiency.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Link to="/dashboard" className="hero-button">
              View Dashboard
              <ArrowRight className="icon-right" />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <motion.div 
            className="features-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            {[
              {
                title: 'Automated Farming Solutions',
                description: 'Streamline your farming operations with our cutting-edge automation technology for increased efficiency and productivity.'
              },
              {
                title: 'Real-Time Analytics',
                description: 'Access vital data anytime, anywhere to make informed decisions and optimize your farming practices.'
              },
              {
                title: 'Eco-Friendly Fertilizer',
                description: 'Utilize our organic fertilizer to promote sustainable agriculture and improve soil health naturally.'
              },
              {
                title: 'Join the Revolution',
                description: 'Experience the future of agriculture with AgroBioSync—where technology meets sustainability for better yields.'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="feature-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};


// AboutPage.jsx
const AboutPage = () => {
  return (
    <div className="page-container">
      <div className="page-content">
        <motion.div
          className="fade-in"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <h1 className="page-title">About Us</h1>
          <div className="page-sections">
            <section className="page-section fade-in fade-in-delay-1">
              <h2 className="section-title">Our Mission</h2>
              <p className="page-text">
                At AgroBioSync, were committed to revolutionizing agriculture through sustainable technology and innovative solutions. Our mission is to empower farmers with the tools they need to maximize efficiency while minimizing environmental impact.
              </p>
            </section>
            
            <section className="page-section fade-in fade-in-delay-2">
              <h2 className="section-title">Our Story</h2>
              <p className="page-text">
                Founded by a team of agricultural experts and technology innovators, AgroBioSync emerged from a shared vision of transforming traditional farming practices into sustainable, data-driven operations.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// ContactPage.jsx
const ContactPage = () => {
  return (
    <div className="page-container">
      <div className="page-content">
        <motion.div
          className="fade-in"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <h1 className="page-title">Contact Us</h1>
          <div className="contact-form-container fade-in fade-in-delay-1">
            <form className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" className="form-input" />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" className="form-input" />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" className="form-textarea"></textarea>
              </div>
              
              <button type="submit" className="submit-button">Send Message</button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};



export { Navbar, HomePage, AboutPage, ContactPage };