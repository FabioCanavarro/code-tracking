// Navbar.jsx
import React, { useState , useEffect , useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, ArrowRight, Phone, MapPin, Mail,  ExternalLink} from 'lucide-react'; 
import { FaWhatsapp } from 'react-icons/fa';
import './styles/navstyle.css';
import "./styles/homestyle.css";
import "./styles/pagestyle.css";


const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [shouldShowNavbar, setShouldShowNavbar] = useState(true);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY) {
        // Scrolling down
        setShouldShowNavbar(false);
      } else {
        // Scrolling up
        setShouldShowNavbar(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlNavbar);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <motion.nav 
      className="nav-container"
      initial={{ y: 0 }}
      animate={{ 
        y: shouldShowNavbar ? 0 : -100,
        transition: {
          type: "spring",
          stiffness: 100,
          damping: 20,
          duration: 0.3
        }
      }}
    >
      <div className="nav-content">
        <div className="nav-wrapper">
          <Link to="/" className="logo">
            <span className="logo-text">GreenSync</span>
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
// ember animation
const EmbersCanvas = ({ 
  color = 'rgba(255, 69, 0, 0.7)', // Default orange-red
  count = 230,
  maxSize = 4,
  minSize = 1,
  maxSpeed = 8,
  minSpeed = 0.5
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const embersRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');

    const updateCanvasSize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const emberSettings = {
      maxSize,
      minSize,
      maxSpeed,
      minSpeed,
      color,
    };

    class Ember {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 100;
        this.size = emberSettings.minSize + Math.random() * (emberSettings.maxSize - emberSettings.minSize);
        this.speed = emberSettings.minSpeed + Math.random() * (emberSettings.maxSpeed - emberSettings.minSpeed);
        this.opacity = 1;
        this.fadeRate = Math.random() * 0.02 + 0.005;
        this.color = emberSettings.color;
      }

      update() {
        this.y -= this.speed;
        this.opacity -= this.fadeRate;
        if (this.opacity <= 0) {
          this.reset();
        }
      }

      draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        // Extract base color and apply current opacity
        const baseColor = this.color.substring(0, this.color.lastIndexOf(','));
        context.fillStyle = `${baseColor}, ${this.opacity.toFixed(2)})`;
        context.fill();
      }
    }

    const initializeEmbers = () => {
      embersRef.current = [];
      for (let i = 0; i < count; i++) {
        embersRef.current.push(new Ember());
      }
    };

    const animate = () => {
      if (!canvas || !ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      embersRef.current.forEach(ember => {
        ember.update();
        ember.draw(ctx);
      });
      animationRef.current = requestAnimationFrame(animate);
    };

    // Initialize
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    initializeEmbers();
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [color, count, maxSize, minSize, maxSpeed, minSpeed]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full z-[2] pointer-events-none"
      style={{ background: 'transparent' }}
    />
  );
};
// HomePage
  const HomePage = () => {
    const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  const features = [
    {
      title: "Real-Time Monitoring",
      description: "Track soil moisture, temperature, and humidity instantly with our advanced sensor technology.",
      icon: "📊",
      color: "#43A047"
    },
    {
      title: "Smart Irrigation",
      description: "Automated watering systems that respond to real-time soil moisture data, saving water and improving efficiency.",
      icon: "💧",
      color: "#00ACC1"
    },
    {
      title: "Desktop And Mobile Compatible",
      description: "The Sleek Website is fully responsive and compatible with desktop and mobile devices.",
      icon: "💻📱",
      color: "#26A69A"
    },
    {
      title: "Global Reach",
      description: "View your farm from anywhere using our intuitive web interface.",
      icon: "🌍",
      color: "#66BB6A"
    },
    {
      title: "Smart Rebound System",
      description: "Be able to rebound the negative effect of the environment by negative feedback.",
      icon: "🌤",
      color: "#26C6DA"
    },
    {
      title: "Eco-Friendly Solutions",
      description: "Sustainable farming practices optimized for minimal environmental impact and maximum yield.",
      icon: "🌱",
      color: "#4DB6AC"
    }
  ];
  const faqs = [
    {
      question: "What is AgroBioSync?",
      answer: "AgroBioSync is an innovative agricultural technology platform that combines real-time monitoring, smart irrigation, and eco-friendly solutions to optimize farming practices."
    },
    {
      question: "How does the smart irrigation system work?",
      answer: "Our smart irrigation system uses real-time soil moisture data to automatically adjust watering schedules, ensuring optimal water usage and plant health."
    },
    {
      question: "Can I access my farm data remotely?",
      answer: "Yes, AgroBioSync provides a user-friendly web interface that allows you to view your farm data from anywhere in the world."
    },
    {
      question: "What makes AgroBioSync eco-friendly?",
      answer: "AgroBioSync promotes sustainable farming practices by optimizing resource use, reducing water waste, and utilizing organic fertilizers to minimize environmental impact."
    }
  ];
  return (
<div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
      {mounted && <EmbersCanvas color="rgba(0, 150, 255, 0.7)" />}
        <div className="hero-content">
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Transform Your Farming with
            <span>AgroBioSync Today</span>
          </motion.h1>
          <motion.p 
            className="hero-description"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Experience the future of sustainable agriculture with our innovative smart farming solutions.
          </motion.p>
          <motion.div
            className="hero-button-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Link to="/dashboard" className="hero-button">
              View Dashboard
              <ArrowRight className="button-icon" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-section">
        <div className="features-container">
          <h2 className="features-title">Key Features</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="feature-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{ '--feature-color': feature.color }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Video Section */}
      <section className="video-section">
        <div className="section-container">
          <h2 className="section-title">See AgroBioSync in Action</h2>
          <div className="video-container">
            <iframe 
              src="https://www.youtube.com/embed/E4WlUXrJgy4?fs=0&modestbranding=1&playsinline=1&control=0" 
              title="AgroBioSync Demo" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="section-container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <motion.div 
                key={index} 
                className="faq-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <h3 className="faq-question">{faq.question}</h3>
                <p className="faq-answer">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
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
            <p className="contact-info">Main: +62 (555) 123-4567</p>
            <p className="contact-info">Support: +62 (555) 987-6543</p>
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
            <p className="contact-info">Available Mon-Fri</p>
            <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="contact-link">
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
            <p className="contact-info">General: fakekelios071@gmail.com</p>
            <a href="mailto:info@company.com" className="contact-link">
              Send email <ExternalLink size={16} />
            </a>
          </motion.div>
        </div>



      </motion.div>
    </div>
  );
};




export { Navbar, HomePage, AboutPage, ContactPage };