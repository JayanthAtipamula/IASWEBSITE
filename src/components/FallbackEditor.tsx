import React from 'react';

interface FallbackEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const FallbackEditor: React.FC<FallbackEditorProps> = ({ content, onChange, placeholder = "Start writing..." }) => {
  return (
    <div className="fallback-editor border border-gray-300 rounded-lg overflow-hidden">
      <div className="toolbar flex items-center gap-2 p-2 border-b border-gray-300 bg-gray-50">
        <span className="text-sm text-gray-600">Basic Text Editor (Fallback Mode)</span>
        <div className="flex-1"></div>
        <span className="text-xs text-gray-500">Rich text editor unavailable</span>
      </div>
      <textarea
        className="w-full min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] max-h-[1200px] p-4 sm:p-6 outline-none text-sm sm:text-base leading-relaxed resize-y focus:ring-2 focus:ring-blue-500 focus:ring-inset overflow-y-auto"
        placeholder={placeholder}
        value={content}
        onChange={(e) => onChange(e.target.value)}
        style={{ 
          caretColor: '#1f2937',
          resize: 'vertical',
          minHeight: '400px'
        }}
        rows={20}
      />
    </div>
  );
};

export default FallbackEditor;