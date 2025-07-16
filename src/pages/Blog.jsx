import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import blogApi from '../services/blogApi';

function Blog() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadPosts();
    loadCategories();
  }, []);

  useEffect(() => {
    loadPosts();
  }, [currentPage, selectedCategory, searchTerm]);

  async function loadPosts() {
    try {
      setLoading(true);
      setError(null);
      
      const filters = {};
      if (selectedCategory) filters.category = selectedCategory;
      if (searchTerm) filters.search = searchTerm;
      
      const data = await blogApi.fetchPosts(currentPage, 9, filters);
      setPosts(data.data);
      setPagination(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadCategories() {
    try {
      const data = await blogApi.fetchCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  }

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    loadPosts();
  };

  const handleCategoryChange = (categorySlug) => {
    setSelectedCategory(categorySlug);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePostClick = (post) => {
    navigate(`/blog/${post.slug}`);
  };

  if (loading && posts.length === 0) {
    return (
      <div className="min-h-screen pt-[calc(70px+1rem)] pb-8 bg-black contact-page">
        <div className="container">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 text-lg">Cargando entradas del blog...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[calc(70px+1rem)] pb-8 bg-black contact-page">
      <div className="container">
        {/* Header Section */}
        <div className="text-center mb-16 md:mb-20 lg:mb-24 pb-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Blog
          </h1>
          <br />
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Top Icon */}
         {/*  <div className="flex items-center mb-8">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10,9 9,9 8,9"/>
              </svg>
            </div>
          </div> */}

                                {/* Navigation and Search Bar */}
           <div className="!py-4 !mb-4" style={{ padding: '2rem 0', marginBottom: '4rem' }}>
             <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between !gap-8" style={{ gap: '2rem' }}>
               {/* Categories Navigation */}
               <div className="flex-1 overflow-hidden">
                 <div className="flex items-center !gap-4 overflow-x-auto scrollbar-hide !pb-3" style={{ gap: '1rem', paddingBottom: '0.75rem' }}>
                   <button
                     className={`inline-flex items-center rounded-md !px-4 !py-3 text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                       selectedCategory === '' 
                         ? 'bg-green-950 text-green-400 ring-1 ring-green-500/20 ring-inset hover:bg-green-900' 
                         : 'bg-gray-900/50 text-gray-400 ring-1 ring-gray-700/30 ring-inset hover:bg-gray-800/50 hover:text-gray-300'
                     }`}
                     onClick={() => handleCategoryChange('')}
                     style={{ padding: '0.75rem 1rem' }}
                   >
                     Todas las publicaciones
                   </button>
                   {categories.map(category => (
                     <button
                       key={category.id}
                       className={`inline-flex items-center rounded-md !px-4 !py-3 text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                         selectedCategory === category.slug 
                           ? 'bg-green-950 text-green-400 ring-1 ring-green-500/20 ring-inset hover:bg-green-900' 
                           : 'bg-gray-900/50 text-gray-400 ring-1 ring-gray-700/30 ring-inset hover:bg-gray-800/50 hover:text-gray-300'
                       }`}
                       onClick={() => handleCategoryChange(category.slug)}
                       style={{ padding: '0.75rem 1rem' }}
                     >
                       {category.name}
                     </button>
                   ))}
                 </div>
               </div>
 
               {/* Search Bar */}
               <div className="lg:!ml-8" style={{ marginLeft: '2rem' }}>
                 <form onSubmit={handleSearch} className="flex items-center">
                   <div className="relative">
                     <input
                       type="text"
                       placeholder="Buscar entradas..."
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                       className="w-full lg:w-80 !h-12 !pl-5 !pr-12 bg-gray-900/30 border border-white/20 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-white/40 focus:bg-gray-900/50 transition-all duration-200"
                       style={{ height: '3rem', paddingLeft: '1.25rem', paddingRight: '3rem' }}
                     />
                     <button 
                       type="submit"
                       className="absolute right-1 top-1 !h-10 !w-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                       style={{ height: '2.5rem', width: '2.5rem' }}
                     >
                       <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                         <circle cx="11" cy="11" r="8"/>
                         <path d="m21 21-4.35-4.35"/>
                       </svg>
                     </button>
                   </div>
                 </form>
               </div>
             </div>
           </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-6 text-center mb-12">
              <p className="text-red-400 mb-4">{error}</p>
              <button 
                onClick={loadPosts} 
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-all duration-200"
              >
                Reintentar
              </button>
            </div>
          )}

          {/* No Posts State */}
          {posts.length === 0 && !loading && !error && (
            <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-3xl !p-12 md:!p-16 text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">No se encontraron entradas</h2>
              <p className="text-gray-300 text-lg">
                {searchTerm || selectedCategory 
                  ? 'No hay entradas que coincidan con tu búsqueda.'
                  : 'Aún no hay entradas publicadas en el blog.'
                }
              </p>
            </div>
          )}

          {/* Blog Posts Grid - Unified Grid with Dividers */}
          {posts.length > 0 && (
            <div className="mb-16">
              {/* Unified Grid with Divider Lines */}
              <div className="blog-grid bg-black border border-white/10">
                {posts.map((post, index) => {
                  // Generate simple geometric icons based on post id
                  const getPostIcon = (id) => {
                    const icons = [
                      // Document
                      <svg className="w-6 h-6 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14,2 14,8 20,8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                      </svg>,
                      // Code
                      <svg className="w-6 h-6 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="16 18 22 12 16 6"/>
                        <polyline points="8 6 2 12 8 18"/>
                      </svg>,
                      // Terminal
                      <svg className="w-6 h-6 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="4 17 10 11 4 5"/>
                        <line x1="12" y1="19" x2="20" y2="19"/>
                      </svg>,
                      // Lightbulb
                      <svg className="w-6 h-6 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21h6"/>
                        <path d="M12 21V15"/>
                        <path d="M12 3a6 6 0 0 1 6 6c0 3-2 3-2 6H8c0-3-2-3-2-6a6 6 0 0 1 6-6z"/>
                      </svg>,
                      // Settings
                      <svg className="w-6 h-6 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="3"/>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                      </svg>,
                      // Star
                      <svg className="w-6 h-6 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                      </svg>
                    ];
                    return icons[id % icons.length];
                  };

                  // Calculate if this is in the last row to remove bottom border
                  const isInLastRow = index >= posts.length - Math.ceil(posts.length % 3) || (posts.length % 3 === 0 && index >= posts.length - 3);
                  
                  return (
                    <article 
                      key={post.id} 
                      className={`blog-grid-cell group cursor-pointer relative overflow-hidden hover:bg-white/[0.02] transition-colors duration-300 ${isInLastRow ? 'border-b-0' : ''}`}
                      style={{ 
                        padding: '1.5rem', 
                        height: '405px',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                      onClick={() => handlePostClick(post)}
                    >
                      {/* Header with icon and date */}
                      <div className="flex items-center justify-between" style={{ marginBottom: '2rem' }}>
                        {/* Icon */}
                        <div className="opacity-70 group-hover:opacity-90 transition-opacity duration-300">
                          {getPostIcon(post.id)}
                        </div>
                        
                        {/* Date */}
                        <div className="text-xs text-gray-500">
                          {new Date(post.published_at).toLocaleDateString('es-ES', { 
                            day: 'numeric',
                            month: 'long'
                          })}
                        </div>
                      </div>
                      
                      {/* Title - flexible height */}
                      <h2 className="text-2xl font-bold text-white group-hover:text-green-400 transition-colors duration-300 leading-tight" style={{ marginBottom: '1rem' }}>
                        {post.title}
                      </h2>
                      
                      {/* Extract with dynamic space and fade effect */}
                      <div className="flex-1 relative overflow-hidden">
                        <p className="text-gray-400 text-sm leading-relaxed h-full overflow-hidden">
                          {post.excerpt}
                        </p>
                        {/* Subtle fade effect on last 3 lines */}
                        <div 
                          className="absolute bottom-0 left-0 right-0 pointer-events-none"
                          style={{
                            height: '4rem',
                            background: 'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.3) 40%, rgba(0, 0, 0, 0.7) 70%, rgba(0, 0, 0, 1) 100%)'
                          }}
                        ></div>
                      </div>
                      
                      {/* Author */}
                      {post.user && (
                        <div className="flex items-center mt-4 pt-3">
                          <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-xs font-semibold text-white mr-2">
                            {post.user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-gray-500 text-xs">
                            {post.user.name}
                          </span>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.last_page > 1 && (
            <div className="flex items-center justify-center gap-4 mb-16">
              <button
                className="px-6 py-3 bg-white/5 text-white rounded-lg border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                ← Anterior
              </button>
              
              <div className="px-4 py-2 text-gray-300">
                Página {currentPage} de {pagination.last_page}
              </div>
              
              <button
                className="px-6 py-3 bg-white/5 text-white rounded-lg border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === pagination.last_page}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Siguiente →
              </button>
            </div>
          )}

          {/* Coming Soon Section */}
          {posts.length === 0 && !searchTerm && !selectedCategory && !loading && !error && (
            <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-3xl !p-12 md:!p-16">
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6 text-center">¡Más contenido pronto!</h2>
              <p className="text-gray-300 leading-relaxed mb-6 text-center text-lg">
                Estoy trabajando en crear contenido valioso para la comunidad de desarrolladores. 
                Próximamente encontrarás tutoriales, guías y reflexiones sobre:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <ul className="space-y-3">
                  <li className="text-gray-300 flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                    Desarrollo Frontend con React y Vue.js
                  </li>
                  <li className="text-gray-300 flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                    Backend con Node.js y Python
                  </li>
                  <li className="text-gray-300 flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                    Mejores prácticas de desarrollo
                  </li>
                </ul>
                <ul className="space-y-3">
                  <li className="text-gray-300 flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                    Experiencias personales en proyectos
                  </li>
                  <li className="text-gray-300 flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                    Reseñas de herramientas y tecnologías
                  </li>
                </ul>
              </div>
              <p className="text-center text-green-400 font-semibold text-lg">
                ¡Mantente conectado para no perderte las actualizaciones!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Blog;