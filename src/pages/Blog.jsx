import { useState } from 'react'

function Blog() {
  const [selectedPost, setSelectedPost] = useState(null)
  
  const blogPosts = [
    {
      id: 1,
      title: "Construyendo mi Landing Page con React y Vite",
      excerpt: "Una guía completa sobre cómo crear una landing page moderna con efectos neón, modo oscuro y animaciones usando React y Vite.",
      date: "2024-12-15",
      tags: ["React", "Vite", "CSS", "Desarrollo Web"],
      readTime: "8 min",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      content: `
        <div class="blog-content">
          <h2>¿Por qué elegí React y Vite?</h2>
          <p>Cuando decidí crear mi nueva landing page, tenía claros algunos requisitos: quería una experiencia de usuario moderna, efectos visuales impactantes y un rendimiento excepcional. Después de evaluar varias opciones, me decidí por React con Vite por estas razones:</p>
          
          <h3>Ventajas de Vite sobre Create React App</h3>
          <ul>
            <li><strong>Arranque ultra-rápido:</strong> Vite utiliza ESBuild para el desarrollo, lo que resulta en tiempos de inicio hasta 10x más rápidos</li>
            <li><strong>Hot Module Replacement (HMR) instantáneo:</strong> Los cambios se reflejan inmediatamente sin perder el estado</li>
            <li><strong>Configuración mínima:</strong> Funciona out-of-the-box con muy poca configuración</li>
            <li><strong>Optimización automática:</strong> Rollup para producción con tree-shaking y code-splitting</li>
          </ul>

          <h2>Implementando el diseño neón</h2>
          <p>Una de las características más llamativas de mi landing page es el uso de colores neón y gradientes dinámicos. Aquí te muestro cómo implementé este efecto:</p>

          <pre><code>:root {
  --neon-cyan: #00ffff;
  --neon-purple: #b300ff;
  --neon-pink: #ff00ff;
  --gradient-primary: linear-gradient(135deg, #00ffff 0%, #b300ff 50%, #ff00ff 100%);
  --glow-cyan: 0 0 20px rgba(0, 255, 255, 0.5);
}

.btn-neon {
  background: var(--gradient-primary);
  color: white;
  box-shadow: var(--glow-cyan);
  transition: all 0.3s ease;
}

.btn-neon:hover {
  box-shadow: var(--glow-cyan), 0 0 40px rgba(0, 255, 255, 0.4);
  transform: translateY(-2px);
}</code></pre>

          <h2>El pasaporte digital animado</h2>
          <p>El elemento más único de mi landing page es sin duda el pasaporte digital animado. Este componente combina CSS animations con JavaScript para crear una experiencia interactiva:</p>

          <h3>Características del pasaporte:</h3>
          <ul>
            <li>Animación de flotación continua con CSS keyframes</li>
            <li>Efecto de glow pulsante que simula energía</li>
            <li>Información personal estilizada como un documento oficial</li>
            <li>Responsive design que se adapta a dispositivos móviles</li>
          </ul>

          <h2>Modo oscuro con Context API</h2>
          <p>Implementé un sistema de modo oscuro/claro usando React Context y localStorage para persistir la preferencia del usuario:</p>

          <pre><code>const [isDark, setIsDark] = useState(false)

useEffect(() => {
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  if (savedTheme) {
    setIsDark(savedTheme === 'dark')
  } else {
    setIsDark(prefersDark)
  }
}, [])

useEffect(() => {
  if (isDark) {
    document.documentElement.classList.add('dark-theme')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark-theme')
    localStorage.setItem('theme', 'light')
  }
}, [isDark])</code></pre>

          <h2>Optimizaciones de rendimiento</h2>
          <p>Para garantizar una experiencia fluida, implementé varias optimizaciones:</p>

          <h3>1. Lazy Loading de componentes</h3>
          <p>Utilicé React.lazy() para cargar componentes solo cuando son necesarios:</p>

          <pre><code>const About = React.lazy(() => import('./pages/About'))
const Projects = React.lazy(() => import('./pages/Projects'))</code></pre>

          <h3>2. Prefers-reduced-motion</h3>
          <p>Respeto las preferencias de accesibilidad del usuario:</p>

          <pre><code>@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}</code></pre>

          <h3>3. Optimización de imágenes</h3>
          <p>Aunque en este proyecto uso principalmente CSS para los efectos visuales, cuando trabajo con imágenes siempre implemento:</p>
          <ul>
            <li>Formato WebP con fallback</li>
            <li>Lazy loading nativo</li>
            <li>Responsive images con srcset</li>
          </ul>

          <h2>Deployment y CI/CD</h2>
          <p>Para el deployment, configuré una pipeline automatizada que:</p>
          <ul>
            <li>Ejecuta tests automatizados</li>
            <li>Construye el proyecto para producción</li>
            <li>Optimiza assets (minificación, compresión)</li>
            <li>Despliega automáticamente en cada push a main</li>
          </ul>

          <h2>Próximos pasos</h2>
          <p>Algunas mejoras que planeo implementar:</p>
          <ul>
            <li><strong>Blog dinámico:</strong> Conectar con un headless CMS como Strapi o Contentful</li>
            <li><strong>Animaciones más complejas:</strong> Integrar Framer Motion para transiciones de página</li>
            <li><strong>PWA:</strong> Convertir el sitio en una Progressive Web App</li>
            <li><strong>Analytics:</strong> Implementar tracking de usuario con Google Analytics 4</li>
          </ul>

          <h2>Conclusión</h2>
          <p>Crear esta landing page ha sido una experiencia increíble que me ha permitido experimentar con las últimas tecnologías web. La combinación de React, Vite y CSS moderno resulta en una experiencia de desarrollo muy fluida y un producto final de alta calidad.</p>

          <p>El resultado es un sitio web rápido, accesible y visualmente impactante que refleja mi personalidad como desarrollador. Si estás considerando crear tu propia landing page, te animo a que experimentes con estas tecnologías.</p>

          <p>¿Tienes alguna pregunta sobre la implementación? ¡No dudes en contactarme!</p>
        </div>
      `
    },
    {
      id: 2,
      title: "Próximamente: Tutoriales de React",
      excerpt: "Planeo crear una serie de tutoriales sobre React desde lo básico hasta conceptos avanzados.",
      date: "2024-01-20",
      tags: ["React", "Tutorial", "JavaScript"],
      readTime: "3 min",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: 3,
      title: "Mis herramientas de desarrollo favoritas",
      excerpt: "Una lista de las herramientas y extensiones que uso diariamente para ser más productivo.",
      date: "2024-01-25",
      tags: ["Productividad", "Herramientas", "VS Code"],
      readTime: "5 min",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
    }
  ]

  if (selectedPost) {
    return (
      <div className="blog">
        <div className="container">
          <div className="blog-post-full">
            <button 
              className="back-button"
              onClick={() => setSelectedPost(null)}
            >
              ← Volver al blog
            </button>
            
            <article className="full-post">
              <div className="post-header">
                <div className="post-meta">
                  <span className="post-date">{selectedPost.date}</span>
                  <span className="post-read-time">{selectedPost.readTime} de lectura</span>
                </div>
                
                <h1 className="post-title">{selectedPost.title}</h1>
                
                <div className="post-tags">
                  {selectedPost.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
              
              {selectedPost.image && (
                <div className="post-image">
                  <img 
                    src={selectedPost.image} 
                    alt={selectedPost.title}
                    loading="lazy"
                  />
                </div>
              )}
              
              <div 
                className="post-content"
                dangerouslySetInnerHTML={{ __html: selectedPost.content }}
              />
            </article>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="blog">
      <div className="container">
        <div className="blog-header">
          <h1>Mi Blog</h1>
          <p className="blog-intro">
            Pensamientos, tutoriales y experiencias sobre desarrollo web y tecnología
          </p>
        </div>

        <div className="blog-posts">
          {blogPosts.map(post => (
            <article key={post.id} className="blog-post">
              {post.image && (
                <div className="post-image-preview">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    loading="lazy"
                  />
                </div>
              )}
              
              <div className="post-content-preview">
                <div className="post-meta">
                  <span className="post-date">{post.date}</span>
                  <span className="post-read-time">{post.readTime} de lectura</span>
                </div>
                
                <h2 className="post-title">{post.title}</h2>
                <p className="post-excerpt">{post.excerpt}</p>
                
                <div className="post-tags">
                  {post.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
                
                <button 
                  className="read-more"
                  onClick={() => setSelectedPost(post)}
                >
                  Leer más →
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="blog-coming-soon">
          <div className="coming-soon-card">
            <h2>¡Más contenido pronto!</h2>
            <p>
              Estoy trabajando en crear contenido valioso para la comunidad de desarrolladores. 
              Próximamente encontrarás tutoriales, guías y reflexiones sobre:
            </p>
            <ul>
              <li>Desarrollo Frontend con React y Vue.js</li>
              <li>Backend con Node.js y Python</li>
              <li>Mejores prácticas de desarrollo</li>
              <li>Experiencias personales en proyectos</li>
              <li>Reseñas de herramientas y tecnologías</li>
            </ul>
            <p>
              <strong>¡Mantente conectado para no perderte las actualizaciones!</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Blog