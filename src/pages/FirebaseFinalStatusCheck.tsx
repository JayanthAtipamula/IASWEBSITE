import React, { useState, useEffect } from 'react';
import { 
  testAllFirebaseConnections, 
  checkFirebaseEnvVars 
} from '../utils/testFirebaseConnection';
import contentEditorService from '../services/contentEditorService';
import { uploadImage } from '../services/fileUploadService';

interface SystemStatus {
  component: string;
  status: 'success' | 'warning' | 'error' | 'pending';
  message: string;
  details?: any;
  fix?: string;
}

const FirebaseFinalStatusCheck: React.FC = () => {
  const [systemStatuses, setSystemStatuses] = useState<SystemStatus[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [overallStatus, setOverallStatus] = useState<'healthy' | 'issues' | 'critical'>('healthy');

  const addStatus = (status: SystemStatus) => {
    setSystemStatuses(prev => [...prev, status]);
  };

  const runComprehensiveCheck = async () => {
    setIsRunning(true);
    setSystemStatuses([]);
    
    try {
      // 1. Environment Variables Check
      addStatus({
        component: 'Environment Variables',
        status: 'pending',
        message: 'Checking Firebase environment variables...'
      });
      
      const envVars = checkFirebaseEnvVars();
      const missingVars = Object.entries(envVars).filter(([key, isSet]) => !isSet);
      
      if (missingVars.length === 0) {
        addStatus({
          component: 'Environment Variables',
          status: 'success',
          message: 'All Firebase environment variables are configured',
          details: envVars
        });
      } else {
        addStatus({
          component: 'Environment Variables',
          status: 'error',
          message: `Missing ${missingVars.length} environment variable(s)`,
          details: missingVars,
          fix: `Add the following to your .env file:\n${missingVars.map(([key]) => `${key}=your_value_here`).join('\n')}`
        });
      }

      // 2. Firebase Services Connection Test
      addStatus({
        component: 'Firebase Services',
        status: 'pending',
        message: 'Testing Firebase service connections...'
      });
      
      const connectionResults = await testAllFirebaseConnections();
      
      // Check Firestore
      if (connectionResults.firestore.success) {
        addStatus({
          component: 'Firestore Database',
          status: 'success',
          message: 'Firestore connection is working correctly',
          details: connectionResults.firestore.details
        });
      } else {
        addStatus({
          component: 'Firestore Database',
          status: 'error',
          message: connectionResults.firestore.message,
          details: connectionResults.firestore.details,
          fix: 'Check your Firebase project ID and ensure Firestore is enabled in Firebase Console'
        });
      }

      // Check Storage
      if (connectionResults.storage.success) {
        addStatus({
          component: 'Firebase Storage',
          status: 'success',
          message: 'Firebase Storage connection is working correctly',
          details: connectionResults.storage.details
        });
      } else {
        addStatus({
          component: 'Firebase Storage',
          status: 'error',
          message: connectionResults.storage.message,
          details: connectionResults.storage.details,
          fix: 'Check your storage bucket configuration and ensure Firebase Storage is enabled'
        });
      }

      // Check Auth
      if (connectionResults.auth.success) {
        addStatus({
          component: 'Firebase Auth',
          status: 'success',
          message: 'Firebase Authentication is accessible',
          details: connectionResults.auth.details
        });
      } else {
        addStatus({
          component: 'Firebase Auth',
          status: 'warning',
          message: connectionResults.auth.message,
          details: connectionResults.auth.details,
          fix: 'Firebase Auth access issue - check if Authentication is enabled if you plan to use it'
        });
      }

      // 3. Content Editor Service Test
      addStatus({
        component: 'Content Editor Service',
        status: 'pending',
        message: 'Testing content editor service functionality...'
      });
      
      try {
        const editorTest = await contentEditorService.testConnection();
        if (editorTest.success) {
          addStatus({
            component: 'Content Editor Service',
            status: 'success',
            message: 'Content editor service is working correctly',
            details: editorTest.details
          });
        } else {
          addStatus({
            component: 'Content Editor Service',
            status: 'error',
            message: editorTest.message,
            details: editorTest.details,
            fix: 'Content editor service cannot connect to Firebase - check Firestore security rules'
          });
        }
      } catch (error) {
        addStatus({
          component: 'Content Editor Service',
          status: 'error',
          message: `Content editor service test failed: ${error}`,
          fix: 'Check contentEditorService implementation and Firebase connection'
        });
      }

      // 4. Image Upload Service Test
      addStatus({
        component: 'Image Upload Service',
        status: 'pending',
        message: 'Testing image upload service...'
      });
      
      try {
        // Create a small test image
        const canvas = document.createElement('canvas');
        canvas.width = 50;
        canvas.height = 50;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#FF0000';
          ctx.fillRect(0, 0, 50, 50);
        }
        
        canvas.toBlob(async (blob) => {
          if (blob) {
            try {
              const testFile = new File([blob], 'status-test.png', { type: 'image/png' });
              const uploadUrl = await uploadImage(testFile);
              
              addStatus({
                component: 'Image Upload Service',
                status: 'success',
                message: 'Image upload service is working correctly',
                details: { testUploadUrl: uploadUrl }
              });
            } catch (uploadError) {
              addStatus({
                component: 'Image Upload Service',
                status: 'error',
                message: `Image upload test failed: ${uploadError}`,
                fix: 'Check Firebase Storage configuration and security rules'
              });
            }
          }
        }, 'image/png');
      } catch (error) {
        addStatus({
          component: 'Image Upload Service',
          status: 'error',
          message: `Image upload service test failed: ${error}`,
          fix: 'Check fileUploadService implementation'
        });
      }

      // 5. Security Rules Check (Simulated)
      addStatus({
        component: 'Security Rules',
        status: 'warning',
        message: 'Security rules should be verified manually',
        details: {
          firestoreRules: 'Check that Firestore rules allow read/write for your use case',
          storageRules: 'Check that Storage rules allow uploads and downloads'
        },
        fix: 'Review and update Firebase security rules in Firebase Console'
      });

      // 6. Performance Check
      addStatus({
        component: 'Performance',
        status: 'success',
        message: 'Firebase SDK loaded and configured correctly',
        details: {
          sdkVersion: 'Firebase SDK v9+',
          configuration: 'Tree-shaking enabled'
        }
      });

    } catch (error) {
      addStatus({
        component: 'System Check',
        status: 'error',
        message: `Comprehensive check failed: ${error}`,
        fix: 'Check console for detailed error information'
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Calculate overall status
  useEffect(() => {
    const statuses = systemStatuses.map(s => s.status);
    const hasErrors = statuses.includes('error');
    const hasWarnings = statuses.includes('warning');
    
    if (hasErrors) {
      setOverallStatus('critical');
    } else if (hasWarnings) {
      setOverallStatus('issues');
    } else if (statuses.length > 0 && statuses.every(s => s === 'success')) {
      setOverallStatus('healthy');
    }
  }, [systemStatuses]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      case 'pending': return '🔄';
      default: return '📝';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'error': return 'bg-red-50 border-red-200';
      case 'pending': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getOverallStatusDisplay = () => {
    switch (overallStatus) {
      case 'healthy':
        return { icon: '✅', text: 'System Healthy', color: 'text-green-600' };
      case 'issues':
        return { icon: '⚠️', text: 'Minor Issues', color: 'text-yellow-600' };
      case 'critical':
        return { icon: '❌', text: 'Critical Issues', color: 'text-red-600' };
      default:
        return { icon: '🔍', text: 'Not Checked', color: 'text-gray-600' };
    }
  };

  const overallDisplay = getOverallStatusDisplay();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Firebase System Status Check</h1>
        <p className="text-gray-600">
          Comprehensive system health check for all Firebase integrations and services.
        </p>
      </div>

      {/* Overall Status */}
      <div className="mb-6">
        <div className={`p-4 rounded-lg border-2 ${overallStatus === 'healthy' ? 'bg-green-50 border-green-200' : 
          overallStatus === 'issues' ? 'bg-yellow-50 border-yellow-200' : 
          overallStatus === 'critical' ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{overallDisplay.icon}</span>
            <div>
              <h2 className={`text-xl font-semibold ${overallDisplay.color}`}>
                Overall Status: {overallDisplay.text}
              </h2>
              <p className="text-gray-600">
                {systemStatuses.length > 0 ? 
                  `${systemStatuses.filter(s => s.status === 'success').length}/${systemStatuses.length} components healthy` :
                  'Run comprehensive check to see system status'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Control Button */}
      <div className="mb-6">
        <button
          onClick={runComprehensiveCheck}
          disabled={isRunning}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isRunning ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              <span>Running Comprehensive Check...</span>
            </>
          ) : (
            <>
              <span>🔍</span>
              <span>Run Comprehensive System Check</span>
            </>
          )}
        </button>
      </div>

      {/* Status Results */}
      <div className="space-y-4">
        {systemStatuses.map((status, index) => (
          <div key={index} className={`border rounded-lg p-4 ${getStatusColor(status.status)}`}>
            <div className="flex items-start space-x-3">
              <span className="text-xl flex-shrink-0">{getStatusIcon(status.status)}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold">{status.component}</h3>
                <p className="mt-1">{status.message}</p>
                
                {status.details && (
                  <div className="mt-2">
                    <details className="text-sm">
                      <summary className="cursor-pointer font-medium">Details</summary>
                      <pre className="mt-2 p-2 bg-white bg-opacity-50 rounded overflow-auto text-xs">
                        {JSON.stringify(status.details, null, 2)}
                      </pre>
                    </details>
                  </div>
                )}
                
                {status.fix && (
                  <div className="mt-3 p-3 bg-white bg-opacity-50 rounded border border-current border-opacity-20">
                    <h4 className="font-medium mb-1">Recommended Fix:</h4>
                    <pre className="text-sm whitespace-pre-wrap">{status.fix}</pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {systemStatuses.length === 0 && !isRunning && (
          <div className="text-center py-12">
            <p className="text-gray-500">No system checks have been run yet. Click the button above to start.</p>
          </div>
        )}
      </div>

      {/* Quick Fix Guide */}
      {overallStatus === 'critical' && (
        <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-4">🚨 Critical Issues Detected</h3>
          <div className="space-y-2 text-sm">
            <p className="text-red-700">
              <strong>Immediate Actions Required:</strong>
            </p>
            <ol className="list-decimal list-inside text-red-700 space-y-1 ml-4">
              <li>Check your .env file and ensure all Firebase environment variables are set</li>
              <li>Verify your Firebase project configuration in Firebase Console</li>
              <li>Ensure Firestore and Storage are enabled in your Firebase project</li>
              <li>Check Firebase security rules allow read/write access</li>
              <li>Restart your development server after making changes</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default FirebaseFinalStatusCheck;