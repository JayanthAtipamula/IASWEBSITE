import React, { useState } from 'react';
import FirebaseEditor from '../components/FirebaseEditor';
import FirebaseConnectionTest from '../components/FirebaseConnectionTest';
import contentEditorService from '../services/contentEditorService';

const FirebaseEditorDebugPage: React.FC = () => {
  const [testCollection, setTestCollection] = useState('test-content');
  const [testDocumentId, setTestDocumentId] = useState('sample-document');
  const [autoSave, setAutoSave] = useState(true);
  const [autoSaveInterval, setAutoSaveInterval] = useState(5000);
  const [enableRealtimeSync, setEnableRealtimeSync] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const [showStatus, setShowStatus] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);
  const [connectionTestResult, setConnectionTestResult] = useState<any>(null);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 49)]);
    console.log(`[Firebase Editor Debug] ${message}`);
  };

  const testFirebaseConnection = async () => {
    addLog('Testing Firebase connection...');
    try {
      const result = await contentEditorService.testConnection();
      setConnectionTestResult(result);
      addLog(`Connection test result: ${result.success ? 'SUCCESS' : 'FAILED'} - ${result.message}`);
    } catch (error) {
      addLog(`Connection test error: ${error}`);
      setConnectionTestResult({ success: false, message: `Error: ${error}`, details: { error } });
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const handleContentChange = (content: string) => {
    addLog(`Content updated: ${content.length} characters`);
  };

  const handleTitleChange = (title: string) => {
    addLog(`Title updated: "${title}"`);
  };

  const handleError = (error: Error) => {
    addLog(`ERROR: ${error.message}`);
  };

  const handleSaved = (data: any) => {
    addLog(`Content saved successfully: ${data.id} (${data.content.length} chars)`);
  };

  const handleLoaded = (data: any) => {
    addLog(`Content loaded successfully: ${data.id} (${data.content.length} chars)`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Firebase Editor Debug Page</h1>
        
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
          <h3 className="text-lg font-medium text-blue-800 mb-2">Instructions</h3>
          <p className="text-blue-700 mb-2">
            This page helps you debug Firebase integration issues with the content editor. 
          </p>
          <ul className="list-disc pl-5 text-blue-700 space-y-1">
            <li>Configure the editor settings below</li>
            <li>Test Firebase connection</li>
            <li>Try editing content and observe the logs</li>
            <li>Check for any errors in the console and logs section</li>
          </ul>
        </div>

        {/* Firebase Connection Test */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Firebase Connection Test</h2>
            <button
              onClick={testFirebaseConnection}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
            >
              Test Firebase Connection
            </button>
            
            {connectionTestResult && (
              <div className={`p-4 rounded ${connectionTestResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <h3 className={`font-medium ${connectionTestResult.success ? 'text-green-800' : 'text-red-800'}`}>
                  {connectionTestResult.success ? '✅ Connection Successful' : '❌ Connection Failed'}
                </h3>
                <p className={connectionTestResult.success ? 'text-green-700' : 'text-red-700'}>
                  {connectionTestResult.message}
                </p>
                {connectionTestResult.details && (
                  <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                    {JSON.stringify(connectionTestResult.details, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Editor Configuration</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Collection Name
                </label>
                <input
                  type="text"
                  value={testCollection}
                  onChange={(e) => setTestCollection(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="test-content"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Document ID
                </label>
                <input
                  type="text"
                  value={testDocumentId}
                  onChange={(e) => setTestDocumentId(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="sample-document"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Auto-save Interval (ms)
                </label>
                <input
                  type="number"
                  value={autoSaveInterval}
                  onChange={(e) => setAutoSaveInterval(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  min="1000"
                  step="1000"
                />
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={autoSave}
                    onChange={(e) => setAutoSave(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">Enable Auto-save</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={enableRealtimeSync}
                    onChange={(e) => setEnableRealtimeSync(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">Enable Real-time Sync</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showTitle}
                    onChange={(e) => setShowTitle(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">Show Title Field</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showStatus}
                    onChange={(e) => setShowStatus(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">Show Status Bar</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Firebase Editor */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Firebase Content Editor</h2>
          <FirebaseEditor
            collection={testCollection}
            documentId={testDocumentId}
            autoSave={autoSave}
            autoSaveInterval={autoSaveInterval}
            enableRealtimeSync={enableRealtimeSync}
            showTitle={showTitle}
            showStatus={showStatus}
            placeholder="Start typing to test Firebase integration..."
            onContentChange={handleContentChange}
            onTitleChange={handleTitleChange}
            onError={handleError}
            onSaved={handleSaved}
            onLoaded={handleLoaded}
          />
        </div>

        {/* Debug Logs */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Debug Logs</h2>
            <button
              onClick={clearLogs}
              className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
            >
              Clear Logs
            </button>
          </div>
          <div className="bg-black text-green-400 p-4 rounded font-mono text-sm h-64 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-gray-500">No logs yet. Start using the editor to see debug information...</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">{log}</div>
              ))
            )}
          </div>
        </div>

        {/* Full Firebase Connection Test */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Complete Firebase Connection Test</h2>
          <FirebaseConnectionTest />
        </div>
      </div>
    </div>
  );
};

export default FirebaseEditorDebugPage;