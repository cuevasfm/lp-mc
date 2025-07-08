function About() {
  return (
    <div className="about">
      <div className="container">
        <div className="about-header">
          <h1>Sobre mí</h1>
          <p className="about-intro">
            Conoce más sobre mi trayectoria, experiencia y lo que me apasiona
          </p>
        </div>

        <div className="about-content">
          <div className="about-text">
            <h2>Mi Historia</h2>
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

            <h2>Mis Habilidades</h2>
            <div className="skills-section">
              <div className="skill-category">
                <h3>Frontend</h3>
                <ul>
                  <li>React & Next.js</li>
                  <li>JavaScript & TypeScript</li>
                  <li>HTML5 & CSS3</li>
                  <li>Responsive Design</li>
                </ul>
              </div>
              <div className="skill-category">
                <h3>Backend</h3>
                <ul>
                  <li>Node.js & Express</li>
                  <li>Python & Django/Flask</li>
                  <li>RESTful APIs</li>
                  <li>GraphQL</li>
                </ul>
              </div>
              <div className="skill-category">
                <h3>Bases de Datos</h3>
                <ul>
                  <li>MongoDB</li>
                  <li>PostgreSQL</li>
                  <li>MySQL</li>
                  <li>Redis</li>
                </ul>
              </div>
            </div>

            <h2>Objetivos</h2>
            <p>
              Mi objetivo es continuar desarrollando soluciones innovadoras que no solo 
              cumplan con los requisitos técnicos, sino que también proporcionen una 
              experiencia excepcional al usuario. Creo firmemente en el poder de la 
              tecnología para resolver problemas complejos y mejorar procesos.
            </p>
          </div>

          <div className="about-sidebar">
            <div className="contact-info">
              <h3>Información de Contacto</h3>
              <div className="contact-item">
                <strong>Email:</strong> tu@email.com
              </div>
              <div className="contact-item">
                <strong>LinkedIn:</strong> /in/tu-perfil
              </div>
              <div className="contact-item">
                <strong>GitHub:</strong> /tu-github
              </div>
            </div>

            <div className="education">
              <h3>Educación</h3>
              <div className="education-item">
                <h4>Tu Título Académico</h4>
                <p>Universidad/Institución</p>
                <span>Año de graduación</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About