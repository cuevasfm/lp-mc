function About() {
  return (
    <div className="min-h-screen pt-[calc(70px+1rem)] pb-8 bg-black contact-page">
      <div className="container">
        {/* Header Section */}
        <div className="text-center mb-16 md:mb-20 lg:mb-24 pb-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 gradient-text">
            Sobre mí
          </h1>
          <br />
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-start max-w-7xl mx-auto">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Mi Historia */}
            <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-3xl !p-12 md:!p-16">
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">Mi Historia</h2>
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <p>
                  Soy Miguel Cuevas, un desarrollador full stack apasionado por la tecnología 
                  y la innovación. Mi viaje en el mundo de la programación comenzó hace varios 
                  años cuando descubrí el poder de crear soluciones digitales que pueden 
                  impactar positivamente en la vida de las personas.
                </p>
                <p>
                  Me especializo en el desarrollo de aplicaciones web modernas utilizando 
                  tecnologías como React, Node.js, y bases de datos tanto SQL como NoSQL. 
                  Siempre estoy en busca de nuevos desafíos y oportunidades para aprender 
                  y crecer profesionalmente.
                </p>
              </div>
            </div>

            {/* Habilidades */}
            <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-3xl !p-12 md:!p-16">
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8">Mis Habilidades</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-400 mb-4">Frontend</h3>
                  <ul className="space-y-3">
                    <li className="text-gray-300 flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                      React & Next.js
                    </li>
                    <li className="text-gray-300 flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                      JavaScript & TypeScript
                    </li>
                    <li className="text-gray-300 flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                      HTML5 & CSS3
                    </li>
                    <li className="text-gray-300 flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                      Responsive Design
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-400 mb-4">Backend</h3>
                  <ul className="space-y-3">
                    <li className="text-gray-300 flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                      Node.js & Express
                    </li>
                    <li className="text-gray-300 flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                      Python & Django/Flask
                    </li>
                    <li className="text-gray-300 flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                      RESTful APIs
                    </li>
                    <li className="text-gray-300 flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                      GraphQL
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-400 mb-4">Bases de Datos</h3>
                  <ul className="space-y-3">
                    <li className="text-gray-300 flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                      MongoDB
                    </li>
                    <li className="text-gray-300 flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                      PostgreSQL
                    </li>
                    <li className="text-gray-300 flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                      MySQL
                    </li>
                    <li className="text-gray-300 flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                      Redis
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Objetivos */}
            <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-3xl !p-12 md:!p-16">
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">Objetivos</h2>
              <p className="text-gray-300 leading-relaxed">
                Mi objetivo es continuar desarrollando soluciones innovadoras que no solo 
                cumplan con los requisitos técnicos, sino que también proporcionen una 
                experiencia excepcional al usuario. Creo firmemente en el poder de la 
                tecnología para resolver problemas complejos y mejorar procesos.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Información de Contacto */}
            <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-3xl !p-8 md:!p-10">
              <h3 className="text-xl font-semibold text-white mb-6">Información de Contacto</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="text-white">tu@email.com</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M8 6v10a2 2 0 002 2h4a2 2 0 002-2V6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">LinkedIn</p>
                    <p className="text-white">/in/tu-perfil</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">GitHub</p>
                    <p className="text-white">/tu-github</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Educación */}
            <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-3xl !p-8 md:!p-10">
              <h3 className="text-xl font-semibold text-white mb-6">Educación</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-medium text-white mb-2">Tu Título Académico</h4>
                  <p className="text-gray-300 mb-1">Universidad/Institución</p>
                  <span className="text-sm text-green-400">Año de graduación</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About