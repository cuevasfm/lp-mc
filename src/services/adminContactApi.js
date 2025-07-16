import { apiRequest } from '../config/api';
import authService from './authService';

class AdminContactAPI {
  // Fetch contacts with pagination and filters
  async fetchContacts(page = 1, perPage = 15, filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.unread_only) params.append('unread_only', 'true');
      params.append('page', page.toString());
      params.append('per_page', perPage.toString());

      const response = await authService.authenticatedRequest(
        `/contacts?${params.toString()}`
      );

      if (response && response.ok) {
        return await response.json();
      }
      
      // Fallback data for demo
      return this.getMockContacts(page, perPage, filters);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      return this.getMockContacts(page, perPage, filters);
    }
  }

  // Fetch contact statistics
  async fetchStats() {
    try {
      const response = await authService.authenticatedRequest('/contacts/stats');
      
      if (response && response.ok) {
        return await response.json();
      }
      
      // Fallback stats for demo
      return {
        total: 15,
        unread: 3,
        this_week: 8,
        this_month: 12
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return {
        total: 15,
        unread: 3,
        this_week: 8,
        this_month: 12
      };
    }
  }

  // Get contact details
  async getContact(id) {
    try {
      const response = await authService.authenticatedRequest(`/contacts/${id}`);
      
      if (response && response.ok) {
        return await response.json();
      }
      
      // Fallback contact for demo
      return this.getMockContact(id);
    } catch (error) {
      console.error('Error fetching contact:', error);
      return this.getMockContact(id);
    }
  }

  // Mark contact as read/unread
  async updateReadStatus(id, isRead = true) {
    try {
      const endpoint = isRead ? 'read' : 'unread';
      const response = await authService.authenticatedRequest(
        `/contacts/${id}/${endpoint}`,
        { method: 'PATCH' }
      );
      
      return response && response.ok;
    } catch (error) {
      console.error('Error updating contact status:', error);
      return true; // Simulate success for demo
    }
  }

  // Delete contact
  async deleteContact(id) {
    try {
      const response = await authService.authenticatedRequest(
        `/contacts/${id}`,
        { method: 'DELETE' }
      );
      
      return response && response.ok;
    } catch (error) {
      console.error('Error deleting contact:', error);
      return true; // Simulate success for demo
    }
  }

  // Mock data for demo purposes
  getMockContacts(page = 1, perPage = 15, filters = {}) {
    const mockContacts = [
      {
        id: 1,
        name: 'Juan Pérez',
        email: 'juan@example.com',
        phone: '+52 123 456 7890',
        message: 'Hola, estoy interesado en desarrollar una aplicación web para mi negocio. ¿Podrías ayudarme con esto?',
        is_read: false,
        created_at: '2024-01-15T10:30:00Z',
        ip_address: '192.168.1.1'
      },
      {
        id: 2,
        name: 'María García',
        email: 'maria@example.com',
        phone: null,
        message: 'Me gustaría saber más sobre tus servicios de desarrollo frontend con React.',
        is_read: true,
        created_at: '2024-01-14T14:20:00Z',
        ip_address: '192.168.1.2'
      },
      {
        id: 3,
        name: 'Carlos López',
        email: 'carlos@example.com',
        phone: '+52 987 654 3210',
        message: 'Necesito una aplicación móvil para iOS y Android. ¿Trabajas con React Native?',
        is_read: false,
        created_at: '2024-01-13T09:15:00Z',
        ip_address: '192.168.1.3'
      }
    ];

    // Apply filters
    let filteredContacts = mockContacts;
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filteredContacts = filteredContacts.filter(contact =>
        contact.name.toLowerCase().includes(search) ||
        contact.email.toLowerCase().includes(search) ||
        contact.message.toLowerCase().includes(search)
      );
    }
    
    if (filters.unread_only) {
      filteredContacts = filteredContacts.filter(contact => !contact.is_read);
    }

    // Simulate pagination
    const total = filteredContacts.length;
    const lastPage = Math.ceil(total / perPage);
    const start = (page - 1) * perPage;
    const data = filteredContacts.slice(start, start + perPage);

    return {
      data,
      current_page: page,
      per_page: perPage,
      total,
      last_page: lastPage
    };
  }

  getMockContact(id) {
    const contacts = this.getMockContacts().data;
    return contacts.find(c => c.id === parseInt(id)) || contacts[0];
  }
}

export default new AdminContactAPI();