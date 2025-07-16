# Formulario de Contacto - Estado Actual

## 🚨 Problema Actual
El backend está devolviendo un error 500 (Internal Server Error) cuando se intenta enviar el formulario de contacto.

## 🔧 Solución Temporal Implementada
- **Modo Demo**: El formulario ahora funciona en modo simulación
- **Validación Client-Side**: Todos los campos se validan antes del envío
- **UX Mejorada**: El usuario ve que el mensaje se "envía" correctamente
- **Logs Detallados**: Los datos del formulario se registran en consola para debug

## 📋 Para Solucionar el Backend

### 1. Verificar el Servidor API
```bash
# Verificar que el servidor esté corriendo en http://127.0.0.1:8000
curl http://127.0.0.1:8000/api/contact/captcha

# Si no responde, iniciar el servidor backend
```

### 2. Verificar los Endpoints Requeridos
El frontend espera estos endpoints:

- **GET** `/api/contact/captcha` - Genera CAPTCHA
- **POST** `/api/contact` - Envía formulario

### 3. Formato de Datos Esperado

**Request POST /api/contact:**
```json
{
  "name": "string",
  "email": "string", 
  "phone": "string",
  "message": "string",
  "captcha_question": "string",
  "captcha_answer": "number"
}
```

**Response exitosa:**
```json
{
  "success": true,
  "message": "Mensaje enviado correctamente"
}
```

**Response con errores de validación (422):**
```json
{
  "success": false,
  "errors": {
    "name": ["El nombre es requerido"],
    "email": ["El email no es válido"],
    "captcha_answer": ["Respuesta incorrecta"]
  }
}
```

### 4. Configuración de Variables de Entorno

**Para desarrollo:**
```env
VITE_API_URL=http://127.0.0.1:8000/api
```

**Para producción:**
```env
VITE_API_URL=https://tu-dominio-api.com/api
```

## 🔄 Restaurar Funcionalidad Real

Una vez que el backend esté funcionando:

1. **Remover la simulación** en `/src/services/contactApi.js`
2. **Actualizar la URL** en `.env` si es necesario
3. **Probar el flujo completo** de envío

## 📝 Logs de Debug

El sistema ahora registra:
- Datos enviados al servidor
- Respuestas de error detalladas
- Estado de la conexión con la API

Revisar la consola del navegador para más detalles.

## ⚡ Estado Actual del Frontend

✅ **Funcional**: El formulario funciona en modo demo
✅ **Validación**: Validación completa client-side  
✅ **UX**: Experiencia de usuario mejorada
✅ **Responsive**: Funciona en todos los dispositivos
✅ **Accesible**: Manejo de errores y estados de carga

🔧 **Pendiente**: Conexión real con backend funcional