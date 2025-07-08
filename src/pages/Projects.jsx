function Projects() {
  const projects = [
    {
      id: 1,
      title: "Proyecto Web E-commerce",
      description: "Una aplicación completa de comercio electrónico con gestión de usuarios, productos y pagos.",
      technologies: ["React", "Node.js", "MongoDB", "Express"],
      status: "En desarrollo",
      github: "#",
      demo: "#"
    },
    {
      id: 2,
      title: "Sistema de Gestión de Tareas",
      description: "Aplicación para gestionar tareas y proyectos con funcionalidades colaborativas.",
      technologies: ["React", "TypeScript", "PostgreSQL", "GraphQL"],
      status: "Planificado",
      github: "#",
      demo: "#"
    },
    {
      id: 3,
      title: "API REST para Blog",
      description: "API completa para un sistema de blog con autenticación y gestión de contenido.",
      technologies: ["Python", "Django", "PostgreSQL", "Redis"],
      status: "Idea",
      github: "#",
      demo: "#"
    }
  ]

  return (
    <div className="projects">
      <div className="container">
        <div className="projects-header">
          <h1>Mis Proyectos</h1>
          <p className="projects-intro">
            Aquí encontrarás una colección de proyectos que he desarrollado y otros que planeo crear
          </p>
        </div>

        <div className="projects-grid">
          {projects.map(project => (
            <div key={project.id} className="project-card">
              <div className="project-header">
                <h3>{project.title}</h3>
                <span className={`project-status ${project.status.toLowerCase().replace(' ', '-')}`}>
                  {project.status}
                </span>
              </div>
              
              <p className="project-description">{project.description}</p>
              
              <div className="project-technologies">
                {project.technologies.map(tech => (
                  <span key={tech} className="tech-tag">{tech}</span>
                ))}
              </div>
              
              <div className="project-actions">
                <a href={project.github} className="btn btn-outline">
                  GitHub
                </a>
                <a href={project.demo} className="btn btn-primary">
                  Ver Demo
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="projects-future">
          <h2>Proyectos Futuros</h2>
          <p>
            Estoy siempre trabajando en nuevas ideas y proyectos. Algunos de los conceptos 
            que tengo en mente incluyen aplicaciones móviles, sistemas de inteligencia artificial, 
            y herramientas de productividad. ¡Mantente atento para ver qué viene después!
          </p>
        </div>
      </div>
    </div>
  )
}

export default Projects