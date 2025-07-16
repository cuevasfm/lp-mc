import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isAuthenticated, user } = useAuth()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="glassmorphism fixed top-0 left-0 right-0 z-50 transition-smooth shadow-lg shadow-black/10">
      <div className="flex justify-between items-center h-[70px] w-full mx-0 px-8">
        <div 
          className="text-2xl font-semibold text-white transition-smooth cursor-pointer hover:scale-110"
          style={{ fontFamily: 'Jost, sans-serif' }}
        >
          M
        </div>
        
        <div className="flex items-center gap-6">
          <ul className={`
            ${isMenuOpen 
              ? 'fixed top-[70px] left-0 right-0 bg-black/30 backdrop-blur-xl flex-col p-6 translate-x-0 border-t border-white/10 shadow-lg shadow-black/20' 
              : 'hidden'
            } 
            md:flex md:static md:bg-transparent md:backdrop-blur-none md:flex-row md:p-0 md:translate-x-0 md:border-t-0 md:shadow-none md:gap-6
            transition-all duration-300 ease-in-out
          `}>
            <li>
              <Link 
                to="/" 
                className="block py-2 md:py-0 text-gray-300 hover:text-accent-primary font-medium text-sm transition-smooth relative group"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-accent-primary to-accent-secondary transition-all group-hover:w-full"></span>
              </Link>
            </li>
            <li>
              <Link 
                to="/about" 
                className="block py-2 md:py-0 text-gray-300 hover:text-accent-primary font-medium text-sm transition-smooth relative group"
                onClick={() => setIsMenuOpen(false)}
              >
                Sobre Mí
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-accent-primary to-accent-secondary transition-all group-hover:w-full"></span>
              </Link>
            </li>
            <li>
              <Link 
                to="/projects" 
                className="block py-2 md:py-0 text-gray-300 hover:text-accent-primary font-medium text-sm transition-smooth relative group"
                onClick={() => setIsMenuOpen(false)}
              >
                Proyectos
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-accent-primary to-accent-secondary transition-all group-hover:w-full"></span>
              </Link>
            </li>
            <li>
              <Link 
                to="/blog" 
                className="block py-2 md:py-0 text-gray-300 hover:text-accent-primary font-medium text-sm transition-smooth relative group"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-accent-primary to-accent-secondary transition-all group-hover:w-full"></span>
              </Link>
            </li>
            <li>
              <Link 
                to="/contact" 
                className="block py-2 md:py-0 text-gray-300 hover:text-accent-primary font-medium text-sm transition-smooth relative group"
                onClick={() => setIsMenuOpen(false)}
              >
                Contacto
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-accent-primary to-accent-secondary transition-all group-hover:w-full"></span>
              </Link>
            </li>
            {isAuthenticated && (
              <li>
                <Link 
                  to="/admin" 
                  className="block py-2 md:py-0 text-accent-primary hover:text-accent-secondary font-medium text-sm transition-smooth relative group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-accent-primary to-accent-secondary transition-all group-hover:w-full"></span>
                </Link>
              </li>
            )}
            {!isAuthenticated && (
              <li>
                <Link 
                  to="/login" 
                  className="block py-2 md:py-0 text-accent-primary hover:text-accent-secondary font-medium text-sm transition-smooth relative group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-accent-primary to-accent-secondary transition-all group-hover:w-full"></span>
                </Link>
              </li>
            )}
          </ul>
          
          <button 
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 p-2"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className="flex flex-col w-5 h-4 relative">
              <span className={`
                w-full h-0.5 bg-accent-primary rounded-sm absolute transition-all
                ${isMenuOpen 
                  ? 'top-1/2 rotate-45 -translate-y-1/2' 
                  : 'top-0'
                }
              `}></span>
              <span className={`
                w-full h-0.5 bg-accent-primary rounded-sm absolute top-1/2 -translate-y-1/2 transition-all
                ${isMenuOpen ? 'opacity-0' : 'opacity-100'}
              `}></span>
              <span className={`
                w-full h-0.5 bg-accent-primary rounded-sm absolute transition-all
                ${isMenuOpen 
                  ? 'bottom-1/2 -rotate-45 translate-y-1/2' 
                  : 'bottom-0'
                }
              `}></span>
            </span>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar