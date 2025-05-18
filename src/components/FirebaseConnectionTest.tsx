import React, { useState, useEffect } from 'react';
import { 
  testAllFirebaseConnections, 
  checkFirebaseEnvVars 
} from '../utils/testFirebaseConnection';

const FirebaseConnectionTest: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [envVarsStatus, setEnvVarsStatus] = useState<{[key: string]: boolean}>({});
  const [connectionResults, setConnectionResults] = useState<{
    firestore: { success: boolean; message: string; details?: any };
    storage: { success: boolean; message: string; details?: any };
    auth: { success: boolean; message: string; details?: any };
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const runTests = async () => {
      try {
        setLoading(true);
        
        // Check environment variables
        const envVars = checkFirebaseEnvVars();
        setEnvVarsStatus(envVars);
        
        // Test connections
        const results = await testAllFirebaseConnections();
        setConnectionResults(results);
      } catch (err) {
        console.error('Error running Firebase connection tests:', err);
        setError('Failed to run Firebase connection tests. See console for details.');
      } finally {
        setLoading(false);
      }
    };

    runTests();
  }, []);

  const renderEnvVarsStatus = () => {
    return (
      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Environment Variables Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {Object.entries(envVarsStatus).map(([key, isSet]) => (
            <div key={key} className="flex items-center">
              <span className={`inline-block w-6 h-6 rounded-full mr-2 flex items-center justify-center ${isSet ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {isSet ? '✓' : '✗'}
              </span>
              <span className="font-mono text-sm">{key}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderConnectionResults = () => {
    if (!connectionResults) return null;
    
    return (
      <div className="space-y-4">
        {Object.entries(connectionResults).map(([service, result]) => (
          <div 
            key={service} 
            className={`p-4 rounded-lg ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}
          >
            <h3 className="text-lg font-medium mb-1 flex items-center">
              <span className={`inline-block w-6 h-6 rounded-full mr-2 flex items-center justify-center ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {result.success ? '✓' : '✗'}
              </span>
              {service.charAt(0).toUpperCase() + service.slice(1)}
            </h3>
            <p className={result.success ? 'text-green-800' : 'text-red-800'}>
              {result.message}
            </p>
            {result.details && (
              <div className="mt-2">
                <details className="text-sm">
                  <summary className="cursor-pointer font-medium">Details</summary>
                  <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto text-xs">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Firebase Connection Test</h2>
      
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-3">Testing Firebase connections...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
          {error}
        </div>
      ) : (
        <>
          {renderEnvVarsStatus()}
          {renderConnectionResults()}
          
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-medium mb-2">What does this mean?</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Environment Variables:</strong> Checks if the Firebase config variables are defined in your .env file.
              </li>
              <li>
                <strong>Firestore:</strong> Tests connection to Firestore database.
              </li>
              <li>
                <strong>Storage:</strong> Tests connection to Firebase Storage.
              </li>
              <li>
                <strong>Auth:</strong> Tests connection to Firebase Authentication.
              </li>
            </ul>
            <p className="mt-3 text-sm">
              If any tests fail, check your .env file and make sure all Firebase configuration variables are correctly set.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default FirebaseConnectionTest;
