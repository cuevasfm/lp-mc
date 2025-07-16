import { useState, useEffect } from 'react';
import authService from '../../services/authService';

function ImageSelector({ onImageSelect, onClose }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      setLoading(true);
      const response = await authService.authenticatedRequest('http://127.0.0.1:8000/api/images?per_page=50');
      const data = await response.json();
      setImages(data.data || []);
    } catch (error) {
      setError('Error al cargar las imágenes');
      console.error('Error loading images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (image) => {
    setSelectedImage(image);
  };

  const handleConfirm = () => {
    if (selectedImage) {
      onImageSelect({
        url: selectedImage.url,
        caption: selectedImage.alt_text || selectedImage.original_name
      });
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="image-selector-modal">
        <div className="image-selector-content">
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Cargando imágenes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="image-selector-modal">
      <div className="image-selector-content">
        <div className="image-selector-header">
          <h3>Seleccionar Imagen</h3>
          <button onClick={onClose} className="close-button">✕</button>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        <div className="image-selector-body">
          {images.length > 0 ? (
            <div className="images-grid">
              {images.map(image => (
                <div 
                  key={image.id} 
                  className={`image-item ${selectedImage?.id === image.id ? 'selected' : ''}`}
                  onClick={() => handleImageSelect(image)}
                >
                  <img src={image.url} alt={image.alt_text || image.filename} />
                  <div className="image-info">
                    <p className="image-name">{image.original_name}</p>
                    <p className="image-size">{formatFileSize(image.size)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No hay imágenes disponibles</p>
            </div>
          )}
        </div>

        <div className="image-selector-footer">
          <button onClick={onClose} className="cancel-button">
            Cancelar
          </button>
          <button 
            onClick={handleConfirm} 
            className="confirm-button"
            disabled={!selectedImage}
          >
            Seleccionar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImageSelector;