import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import blogApi from '../services/blogApi';

function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPost() {
      try {
        setLoading(true);
        setError(null);
        
        const data = await blogApi.fetchPost(slug);
        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-[calc(70px+1rem)] pb-8 bg-black contact-page">
        <div className="container">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 text-lg">Cargando entrada...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-[calc(70px+1rem)] pb-8 bg-black contact-page">
        <div className="container">
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)]">
            <div 
              className="blogpost-error-container"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                backdropFilter: 'blur(4px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '4rem 3rem',
                textAlign: 'center',
                maxWidth: '28rem',
                width: '100%',
                margin: '0 auto',
                borderRadius: '0'
              }}
            >
              <div style={{ marginBottom: '2rem' }}>
                <svg 
                  style={{ 
                    width: '5rem', 
                    height: '5rem', 
                    margin: '0 auto 1.5rem auto', 
                    color: '#f87171' 
                  }} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              
              <h2 
                style={{ 
                  fontSize: '2.25rem', 
                  fontWeight: '700', 
                  color: '#ffffff', 
                  marginBottom: '1.5rem', 
                  lineHeight: '1.2',
                  letterSpacing: '-0.025em'
                }}
              >
                Error
              </h2>
              
              <p 
                style={{ 
                  color: '#d1d5db', 
                  marginBottom: '2.5rem', 
                  fontSize: '1.25rem', 
                  lineHeight: '1.6',
                  fontWeight: '400'
                }}
              >
                {error}
              </p>
              
              <button 
                style={{
                  padding: '1rem 2.5rem',
                  backgroundColor: '#059669',
                  color: '#ffffff',
                  fontWeight: '600',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '1.125rem',
                  letterSpacing: '0.025em'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#047857'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#059669'}
                onClick={() => navigate('/blog')}
              >
                Volver al blog
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen pt-[calc(70px+1rem)] pb-8 bg-black contact-page">
        <div className="container">
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)]">
            <div 
              className="blogpost-error-container"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                backdropFilter: 'blur(4px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '4rem 3rem',
                textAlign: 'center',
                maxWidth: '28rem',
                width: '100%',
                margin: '0 auto',
                borderRadius: '0'
              }}
            >
              <div style={{ marginBottom: '2rem' }}>
                <svg 
                  style={{ 
                    width: '5rem', 
                    height: '5rem', 
                    margin: '0 auto 1.5rem auto', 
                    color: '#fbbf24' 
                  }} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              
              <h2 
                style={{ 
                  fontSize: '2.25rem', 
                  fontWeight: '700', 
                  color: '#ffffff', 
                  marginBottom: '1.5rem', 
                  lineHeight: '1.2',
                  letterSpacing: '-0.025em'
                }}
              >
                Entrada no encontrada
              </h2>
              
              <p 
                style={{ 
                  color: '#d1d5db', 
                  marginBottom: '2.5rem', 
                  fontSize: '1.25rem', 
                  lineHeight: '1.6',
                  fontWeight: '400'
                }}
              >
                La entrada que buscas no existe o ha sido eliminada.
              </p>
              
              <button 
                style={{
                  padding: '1rem 2.5rem',
                  backgroundColor: '#059669',
                  color: '#ffffff',
                  fontWeight: '600',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '1.125rem',
                  letterSpacing: '0.025em'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#047857'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#059669'}
                onClick={() => navigate('/blog')}
              >
                Volver al blog
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
        <div className="blogpost-container !max-w-4xl !mx-auto !px-4" style={{ maxWidth: '56rem', margin: '0 auto', padding: '0 1rem' }}>
          {/* Back Button */}
          <button 
            className="inline-flex items-center !px-4 !py-3 bg-gray-900/50 text-gray-300 rounded-lg border border-white/10 hover:bg-gray-800/50 hover:text-white hover:border-white/20 transition-all duration-200 !mb-8 group"
            onClick={() => navigate('/blog')}
            style={{ padding: '0.75rem 1rem', marginBottom: '2rem' }}
          >
            <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver al blog
          </button>
          
          {/* Article */}
          <article className="bg-white/[0.00] backdrop-blur-sm border border-white/[0.1] overflow-hidden">
            {/* Featured Image */}
            {post.featured_image && (
              <div className="aspect-video overflow-hidden">
                <img 
                  src={post.featured_image} 
                  alt={post.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            {/* Article Content */}
            <div className="!p-12 md:!p-16" style={{ padding: '3rem 2rem' }}>
              {/* Post Header */}
              <header className="text-center !mb-12" style={{ marginBottom: '3rem' }}>
                {/* Meta Information */}
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400 !mb-6" style={{ marginBottom: '1.5rem' }}>
                  <span>{blogApi.formatDate(post.published_at)}</span>
                  <span>•</span>
                  <span>{blogApi.estimateReadTime(post.content)} de lectura</span>
                  {post.user && (
                    <>
                      <span>•</span>
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-xs font-semibold text-white mr-2">
                          {post.user.name.charAt(0).toUpperCase()}
                        </div>
                        <span>Por {post.user.name}</span>
                      </div>
                    </>
                  )}
                </div>
                
                {/* Title */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white !mb-6 leading-tight" style={{ marginBottom: '1.5rem' }}>
                  {post.title}
                </h1>
                
                {/* Excerpt */}
                {post.excerpt && (
                  <p className="blog-excerpt-override">
                    {post.excerpt.replace(/\s+/g, ' ').replace(/\n+/g, ' ').trim()}
                  </p>
                )}
                
                {/* Tags */}
                <div className="flex flex-wrap justify-center gap-2">
                  {post.category && (
                    <span className="inline-flex items-center rounded-md !px-3 !py-2 text-xs font-medium bg-blue-950 text-blue-400 ring-1 ring-blue-500/20 ring-inset" style={{ padding: '0.5rem 0.75rem' }}>
                      {post.category.name}
                    </span>
                  )}
                  {post.tags && post.tags.map(tag => (
                    <span 
                      key={tag.id} 
                      className="inline-flex items-center rounded-md !px-3 !py-2 text-xs font-medium bg-green-950 text-green-400 ring-1 ring-green-500/20 ring-inset"
                      style={{ padding: '0.5rem 0.75rem' }}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </header>
              
              {/* Post Content */}
              <div 
                className="prose prose-invert prose-lg max-w-none !mt-12 !text-left blogpost-content-left"
                style={{ 
                  marginTop: '3rem',
                  fontSize: '1.125rem',
                  lineHeight: '1.8',
                  color: 'rgb(229, 231, 235)',
                  textAlign: 'left'
                }}
                dangerouslySetInnerHTML={{ 
                  __html: blogApi.renderEditorContent(post.content) 
                }}
              />

              {/* Gallery */}
              {post.images && post.images.length > 0 && (
                <div className="!mt-16" style={{ marginTop: '4rem' }}>
                  <h3 className="text-2xl font-semibold text-white !mb-8 text-center" style={{ marginBottom: '2rem' }}>
                    Galería
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {post.images.map(image => (
                      <div key={image.id} className="bg-white/[0.02] border border-white/[0.08] rounded-2xl overflow-hidden hover:bg-white/[0.04] transition-all duration-300">
                        <img 
                          src={image.url} 
                          alt={image.alt_text || post.title}
                          loading="lazy"
                          className="w-full h-64 object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}

export default BlogPost;