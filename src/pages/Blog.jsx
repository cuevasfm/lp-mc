function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: "Bienvenidos a mi blog",
      excerpt: "Este es el primer post de mi blog personal donde compartiré mis experiencias en desarrollo web.",
      date: "2024-01-15",
      tags: ["Blog", "Desarrollo Web", "Personal"],
      readTime: "2 min"
    },
    {
      id: 2,
      title: "Próximamente: Tutoriales de React",
      excerpt: "Planeo crear una serie de tutoriales sobre React desde lo básico hasta conceptos avanzados.",
      date: "2024-01-20",
      tags: ["React", "Tutorial", "JavaScript"],
      readTime: "3 min"
    },
    {
      id: 3,
      title: "Mis herramientas de desarrollo favoritas",
      excerpt: "Una lista de las herramientas y extensiones que uso diariamente para ser más productivo.",
      date: "2024-01-25",
      tags: ["Productividad", "Herramientas", "VS Code"],
      readTime: "5 min"
    }
  ]

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
              
              <a href="#" className="read-more">
                Leer más →
              </a>
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