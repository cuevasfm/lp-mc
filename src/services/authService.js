const API_BASE_URL = 'http://127.0.0.1:8000/api';

class AuthService {
  constructor() {
    this.token = localStorage.getItem('blog_token');
    this.user = JSON.parse(localStorage.getItem('blog_user') || 'null');
  }

  // Login del usuario
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en el login');
      }

      const data = await response.json();
      
      // Guardar token y usuario en localStorage
      this.token = data.token;
      this.user = data.user;
      
      localStorage.setItem('blog_token', data.token);
      localStorage.setItem('blog_user', JSON.stringify(data.user));
      
      return data;
    } catch (error) {
      throw error;
    }
  }

  // Logout del usuario
  async logout() {
    try {
      if (this.token) {
        await fetch(`${API_BASE_URL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      // Limpiar datos locales independientemente del resultado
      this.token = null;
      this.user = null;
      localStorage.removeItem('blog_token');
      localStorage.removeItem('blog_user');
    }
  }

  // Verificar si el usuario está autenticado
  isAuthenticated() {
    return !!this.token && !!this.user;
  }

  // Obtener el token actual
  getToken() {
    return this.token;
  }

  // Obtener el usuario actual
  getUser() {
    return this.user;
  }

  // Obtener headers de autenticación
  getAuthHeaders() {
    if (!this.token) {
      return {};
    }

    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    };
  }

  // Realizar petición autenticada
  async authenticatedRequest(url, options = {}) {
    const headers = {
      ...this.getAuthHeaders(),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Si el token ha expirado, hacer logout automático
    if (response.status === 401) {
      await this.logout();
      throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
    }

    return response;
  }

  // Verificar si el usuario tiene permisos de administrador
  isAdmin() {
    return this.isAuthenticated() && this.user;
  }

  // Registrar usuario (opcional, si decides permitir registro)
  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en el registro');
      }

      const data = await response.json();
      
      // Guardar token y usuario automáticamente tras registro
      this.token = data.token;
      this.user = data.user;
      
      localStorage.setItem('blog_token', data.token);
      localStorage.setItem('blog_user', JSON.stringify(data.user));
      
      return data;
    } catch (error) {
      throw error;
    }
  }

  // Obtener información del usuario actual desde la API
  async getCurrentUser() {
    try {
      const response = await this.authenticatedRequest(`${API_BASE_URL}/user`);
      
      if (!response.ok) {
        throw new Error('Error al obtener información del usuario');
      }
      
      const userData = await response.json();
      this.user = userData;
      localStorage.setItem('blog_user', JSON.stringify(userData));
      
      return userData;
    } catch (error) {
      throw error;
    }
  }
}

export default new AuthService();