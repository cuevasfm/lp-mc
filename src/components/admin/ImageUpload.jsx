import { useState, useRef } from 'react';
import authService from '../../services/authService';
import { API_BASE_URL } from '../../config/api.js';

function ImageUpload({ onImageUploaded, allowMultiple = false, className = '' }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Tipo de archivo no permitido. Solo se permiten imágenes (JPEG, PNG, GIF, WebP).');
    }

    if (file.size > maxSize) {
      throw new Error('El archivo es demasiado grande. Tamaño máximo: 5MB.');
    }
  };

  const uploadFile = async (file) => {
    validateFile(file);

    const formData = new FormData();
    formData.append('image', file);

          const response = await authService.authenticatedRequest(`${API_BASE_URL}/images/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        // No establecer Content-Type para que el navegador lo haga automáticamente con boundary
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al subir la imagen');
    }

    return await response.json();
  };

  const handleFileSelect = async (files) => {
    setError('');
    setUploading(true);

    try {
      const filesToUpload = allowMultiple ? Array.from(files) : [files[0]];
      
      if (allowMultiple) {
        // Subir múltiples archivos
        const uploadPromises = filesToUpload.map(file => uploadFile(file));
        const results = await Promise.all(uploadPromises);
        onImageUploaded(results);
      } else {
        // Subir un solo archivo
        const result = await uploadFile(filesToUpload[0]);
        onImageUploaded(result);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`image-upload ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={allowMultiple}
        onChange={handleInputChange}
        style={{ display: 'none' }}
        disabled={uploading}
      />

      <div
        className={`upload-area ${dragOver ? 'drag-over' : ''} ${uploading ? 'uploading' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {uploading ? (
          <div className="upload-loading">
            <div className="loading-spinner"></div>
            <p>Subiendo imagen{allowMultiple ? 's' : ''}...</p>
          </div>
        ) : (
          <div className="upload-content">
            <div className="upload-icon">📸</div>
            <h3>
              {dragOver 
                ? `Suelta ${allowMultiple ? 'las imágenes' : 'la imagen'} aquí`
                : `Subir ${allowMultiple ? 'imágenes' : 'imagen'}`
              }
            </h3>
            <p>
              Arrastra {allowMultiple ? 'las imágenes' : 'la imagen'} aquí o haz clic para seleccionar
            </p>
            <div className="upload-specs">
              <small>
                Formatos: JPEG, PNG, GIF, WebP • Tamaño máximo: 5MB
                {allowMultiple && ' • Múltiples archivos permitidos'}
              </small>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="upload-error">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}

export default ImageUpload;