import React, { useState, useEffect } from 'react';
import { 
  testAllFirebaseConnections, 
  checkFirebaseEnvVars 
} from '../utils/testFirebaseConnection';
import { db, auth, storage } from '../config/firebase';

interface ConfigIssue {
  type: 'error' | 'warning' | 'info';
  title: string;
  description: string;
  solution?: string;
}

const FirebaseConfigTroubleshooter: React.FC = () => {
  const [issues, setIssues] = useState<ConfigIssue[]>([]);
  const [envVars, setEnvVars] = useState<{[key: string]: boolean}>({});
  const [connectionResults, setConnectionResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSolutions, setShowSolutions] = useState(true);

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    setIsLoading(true);
    setIssues([]);
    
    try {
      // Check environment variables
      const envStatus = checkFirebaseEnvVars();
      setEnvVars(envStatus);
      
      // Test connections
      const connections = await testAllFirebaseConnections();
      setConnectionResults(connections);
      
      // Analyze and generate issues
      analyzeConfiguration(envStatus, connections);
    } catch (error) {
      console.error('Error running diagnostics:', error);
      addIssue({
        type: 'error',
        title: 'Diagnostic Error',
        description: 'Failed to run Firebase diagnostics. Check console for details.',
        solution: 'Refresh the page and try again. If the problem persists, check your network connection.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addIssue = (issue: ConfigIssue) => {
    setIssues(prev => [...prev, issue]);
  };

  const analyzeConfiguration = (envStatus: {[key: string]: boolean}, connections: any) => {
    // Check missing environment variables
    const missingEnvVars = Object.entries(envStatus).filter(([key, isSet]) => !isSet);
    if (missingEnvVars.length > 0) {
      addIssue({
        type: 'error',
        title: 'Missing Environment Variables',
        description: `The following Firebase environment variables are not set: ${missingEnvVars.map(([key]) => key).join(', ')}`,
        solution: `Create a .env file in your project root with the following variables:\n\n${missingEnvVars.map(([key]) => `${key}=your_value_here`).join('\n')}\n\nGet these values from your Firebase project settings.`
      });
    }

    // Check connection failures
    if (connections) {
      if (!connections.firestore.success) {
        addIssue({
          type: 'error',
          title: 'Firestore Connection Failed',
          description: connections.firestore.message,
          solution: 'Check your Firebase project ID and ensure Firestore is enabled in your Firebase console. Verify your network connection and Firebase security rules.'
        });
      }

      if (!connections.storage.success) {
        addIssue({
          type: 'error',
          title: 'Firebase Storage Connection Failed',
          description: connections.storage.message,
          solution: 'Check your storage bucket name and ensure Firebase Storage is enabled in your Firebase console. Verify storage security rules allow read/write access.'
        });
      }

      if (!connections.auth.success) {
        addIssue({
          type: 'warning',
          title: 'Firebase Auth Connection Issue',
          description: connections.auth.message,
          solution: 'Check your Firebase Auth configuration. Ensure Authentication is enabled in your Firebase console if you plan to use it.'
        });
      }
    }

    // Check for common configuration issues
    if (envStatus.VITE_FIREBASE_PROJECT_ID && envStatus.VITE_FIREBASE_STORAGE_BUCKET) {
      // Project ID and storage bucket should match
      const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
      const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
      
      if (storageBucket && !storageBucket.includes(projectId)) {
        addIssue({
          type: 'warning',
          title: 'Potential Storage Bucket Mismatch',
          description: 'Your storage bucket name doesn\'t appear to match your project ID.',
          solution: 'Verify that your VITE_FIREBASE_STORAGE_BUCKET matches the storage bucket in your Firebase project settings.'
        });
      }
    }

    // Check for development vs production considerations
    if (import.meta.env.DEV) {
      addIssue({
        type: 'info',
        title: 'Development Mode',
        description: 'You are running in development mode.',
        solution: 'Ensure your Firebase security rules allow development access. For production, update your rules to be more restrictive.'
      });
    }

    // Add success message if no issues
    if (missingEnvVars.length === 0 && 
        connections?.firestore?.success && 
        connections?.storage?.success) {
      addIssue({
        type: 'info',
        title: 'Configuration Looks Good!',
        description: 'Your Firebase configuration appears to be working correctly.',
        solution: 'Your Firebase setup is ready to use. You can now implement Firebase features in your application.'
      });
    }
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📝';
    }
  };

  const getIssueColor = (type: string) => {
    switch (type) {
      case 'error': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const generateEnvFileTemplate = () => {
    const requiredVars = [
      'VITE_FIREBASE_API_KEY',
      'VITE_FIREBASE_AUTH_DOMAIN',
      'VITE_FIREBASE_PROJECT_ID',
      'VITE_FIREBASE_STORAGE_BUCKET',
      'VITE_FIREBASE_MESSAGING_SENDER_ID',
      'VITE_FIREBASE_APP_ID'
    ];

    return requiredVars.map(varName => `${varName}=your_value_here`).join('\n');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Firebase Configuration Troubleshooter</h1>
        <p className="text-gray-600">
          This tool helps diagnose and fix Firebase configuration issues in your application.
        </p>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={runDiagnostics}
          disabled={isLoading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              <span>Running Diagnostics...</span>
            </>
          ) : (
            <>
              <span>🔍</span>
              <span>Run Diagnostics</span>
            </>
          )}
        </button>

        <button
          onClick={() => setShowSolutions(!showSolutions)}
          className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
        >
          {showSolutions ? 'Hide Solutions' : 'Show Solutions'}
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Analyzing Firebase configuration...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Issues List */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Diagnostic Results ({issues.length} {issues.length === 1 ? 'item' : 'items'})
            </h2>
            
            {issues.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <p className="text-gray-600">No diagnostic results available. Click "Run Diagnostics" to start.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {issues.map((issue, index) => (
                  <div key={index} className={`border rounded-lg p-4 ${getIssueColor(issue.type)}`}>
                    <div className="flex items-start space-x-3">
                      <span className="text-xl flex-shrink-0">{getIssueIcon(issue.type)}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold">{issue.title}</h3>
                        <p className="mt-1">{issue.description}</p>
                        {showSolutions && issue.solution && (
                          <div className="mt-3 p-3 bg-white bg-opacity-50 rounded border border-current border-opacity-20">
                            <h4 className="font-medium mb-1">Solution:</h4>
                            <pre className="text-sm whitespace-pre-wrap font-mono">{issue.solution}</pre>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Environment Variables Status */}
          {Object.keys(envVars).length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Environment Variables Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(envVars).map(([key, isSet]) => (
                  <div key={key} className="flex items-center space-x-3">
                    <span className={`text-lg ${isSet ? 'text-green-600' : 'text-red-600'}`}>
                      {isSet ? '✅' : '❌'}
                    </span>
                    <span className={`font-mono text-sm ${isSet ? 'text-gray-700' : 'text-red-700'}`}>
                      {key}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Connection Test Results */}
          {connectionResults && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Connection Test Results</h3>
              <div className="space-y-3">
                {Object.entries(connectionResults).map(([service, result]: [string, any]) => (
                  <div key={service} className="flex items-start space-x-3">
                    <span className={`text-lg ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                      {result.success ? '✅' : '❌'}
                    </span>
                    <div>
                      <span className="font-medium capitalize">{service}</span>
                      <p className="text-sm text-gray-600">{result.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Setup Guide */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Setup Guide</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">1. Create a .env file in your project root:</h4>
                <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
{generateEnvFileTemplate()}
                </pre>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">2. Get your Firebase configuration:</h4>
                <ol className="list-decimal list-inside text-sm space-y-1 ml-4">
                  <li>Go to your Firebase Console</li>
                  <li>Select your project</li>
                  <li>Click the gear icon → Project settings</li>
                  <li>Scroll down to "Your apps" section</li>
                  <li>Copy the config values to your .env file</li>
                </ol>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">3. Restart your development server:</h4>
                <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm">
npm run dev
# or
yarn dev
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FirebaseConfigTroubleshooter;