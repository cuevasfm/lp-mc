import authService from '../../services/authService';
import { API_BASE_URL } from '../../config/api.js';

class SimpleImageTool {
  static get toolbox() {
    return {
      title: 'Imagen',
      icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>'
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  constructor({ data, config, api, readOnly }) {
    
    this.api = api;
    this.readOnly = readOnly;
    this.config = config || {};
    
    // Inicializar datos con valores por defecto
    this.data = {
      url: '',
      caption: '',
      withBorder: false,
      withBackground: false,
      stretched: false,
    };
    
    // Procesar datos de entrada
    if (data) {
      if (data.url) {
        this.data.url = data.url;
        this.data.caption = data.caption || '';
        this.data.withBorder = data.withBorder || false;
        this.data.withBackground = data.withBackground || false;
        this.data.stretched = data.stretched || false;
      } else if (data.file && data.file.url) {
        this.data.url = data.file.url;
        this.data.caption = data.caption || '';
        this.data.withBorder = data.withBorder || false;
        this.data.withBackground = data.withBackground || false;
        this.data.stretched = data.stretched || false;
      }
    }
    
    
    this.wrapper = null;
    this.image = null;
    this.caption = null;
  }

  render() {
    
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('simple-image-tool');

    if (this.data.url) {
      this._createImageElement();
    } else {
      this._createUploadInterface();
    }
    return this.wrapper;
  }

  _createImageElement() {
    
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('image-container');

    // Crear elemento de imagen
    this.image = document.createElement('img');
    this.image.src = this.data.url;
    this.image.alt = this.data.caption || '';
    this.image.classList.add('image-tool__image');
    
    // Aplicar estilos según configuración
    if (this.data.withBorder) {
      this.image.classList.add('image-tool--withBorder');
    }
    if (this.data.withBackground) {
      this.image.classList.add('image-tool--withBackground');
    }
    if (this.data.stretched) {
      this.image.classList.add('image-tool--stretched');
    }

    // Crear campo de caption editable
    this.caption = document.createElement('div');
    this.caption.classList.add('image-tool__caption');
    this.caption.contentEditable = !this.readOnly;
    this.caption.innerHTML = this.data.caption || '';

    if (!this.readOnly) {
      this.caption.addEventListener('blur', () => {
        this.data.caption = this.caption.innerHTML;
      });
    }

    imageContainer.appendChild(this.image);
    imageContainer.appendChild(this.caption);
    this.wrapper.appendChild(imageContainer);
  }

  _createUploadInterface() {
    const uploadContainer = document.createElement('div');
    uploadContainer.classList.add('image-upload-container');

    const uploadButton = document.createElement('button');
    uploadButton.type = 'button';
    uploadButton.classList.add('image-upload-button');
    uploadButton.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.15 13.628A7.749 7.749 0 0 0 10 18.5a7.74 7.74 0 0 0 6.305-3.182l-2.004-2.004A4.944 4.944 0 0 1 10 15.5a4.944 4.944 0 0 1-4.301-2.186l-2.549 2.314z"/>
      </svg>
      Subir imagen
    `;

    const selectButton = document.createElement('button');
    selectButton.type = 'button';
    selectButton.classList.add('image-select-button');
    selectButton.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
      </svg>
      Seleccionar existente
    `;

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';

    uploadButton.addEventListener('click', () => {
      fileInput.click();
    });

    fileInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (file) {
        this._uploadFile(file);
      }
    });

    selectButton.addEventListener('click', () => {
      this._showImageSelector();
    });

    uploadContainer.appendChild(uploadButton);
    uploadContainer.appendChild(selectButton);
    uploadContainer.appendChild(fileInput);
    this.wrapper.appendChild(uploadContainer);
  }

