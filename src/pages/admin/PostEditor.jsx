import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Code from '@editorjs/code';
import Quote from '@editorjs/quote';
import Table from '@editorjs/table';
import SimpleImageTool from '../../components/editor/SimpleImageTool';
import ImageSelector from '../../components/editor/ImageSelector';
import authService from '../../services/authService';


function PostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    category_id: '',
    status: 'draft',
    published_at: '',
    tags: []
  });
  
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editorLoading, setEditorLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [imageSelectorCallback, setImageSelectorCallback] = useState(null);

  useEffect(() => {
    const setupEditor = async () => {
      await loadCategoriesAndTags();
      
      if (isEdit) {
        await loadPost();
      } else {
        await initializeEditor();
      }
    };

    setupEditor();

    return () => {
      if (editorRef.current && typeof editorRef.current.destroy === 'function') {
        try {
          editorRef.current.destroy();
        } catch (error) {
          console.error('Error destroying editor:', error);
        }
      }
    };
  }, [id]);

  // Event listener para el selector de imágenes
  useEffect(() => {
    const handleImageSelectorEvent = (event) => {
      setImageSelectorCallback(() => event.detail.onImageSelect);
      setShowImageSelector(true);
    };

    window.addEventListener('showImageSelector', handleImageSelectorEvent);

    return () => {
      window.removeEventListener('showImageSelector', handleImageSelectorEvent);
    };
  }, []);

  const initializeEditor = () => {
    return new Promise((resolve) => {
      // Destroy existing editor if it exists
      if (editorRef.current) {
        try {
          editorRef.current.destroy();
        } catch (error) {
          console.error('Error destroying existing editor:', error);
        }
        editorRef.current = null;
      }

      // Small delay to ensure DOM is ready
      setTimeout(() => {
        try {
          // Limpiar el contenedor del editor
          const editorElement = document.getElementById('editor');
          if (editorElement) {
            editorElement.innerHTML = '';
          }
          
          const tools = {
            header: {
              class: Header,
              config: {
                placeholder: 'Título...',
                levels: [2, 3, 4, 5, 6],
                defaultLevel: 2
              }
            },
            list: {
              class: List,
              inlineToolbar: true,
              config: {
                defaultStyle: 'unordered'
              }
            },
            code: {
              class: Code,
              config: {
                placeholder: 'Escribe tu código aquí...'
              }
            },
            quote: {
              class: Quote,
              inlineToolbar: true,
              config: {
                quotePlaceholder: 'Escribe una cita...',
                captionPlaceholder: 'Autor de la cita'
              }
            },
            table: {
              class: Table,
              inlineToolbar: true
            },
            image: {
              class: SimpleImageTool,
              config: {
                endpoints: {
                  byFile: 'http://127.0.0.1:8000/api/images/editor-upload',
                },
                additionalRequestHeaders: {
                  'Authorization': `Bearer ${authService.getToken()}`
                }
              }
            }
          };
          
          
          editorRef.current = new EditorJS({
            holder: 'editor',
            placeholder: 'Escribe el contenido de tu post aquí...',
            tools: tools,
          autofocus: true,
          onReady: () => {
            console.log('Editor.js is ready to work!');
            setEditorLoading(false);
            resolve();
          }
        });
        } catch (error) {
          console.error('Error initializing editor:', error);
          setEditorLoading(false);
          resolve(); // Resolve anyway to not block the flow
        }
      }, 100); // Small delay to ensure DOM is ready
      
      // Timeout fallback
      setTimeout(() => {
        console.warn('Editor initialization timeout');
        setEditorLoading(false);
        resolve();
      }, 5000); // 5 second timeout
    });
  };

  const initializeEditorWithContent = (content) => {
    return new Promise((resolve) => {
      // Destroy existing editor if it exists
      if (editorRef.current) {
        try {
          editorRef.current.destroy();
        } catch (error) {
          console.error('Error destroying existing editor:', error);
        }
        editorRef.current = null;
      }

      // Small delay to ensure DOM is ready
      setTimeout(() => {
        try {
          // Verificar que el elemento existe
          const editorElement = document.getElementById('editor');
          if (!editorElement) {
            console.error('Editor element not found!');
            setEditorLoading(false);
            resolve();
            return;
          }
          
          // Limpiar el contenedor del editor
          editorElement.innerHTML = '';
          
          console.log('Creating EditorJS instance with content:', content);
          
            
            const toolsConfig = {
              header: {
                class: Header,
                config: {
                  placeholder: 'Título...',
                  levels: [2, 3, 4, 5, 6],
                  defaultLevel: 2
                }
              },
              list: {
                class: List,
                inlineToolbar: true,
                config: {
                  defaultStyle: 'unordered'
                }
              },
              code: {
                class: Code,
                config: {
                  placeholder: 'Escribe tu código aquí...'
                }
              },
              quote: {
                class: Quote,
                inlineToolbar: true,
                config: {
                  quotePlaceholder: 'Escribe una cita...',
                  captionPlaceholder: 'Autor de la cita'
                }
              },
              table: {
                class: Table,
                inlineToolbar: true
              },
              image: {
                class: SimpleImageTool,
                config: {
                  endpoints: {
                    byFile: 'http://127.0.0.1:8000/api/images/editor-upload',
                  },
                  additionalRequestHeaders: {
                    'Authorization': `Bearer ${authService.getToken()}`
                  }
                }
              }
            };
            
            
            editorRef.current = new EditorJS({
              holder: 'editor',
              placeholder: 'Escribe el contenido de tu post aquí...',
              data: content || {
                time: Date.now(),
                blocks: [],
                version: "2.28.2"
              },
              tools: toolsConfig,
            autofocus: true,
            onReady: () => {
              console.log('Editor.js is ready with content!');
              setEditorLoading(false);
              resolve();
            }
          });
        } catch (error) {
          console.error('Error initializing editor with content:', error);
          setEditorLoading(false);
          resolve(); // Resolve anyway to not block the flow
        }
      }, 100); // Small delay to ensure DOM is ready
      
      // Timeout fallback
      setTimeout(() => {
        console.warn('Editor with content initialization timeout');
        setEditorLoading(false);
        resolve();
      }, 5000); // 5 second timeout
    });
  };

  const loadCategoriesAndTags = async () => {
    try {
      const [categoriesRes, tagsRes] = await Promise.all([
        authService.authenticatedRequest('http://127.0.0.1:8000/api/categories'),
        authService.authenticatedRequest('http://127.0.0.1:8000/api/tags')
      ]);

      const categoriesData = await categoriesRes.json();
      const tagsData = await tagsRes.json();

      setCategories(categoriesData);
      setTags(tagsData);
    } catch (error) {
      console.error('Error loading categories and tags:', error);
    }
  };

  const loadPost = async () => {
    try {
      setLoading(true);
      console.log('Loading post with ID:', id);
      
      const response = await authService.authenticatedRequest(`http://127.0.0.1:8000/api/admin/posts/${id}`);
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        throw new Error('Post no encontrado');
      }

      const post = await response.json();
      console.log('Post loaded:', post);
      
      setFormData({
        title: post.title,
        excerpt: post.excerpt || '',
        category_id: post.category_id || '',
        status: post.status,
        published_at: post.published_at ? post.published_at.split('T')[0] : '',
        tags: post.tags || []
      });

      setSelectedTags(post.tags ? post.tags.map(tag => tag.id) : []);

      // Inicializar el editor con el contenido del post
      console.log('Initializing editor with content...');
      try {
        await initializeEditorWithContent(post.content);
        console.log('Editor initialized successfully');
      } catch (editorError) {
        console.error('Editor initialization failed:', editorError);
        // Fallback: inicializar editor vacío
        await initializeEditor();
      }
    } catch (error) {
      console.error('Error in loadPost:', error);
      setError(error.message);
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

  const handleTagToggle = (tagId) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSave = async (status) => {
    try {
      setSaving(true);
      setError('');

      // Validar que el título no esté vacío
      if (!formData.title || formData.title.trim() === '') {
        throw new Error('El título es requerido');
      }

      // Verificar que el editor esté inicializado
      if (!editorRef.current) {
        throw new Error('El editor no está inicializado');
      }

      // Obtener contenido del editor
      const savedData = await editorRef.current.save();

      const postData = {
        ...formData,
        status: status || formData.status,
        content: savedData,
        tags: selectedTags
      };

      // Si no hay fecha de publicación y el estado es publicado, usar la fecha actual
      if (!postData.published_at && postData.status === 'published') {
        postData.published_at = new Date().toISOString().split('T')[0];
      }

      // Limpiar campos vacíos
      if (!postData.category_id) {
        delete postData.category_id;
      }
      if (!postData.published_at) {
        delete postData.published_at;
      }

      const url = isEdit 
        ? `http://127.0.0.1:8000/api/posts/${id}`
        : 'http://127.0.0.1:8000/api/posts';
      
      const method = isEdit ? 'PUT' : 'POST';

      const response = await authService.authenticatedRequest(url, {
        method,
        body: JSON.stringify(postData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al guardar el post');
      }

      // Redirigir al dashboard después de guardar
      navigate('/admin');
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="container">
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Cargando post...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="container">
        <div className="editor-header">
          <h1>{isEdit ? 'Editar Post' : 'Nuevo Post'}</h1>
          <div className="editor-actions">
            <button 
              onClick={() => navigate('/admin')}
              className="cancel-button"
              disabled={saving}
            >
              Cancelar
            </button>
            <button 
              onClick={() => handleSave('draft')}
              className="save-draft-button"
              disabled={saving}
            >
              {saving ? 'Guardando...' : 'Guardar Borrador'}
            </button>
            <button 
              onClick={() => handleSave('published')}
              className="publish-button"
              disabled={saving}
            >
              {saving ? 'Publicando...' : 'Publicar'}
            </button>
          </div>
        </div>

        {error && (
          <div className="editor-error">
            <p>{error}</p>
          </div>
        )}

        <div className="editor-form">
          {/* Metadatos del post */}
          <div className="post-meta-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">Título del Post</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Escribe el título aquí..."
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="excerpt">Extracto</label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  placeholder="Breve descripción del post..."
                  rows="3"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category_id">Categoría</label>
                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                >
                  <option value="">Sin categoría</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="published_at">Fecha de Publicación</label>
                <input
                  type="date"
                  id="published_at"
                  name="published_at"
                  value={formData.published_at}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Etiquetas */}
            <div className="form-group">
              <label>Etiquetas</label>
              <div className="tags-selector">
                {tags.map(tag => (
                  <label key={tag.id} className="tag-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag.id)}
                      onChange={() => handleTagToggle(tag.id)}
                    />
                    <span className="tag-label">{tag.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Editor de contenido */}
          <div className="content-editor">
            <label>Contenido del Post</label>
            <div className="editor-wrapper">
              {editorLoading && (
                <div className="editor-loading">
                  <div className="loading-spinner"></div>
                  <p>Cargando editor...</p>
                </div>
              )}
              <div id="editor" className="editor-container" style={{ display: editorLoading ? 'none' : 'block' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal del selector de imágenes */}
      {showImageSelector && (
        <ImageSelector
          onImageSelect={(imageData) => {
            if (imageSelectorCallback) {
              imageSelectorCallback(imageData);
            }
            setShowImageSelector(false);
            setImageSelectorCallback(null);
          }}
          onClose={() => {
            setShowImageSelector(false);
            setImageSelectorCallback(null);
          }}
        />
      )}
    </div>
  );
}

export default PostEditor;