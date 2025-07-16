import { apiRequest, API_BASE_URL } from '../config/api';

class BlogAPI {
  async fetchPosts(page = 1, perPage = 15, filters = {}) {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
      ...filters
    });

    try {
      return await apiRequest(`/posts?${queryParams}`);
    } catch (error) {
      throw new Error('Error al obtener las entradas del blog');
    }
  }

  async fetchPost(slug) {
    try {
      return await apiRequest(`/posts/${slug}`);
    } catch (error) {
      if (error.message.includes('404')) {
        throw new Error('Entrada no encontrada');
      }
      throw new Error('Error al obtener la entrada del blog');
    }
  }

  async fetchCategories() {
    try {
      return await apiRequest('/categories');
    } catch (error) {
      throw new Error('Error al obtener las categorías');
    }
  }

  async fetchTags() {
    try {
      return await apiRequest('/tags');
    } catch (error) {
      throw new Error('Error al obtener las etiquetas');
    }
  }

  // Helper para renderizar contenido de Editor.js
  renderEditorContent(content) {
    if (!content || !content.blocks) {
      return '';
    }

    return content.blocks.map(block => {
      switch (block.type) {
        case 'paragraph':
          return `<p>${block.data.text}</p>`;
        case 'header':
          return `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
        case 'list':
          const listType = block.data.style === 'ordered' ? 'ol' : 'ul';
          const items = block.data.items.map(item => `<li>${item}</li>`).join('');
          return `<${listType}>${items}</${listType}>`;
        case 'quote':
          return `<blockquote><p>${block.data.text}</p><footer>${block.data.caption || ''}</footer></blockquote>`;
        case 'code':
          return `<pre><code>${block.data.code}</code></pre>`;
        case 'image':
          const imageUrl = block.data.url || block.data.file?.url || '';
          const classes = [];
          if (block.data.withBorder) classes.push('image-with-border');
          if (block.data.withBackground) classes.push('image-with-background');
          if (block.data.stretched) classes.push('image-stretched');
          
          return `<figure class="${classes.join(' ')}">
            <img src="${imageUrl}" alt="${block.data.caption || ''}" loading="lazy" />
            ${block.data.caption ? `<figcaption>${block.data.caption}</figcaption>` : ''}
          </figure>`;
        case 'table':
          const rows = block.data.content.map(row => 
            `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`
          ).join('');
          return `<table><tbody>${rows}</tbody></table>`;
        default:
          return '';
      }
    }).join('');
  }

  // Helper para formatear fecha
  formatDate(dateString) {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  }

  // Helper para calcular tiempo de lectura estimado
  estimateReadTime(content) {
    if (!content || !content.blocks) {
      return '1 min';
    }

    const wordsPerMinute = 200;
    const totalWords = content.blocks.reduce((total, block) => {
      let text = '';
      
      switch (block.type) {
        case 'paragraph':
        case 'header':
        case 'quote':
          text = block.data.text || '';
          break;
        case 'list':
          text = (block.data.items || []).join(' ');
          break;
        case 'code':
          text = block.data.code || '';
          break;
        default:
          text = '';
      }
      
      return total + text.split(/\s+/).length;
    }, 0);

    const minutes = Math.ceil(totalWords / wordsPerMinute);
    return `${minutes} min`;
  }
}

export default new BlogAPI();