  _uploadFile(file) {
    const formData = new FormData();
    formData.append('image', file);

    // Mostrar loading
    this.wrapper.innerHTML = '<div class="image-loading">Subiendo imagen...</div>';

            fetch(`${API_BASE_URL}/images/editor-upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authService.getToken()}`
      },
      body: formData
    })
    .then(response => response.json())
    .then(result => {
      if (result.success) {
        this.data.url = result.file.url;
        this.data.caption = result.file.name || '';
        this.wrapper.innerHTML = '';
        this._createImageElement();
      } else {
        console.error('Upload failed:', result);
        this.wrapper.innerHTML = '<div class="image-error">Error al subir la imagen</div>';
      }
    })
    .catch(error => {
      console.error('Upload error:', error);
      this.wrapper.innerHTML = '<div class="image-error">Error al subir la imagen</div>';
    });
  }

  _showImageSelector() {
    const customEvent = new CustomEvent('showImageSelector', {
      detail: {
        onImageSelect: (imageData) => {
          this.data.url = imageData.url;
          this.data.caption = imageData.caption || '';
          this.wrapper.innerHTML = '';
          this._createImageElement();
        }
      }
    });
    
    window.dispatchEvent(customEvent);
  }

  renderSettings() {
    const settings = [
      {
        name: 'withBorder',
        icon: '<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M15.8 10.592v2.043h2.35v2.138H15.8v2.232h-2.25v-2.232h-2.4v-2.138h2.4v-2.043h2.25zm1.9-8.025v2.138h-4.15v2.043h4.15v2.138h-2.25v-2.138h-2.4v-2.043h2.4v-2.138h2.25zm-10.45 8.025v2.043h2.35v2.138H7.25v2.232H5v-2.232H2.6v-2.138H5v-2.043h2.25zm1.9-8.025v2.138H4.1v2.043h4.15v2.138H6v-2.138H3.6v-2.043H6v-2.138h2.25z"/></svg>'
      },
      {
        name: 'withBackground',
        icon: '<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.043 8.265l3.183-3.183h-2.924L4.75 10.636v2.923l4.15-4.15v2.351l-2.158 2.159H8.9v2.137H4.7c-1.215 0-2.2-.936-2.2-2.09v-8.93c0-1.154.985-2.09 2.2-2.09h10.663c1.215 0 2.2.936 2.2 2.09v8.93c0 1.154-.985 2.09-2.2 2.09h-1.047v-2.137h1.047V6.636L10.043 8.265z"/></svg>'
      },
      {
        name: 'stretched',
        icon: '<svg width="17" height="10" viewBox="0 0 17 10" xmlns="http://www.w3.org/2000/svg"><path d="M13.568 5.925H4.056l1.703 1.703a1.125 1.125 0 0 1-1.59 1.591L.962 6.014A1.069 1.069 0 0 1 .588 4.26L4.38.469a1.069 1.069 0 0 1 1.512 1.511L4.084 3.787h9.606l-1.85-1.85a1.069 1.069 0 1 1 1.512-1.51l3.792 3.791a1.069 1.069 0 0 1-.375 1.755L12.973 9.66a1.125 1.125 0 0 1-1.59-1.591L13.568 5.925z"/></svg>'
      }
    ];

    const wrapper = document.createElement('div');

    settings.forEach(setting => {
      const button = document.createElement('div');
      button.classList.add('cdx-settings-button');
      button.innerHTML = setting.icon;
      
      if (this.data[setting.name]) {
        button.classList.add('cdx-settings-button--active');
      }

      button.addEventListener('click', () => {
        this.data[setting.name] = !this.data[setting.name];
        button.classList.toggle('cdx-settings-button--active');
        
        if (this.image) {
          this.image.classList.toggle(`image-tool--${setting.name}`, this.data[setting.name]);
        }

        if (setting.name === 'stretched' && this.api.blocks) {
          this.api.blocks.stretchBlock(this.api.blocks.getCurrentBlockIndex(), this.data.stretched);
        }
      });

      wrapper.appendChild(button);
    });

    return wrapper;
  }

  save() {
    const savedData = {
      url: this.data.url,
      caption: this.data.caption,
      withBorder: this.data.withBorder,
      withBackground: this.data.withBackground,
      stretched: this.data.stretched,
    };
    
    return savedData;
  }

  validate(savedData) {
    if (!savedData || typeof savedData !== 'object') {
      return false;
    }
    
    // Permitir datos vacíos para nuevos bloques
    if (!savedData.url && !savedData.file) {
      return true;
    }
    
    // Validar URL directa
    if (savedData.url && typeof savedData.url === 'string') {
      return true;
    }
    
    // Validar formato file
    if (savedData.file && savedData.file.url && typeof savedData.file.url === 'string') {
      return true;
    }
    
    return false;
  }

  static get sanitize() {
    return {
      url: {},
      caption: {
        br: true,
      },
      withBorder: {},
      withBackground: {},
      stretched: {},
    };
  }
}

export default SimpleImageTool;