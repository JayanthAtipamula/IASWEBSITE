import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Trash2, Check, X, Phone, MessageCircle, CheckCircle } from 'lucide-react';
import { getMessages, deleteMessage, markMessageAsRead, updateContactedStatus, updateAdminComment } from '../../services/messageService';
import { ContactMessage } from '../../types/message';
import LoadingScreen from '../../components/LoadingScreen';

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMessage, setActiveMessage] = useState<ContactMessage | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [adminComment, setAdminComment] = useState<string>('');
  const [isSubmittingComment, setIsSubmittingComment] = useState<boolean>(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    if (activeMessage) {
      setAdminComment(activeMessage.adminComment || '');
    }
  }, [activeMessage]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await getMessages();
      setMessages(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markMessageAsRead(id);
      setMessages(prev => 
        prev.map(message => 
          message.id === id ? { ...message, isRead: true } : message
        )
      );
    } catch (err) {
      console.error('Error marking message as read:', err);
    }
  };

  const handleToggleContacted = async (id: string, contacted: boolean) => {
    try {
      await updateContactedStatus(id, contacted);
      setMessages(prev => 
        prev.map(message => 
          message.id === id ? { ...message, contacted } : message
        )
      );
      
      if (activeMessage && activeMessage.id === id) {
        setActiveMessage(prev => prev ? { ...prev, contacted } : null);
      }
    } catch (err) {
      console.error('Error updating contacted status:', err);
    }
  };

  const handleSaveComment = async () => {
    if (!activeMessage) return;
    
    setIsSubmittingComment(true);
    try {
      await updateAdminComment(activeMessage.id, adminComment);
      setMessages(prev => 
        prev.map(message => 
          message.id === activeMessage.id ? { ...message, adminComment } : message
        )
      );
      setActiveMessage(prev => prev ? { ...prev, adminComment } : null);
    } catch (err) {
      console.error('Error saving comment:', err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      return;
    }

    try {
      await deleteMessage(id);
      setMessages(prev => prev.filter(message => message.id !== id));
      if (activeMessage?.id === id) {
        setActiveMessage(null);
      }
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  const formatDate = (timestamp: number) => {
    return format(new Date(timestamp), 'dd MMM yyyy, h:mm a');
  };

  if (loading) return <LoadingScreen />;

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Messages</h1>
        <button 
          onClick={fetchMessages}
          className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {messages.length === 0 && !loading ? (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-1">No Messages Yet</h3>
          <p className="text-gray-500">When users submit the contact form, their messages will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1 space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id}
                className={`
                  p-4 border rounded-lg cursor-pointer transition-colors
                  ${message.contacted 
                    ? 'bg-green-50 border-green-200' 
                    : message.isRead 
                      ? 'bg-white border-gray-200' 
                      : 'bg-blue-50 border-blue-200 font-medium'}
                  ${activeMessage?.id === message.id ? 'ring-2 ring-blue-500' : ''}
                `}
                onClick={() => {
                  setActiveMessage(message);
                  if (!message.isRead) {
                    handleMarkAsRead(message.id);
                  }
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-gray-900 font-medium truncate">{message.name}</h3>
                  <div className="flex items-center space-x-1">
                    {message.contacted && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                    {!message.isRead && (
                      <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                    )}
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Phone className="h-4 w-4 mr-1" />
                  <span>{message.phoneNumber}</span>
                </div>
                <p className="text-gray-600 text-sm truncate mb-2">{message.message}</p>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-400">{formatDate(message.createdAt)}</p>
                  {message.adminComment && (
                    <MessageCircle className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Message Detail View */}
          <div className="lg:col-span-2">
            {activeMessage ? (
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold">{activeMessage.name}</h2>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center mr-2">
                      <input
                        type="checkbox"
                        id="contactedCheckbox"
                        checked={activeMessage.contacted}
                        onChange={(e) => handleToggleContacted(activeMessage.id, e.target.checked)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor="contactedCheckbox" className="ml-2 text-sm text-gray-700">
                        Contacted
                      </label>
                    </div>
                    <button
                      onClick={() => handleDelete(activeMessage.id)}
                      className={`p-1 rounded-full hover:bg-red-100 ${
                        deleteConfirm === activeMessage.id ? 'bg-red-100' : ''
                      }`}
                      title="Delete message"
                    >
                      {deleteConfirm === activeMessage.id ? (
                        <div className="flex items-center space-x-1">
                          <Check 
                            className="h-5 w-5 text-green-600 cursor-pointer" 
                            onClick={() => handleDelete(activeMessage.id)} 
                          />
                          <X 
                            className="h-5 w-5 text-red-600 cursor-pointer" 
                            onClick={() => setDeleteConfirm(null)}
                          />
                        </div>
                      ) : (
                        <Trash2 className="h-5 w-5 text-red-500" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center mb-4 text-gray-500">
                  <Phone className="h-5 w-5 mr-2" />
                  <a 
                    href={`tel:${activeMessage.phoneNumber}`} 
                    className="text-blue-600 hover:underline"
                  >
                    {activeMessage.phoneNumber}
                  </a>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Message:</h3>
                  <div className="bg-gray-50 p-4 rounded-lg text-gray-800">
                    {activeMessage.message}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Admin Comment:</h3>
                  <div className="flex flex-col space-y-2">
                    <textarea
                      value={adminComment}
                      onChange={(e) => setAdminComment(e.target.value)}
                      rows={3}
                      className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                      placeholder="Add your follow-up notes here..."
                    />
                    <button
                      onClick={handleSaveComment}
                      disabled={isSubmittingComment}
                      className="self-end px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {isSubmittingComment ? 'Saving...' : 'Save Comment'}
                    </button>
                  </div>
                </div>

                <div className="text-sm text-gray-500">
                  Received on {formatDate(activeMessage.createdAt)}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 flex items-center justify-center h-64">
                <p className="text-gray-500">Select a message to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages; 