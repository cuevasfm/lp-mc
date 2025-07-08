import { Link } from 'react-router-dom'
import { useState } from 'react'
import ThemeToggle from './ThemeToggle'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-text">Miguel Cuevas</span>
          <span className="logo-subtitle">Digital Creator</span>
        </Link>
        
        <div className="nav-right">
          <ul className={`nav-menu ${isMenuOpen ? 'nav-menu-open' : ''}`}>
            <li className="nav-item">
              <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Sobre mí
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/projects" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Proyectos
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/blog" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Blog
              </Link>
            </li>
          </ul>
          
          <ThemeToggle />
          
          <button 
            className="mobile-menu-toggle"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className={`hamburger ${isMenuOpen ? 'hamburger-open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar