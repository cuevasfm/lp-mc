import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import authService from '../../services/authService';

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalCategories: 0,
    totalTags: 0
  });
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Cargar posts con diferentes estados
      const [allPosts, categories, tags] = await Promise.all([
        authService.authenticatedRequest('http://127.0.0.1:8000/api/admin/posts?status=all&per_page=100'),
        authService.authenticatedRequest('http://127.0.0.1:8000/api/categories'),
        authService.authenticatedRequest('http://127.0.0.1:8000/api/tags')
      ]);

      const postsData = await allPosts.json();
      const categoriesData = await categories.json();
      const tagsData = await tags.json();

      // Calcular estadísticas
      const posts = postsData.data || [];
      const publishedCount = posts.filter(p => p.status === 'published').length;
      const draftCount = posts.filter(p => p.status === 'draft').length;

      setStats({
        totalPosts: posts.length,
        publishedPosts: publishedCount,
        draftPosts: draftCount,
        totalCategories: categoriesData.length || 0,
        totalTags: tagsData.length || 0
      });

      // Obtener posts recientes (últimos 5)
      setRecentPosts(posts.slice(0, 5));

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="container">
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Cargando dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <div className="admin-title">
            <h1>Panel de Administración</h1>
            <p>Bienvenido, {user?.name}</p>
          </div>
          <button onClick={handleLogout} className="logout-button">
            Cerrar Sesión
          </button>
        </div>

        {/* Estadísticas */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-content">
              <h3>{stats.totalPosts}</h3>
              <p>Total Posts</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>{stats.publishedPosts}</h3>
              <p>Publicados</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">📄</div>
            <div className="stat-content">
              <h3>{stats.draftPosts}</h3>
              <p>Borradores</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🏷️</div>
            <div className="stat-content">
              <h3>{stats.totalCategories}</h3>
              <p>Categorías</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🔖</div>
            <div className="stat-content">
              <h3>{stats.totalTags}</h3>
              <p>Etiquetas</p>
            </div>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="dashboard-actions">
          <h2>Acciones Rápidas</h2>
          <div className="action-cards">
            <div className="action-card" onClick={() => navigate('/admin/posts/new')}>
              <div className="action-icon">➕</div>
              <h3>Nuevo Post</h3>
              <p>Crear una nueva entrada para el blog</p>
            </div>
            
            <div className="action-card" onClick={() => navigate('/admin/posts')}>
              <div className="action-icon">📋</div>
              <h3>Gestionar Posts</h3>
              <p>Ver y editar todas las entradas</p>
            </div>
            
            <div className="action-card" onClick={() => navigate('/admin/categories')}>
              <div className="action-icon">📁</div>
              <h3>Categorías</h3>
              <p>Gestionar categorías del blog</p>
            </div>
            
            <div className="action-card" onClick={() => navigate('/admin/tags')}>
              <div className="action-icon">🏷️</div>
              <h3>Etiquetas</h3>
              <p>Gestionar etiquetas del blog</p>
            </div>
            
            <div className="action-card" onClick={() => navigate('/admin/media')}>
              <div className="action-icon">🖼️</div>
              <h3>Media Library</h3>
              <p>Gestionar imágenes</p>
            </div>
            
            <div className="action-card" onClick={() => navigate('/admin/contacts')}>
              <div className="action-icon">📧</div>
              <h3>Contactos</h3>
              <p>Ver mensajes de contacto</p>
            </div>
          </div>
        </div>

        {/* Posts recientes */}
        <div className="dashboard-recent">
          <h2>Posts Recientes</h2>
          {recentPosts.length > 0 ? (
            <div className="recent-posts">
              {recentPosts.map(post => (
                <div key={post.id} className="recent-post">
                  <div className="recent-post-content">
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <div className="recent-post-meta">
                      <span className={`status-badge ${post.status}`}>
                        {post.status === 'published' ? 'Publicado' : 
                         post.status === 'draft' ? 'Borrador' : 'Archivado'}
                      </span>
                      <span className="post-date">
                        {new Date(post.created_at).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                  </div>
                  <div className="recent-post-actions">
                    <button 
                      onClick={() => navigate(`/admin/posts/edit/${post.id}`)}
                      className="edit-button"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => navigate(`/blog/${post.slug}`)}
                      className="view-button"
                    >
                      Ver
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-posts">
              <p>No hay posts aún. <span onClick={() => navigate('/admin/posts/new')}>¡Crea el primero!</span></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;