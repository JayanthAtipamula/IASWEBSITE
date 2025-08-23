import React, { useState, useEffect } from 'react';
import { checkFirebaseEnvVars } from '../utils/testFirebaseConnection';

interface EnvStatus {
  [key: string]: boolean;
}

const FirebaseEnvChecker: React.FC = () => {
  const [envStatus, setEnvStatus] = useState<EnvStatus>({});
  const [isLoading, setIsLoading] = useState(true);
  const [allConfigured, setAllConfigured] = useState(false);

  useEffect(() => {
    const checkEnvironment = () => {
      try {
        console.log('🔍 Checking Firebase environment variables...');
        const status = checkFirebaseEnvVars();
        setEnvStatus(status);
        
        const allSet = Object.values(status).every(isSet => isSet);
        setAllConfigured(allSet);
        
        console.log(`✅ Environment check complete. All configured: ${allSet}`);
      } catch (error) {
        console.error('❌ Error checking environment variables:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkEnvironment();
  }, []);

  const getRequiredEnvVars = () => [
    {
      key: 'VITE_FIREBASE_API_KEY',
      description: 'Firebase API Key',
      example: 'AIzaSyB...'
    },
    {
      key: 'VITE_FIREBASE_AUTH_DOMAIN',
      description: 'Firebase Auth Domain',
      example: 'yourproject.firebaseapp.com'
    },
    {
      key: 'VITE_FIREBASE_PROJECT_ID',
      description: 'Firebase Project ID',
      example: 'yourproject'
    },
    {
      key: 'VITE_FIREBASE_STORAGE_BUCKET',
      description: 'Firebase Storage Bucket',
      example: 'yourproject.appspot.com'
    },
    {
      key: 'VITE_FIREBASE_MESSAGING_SENDER_ID',
      description: 'Firebase Messaging Sender ID',
      example: '123456789'
    },
    {
      key: 'VITE_FIREBASE_APP_ID',
      description: 'Firebase App ID',
      example: '1:123456789:web:abc123'
    }
  ];

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-3 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Firebase Environment Configuration
        </h2>
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          allConfigured 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {allConfigured ? (
            <>
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              All Variables Configured
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Missing Configuration
            </>
          )}
        </div>
      </div>

      {!allConfigured && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Firebase Configuration Required
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Some Firebase environment variables are missing. Please create a <code className="bg-yellow-100 px-1 rounded">.env</code> file 
                  in your project root and add the required variables.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        <h3 className="text-lg font-medium text-gray-900">Environment Variables Status</h3>
        
        {getRequiredEnvVars().map((envVar) => {
          const isSet = envStatus[envVar.key];
          return (
            <div 
              key={envVar.key}
              className={`border rounded-lg p-4 ${
                isSet ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      isSet ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <code className={`font-mono text-sm font-medium ${
                      isSet ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {envVar.key}
                    </code>
                  </div>
                  <p className={`mt-1 text-sm ${
                    isSet ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {envVar.description}
                  </p>
                  {!isSet && (
                    <p className="mt-2 text-xs text-gray-600">
                      Example: <code className="bg-gray-100 px-1 rounded">{envVar.example}</code>
                    </p>
                  )}
                </div>
                <div className={`text-sm font-medium ${
                  isSet ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isSet ? 'Set ✓' : 'Missing ✗'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!allConfigured && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">How to Configure Firebase:</h4>
          <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
            <li>Go to <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="underline">Firebase Console</a></li>
            <li>Select your project or create a new one</li>
            <li>Go to Project Settings (gear icon)</li>
            <li>Scroll down to "Your apps" and add/select a Web app</li>
            <li>Copy the configuration values to your <code className="bg-blue-100 px-1 rounded">.env</code> file</li>
            <li>Restart your development server</li>
          </ol>
        </div>
      )}

      {allConfigured && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-green-800">Configuration Complete!</h4>
              <p className="text-sm text-green-700 mt-1">
                All Firebase environment variables are configured. You can now test the Firebase connection.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh Check
          </button>
          <a
            href="/firebase-test"
            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 inline-block"
          >
            Test Firebase Connection
          </a>
          <a
            href="/firebase-editor-debug"
            className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 inline-block"
          >
            Test Firebase Editor
          </a>
        </div>
      </div>
    </div>
  );
};

export default FirebaseEnvChecker;