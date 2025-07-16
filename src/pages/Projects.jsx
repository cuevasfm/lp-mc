function Projects() {
  const projects = [
    {
      id: 1,
      title: "Proyecto Web E-commerce",
      description: "Una aplicación completa de comercio electrónico con gestión de usuarios, productos y pagos.",
      technologies: ["React", "Node.js", "MongoDB", "Express"],
      status: "En desarrollo",
      statusColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      github: "#",
      demo: "#"
    },
    {
      id: 2,
      title: "Sistema de Gestión de Tareas",
      description: "Aplicación para gestionar tareas y proyectos con funcionalidades colaborativas.",
      technologies: ["React", "TypeScript", "PostgreSQL", "GraphQL"],
      status: "Planificado",
      statusColor: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      github: "#",
      demo: "#"
    },
    {
      id: 3,
      title: "API REST para Blog",
      description: "API completa para un sistema de blog con autenticación y gestión de contenido.",
      technologies: ["Python", "Django", "PostgreSQL", "Redis"],
      status: "Idea",
      statusColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      github: "#",
      demo: "#"
    }
  ]

  return (
    <div className="min-h-screen pt-[calc(70px+1rem)] pb-8 bg-black contact-page">
      <div className="container">
        {/* Header Section */}
        <div className="text-center mb-16 md:mb-20 lg:mb-24 pb-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 gradient-text">
            Mis Proyectos
          </h1>
          <br />
        </div>

        {/* Projects Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-12 mb-16">
            {projects.map(project => (
              <div key={project.id} className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-3xl !p-8 md:!p-10 hover:bg-white/[0.04] transition-all duration-300 group">
                {/* Project Header */}
                <div className="flex items-start justify-between mb-6">
                  <h3 className="text-xl md:text-2xl font-semibold text-white group-hover:text-green-400 transition-colors duration-300">
                    {project.title}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${project.statusColor} whitespace-nowrap ml-3`}>
                    {project.status}
                  </span>
                </div>
                
                {/* Project Description */}
                <p className="text-gray-300 leading-relaxed mb-6">
                  {project.description}
                </p>
                
                {/* Technologies */}
                <div className="mb-8">
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map(tech => (
                      <span key={tech} className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm font-medium border border-green-500/20">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Project Actions */}
                <div className="flex gap-3">
                  <a 
                    href={project.github} 
                    className="flex-1 px-4 py-2 bg-white/5 text-white rounded-lg border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 text-center text-sm font-medium"
                  >
                    GitHub
                  </a>
                  <a 
                    href={project.demo} 
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-all duration-200 text-center text-sm font-medium"
                  >
                    Ver Demo
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Future Projects Section */}
          <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-3xl !p-12 md:!p-16">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">Proyectos Futuros</h2>
            <p className="text-gray-300 leading-relaxed text-lg">
              Estoy siempre trabajando en nuevas ideas y proyectos. Algunos de los conceptos 
              que tengo en mente incluyen aplicaciones móviles, sistemas de inteligencia artificial, 
              y herramientas de productividad. ¡Mantente atento para ver qué viene después!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Projects