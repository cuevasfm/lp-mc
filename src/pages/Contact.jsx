import { useState, useEffect } from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import contactApi from '../services/contactApi';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [captcha, setCaptcha] = useState({ question: '', answer: '' });
  const [userCaptchaAnswer, setUserCaptchaAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = async () => {
    try {
      const data = await contactApi.generateCaptcha();
      setCaptcha(data);
      setUserCaptchaAnswer('');
    } catch (error) {
      console.error('Error generating captcha:', error);
      // Fallback captcha generation
      const num1 = Math.floor(Math.random() * 10) + 1;
      const num2 = Math.floor(Math.random() * 10) + 1;
      setCaptcha({
        question: `${num1} + ${num2}`,
        answer: num1 + num2
      });
      setUserCaptchaAnswer('');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Client-side validation
    const validation = contactApi.validateForm(formData, userCaptchaAnswer, captcha.answer);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      setLoading(false);
      if (validation.errors.captcha_answer) {
        generateCaptcha(); // Regenerate captcha if failed
      }
      return;
    }

    try {
      const data = await contactApi.submitContact({
        ...formData,
        captcha_question: captcha.question,
        captcha_answer: parseInt(userCaptchaAnswer)
      });

      if (data.success) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', message: '' });
        setUserCaptchaAnswer('');
        generateCaptcha();
      } else {
        setErrors(data.errors || {});
        if (data.errors?.captcha_answer) {
          generateCaptcha(); // Regenerate captcha if failed
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ general: 'Error inesperado. Por favor intenta nuevamente.' });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', paddingTop: 'calc(70px + 1rem)', paddingBottom: '2rem', backgroundColor: '#000000' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: 'calc(100vh - 140px)' 
          }}>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '1rem',
              padding: '3rem 2rem',
              textAlign: 'center',
              width: '100%',
              maxWidth: '500px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>
              <div style={{ 
                fontSize: '4rem', 
                marginBottom: '1.5rem',
                lineHeight: '1'
              }}>
                ✅
              </div>
              
              <h1 style={{
                fontSize: '2rem',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #10b981, #34d399)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '1rem',
                margin: '0 0 1rem 0'
              }}>
                ¡Mensaje Enviado!
              </h1>
              
              <p style={{
                color: '#d1d5db',
                marginBottom: '1.5rem',
                fontSize: '1.125rem',
                lineHeight: '1.6',
                margin: '0 0 1.5rem 0'
              }}>
                Gracias por contactarme. Te responderé lo antes posible.
              </p>
              
              <p style={{
                color: '#fbbf24',
                fontSize: '0.875rem',
                marginBottom: '2rem',
                padding: '0.75rem',
                backgroundColor: 'rgba(251, 191, 36, 0.1)',
                border: '1px solid rgba(251, 191, 36, 0.2)',
                borderRadius: '0.5rem',
                margin: '0 0 2rem 0'
              }}>
                Nota: El formulario está funcionando en modo demo. En producción, tu mensaje se enviaría directamente.
              </p>
              
              <button
                onClick={() => setSubmitted(false)}
                style={{
                  padding: '0.75rem 2rem',
                  backgroundColor: '#059669',
                  color: '#ffffff',
                  fontSize: '1rem',
                  fontWeight: '600',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  outline: 'none',
                  fontFamily: 'inherit',
                  transition: 'background-color 0.2s ease',
                  width: '100%',
                  maxWidth: '200px'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#047857'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#059669'}
              >
                Enviar otro mensaje
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[calc(70px+1rem)] pb-8 bg-black contact-page">
      <div className="container">
        {/* Header Section - Vercel Style */}
        <div className="text-center mb-16 md:mb-20 lg:mb-24 pb-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Contacto
          </h1>
          <br />
        </div>

        {/* Content Section - Clean Form Layout */}
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '0 1rem' }}>
          <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
            
            {/* Form Header */}
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#ffffff', marginBottom: '1rem', margin: '0 0 1rem 0' }}>
                Contacto
              </h2>
              <p style={{ color: '#9ca3af', fontSize: '1rem', margin: '0' }}>
                Cuéntame sobre tu proyecto y trabajemos juntos.
              </p>
            </div>

            {/* Contact Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {errors.general && (
                <div style={{ 
                  backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                  border: '1px solid rgba(239, 68, 68, 0.2)', 
                  borderRadius: '0.5rem', 
                  padding: '1rem', 
                  color: '#f87171', 
                  fontSize: '0.875rem' 
                }}>
                  {errors.general}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Name Field */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    color: '#ffffff',
                    margin: '0',
                    padding: '0'
                  }}>
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: 'rgba(17, 24, 39, 0.5)',
                      border: errors.name ? '1px solid #ef4444' : '1px solid #374151',
                      borderRadius: '0.5rem',
                      color: '#ffffff',
                      fontSize: '1rem',
                      outline: 'none',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Tu nombre completo"
                    required
                    onFocus={(e) => e.target.style.border = '2px solid #10b981'}
                    onBlur={(e) => e.target.style.border = errors.name ? '1px solid #ef4444' : '1px solid #374151'}
                  />
                  {errors.name && <p style={{ fontSize: '0.875rem', color: '#f87171', margin: '0' }}>{errors.name[0]}</p>}
                </div>

                {/* Email and Phone Fields */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: window.innerWidth >= 768 ? '1fr 1fr' : '1fr', 
                  gap: '1rem' 
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ 
                      fontSize: '0.875rem', 
                      fontWeight: '500', 
                      color: '#ffffff',
                      margin: '0',
                      padding: '0'
                    }}>
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        backgroundColor: 'rgba(17, 24, 39, 0.5)',
                        border: errors.email ? '1px solid #ef4444' : '1px solid #374151',
                        borderRadius: '0.5rem',
                        color: '#ffffff',
                        fontSize: '1rem',
                        outline: 'none',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box'
                      }}
                      placeholder="tu@empresa.com"
                      required
                      onFocus={(e) => e.target.style.border = '2px solid #10b981'}
                      onBlur={(e) => e.target.style.border = errors.email ? '1px solid #ef4444' : '1px solid #374151'}
                    />
                    {errors.email && <p style={{ fontSize: '0.875rem', color: '#f87171', margin: '0' }}>{errors.email[0]}</p>}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ 
                      fontSize: '0.875rem', 
                      fontWeight: '500', 
                      color: '#ffffff',
                      margin: '0',
                      padding: '0'
                    }}>
                      Teléfono (opcional)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        backgroundColor: 'rgba(17, 24, 39, 0.5)',
                        border: errors.phone ? '1px solid #ef4444' : '1px solid #374151',
                        borderRadius: '0.5rem',
                        color: '#ffffff',
                        fontSize: '1rem',
                        outline: 'none',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box'
                      }}
                      placeholder="+52 123 456 7890"
                      onFocus={(e) => e.target.style.border = '2px solid #10b981'}
                      onBlur={(e) => e.target.style.border = errors.phone ? '1px solid #ef4444' : '1px solid #374151'}
                    />
                    {errors.phone && <p style={{ fontSize: '0.875rem', color: '#f87171', margin: '0' }}>{errors.phone[0]}</p>}
                  </div>
                </div>

                {/* Message Field */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    color: '#ffffff',
                    margin: '0',
                    padding: '0'
                  }}>
                    ¿Cómo puedo ayudarte?
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    maxLength="1000"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: 'rgba(17, 24, 39, 0.5)',
                      border: errors.message ? '1px solid #ef4444' : '1px solid #374151',
                      borderRadius: '0.5rem',
                      color: '#ffffff',
                      fontSize: '1rem',
                      outline: 'none',
                      fontFamily: 'inherit',
                      resize: 'none',
                      boxSizing: 'border-box',
                      minHeight: '120px'
                    }}
                    placeholder="Cuéntame sobre tu proyecto, qué necesitas desarrollar, timeline, presupuesto estimado..."
                    required
                    onFocus={(e) => e.target.style.border = '2px solid #10b981'}
                    onBlur={(e) => e.target.style.border = errors.message ? '1px solid #ef4444' : '1px solid #374151'}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      {errors.message && <span style={{ fontSize: '0.875rem', color: '#f87171' }}>{errors.message[0]}</span>}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                      {formData.message.length}/1000
                    </div>
                  </div>
                </div>

                {/* Captcha Field */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    color: '#ffffff',
                    margin: '0',
                    padding: '0'
                  }}>
                    Verificación
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <div style={{ 
                      backgroundColor: 'rgba(34, 197, 94, 0.1)', 
                      border: '1px solid rgba(34, 197, 94, 0.2)', 
                      borderRadius: '0.5rem', 
                      padding: '0.5rem 1rem', 
                      color: '#34d399', 
                      fontSize: '0.875rem', 
                      fontWeight: '500' 
                    }}>
                      ¿Cuánto es {captcha.question}?
                    </div>
                    <input
                      type="number"
                      value={userCaptchaAnswer}
                      onChange={(e) => setUserCaptchaAnswer(e.target.value)}
                      style={{
                        width: '80px',
                        padding: '0.5rem',
                        backgroundColor: 'rgba(17, 24, 39, 0.5)',
                        border: errors.captcha_answer ? '1px solid #ef4444' : '1px solid #374151',
                        borderRadius: '0.5rem',
                        color: '#ffffff',
                        fontSize: '1rem',
                        textAlign: 'center',
                        outline: 'none',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box'
                      }}
                      placeholder="?"
                      required
                      onFocus={(e) => e.target.style.border = '2px solid #10b981'}
                      onBlur={(e) => e.target.style.border = errors.captcha_answer ? '1px solid #ef4444' : '1px solid #374151'}
                    />
                    <button 
                      type="button" 
                      onClick={generateCaptcha}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#1f2937',
                        border: '1px solid #4b5563',
                        borderRadius: '0.5rem',
                        color: '#ffffff',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        outline: 'none'
                      }}
                      title="Generar nueva pregunta"
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#374151'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#1f2937'}
                    >
                      🔄
                    </button>
                  </div>
                  {errors.captcha_answer && <p style={{ fontSize: '0.875rem', color: '#f87171', margin: '0' }}>{errors.captcha_answer[0]}</p>}
                </div>

                {/* Submit Button */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: '0.75rem 2rem',
                      backgroundColor: loading ? '#059669' : '#059669',
                      color: '#ffffff',
                      fontSize: '1rem',
                      fontWeight: '600',
                      borderRadius: '0.5rem',
                      border: 'none',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? '0.5' : '1',
                      outline: 'none',
                      fontFamily: 'inherit'
                    }}
                    onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#047857')}
                    onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#059669')}
                  >
                    {loading ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                          width: '16px',
                          height: '16px',
                          border: '2px solid rgba(255, 255, 255, 0.3)',
                          borderTop: '2px solid #ffffff',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }}></div>
                        Enviando...
                      </span>
                    ) : (
                      'Enviar mensaje'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;