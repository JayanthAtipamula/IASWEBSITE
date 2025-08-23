import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

interface FirebaseDocument {
  id: string;
  content: string;
  title: string;
  lastModified: number;
  [key: string]: any;
}

const FirebaseContentViewer: React.FC = () => {
  const [documents, setDocuments] = useState<FirebaseDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<FirebaseDocument | null>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get all documents from blog-drafts collection
      const querySnapshot = await getDocs(collection(db, 'blog-drafts'));
      const docs: FirebaseDocument[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        docs.push({
          id: doc.id,
          content: data.content || '',
          title: data.title || 'Untitled',
          lastModified: data.lastModified || 0,
          ...data
        });
      });
      
      // Sort by last modified date
      docs.sort((a, b) => b.lastModified - a.lastModified);
      
      setDocuments(docs);
      console.log(`Found ${docs.length} documents in blog-drafts collection`);
    } catch (err) {
      console.error('Error loading documents:', err);
      setError(`Error loading documents: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    if (!timestamp) return 'No date';
    return new Date(timestamp).toLocaleString();
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Firebase Content Viewer</h1>
        <p className="text-gray-600">
          View and debug content stored in Firebase blog-drafts collection
        </p>
      </div>

      <div className="mb-4">
        <button
          onClick={loadDocuments}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Refresh Documents'}
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-semibold">Error</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Documents List */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">
              Documents ({documents.length})
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading documents...</p>
              </div>
            ) : documents.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No documents found in blog-drafts collection
              </div>
            ) : (
              documents.map((doc) => (
                <div
                  key={doc.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${
                    selectedDoc?.id === doc.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                  onClick={() => setSelectedDoc(doc)}
                >
                  <h3 className="font-medium text-gray-900">
                    {doc.title || 'Untitled'}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    ID: {doc.id}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDate(doc.lastModified)}
                  </p>
                  <p className="text-sm text-gray-700 mt-2">
                    {truncateText(doc.content)}
                  </p>
                  <div className="text-xs text-gray-500 mt-2">
                    {doc.content.length} characters
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Document Viewer */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">
              {selectedDoc ? 'Document Details' : 'Select a Document'}
            </h2>
          </div>
          
          <div className="p-4">
            {selectedDoc ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Document ID</label>
                  <p className="text-sm text-gray-900 font-mono bg-gray-100 p-2 rounded">
                    {selectedDoc.id}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <p className="text-sm text-gray-900">
                    {selectedDoc.title || 'No title'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Modified</label>
                  <p className="text-sm text-gray-900">
                    {formatDate(selectedDoc.lastModified)}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Content</label>
                  <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded max-h-64 overflow-y-auto">
                    {selectedDoc.content ? (
                      <pre className="whitespace-pre-wrap">{selectedDoc.content}</pre>
                    ) : (
                      <span className="text-gray-500 italic">No content</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Raw Data</label>
                  <details className="text-sm">
                    <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                      Show raw Firebase document data
                    </summary>
                    <pre className="mt-2 bg-gray-100 p-3 rounded text-xs overflow-auto">
                      {JSON.stringify(selectedDoc, null, 2)}
                    </pre>
                  </details>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>Click on a document from the list to view its details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {documents.length > 0 && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-blue-800 font-semibold mb-2">Debug Information</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Found {documents.length} document(s) in Firebase</li>
            <li>• Collection: blog-drafts</li>
            <li>• Latest document: {documents[0]?.title || 'No documents'}</li>
            <li>• Total content characters: {documents.reduce((sum, doc) => sum + doc.content.length, 0)}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default FirebaseContentViewer;