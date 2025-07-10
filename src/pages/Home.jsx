function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="gradient-text">custom</span>
              <span className="gradient-text">dev</span>
            </h1>
            <p className="hero-subtitle">
            </p>
            <div className="hero-buttons">
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div className="container">
          <h2>Contacto</h2>
          {/* <p>
            Interesado en desarrollar tu proyecto personalizado?
          </p> */}
          <div className="contact-info">
            <a href="mailto:cuevasfm@gmail.com" className="contact-link">
              cuevasfm@gmail.com
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home