import React, { useEffect, useState } from 'react';

interface ClientOnlyLexicalEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const ClientOnlyLexicalEditor: React.FC<ClientOnlyLexicalEditorProps> = (props) => {
  const [isClient, setIsClient] = useState(false);
  const [LexicalEditor, setLexicalEditor] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    // Dynamically import LexicalEditor only on client side
    const loadLexicalEditor = async () => {
      try {
        const LexicalEditorModule = await import('./LexicalEditor');
        setLexicalEditor(() => LexicalEditorModule.default);
      } catch (error) {
        console.error('Failed to load LexicalEditor:', error);
      }
    };
    loadLexicalEditor();
  }, []);

  if (!isClient || !LexicalEditor) {
    return (
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <div className="p-2 border-b border-gray-300 bg-gray-50">
          <div className="text-sm text-gray-500">Loading editor...</div>
        </div>
        <div className="min-h-[200px] p-4 bg-gray-50">
          <div className="text-gray-400">Editor is loading...</div>
        </div>
      </div>
    );
  }

  return (
    <LexicalEditor
      content={props.content}
      onChange={props.onChange}
      placeholder={props.placeholder}
    />
  );
};

export default ClientOnlyLexicalEditor;