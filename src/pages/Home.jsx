function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <div className="brand-tag">Miguel Cuevas</div>
            <h1 className="hero-title">
              <span className="gradient-text">CREADOR DE</span>
              <span className="gradient-text">SOLUCIONES</span>
              <span className="gradient-text">DIGITALES</span>
            </h1>
            <p className="hero-subtitle">
              Transformando ideas en experiencias digitales excepcionales con tecnología de vanguardia
            </p>
            <div className="hero-buttons">
              <a href="#about" className="btn btn-neon">
                Descubre mi trabajo
              </a>
              <a href="#projects" className="btn btn-outline-neon">
                Ver proyectos
              </a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="passport-container">
              <div className="animated-passport">
                <div className="passport-front">
                  <div className="passport-header">
                    <span>DIGITAL</span>
                    <span>CREATOR</span>
                  </div>
                  <div className="passport-photo">
                    <div className="photo-placeholder">MC</div>
                  </div>
                  <div className="passport-info">
                    <div className="info-line">
                      <span>NAME:</span>
                      <span>MIGUEL CUEVAS</span>
                    </div>
                    <div className="info-line">
                      <span>SKILLS:</span>
                      <span>FULL STACK</span>
                    </div>
                    <div className="info-line">
                      <span>STATUS:</span>
                      <span>CREATING</span>
                    </div>
                  </div>
                </div>
                <div className="passport-glow"></div>
              </div>
            </div>
            <div className="floating-elements">
              <div className="floating-icon code">{'</>'}</div>
              <div className="floating-icon rocket">🚀</div>
              <div className="floating-icon lightning">⚡</div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="about-preview">
        <div className="container">
          <h2>Sobre mí</h2>
          <p>
            Soy un desarrollador apasionado por la tecnología y la innovación. 
            Me encanta crear aplicaciones web modernas y funcionales que resuelvan 
            problemas reales.
          </p>
          <div className="skills">
            <span className="skill-tag">React</span>
            <span className="skill-tag">Node.js</span>
            <span className="skill-tag">JavaScript</span>
            <span className="skill-tag">Python</span>
            <span className="skill-tag">MongoDB</span>
            <span className="skill-tag">PostgreSQL</span>
          </div>
        </div>
      </section>

      <section id="projects" className="projects-preview">
        <div className="container">
          <h2>Proyectos Destacados</h2>
          <div className="projects-grid">
            <div className="project-card">
              <h3>Proyecto 1</h3>
              <p>Descripción del proyecto que desarrollarás en el futuro.</p>
              <div className="project-tech">
                <span>React</span>
                <span>Node.js</span>
              </div>
            </div>
            <div className="project-card">
              <h3>Proyecto 2</h3>
              <p>Otro proyecto increíble que planeas crear.</p>
              <div className="project-tech">
                <span>Python</span>
                <span>Flask</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home