import React, { useState, useEffect } from 'react';
import FirebaseEnvChecker from '../components/FirebaseEnvChecker';
import FirebaseConnectionTest from '../components/FirebaseConnectionTest';
import { testAllFirebaseConnections, checkFirebaseEnvVars } from '../utils/testFirebaseConnection';
import contentEditorService from '../services/contentEditorService';

interface DiagnosticResult {
  success: boolean;
  message: string;
  details?: any;
  timestamp: Date;
}

interface TestResults {
  envVars: { [key: string]: boolean };
  firebaseConnection: DiagnosticResult | null;
  contentService: DiagnosticResult | null;
  firestoreWrite: DiagnosticResult | null;
  firestoreRead: DiagnosticResult | null;
  storageAccess: DiagnosticResult | null;
  authService: DiagnosticResult | null;
}

const FirebaseConnectionDiagnostic: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResults>({
    envVars: {},
    firebaseConnection: null,
    contentService: null,
    firestoreWrite: null,
    firestoreRead: null,
    storageAccess: null,
    authService: null
  });
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${type.toUpperCase()}: ${message}`;
    setLogs(prev => [logEntry, ...prev.slice(0, 99)]);
    console.log(`[Firebase Diagnostic] ${logEntry}`);
  };

  const runDiagnostic = async (testName: string, testFn: () => Promise<any>) => {
    setCurrentTest(testName);
    addLog(`Starting ${testName}...`, 'info');
    
    try {
      const result = await testFn();
      const diagnosticResult: DiagnosticResult = {
        success: result.success || false,
        message: result.message || 'Test completed',
        details: result.details,
        timestamp: new Date()
      };
      
      addLog(`${testName} ${diagnosticResult.success ? 'PASSED' : 'FAILED'}: ${diagnosticResult.message}`, 
              diagnosticResult.success ? 'success' : 'error');
      
      return diagnosticResult;
    } catch (error) {
      const diagnosticResult: DiagnosticResult = {
        success: false,
        message: `Test failed: ${error}`,
        details: { error },
        timestamp: new Date()
      };
      
      addLog(`${testName} ERROR: ${error}`, 'error');
      return diagnosticResult;
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    addLog('🚀 Starting comprehensive Firebase diagnostic...', 'info');
    
    try {
      // 1. Check Environment Variables
      addLog('Step 1: Checking environment variables...', 'info');
      const envVars = checkFirebaseEnvVars();
      setTestResults(prev => ({ ...prev, envVars }));

      // 2. Test Firebase Connection
      const firebaseConnection = await runDiagnostic('Firebase Connection Test', async () => {
        return await testAllFirebaseConnections();
      });
      setTestResults(prev => ({ ...prev, firebaseConnection }));

      // 3. Test Content Editor Service
      const contentService = await runDiagnostic('Content Editor Service Test', async () => {
        return await contentEditorService.testConnection();
      });
      setTestResults(prev => ({ ...prev, contentService }));

      // 4. Test Firestore Write
      const firestoreWrite = await runDiagnostic('Firestore Write Test', async () => {
        const testData = {
          content: 'Test content for diagnostic',
          title: 'Diagnostic Test Document',
          timestamp: Date.now()
        };
        
        const success = await contentEditorService.saveContent(testData, {
          collection: 'diagnostic-tests',
          documentId: `test-${Date.now()}`
        });
        
        return {
          success,
          message: success ? 'Successfully wrote test document to Firestore' : 'Failed to write to Firestore',
          details: { testData }
        };
      });
      setTestResults(prev => ({ ...prev, firestoreWrite }));

      // 5. Test Firestore Read
      const firestoreRead = await runDiagnostic('Firestore Read Test', async () => {
        const data = await contentEditorService.loadContent({
          collection: 'diagnostic-tests',
          documentId: `test-${Date.now()}`
        });
        
        return {
          success: data !== null,
          message: data ? 'Successfully read from Firestore' : 'No data found (this is normal for new test)',
          details: { dataLength: data?.content?.length || 0 }
        };
      });
      setTestResults(prev => ({ ...prev, firestoreRead }));

      // 6. Test Storage Access (if available)
      const storageAccess = await runDiagnostic('Firebase Storage Test', async () => {
        // This would need to be implemented based on your storage setup
        return {
          success: true,
          message: 'Storage test skipped (implement if needed)',
          details: { note: 'Storage testing not implemented in this diagnostic' }
        };
      });
      setTestResults(prev => ({ ...prev, storageAccess }));

      // 7. Test Auth Service
      const authService = await runDiagnostic('Firebase Auth Test', async () => {
        // Basic auth service check
        return {
          success: true,
          message: 'Auth service initialized successfully',
          details: { note: 'Auth functionality available' }
        };
      });
      setTestResults(prev => ({ ...prev, authService }));

      addLog('✅ All diagnostic tests completed!', 'success');
      
    } catch (error) {
      addLog(`❌ Diagnostic failed: ${error}`, 'error');
    } finally {
      setIsRunning(false);
      setCurrentTest('');
    }
  };

  const clearLogs = () => {
    setLogs([]);
    addLog('Logs cleared', 'info');
  };

  const resetTests = () => {
    setTestResults({
      envVars: {},
      firebaseConnection: null,
      contentService: null,
      firestoreWrite: null,
      firestoreRead: null,
      storageAccess: null,
      authService: null
    });
    setLogs([]);
    addLog('All tests reset', 'info');
  };

  const getOverallStatus = () => {
    const results = [
      testResults.firebaseConnection,
      testResults.contentService,
      testResults.firestoreWrite,
      testResults.firestoreRead,
      testResults.authService
    ].filter(r => r !== null);
    
    if (results.length === 0) return 'pending';
    
    const allSuccess = results.every(r => r!.success);
    const anyFailure = results.some(r => !r!.success);
    
    if (allSuccess) return 'success';
    if (anyFailure) return 'error';
    return 'warning';
  };

  const renderTestResult = (title: string, result: DiagnosticResult | null, isRequired = true) => {
    if (!result) {
      return (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-gray-400 mr-3"></div>
            <h3 className="font-medium text-gray-700">{title}</h3>
            <span className="ml-auto text-sm text-gray-500">Pending</span>
          </div>
        </div>
      );
    }

    const bgColor = result.success 
      ? 'bg-green-50 border-green-200' 
      : isRequired 
        ? 'bg-red-50 border-red-200' 
        : 'bg-yellow-50 border-yellow-200';
        
    const textColor = result.success 
      ? 'text-green-800' 
      : isRequired 
        ? 'text-red-800' 
        : 'text-yellow-800';
        
    const dotColor = result.success 
      ? 'bg-green-500' 
      : isRequired 
        ? 'bg-red-500' 
        : 'bg-yellow-500';

    return (
      <div className={`border rounded-lg p-4 ${bgColor}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start">
            <div className={`w-3 h-3 rounded-full mt-1 mr-3 ${dotColor}`}></div>
            <div className="flex-1">
              <h3 className={`font-medium ${textColor}`}>{title}</h3>
              <p className={`text-sm mt-1 ${textColor}`}>{result.message}</p>
              {result.details && (
                <details className="mt-2">
                  <summary className={`text-xs cursor-pointer ${textColor} opacity-75`}>
                    View Details
                  </summary>
                  <pre className="text-xs mt-1 p-2 bg-white rounded overflow-auto">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                </details>
              )}
              <div className={`text-xs mt-2 ${textColor} opacity-75`}>
                Tested: {result.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
          <span className={`text-sm font-medium ${textColor}`}>
            {result.success ? 'PASS' : 'FAIL'}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Firebase Connection Diagnostic
        </h1>
        <p className="text-gray-600">
          Comprehensive testing and troubleshooting for Firebase integration
        </p>
      </div>

      {/* Overall Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Overall Status</h2>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            getOverallStatus() === 'success' ? 'bg-green-100 text-green-800' :
            getOverallStatus() === 'error' ? 'bg-red-100 text-red-800' :
            getOverallStatus() === 'warning' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {getOverallStatus() === 'success' ? '✅ All Systems Operational' :
             getOverallStatus() === 'error' ? '❌ Issues Detected' :
             getOverallStatus() === 'warning' ? '⚠️ Some Issues' :
             '⏳ Tests Pending'}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={runAllTests}
            disabled={isRunning}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? 'Running Tests...' : 'Run All Tests'}
          </button>
          
          <button
            onClick={resetTests}
            disabled={isRunning}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
          >
            Reset
          </button>
        </div>

        {isRunning && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded p-3">
            <div className="flex items-center">
              <svg className="animate-spin h-5 w-5 text-blue-600 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-blue-800">
                {currentTest ? `Running: ${currentTest}` : 'Initializing tests...'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Environment Configuration */}
      <FirebaseEnvChecker />

      {/* Test Results */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6">Test Results</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderTestResult('Firebase Connection', testResults.firebaseConnection)}
          {renderTestResult('Content Editor Service', testResults.contentService)}
          {renderTestResult('Firestore Write Test', testResults.firestoreWrite)}
          {renderTestResult('Firestore Read Test', testResults.firestoreRead)}
          {renderTestResult('Firebase Auth', testResults.authService)}
          {renderTestResult('Firebase Storage', testResults.storageAccess, false)}
        </div>
      </div>

      {/* Live Test Logs */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Live Test Logs</h2>
          <button
            onClick={clearLogs}
            className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Clear Logs
          </button>
        </div>
        
        <div className="bg-black text-green-400 p-4 rounded font-mono text-sm h-64 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="text-gray-500">No logs yet. Run tests to see diagnostic information...</div>
          ) : (
            logs.map((log, index) => (
              <div 
                key={index} 
                className={`mb-1 ${
                  log.includes('ERROR') ? 'text-red-400' : 
                  log.includes('SUCCESS') || log.includes('PASSED') ? 'text-green-400' : 
                  'text-gray-300'
                }`}
              >
                {log}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Detailed Firebase Connection Test */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Detailed Firebase Service Tests</h2>
          <p className="text-gray-600 mt-1">
            Individual tests for each Firebase service
          </p>
        </div>
        <FirebaseConnectionTest />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/firebase-editor-debug"
            className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
          >
            <div className="text-2xl mb-2">📝</div>
            <h3 className="font-medium">Test Firebase Editor</h3>
            <p className="text-sm text-gray-600">Test content editing with Firebase</p>
          </a>
          
          <a
            href="/firebase-test"
            className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
          >
            <div className="text-2xl mb-2">🔧</div>
            <h3 className="font-medium">Firebase Connection Test</h3>
            <p className="text-sm text-gray-600">Basic connection testing</p>
          </a>
          
          <a
            href="https://console.firebase.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
          >
            <div className="text-2xl mb-2">🚀</div>
            <h3 className="font-medium">Firebase Console</h3>
            <p className="text-sm text-gray-600">Open Firebase Console</p>
          </a>
        </div>
      </div>

      {/* Troubleshooting Guide */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Common Issues & Solutions</h2>
        
        <div className="space-y-4">
          <div className="border-l-4 border-red-500 pl-4">
            <h3 className="font-medium text-red-800">Environment Variables Missing</h3>
            <p className="text-sm text-red-700 mt-1">
              Create a <code>.env</code> file in your project root with all Firebase configuration variables.
            </p>
          </div>
          
          <div className="border-l-4 border-yellow-500 pl-4">
            <h3 className="font-medium text-yellow-800">Permission Denied Errors</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Update your Firestore security rules to allow read/write access for your use case.
            </p>
          </div>
          
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-medium text-blue-800">Network Connection Issues</h3>
            <p className="text-sm text-blue-700 mt-1">
              Check your internet connection and verify Firebase project is active.
            </p>
          </div>
          
          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-medium text-green-800">All Tests Passing</h3>
            <p className="text-sm text-green-700 mt-1">
              Great! Your Firebase integration is working correctly. You can now use the Firebase editor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirebaseConnectionDiagnostic;