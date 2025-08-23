import React, { useEffect, useState, useRef } from 'react';
import { useFirebaseEditor, UseFirebaseEditorOptions } from '../hooks/useFirebaseEditor';
import ClientOnlyLexicalEditor from './ClientOnlyLexicalEditor';
import LoadingScreen from './LoadingScreen';

interface FirebaseEditorProps extends UseFirebaseEditorOptions {
  placeholder?: string;
  showTitle?: boolean;
  showStatus?: boolean;
  className?: string;
  onContentChange?: (content: string) => void;
  onTitleChange?: (title: string) => void;
  initialContent?: string;
  initialTitle?: string;
}

const FirebaseEditor: React.FC<FirebaseEditorProps> = ({
  collection,
  documentId,
  autoSave = true,
  autoSaveInterval = 5000,
  enableRealtimeSync = false,
  placeholder = 'Start writing...',
  showTitle = true,
  showStatus = true,
  className = '',
  onContentChange,
  onTitleChange,
  onError,
  onSaved,
  onLoaded,
  initialContent,
  initialTitle
}) => {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  
  const {
    content,
    title,
    isLoading,
    isSaving,
    lastSaved,
    error,
    updateContent,
    updateTitle,
    saveNow,
    reload,
    clearError
  } = useFirebaseEditor({
    collection,
    documentId,
    autoSave,
    autoSaveInterval,
    enableRealtimeSync,
    initialContent,
    initialTitle,
    onError: (err) => {
      console.error('Firebase Editor Error:', err);
      setConnectionStatus('disconnected');
      if (onError) onError(err);
    },
    onSaved: (data) => {
      console.log('Content saved:', data.id);
      setConnectionStatus('connected');
      if (onSaved) onSaved(data);
    },
    onLoaded: (data) => {
      console.log('Content loaded:', data.id);
      setConnectionStatus('connected');
      if (onLoaded) onLoaded(data);
    }
  });

  // Call external change handlers only when content actually changes
  const previousContentRef = useRef(content);
  const previousTitleRef = useRef(title);
  
  useEffect(() => {
    if (onContentChange && content !== previousContentRef.current) {
      console.log('🔄 FirebaseEditor: Content changed, calling onContentChange');
      onContentChange(content);
      previousContentRef.current = content;
    }
  }, [content, onContentChange]);

  useEffect(() => {
    if (onTitleChange && title !== previousTitleRef.current) {
      console.log('🔄 FirebaseEditor: Title changed, calling onTitleChange');
      onTitleChange(title);
      previousTitleRef.current = title;
    }
  }, [title, onTitleChange]);

  // Update connection status after loading
  useEffect(() => {
    if (!isLoading) {
      setConnectionStatus(error ? 'disconnected' : 'connected');
    }
  }, [isLoading, error]);

  const handleContentChange = (newContent: string) => {
    updateContent(newContent);
  };

  const handleTitleChange = (newTitle: string) => {
    updateTitle(newTitle);
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-600';
      case 'disconnected': return 'text-red-600';
      case 'checking': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusText = () => {
    if (isSaving) return 'Saving...';
    if (isLoading) return 'Loading...';
    
    switch (connectionStatus) {
      case 'connected':
        return lastSaved 
          ? `Last saved: ${lastSaved.toLocaleTimeString()}`
          : 'Connected to Firebase';
      case 'disconnected':
        return 'Disconnected from Firebase';
      case 'checking':
        return 'Checking connection...';
      default:
        return 'Unknown status';
    }
  };

  if (isLoading) {
    return (
      <div className={`firebase-editor ${className}`}>
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <div className="p-2 border-b border-gray-300 bg-gray-50">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Firebase Editor</span>
              <span className="text-sm text-yellow-600">Loading from Firebase...</span>
            </div>
          </div>
          <div className="p-4">
            <LoadingScreen />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`firebase-editor ${className}`}>
      {/* Error Banner */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Firebase Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <div className="flex space-x-2">
                  <button
                    onClick={clearError}
                    className="bg-red-100 px-2 py-1 rounded text-sm text-red-800 hover:bg-red-200"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={reload}
                    className="bg-red-100 px-2 py-1 rounded text-sm text-red-800 hover:bg-red-200"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Editor Container */}
      <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
        {/* Header */}
        <div className="p-2 sm:p-3 border-b border-gray-300 bg-gray-50">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Firebase Editor</span>
              <span className="text-xs text-gray-500">
                {collection}/{documentId}
              </span>
              {initialContent && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  With initial content ({initialContent.length} chars)
                </span>
              )}
            </div>
            
            {showStatus && (
              <div className="flex items-center space-x-2">
                {/* Connection Status */}
                <div className={`flex items-center space-x-1 ${getStatusColor()}`}>
                  <div className={`w-2 h-2 rounded-full ${
                    connectionStatus === 'connected' ? 'bg-green-500' :
                    connectionStatus === 'disconnected' ? 'bg-red-500' :
                    'bg-yellow-500'
                  }`}></div>
                  <span className="text-xs">{getStatusText()}</span>
                </div>
                
                {/* Manual Save Button */}
                <button
                  onClick={saveNow}
                  disabled={isSaving}
                  className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Save now"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
                
                {/* Reload Button */}
                <button
                  onClick={reload}
                  disabled={isLoading}
                  className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Reload content"
                >
                  ↻
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Title Input */}
        {showTitle && (
          <div className="p-4 border-b border-gray-200">
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter title..."
              className="w-full text-xl font-semibold border-none outline-none bg-transparent resize-none placeholder-gray-400"
            />
          </div>
        )}

        {/* Content Editor */}
        <div className="relative">
          <ClientOnlyLexicalEditor
            content={content}
            onChange={handleContentChange}
            placeholder={placeholder}
            key={`editor-${documentId}-${content.length}`}
          />
          
          {/* Loading Overlay */}
          {(isLoading || isSaving) && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-blue-600" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="text-sm text-gray-600">
                  {isLoading ? 'Loading...' : 'Saving...'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer with additional info */}
        {showStatus && (
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
            <div className="flex justify-between items-center">
              <div>
                Auto-save: {autoSave ? `Every ${autoSaveInterval / 1000}s` : 'Disabled'}
                {enableRealtimeSync && ' | Real-time sync: Enabled'}
              </div>
              <div>
                Characters: {content.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FirebaseEditor;