import React, { useState } from 'react';
import MinimalLexicalTest from '../components/MinimalLexicalTest';

const EditorDebugTest: React.FC = () => {
  const [content, setContent] = useState('<p>Initial test content</p>');
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    const timestamp = new Date().toLocaleTimeString();
    setDebugInfo(prev => [
      `${timestamp}: Content changed (${newContent.length} chars)`,
      ...prev.slice(0, 9) // Keep last 10 entries
    ]);
  };

  const clearDebugInfo = () => {
    setDebugInfo([]);
  };

  const resetContent = () => {
    setContent('<p>Reset test content</p>');
    setDebugInfo([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            🐛 Lexical Editor Debug Page
          </h1>
          <p className="text-gray-600 mb-6">
            This page isolates the Lexical editor to test keyboard input behavior.
            The editor below should allow normal typing without creating line breaks on every keypress.
          </p>
          
          <div className="flex gap-4 mb-6">
            <button
              onClick={resetContent}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Reset Content
            </button>
            <button
              onClick={clearDebugInfo}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Clear Debug Log
            </button>
          </div>

          <MinimalLexicalTest 
            content={content}
            onChange={handleContentChange}
            placeholder="Click here and type normally. Test: fd as l j fdk as"
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            📊 Debug Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Current Content:</h3>
              <div className="bg-gray-100 p-3 rounded border text-sm font-mono max-h-32 overflow-auto">
                {content}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Change Log:</h3>
              <div className="bg-gray-100 p-3 rounded border text-sm max-h-32 overflow-auto">
                {debugInfo.length === 0 ? (
                  <p className="text-gray-500">No changes yet</p>
                ) : (
                  debugInfo.map((info, index) => (
                    <div key={index} className="mb-1">
                      {info}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-yellow-800 mb-3">
            🧪 Testing Instructions
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-yellow-700">
            <li>Click in the red-bordered editor above</li>
            <li>Type normally: "hello world"</li>
            <li>Check if text appears on the same line</li>
            <li>Try pressing Enter to create intentional line breaks</li>
            <li>Try typing after pressing Enter</li>
            <li>Watch the debug log for any unusual behavior</li>
          </ol>
          
          <div className="mt-4 p-3 bg-yellow-100 rounded">
            <p className="text-sm font-medium text-yellow-800">
              Expected Behavior: Normal typing should keep text on the same line unless Enter is pressed.
            </p>
            <p className="text-sm text-yellow-700 mt-1">
              Problem Behavior: Each keypress creates a new line/paragraph.
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-3">
            🔍 Diagnostic Information
          </h2>
          <div className="space-y-2 text-sm text-blue-700">
            <p><strong>Browser:</strong> {navigator.userAgent}</p>
            <p><strong>URL:</strong> {window.location.href}</p>
            <p><strong>Time:</strong> {new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorDebugTest;