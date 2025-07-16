import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import ImageUpload from '../../components/admin/ImageUpload';
import { API_BASE_URL } from '../../config/api.js';

function MediaLibrary() {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [cleaningUp, setCleaningUp] = useState(false);
  const [cleanupResult, setCleanupResult] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    sort: 'newest', // 'newest' | 'oldest' | 'name' | 'size'
    unused_only: false // show only unused images
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 24,
    total: 0,
    last_page: 1
  });

  useEffect(() => {
    loadImages();
  }, [filters, pagination.current_page]);

  const loadImages = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.type) params.append('type', filters.type);
      if (filters.sort) params.append('sort', filters.sort);
      if (filters.unused_only) params.append('unused_only', 'true');
      params.append('page', pagination.current_page.toString());
      params.append('per_page', pagination.per_page.toString());

      const response = await authService.authenticatedRequest(
        `${API_BASE_URL}/images?${params.toString()}`
      );
      
      if (!response.ok) {
        throw new Error('Error al cargar las imágenes');
      }

      const data = await response.json();
      
      // Handle both paginated and non-paginated responses
      if (data.data && data.current_page) {
        // Paginated response
        setImages(data.data);
        setPagination({
          current_page: data.current_page,
          per_page: data.per_page,
          total: data.total,
          last_page: data.last_page
        });
      } else {
        // Non-paginated response (fallback)
        setImages(data.data || data || []);
      }
    } catch (error) {
      setError('Error al cargar las imágenes');
      console.error('Error loading images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUploaded = async (uploadedImages) => {
    setShowUpload(false);
    await loadImages();
  };

  const handleDelete = async (imageId) => {
    const image = images.find(img => img.id === imageId);
    
    if (image && image.is_used) {
      if (!confirm(`¡Atención! Esta imagen está siendo utilizada en ${image.usage_count} lugar(es). ¿Estás seguro de que quieres eliminarla? Esto podría romper el contenido donde se usa.`)) {
        return;
      }
    } else if (!confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
      return;
    }

    try {
      setDeleting(imageId);
      const response = await authService.authenticatedRequest(`${API_BASE_URL}/images/${imageId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar la imagen');
      }

      await loadImages();
      setSelectedImages(prev => prev.filter(id => id !== imageId));
    } catch (error) {
      setError(error.message);
    } finally {
      setDeleting(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedImages.length === 0) return;
    
    if (!confirm(`¿Estás seguro de que quieres eliminar ${selectedImages.length} imagen(es)?`)) {
      return;
    }

    try {
      setLoading(true);
      const deletePromises = selectedImages.map(id => 
        authService.authenticatedRequest(`${API_BASE_URL}/images/${id}`, {
          method: 'DELETE'
        })
      );
      
      await Promise.all(deletePromises);
      await loadImages();
      setSelectedImages([]);
    } catch (error) {
      setError('Error al eliminar las imágenes seleccionadas');
    } finally {
      setLoading(false);
    }
  };

  const toggleImageSelection = (imageId) => {
    setSelectedImages(prev => 
      prev.includes(imageId) 
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  const selectAllImages = () => {
    if (selectedImages.length === images.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(images.map(img => img.id));
    }
  };

  const copyImageUrl = (imageUrl) => {
    navigator.clipboard.writeText(imageUrl);
    // Aquí podrías agregar una notificación de éxito
  };

  const handleCleanupUnused = async () => {
    const unusedCount = images.filter(img => !img.is_used).length;
    
    if (unusedCount === 0) {
      alert('No hay imágenes no utilizadas para eliminar.');
      return;
    }

    if (!confirm(`¿Estás seguro de que quieres eliminar ${unusedCount} imagen(es) no utilizada(s)? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      setCleaningUp(true);
      setError('');
      setCleanupResult(null);

      const response = await authService.authenticatedRequest(`${API_BASE_URL}/images/cleanup`, {
        method: 'POST'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al limpiar imágenes no utilizadas');
      }

      const result = await response.json();
      setCleanupResult(result);
      
      // Recargar la lista de imágenes
      await loadImages();
      
      // Limpiar selecciones
      setSelectedImages([]);
      
    } catch (error) {
      setError('Error al limpiar imágenes no utilizadas: ' + error.message);
      console.error('Error cleaning up images:', error);
    } finally {
      setCleaningUp(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading && images.length === 0) {
    return (
      <div className="admin-page">
        <div className="container">
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Cargando biblioteca de medios...</p>
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
            <h1>Biblioteca de Medios</h1>
            <p>Gestiona todas las imágenes de tu blog</p>
          </div>
          <div className="admin-actions">
            <button 
              onClick={() => navigate('/admin')}
              className="secondary-button"
            >
              Volver al Dashboard
            </button>
            <button 
              onClick={() => setShowUpload(true)}
              className="primary-button"
            >
              Subir Imágenes
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {cleanupResult && (
          <div className="success-message">
            <p>✅ {cleanupResult.message}</p>
            <p>Espacio liberado: {cleanupResult.deleted_size_formatted}</p>
            {cleanupResult.errors && cleanupResult.errors.length > 0 && (
              <details>
                <summary>Errores durante la limpieza ({cleanupResult.errors.length})</summary>
                <ul>
                  {cleanupResult.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        )}

        {showUpload && (
          <div className="upload-modal">
            <div className="upload-modal-content">
              <div className="upload-modal-header">
                <h2>Subir Imágenes</h2>
                <button 
                  onClick={() => setShowUpload(false)}
                  className="close-button"
                >
                  ✕
                </button>
              </div>
              
              <ImageUpload 
                onImageUploaded={handleImageUploaded}
                allowMultiple={true}
                className="modal-upload"
              />
            </div>
          </div>
        )}

        {/* Controles y filtros */}
        <div className="media-controls">
          <div className="media-filters">
            <input
              type="text"
              placeholder="Buscar imágenes..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="search-input"
            />
            
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="filter-select"
            >
              <option value="">Todos los tipos</option>
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
              <option value="gif">GIF</option>
              <option value="webp">WebP</option>
            </select>

            <select
              value={filters.sort}
              onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
              className="filter-select"
            >
              <option value="newest">Más recientes</option>
              <option value="oldest">Más antiguas</option>
              <option value="name">Por nombre</option>
              <option value="size">Por tamaño</option>
            </select>

            <label className="unused-filter">
              <input
                type="checkbox"
                checked={filters.unused_only}
                onChange={(e) => setFilters(prev => ({ ...prev, unused_only: e.target.checked }))}
              />
              <span>Solo imágenes no utilizadas</span>
            </label>
          </div>

          <div className="media-actions">
            <div className="view-controls">
              <button
                onClick={() => setViewMode('grid')}
                className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
              >
                ⊞
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
              >
                ☰
              </button>
            </div>

            {selectedImages.length > 0 && (
              <div className="bulk-actions">
                <span className="selection-count">
                  {selectedImages.length} seleccionada(s)
                </span>
                <button
                  onClick={handleBulkDelete}
                  className="bulk-delete-button"
                >
                  Eliminar Seleccionadas
                </button>
                <button
                  onClick={() => setSelectedImages([])}
                  className="cancel-selection-button"
                >
                  Cancelar
                </button>
              </div>
            )}

            {images.length > 0 && (
              <button
                onClick={selectAllImages}
                className="select-all-button"
              >
                {selectedImages.length === images.length ? 'Deseleccionar Todo' : 'Seleccionar Todo'}
              </button>
            )}

            <button
              onClick={handleCleanupUnused}
              disabled={cleaningUp || images.filter(img => !img.is_used).length === 0}
              className="cleanup-button"
              title="Elimina automáticamente todas las imágenes que no están siendo utilizadas"
            >
              {cleaningUp ? '🧹 Limpiando...' : '🧹 Limpiar No Utilizadas'}
            </button>

            {images.length > 0 && (
              <button
                onClick={() => {
                  const firstImage = images[0];
                  window.open(firstImage.url, '_blank');
                }}
                className="secondary-button"
                title="Abrir primera imagen en nueva pestaña para probar"
              >
                🔗 Test Image
              </button>
            )}

          </div>
        </div>

        {/* Información de paginación */}
        {pagination.total > 0 && (
          <div className="pagination-info">
            <p>
              Mostrando {((pagination.current_page - 1) * pagination.per_page) + 1} - {Math.min(pagination.current_page * pagination.per_page, pagination.total)} de {pagination.total} imágenes
            </p>
          </div>
        )}

        {/* Lista de imágenes */}
        <div className={`media-library ${viewMode}`}>
          {images.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="images-grid">
                {images.map(image => (
                  <div 
                    key={image.id} 
                    className={`image-card ${selectedImages.includes(image.id) ? 'selected' : ''}`}
                  >
                    <div className="image-card-header">
                      <input
                        type="checkbox"
                        checked={selectedImages.includes(image.id)}
                        onChange={() => toggleImageSelection(image.id)}
                        className="image-checkbox"
                      />
                      <div className="image-actions">
                        <button
                          onClick={() => copyImageUrl(image.url)}
                          className="copy-button"
                          title="Copiar URL"
                        >
                          📋
                        </button>
                        <button
                          onClick={() => handleDelete(image.id)}
                          className="delete-button"
                          disabled={deleting === image.id}
                          title="Eliminar imagen"
                        >
                          {deleting === image.id ? '⏳' : '🗑️'}
                        </button>
                      </div>
                    </div>

                    <div className="image-preview">
                      {console.log('Rendering image:', image.id, 'URL:', image.url, 'Full image object:', image)}
                      <img 
                        src={image.url || `http://127.0.0.1:8000/storage/${image.path}`} 
                        alt={image.alt_text || image.filename}
                        onLoad={(e) => {
                          console.log('✅ Image loaded successfully in preview:', e.target.src);
                        }}
                        onError={(e) => {
                          console.error('❌ Error loading image in preview:', e.target.src);
                          console.error('Image object:', image);
                          e.target.style.display = 'none';
                          e.target.parentNode.innerHTML = `<div class="image-error">❌ Error cargando imagen<br/><small>${image.filename}</small></div>`;
                        }}
                      />
                    </div>

                    <div className="image-info">
                      <h4>{image.original_name || image.filename}</h4>
                      <p className="image-size">{image.size_formatted || formatFileSize(image.size)}</p>
                      <p className="image-usage">
                        {image.is_used ? 
                          `Usada en ${image.usage_count} lugar(es)` : 
                          'No utilizada'
                        }
                      </p>
                      <p className="image-date">
                        {new Date(image.created_at).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="images-list">
                <table className="images-table">
                  <thead>
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                          checked={selectedImages.length === images.length && images.length > 0}
                          onChange={selectAllImages}
                        />
                      </th>
                      <th>Vista previa</th>
                      <th>Nombre</th>
                      <th>Tamaño</th>
                      <th>Fecha</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {images.map(image => (
                      <tr key={image.id} className={selectedImages.includes(image.id) ? 'selected' : ''}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedImages.includes(image.id)}
                            onChange={() => toggleImageSelection(image.id)}
                          />
                        </td>
                        <td>
                          <img 
                            src={image.url} 
                            alt={image.alt_text || image.filename}
                            className="table-image-preview"
                            crossOrigin="anonymous"
                            onError={(e) => {
                              console.error('Error loading image:', image.url);
                              e.target.style.display = 'none';
                              e.target.parentNode.innerHTML = '<div class="image-error">❌</div>';
                            }}
                          />
                        </td>
                        <td>
                          <div className="image-name-cell">
                            <strong>{image.filename}</strong>
                            {image.alt_text && <p>{image.alt_text}</p>}
                          </div>
                        </td>
                        <td>{formatFileSize(image.size)}</td>
                        <td>{new Date(image.created_at).toLocaleDateString('es-ES')}</td>
                        <td>
                          <div className="table-actions">
                            <button
                              onClick={() => copyImageUrl(image.url)}
                              className="copy-button"
                              title="Copiar URL"
                            >
                              📋
                            </button>
                            <button
                              onClick={() => handleDelete(image.id)}
                              className="delete-button"
                              disabled={deleting === image.id}
                              title="Eliminar"
                            >
                              {deleting === image.id ? '⏳' : '🗑️'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📸</div>
              <h3>No hay imágenes</h3>
              <p>
                {filters.search || filters.type
                  ? 'No se encontraron imágenes con los filtros aplicados'
                  : 'Sube tu primera imagen para comenzar'
                }
              </p>
              {!filters.search && !filters.type && (
                <button 
                  onClick={() => setShowUpload(true)}
                  className="primary-button"
                >
                  Subir Primera Imagen
                </button>
              )}
            </div>
          )}
        </div>

        {/* Controles de paginación */}
        {pagination.last_page > 1 && (
          <div className="pagination-controls">
            <button
              onClick={() => setPagination(prev => ({ ...prev, current_page: 1 }))}
              disabled={pagination.current_page === 1}
              className="pagination-button"
            >
              ««
            </button>
            
            <button
              onClick={() => setPagination(prev => ({ ...prev, current_page: Math.max(1, prev.current_page - 1) }))}
              disabled={pagination.current_page === 1}
              className="pagination-button"
            >
              ‹ Anterior
            </button>

            <div className="pagination-info-inline">
              Página {pagination.current_page} de {pagination.last_page}
            </div>

            <button
              onClick={() => setPagination(prev => ({ ...prev, current_page: Math.min(prev.last_page, prev.current_page + 1) }))}
              disabled={pagination.current_page === pagination.last_page}
              className="pagination-button"
            >
              Siguiente ›
            </button>

            <button
              onClick={() => setPagination(prev => ({ ...prev, current_page: prev.last_page }))}
              disabled={pagination.current_page === pagination.last_page}
              className="pagination-button"
            >
              »»
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MediaLibrary;