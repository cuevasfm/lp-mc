# Blog Integration - Documentación

## 🎯 Funcionalidades Implementadas

### ✅ Características principales:
- **Lista de posts paginada** - 9 posts por página
- **Búsqueda en tiempo real** - Por título y extracto
- **Filtrado por categorías** - Con contador de posts
- **Vista individual de posts** - Con contenido enriquecido
- **Rendering de Editor.js** - Soporte completo para bloques
- **Responsive design** - Optimizado para móviles
- **Estados de carga** - Loading, error, y vacío
- **Navegación fluida** - Entre lista y posts individuales

### 🛠️ Estructura de archivos:

```
src/
├── services/
│   └── blogApi.js          # Servicio para consumir la API
├── pages/
│   ├── Blog.jsx            # Lista de posts con filtros
│   └── BlogPost.jsx        # Vista individual de post
└── components/
    └── Navbar.jsx          # Navegación actualizada
```

## 🚀 Cómo usar

### Desarrollo local:
1. **Iniciar Laravel API** (en terminal 1):
   ```bash
   cd /Users/miguelcuevas/www/blog-api
   php artisan serve
   ```

2. **Iniciar React** (en terminal 2):
   ```bash
   cd /Users/miguelcuevas/www/Clau
   npm run dev
   ```

3. **Visitar**: http://localhost:5173/blog

### URLs disponibles:
- `/blog` - Lista de posts
- `/blog/{slug}` - Post individual

## 📝 API Configuration

### Configuración actual:
- **Base URL**: `http://127.0.0.1:8000/api`
- **CORS**: Configurado para desarrollo local
- **Paginación**: 9 posts por página (configurable)

### Para cambiar la URL de la API:
Edita `src/services/blogApi.js` línea 1:
```javascript
const API_BASE_URL = 'https://tu-api.com/api';
```

## 🎨 Diseño

### Sistema de colores:
- **Accent Primary**: `#00ff88` (verde neón)
- **Accent Secondary**: `#0099ff` (azul)
- **Accent Tertiary**: `#ff0080` (rosa)
- **Background**: Negro con overlays transparentes
- **Text**: Blanco y grises

### Responsive breakpoints:
- **Desktop**: > 768px
- **Tablet**: ≤ 768px
- **Mobile**: ≤ 480px

## 🔧 Funcionalidades de la API consumidas

### Posts:
- `GET /api/posts` - Lista paginada con filtros
- `GET /api/posts/{slug}` - Post individual

### Categorías:
- `GET /api/categories` - Lista de categorías

### Filtros soportados:
- `?search=término` - Búsqueda
- `?category=slug` - Filtro por categoría
- `?page=1` - Paginación
- `?per_page=9` - Posts por página

## 📱 Tipos de contenido soportados

### Editor.js blocks:
- ✅ **Paragraph** - Párrafos de texto
- ✅ **Header** - Títulos (H1-H6)
- ✅ **List** - Listas ordenadas y no ordenadas
- ✅ **Quote** - Citas con autor
- ✅ **Code** - Bloques de código
- ✅ **Image** - Imágenes con caption
- ✅ **Table** - Tablas de datos

### Metadata:
- ✅ **Fecha de publicación**
- ✅ **Tiempo de lectura estimado**
- ✅ **Autor del post**
- ✅ **Categoría y etiquetas**
- ✅ **Imagen destacada**
- ✅ **Galería de imágenes**

## 🚨 Troubleshooting

### Problemas comunes:

1. **Error 404 en API**:
   - Verificar que Laravel esté corriendo en puerto 8000
   - Confirmar que las rutas API estén registradas

2. **CORS errors**:
   - Verificar configuración CORS en Laravel
   - Asegurar que ForceJsonResponse middleware esté activo

3. **Posts no aparecen**:
   - Verificar que haya posts publicados en la BD
   - Comprobar que `published_at` sea anterior a ahora

4. **Estilos no cargan**:
   - Verificar que App.css esté importado
   - Comprobar variables CSS en navegador

## 📈 Próximas mejoras

### Funcionalidades pendientes:
- [ ] Modo offline con caché
- [ ] Compartir en redes sociales
- [ ] Comentarios
- [ ] Búsqueda avanzada con filtros
- [ ] Tema claro/oscuro automático
- [ ] PWA support
- [ ] Lazy loading de imágenes
- [ ] Infinite scroll opcional

### Optimizaciones:
- [ ] React.memo para componentes
- [ ] Debounce en búsqueda
- [ ] Prefetch de posts relacionados
- [ ] Compresión de imágenes
- [ ] Service Worker para caché