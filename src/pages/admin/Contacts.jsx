import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminContactApi from '../../services/adminContactApi';

function Contacts() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [stats, setStats] = useState({ total: 0, unread: 0, this_week: 0, this_month: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    unread_only: false
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 15,
    total: 0,
    last_page: 1
  });

  useEffect(() => {
    loadContacts();
    loadStats();
  }, [filters, pagination.current_page]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      
      const data = await adminContactApi.fetchContacts(
        pagination.current_page,
        pagination.per_page,
        filters
      );
      
      setContacts(data.data || []);
      setPagination({
        current_page: data.current_page || 1,
        per_page: data.per_page || 15,
        total: data.total || 0,
        last_page: data.last_page || 1
      });
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await adminContactApi.fetchStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleViewContact = async (contact) => {
    try {
      const data = await adminContactApi.getContact(contact.id);
      setSelectedContact(data);
      setShowModal(true);
      
      // Actualizar el estado de leído en la lista local
      setContacts(prev => prev.map(c => 
        c.id === contact.id ? { ...c, is_read: true } : c
      ));
      
      // Actualizar stats
      loadStats();
    } catch (error) {
      console.error('Error viewing contact:', error);
    }
  };

  const handleMarkAsRead = async (contactId, isRead = true) => {
    try {
      const success = await adminContactApi.updateReadStatus(contactId, isRead);
      
      if (success) {
        setContacts(prev => prev.map(c => 
          c.id === contactId ? { ...c, is_read: isRead } : c
        ));
        loadStats();
      }
    } catch (error) {
      console.error('Error updating contact status:', error);
    }
  };

  const handleDelete = async (contactId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este mensaje?')) {
      return;
    }

    try {
      const success = await adminContactApi.deleteContact(contactId);
      
      if (success) {
        setContacts(prev => prev.filter(c => c.id !== contactId));
        setShowModal(false);
        loadStats();
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && contacts.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400 text-lg">Cargando mensajes...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Mensajes de Contacto</h1>
            <p className="text-gray-400">Gestiona los mensajes que llegan desde el formulario de contacto</p>
          </div>
          <button 
            onClick={() => navigate('/admin')}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors border border-gray-700"
          >
            ← Volver al Dashboard
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-3xl font-bold text-white mb-1">{stats.total}</div>
            <div className="text-gray-400 text-sm">Total</div>
          </div>
          <div className="bg-red-900/20 border border-red-800/50 rounded-xl p-6">
            <div className="text-3xl font-bold text-red-400 mb-1">{stats.unread}</div>
            <div className="text-gray-400 text-sm">No leídos</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-3xl font-bold text-white mb-1">{stats.this_week}</div>
            <div className="text-gray-400 text-sm">Esta semana</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-3xl font-bold text-white mb-1">{stats.this_month}</div>
            <div className="text-gray-400 text-sm">Este mes</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar por nombre, email o mensaje..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>
            
            <label className="flex items-center gap-3 text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.unread_only}
                onChange={(e) => setFilters(prev => ({ ...prev, unread_only: e.target.checked }))}
                className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-green-500 focus:ring-green-500 focus:ring-2"
              />
              <span>Solo no leídos</span>
            </label>
          </div>
        </div>

        {/* Contacts List */}
        <div className="space-y-4 mb-8">
          {contacts.length > 0 ? (
            contacts.map(contact => (
              <div 
                key={contact.id} 
                className={`bg-gray-900 border rounded-xl p-6 cursor-pointer transition-all duration-200 hover:bg-gray-800 ${
                  !contact.is_read 
                    ? 'border-red-500/50 bg-red-900/10' 
                    : 'border-gray-800'
                }`}
                onClick={() => handleViewContact(contact)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">{contact.name}</h3>
                    <p className="text-gray-400 text-sm mb-1">{contact.email}</p>
                    {contact.phone && <p className="text-gray-500 text-sm">{contact.phone}</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 text-sm">{formatDate(contact.created_at)}</span>
                    {!contact.is_read && (
                      <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                        Nuevo
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-gray-300 text-sm leading-relaxed">
                  {contact.message.length > 150 
                    ? contact.message.substring(0, 150) + '...'
                    : contact.message
                  }
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📧</div>
              <h3 className="text-xl font-semibold text-white mb-2">No hay mensajes</h3>
              <p className="text-gray-400">
                {filters.search || filters.unread_only
                  ? 'No se encontraron mensajes con los filtros aplicados'
                  : 'Aún no has recibido mensajes de contacto'
                }
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.last_page > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, current_page: 1 }))}
              disabled={pagination.current_page === 1}
              className="px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ««
            </button>
            
            <button
              onClick={() => setPagination(prev => ({ ...prev, current_page: Math.max(1, prev.current_page - 1) }))}
              disabled={pagination.current_page === 1}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ← Anterior
            </button>

            <div className="px-4 py-2 text-gray-300">
              Página {pagination.current_page} de {pagination.last_page}
            </div>

            <button
              onClick={() => setPagination(prev => ({ ...prev, current_page: Math.min(prev.last_page, prev.current_page + 1) }))}
              disabled={pagination.current_page === pagination.last_page}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente →
            </button>

            <button
              onClick={() => setPagination(prev => ({ ...prev, current_page: prev.last_page }))}
              disabled={pagination.current_page === pagination.last_page}
              className="px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              »»
            </button>
          </div>
        )}
      </div>

      {/* Contact Detail Modal */}
      {showModal && selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h2 className="text-xl font-semibold text-white">Mensaje de {selectedContact.name}</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Nombre:</label>
                  <span className="text-white">{selectedContact.name}</span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Email:</label>
                  <span className="text-white">{selectedContact.email}</span>
                </div>
                
                {selectedContact.phone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Teléfono:</label>
                    <span className="text-white">{selectedContact.phone}</span>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Fecha:</label>
                  <span className="text-white">{formatDate(selectedContact.created_at)}</span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">IP:</label>
                  <span className="text-white">{selectedContact.ip_address || 'No disponible'}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">Mensaje:</label>
                <div className="bg-black border border-gray-800 rounded-lg p-4 text-gray-300 leading-relaxed">
                  {selectedContact.message}
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-800">
              <button
                onClick={() => handleMarkAsRead(selectedContact.id, !selectedContact.is_read)}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                {selectedContact.is_read ? 'Marcar como no leído' : 'Marcar como leído'}
              </button>
              
              <button
                onClick={() => handleDelete(selectedContact.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Eliminar mensaje
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Contacts;