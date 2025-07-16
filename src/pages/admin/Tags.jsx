import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

function Tags() {
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    color: '#10b981'
  });

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      setLoading(true);
      const response = await authService.authenticatedRequest('http://127.0.0.1:8000/api/tags');
      const data = await response.json();
      setTags(data);
    } catch (error) {
      setError('Error al cargar las etiquetas');
      console.error('Error loading tags:', error);
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
      const url = editingTag 
        ? `http://127.0.0.1:8000/api/tags/${editingTag.id}`
        : 'http://127.0.0.1:8000/api/tags';
      
      const method = editingTag ? 'PUT' : 'POST';

      const response = await authService.authenticatedRequest(url, {
        method,
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al guardar la etiqueta');
      }

      // Recargar etiquetas
      await loadTags();
      
      // Resetear formulario
      setFormData({ name: '', color: '#10b981' });
      setEditingTag(null);
      setShowForm(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (tag) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name,
      color: tag.color || '#10b981'
    });
    setShowForm(true);
  };

  const handleDelete = async (tagId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta etiqueta?')) {
      return;
    }

    try {
      setSaving(true);
      const response = await authService.authenticatedRequest(`http://127.0.0.1:8000/api/tags/${tagId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar la etiqueta');
      }

      await loadTags();
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', color: '#10b981' });
    setEditingTag(null);
    setShowForm(false);
    setError('');
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="container">
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Cargando etiquetas...</p>
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
            <h1>Gestión de Etiquetas</h1>
            <p>Administra las etiquetas de tu blog</p>
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
              Nueva Etiqueta
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
                <h2>{editingTag ? 'Editar Etiqueta' : 'Nueva Etiqueta'}</h2>
                <button 
                  onClick={handleCancel}
                  className="close-button"
                  disabled={saving}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="tag-form">
                <div className="form-group">
                  <label htmlFor="name">Nombre de la Etiqueta</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ej: React, JavaScript, Tutorial, etc."
                    required
                    disabled={saving}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="color">Color de la Etiqueta</label>
                  <div className="color-input-group">
                    <input
                      type="color"
                      id="color"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      disabled={saving}
                    />
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                      placeholder="#10b981"
                      pattern="^#[0-9A-Fa-f]{6}$"
                      disabled={saving}
                    />
                    <div 
                      className="color-preview"
                      style={{ backgroundColor: formData.color }}
                    ></div>
                  </div>
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
                    {saving ? 'Guardando...' : editingTag ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="tags-list">
          {tags.length > 0 ? (
            <div className="tags-grid">
              {tags.map(tag => (
                <div key={tag.id} className="tag-card">
                  <div className="tag-card-header">
                    <div className="tag-preview">
                      <span 
                        className="tag-badge"
                        style={{ backgroundColor: tag.color || '#10b981' }}
                      >
                        {tag.name}
                      </span>
                    </div>
                    <div className="tag-actions">
                      <button 
                        onClick={() => handleEdit(tag)}
                        className="edit-button"
                        disabled={saving}
                        title="Editar etiqueta"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleDelete(tag.id)}
                        className="delete-button"
                        disabled={saving}
                        title="Eliminar etiqueta"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  
                  <div className="tag-card-content">
                    <h3>{tag.name}</h3>
                    <p className="posts-count">
                      {tag.posts_count || 0} posts
                    </p>
                    <p className="tag-date">
                      Creada: {new Date(tag.created_at).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🏷️</div>
              <h3>No hay etiquetas</h3>
              <p>Crea tu primera etiqueta para clasificar tus posts</p>
              <button 
                onClick={() => setShowForm(true)}
                className="primary-button"
              >
                Crear Primera Etiqueta
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Tags;