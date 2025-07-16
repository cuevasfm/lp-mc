import Image from '@editorjs/image';

class EnhancedImageTool extends Image {
  constructor({ data, config, api, readOnly }) {
    // Transformar los datos al formato esperado por el plugin padre
    const transformedData = { ...data };
    
    console.log('EnhancedImageTool constructor - original data:', data);
    
    // Si tenemos url directamente pero no file.url, transformar
    if (data.url && !data.file) {
      transformedData.file = {
        url: data.url
      };
    }
    
    console.log('EnhancedImageTool constructor - transformed data:', transformedData);
    
    // Llamar al constructor padre con los datos transformados
    super({ data: transformedData, config, api, readOnly });
  }

  render() {
    const parentRender = super.render();
    
    // Si ya hay una imagen, agregar el botón de selector
    if (this.data && this.data.url) {
      return parentRender;
    }

    // Si no hay imagen, agregar nuestro botón personalizado
    const wrapper = document.createElement('div');
    wrapper.classList.add('enhanced-image-tool');
    
    const originalContainer = parentRender;
    const selectButton = document.createElement('button');
    selectButton.type = 'button';
    selectButton.classList.add('image-tool-select');
    selectButton.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
      </svg>
      Seleccionar imagen existente
    `;

    selectButton.addEventListener('click', () => {
      this._showImageSelector();
    });

    wrapper.appendChild(originalContainer);
    wrapper.appendChild(selectButton);
    
    return wrapper;
  }

  _showImageSelector() {
    const customEvent = new CustomEvent('showImageSelector', {
      detail: {
        onImageSelect: (imageData) => {
          // Actualizar los datos usando el método padre
          this.data.url = imageData.url;
          this.data.caption = imageData.caption;
          
          // Forzar re-render usando los métodos disponibles del plugin padre
          if (this.ui && this.ui.fillImage) {
            this.ui.fillImage(imageData.url);
          }
          if (this.ui && this.ui.fillCaption && imageData.caption) {
            this.ui.fillCaption(imageData.caption);
          }
          
          // Trigger el callback de éxito si existe
          if (this.onUpload) {
            this.onUpload({
              success: 1,
              file: {
                url: imageData.url
              }
            });
          }
        }
      }
    });
    
    window.dispatchEvent(customEvent);
  }

  save() {
    const parentData = super.save();
    console.log('EnhancedImageTool save - parent data:', parentData);
    
    // Asegurar que tenemos la URL en ambos formatos para compatibilidad
    const saveData = {
      ...parentData,
      url: parentData.file?.url || parentData.url || '',
    };
    
    console.log('EnhancedImageTool save - final data:', saveData);
    return saveData;
  }

  static get toolbox() {
    return {
      title: 'Imagen',
      icon: Image.toolbox.icon
    };
  }
}

export default EnhancedImageTool;