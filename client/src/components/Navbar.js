import { Link } from "react-router-dom";
import '../styles/Navbar.css';
import { useState, useEffect } from "react";
import ProgressCircle from './ProgressCircle';

const Navbar = ({ totalTasks, completedTasks }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Track window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close menu when link is clicked on mobile
  const handleLinkClick = () => {
    if (windowWidth <= 768) {
      setIsOpen(false);
    }
  };

  // Toggle menu open/closed
  const toggleMenu = () => {
    setIsOpen(!isOpen);
    
    // Toggle class on App container for shifting content
    const appElement = document.querySelector('.App');
    if (appElement) {
      if (!isOpen) {
        appElement.classList.add('nav-open');
      } else {
        appElement.classList.remove('nav-open');
      }
    }
  };
  return (
    <>
    {/* Hamburger Menu Button */}
    <div className="menu-toggle" onClick={toggleMenu}>
      <span></span>
      <span></span>
      <span></span>
    </div>

    {/* Navigation */}
    <nav className={isOpen ? 'open' : ''}>
      <h1 className="taskr-heading">
        <span className="taskr-title">Taskr</span>
        {/* <span className="material-symbols-outlined">cognition_2</span> */}
      </h1>

      <div>
        <Link to="/" className="nav-link" onClick={handleLinkClick}>Home</Link>
        <Link to="/tasks/new" className="nav-link" onClick={handleLinkClick}>+ New Task</Link>
        <Link to="/statistics" className="nav-link" onClick={handleLinkClick}>Statistics</Link>
      </div>

      <div className="progress-circle-container">
        <ProgressCircle totalTasks={totalTasks} completedTasks={completedTasks} />
      </div>
    </nav>
  </>
);
};


export default Navbar;
