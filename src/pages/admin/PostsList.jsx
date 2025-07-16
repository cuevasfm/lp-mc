import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

function PostsList() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    search: ''
  });
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0
  });

  useEffect(() => {
    loadCategories();
    loadPosts();
  }, [filters, pagination.current_page]);

  const loadCategories = async () => {
    try {
      const response = await authService.authenticatedRequest('http://127.0.0.1:8000/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadPosts = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: pagination.current_page,
        per_page: pagination.per_page,
        status: filters.status || 'all'
      });
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);

      const response = await authService.authenticatedRequest(
        `http://127.0.0.1:8000/api/admin/posts?${params.toString()}`
      );
      
      const data = await response.json();
      setPosts(data.data || []);
      setPagination({
        current_page: data.current_page || 1,
        last_page: data.last_page || 1,
        per_page: data.per_page || 10,
        total: data.total || 0
      });
    } catch (error) {
      setError('Error al cargar los posts');
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  const handleDelete = async (postId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este post?')) {
      return;
    }

    try {
      setDeleting(postId);
      const response = await authService.authenticatedRequest(`http://127.0.0.1:8000/api/posts/${postId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar el post');
      }

      await loadPosts();
    } catch (error) {
      setError(error.message);
    } finally {
      setDeleting(null);
    }
  };

  const handleStatusChange = async (postId, newStatus) => {
    try {
      const response = await authService.authenticatedRequest(`http://127.0.0.1:8000/api/posts/${postId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el estado');
      }

      await loadPosts();
    } catch (error) {
      setError(error.message);
    }
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, current_page: page }));
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      published: { text: 'Publicado', class: 'status-published' },
      draft: { text: 'Borrador', class: 'status-draft' },
      archived: { text: 'Archivado', class: 'status-archived' }
    };
    
    return statusMap[status] || { text: status, class: 'status-unknown' };
  };

  if (loading && posts.length === 0) {
    return (
      <div className="admin-page">
        <div className="container">
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Cargando posts...</p>
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
            <h1>Gestión de Posts</h1>
            <p>Administra todas las entradas de tu blog</p>
          </div>
          <div className="admin-actions">
            <button 
              onClick={() => navigate('/admin')}
              className="secondary-button"
            >
              Volver al Dashboard
            </button>
            <button 
              onClick={() => navigate('/admin/posts/new')}
              className="primary-button"
            >
              Nuevo Post
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {/* Filtros */}
        <div className="posts-filters">
          <div className="filter-group">
            <input
              type="text"
              placeholder="Buscar posts..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-group">
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="filter-select"
            >
              <option value="">Todos los estados</option>
              <option value="published">Publicados</option>
              <option value="draft">Borradores</option>
              <option value="archived">Archivados</option>
            </select>
          </div>

          <div className="filter-group">
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="filter-select"
            >
              <option value="">Todas las categorías</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Lista de posts */}
        <div className="posts-table-container">
          {posts.length > 0 ? (
            <>
              <table className="posts-table">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Estado</th>
                    <th>Categoría</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map(post => {
                    const statusBadge = getStatusBadge(post.status);
                    return (
                      <tr key={post.id}>
                        <td>
                          <div className="post-title-cell">
                            <h4>{post.title}</h4>
                            {post.excerpt && (
                              <p className="post-excerpt">{post.excerpt}</p>
                            )}
                          </div>
                        </td>
                        <td>
                          <select
                            value={post.status}
                            onChange={(e) => handleStatusChange(post.id, e.target.value)}
                            className={`status-select ${statusBadge.class}`}
                          >
                            <option value="draft">Borrador</option>
                            <option value="published">Publicado</option>
                            <option value="archived">Archivado</option>
                          </select>
                        </td>
                        <td>
                          {post.category ? post.category.name : 'Sin categoría'}
                        </td>
                        <td>
                          <div className="post-dates">
                            <div>
                              <small>Creado:</small><br />
                              {new Date(post.created_at).toLocaleDateString('es-ES')}
                            </div>
                            {post.published_at && (
                              <div>
                                <small>Publicado:</small><br />
                                {new Date(post.published_at).toLocaleDateString('es-ES')}
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="post-actions">
                            <button
                              onClick={() => navigate(`/admin/posts/edit/${post.id}`)}
                              className="edit-button"
                              title="Editar post"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => navigate(`/blog/${post.slug}`)}
                              className="view-button"
                              title="Ver post"
                            >
                              👁️
                            </button>
                            <button
                              onClick={() => handleDelete(post.id)}
                              className="delete-button"
                              disabled={deleting === post.id}
                              title="Eliminar post"
                            >
                              {deleting === post.id ? '⏳' : '🗑️'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Paginación */}
              {pagination.last_page > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => handlePageChange(pagination.current_page - 1)}
                    disabled={pagination.current_page === 1}
                    className="pagination-button"
                  >
                    ← Anterior
                  </button>
                  
                  <div className="pagination-info">
                    Página {pagination.current_page} de {pagination.last_page}
                    ({pagination.total} posts total)
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(pagination.current_page + 1)}
                    disabled={pagination.current_page === pagination.last_page}
                    className="pagination-button"
                  >
                    Siguiente →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>No hay posts</h3>
              <p>
                {filters.search || filters.status || filters.category
                  ? 'No se encontraron posts con los filtros aplicados'
                  : 'Crea tu primer post para comenzar'
                }
              </p>
              {!filters.search && !filters.status && !filters.category && (
                <button 
                  onClick={() => navigate('/admin/posts/new')}
                  className="primary-button"
                >
                  Crear Primer Post
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostsList;