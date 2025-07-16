import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

function Categories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await authService.authenticatedRequest('http://127.0.0.1:8000/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      setError('Error al cargar las categorías');
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const url = editingCategory 
        ? `http://127.0.0.1:8000/api/categories/${editingCategory.id}`
        : 'http://127.0.0.1:8000/api/categories';
      
      const method = editingCategory ? 'PUT' : 'POST';

      const response = await authService.authenticatedRequest(url, {
        method,
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al guardar la categoría');
      }

      // Recargar categorías
      await loadCategories();
      
      // Resetear formulario
      setFormData({ name: '', description: '' });
      setEditingCategory(null);
      setShowForm(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (categoryId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      return;
    }

    try {
      setSaving(true);
      const response = await authService.authenticatedRequest(`http://127.0.0.1:8000/api/categories/${categoryId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar la categoría');
      }

      await loadCategories();
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', description: '' });
    setEditingCategory(null);
    setShowForm(false);
    setError('');
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="container">
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Cargando categorías...</p>
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
            <h1>Gestión de Categorías</h1>
            <p>Administra las categorías de tu blog</p>
          </div>
          <div className="admin-actions">
            <button 
              onClick={() => navigate('/admin')}
              className="secondary-button"
            >
              Volver al Dashboard
            </button>
            <button 
              onClick={() => setShowForm(true)}
              className="primary-button"
              disabled={saving}
            >
              Nueva Categoría
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {showForm && (
          <div className="form-modal">
            <div className="form-modal-content">
              <div className="form-modal-header">
                <h2>{editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
                <button 
                  onClick={handleCancel}
                  className="close-button"
                  disabled={saving}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="category-form">
                <div className="form-group">
                  <label htmlFor="name">Nombre de la Categoría</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ej: Tecnología, Viajes, etc."
                    required
                    disabled={saving}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Descripción</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Descripción opcional de la categoría..."
                    rows="3"
                    disabled={saving}
                  />
                </div>

                <div className="form-actions">
                  <button 
                    type="button"
                    onClick={handleCancel}
                    className="cancel-button"
                    disabled={saving}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="save-button"
                    disabled={saving}
                  >
                    {saving ? 'Guardando...' : editingCategory ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="categories-list">
          {categories.length > 0 ? (
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Posts</th>
                    <th>Fecha de Creación</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(category => (
                    <tr key={category.id}>
                      <td>
                        <strong>{category.name}</strong>
                      </td>
                      <td>{category.description || 'Sin descripción'}</td>
                      <td>
                        <span className="posts-count">
                          {category.posts_count || 0} posts
                        </span>
                      </td>
                      <td>
                        {new Date(category.created_at).toLocaleDateString('es-ES')}
                      </td>
                      <td>
                        <div className="table-actions">
                          <button 
                            onClick={() => handleEdit(category)}
                            className="edit-button"
                            disabled={saving}
                          >
                            Editar
                          </button>
                          <button 
                            onClick={() => handleDelete(category.id)}
                            className="delete-button"
                            disabled={saving}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📁</div>
              <h3>No hay categorías</h3>
              <p>Crea tu primera categoría para organizar tus posts</p>
              <button 
                onClick={() => setShowForm(true)}
                className="primary-button"
              >
                Crear Primera Categoría
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Categories;