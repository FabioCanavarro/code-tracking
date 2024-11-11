// Navbar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, ArrowRight, Phone, MapPin, Mail, Clock, ExternalLink} from 'lucide-react'; 
import { FaWhatsapp } from 'react-icons/fa';
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
            <span className="logo-text"><u>TerraBloom</u></span>
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

// HomePage
const HomePage = () => {
  const features = [
    {
      title: "Real-Time Monitoring",
      description: "Track soil conditions, temperature, and humidity instantly with our advanced sensor technology.",
      icon: "📊",
      color: "#4f46e5" // Indigo
    },
    {
      title: "Smart Irrigation",
      description: "Automated watering systems that respond to real-time soil moisture data, saving water and improving efficiency.",
      icon: "💧",
      color: "#0891b2" // Cyan
    },
    {
      title: "AI-Powered Analytics",
      description: "Advanced algorithms analyze your farm's data to provide actionable insights and predictive forecasting.",
      icon: "🤖",
      color: "#7c3aed" // Violet
    },
    {
      title: "Mobile Control",
      description: "Manage your farm from anywhere using our intuitive mobile app interface.",
      icon: "📱",
      color: "#059669" // Emerald
    },
    {
      title: "Weather Integration",
      description: "Stay ahead with integrated weather forecasting and automated climate response systems.",
      icon: "🌤",
      color: "#ea580c" // Orange
    },
    {
      title: "Eco-Friendly Solutions",
      description: "Sustainable farming practices optimized for minimal environmental impact and maximum yield.",
      icon: "🌱",
      color: "#65a30d" // Lime
    }
  ];

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

      {/* Key Features Section */}
      <section className="key-features-section">
        <div className="section-container">
          <h2 className="section-title">Key Features</h2>
          <p className="section-subtitle">Discover how AgroBioSync can transform your farming operations</p>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="feature-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                style={{
                  borderColor: feature.color,
                }}
              >
                <div className="feature-icon" style={{ backgroundColor: `${feature.color}15`, color: feature.color }}>
                  {feature.icon}
                </div>
                <h3 className="feature-title" style={{ color: feature.color }}>{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Original Features Section remains the same */}
    </div>
  );
};


// AboutPage
const AboutPage = () => {
  return (
    <div className="page-container">
      <div className="page-content">
        <motion.div
          className="fade-in"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="page-title">About Us</h1>
          
          <div className="page-sections">
            <section className="page-section fade-in fade-in-delay-1">
              <h2 className="section-title">Our Mission</h2>
              <p className="page-text">
                At AgroBioSync, were committed to revolutionizing agriculture through sustainable technology and innovative solutions. 
                Our mission is to empower farmers with the tools they need to maximize efficiency while minimizing environmental impact.
              </p>
            </section>
            
            <section className="page-section fade-in fade-in-delay-2">
              <h2 className="section-title">Our Story</h2>
              <p className="page-text">
                Founded by a team of agricultural experts and technology innovators, AgroBioSync emerged from a shared vision of 
                transforming traditional farming practices into sustainable, data-driven operations.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};



// ContactPage
const ContactPage = () => {
  return (
    <div className="contact-container">
      <motion.div 
        className="contact-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="contact-title">Get in Touch</h1>
        
        <div className="contact-methods">
          <motion.div 
            className="contact-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="card-icon phone-icon">
              <Phone size={24} />
            </div>
            <h2 className="contact-type">Phone</h2>
            <p className="contact-info">Main: +1 (555) 123-4567</p>
            <p className="contact-info">Support: +1 (555) 987-6543</p>
            <a href="tel:+15551234567" className="contact-link">
              Call us now <ExternalLink size={16} />
            </a>
          </motion.div>

          <motion.div 
            className="contact-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="card-icon whatsapp-icon">
              <FaWhatsapp size={24} />
            </div>
            <h2 className="contact-type">WhatsApp</h2>
            <p className="contact-info">Available Mon-Fri, 9AM-6PM</p>
            <a href="https://wa.me/15551234567" target="_blank" rel="noopener noreferrer" className="contact-link">
              Chat on WhatsApp <ExternalLink size={16} />
            </a>
          </motion.div>

          <motion.div 
            className="contact-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="card-icon location-icon">
              <MapPin size={24} />
            </div>
            <h2 className="contact-type">Address</h2>
            <p className="contact-info">
              123 Innovation Drive<br />
              Tech Valley, CA 94025<br />
              United States
            </p>
            <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="contact-link">
              Get directions <ExternalLink size={16} />
            </a>
          </motion.div>

          <motion.div 
            className="contact-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="card-icon email-icon">
              <Mail size={24} />
            </div>
            <h2 className="contact-type">Email</h2>
            <p className="contact-info">General: info@company.com</p>
            <p className="contact-info">Support: support@company.com</p>
            <a href="mailto:info@company.com" className="contact-link">
              Send email <ExternalLink size={16} />
            </a>
          </motion.div>
        </div>

        <div className="divider"></div>

        <motion.div 
          className="business-hours"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="card-icon">
            <Clock size={24} />
          </div>
          <h2 className="hours-title">Business Hours</h2>
          <div className="hours-list">
            <div className="hours-item">
              <span>Monday - Friday</span>
              <span>9:00 AM - 6:00 PM</span>
            </div>
            <div className="hours-item">
              <span>Saturday</span>
              <span>10:00 AM - 4:00 PM</span>
            </div>
            <div className="hours-item">
              <span>Sunday</span>
              <span>Closed</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};




export { Navbar, HomePage, AboutPage, ContactPage };