import React, { useEffect, useState } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
}

const ClientOnlyRichTextEditor: React.FC<RichTextEditorProps> = (props) => {
  const [isClient, setIsClient] = useState(false);
  const [ReactQuill, setReactQuill] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    // Dynamically import ReactQuill only on client side
    const loadQuill = async () => {
      try {
        const ReactQuillModule = await import('react-quill');
        await import('react-quill/dist/quill.snow.css');
        setReactQuill(() => ReactQuillModule.default);
      } catch (error) {
        console.error('Failed to load ReactQuill:', error);
      }
    };
    loadQuill();
  }, []);

  if (!isClient || !ReactQuill) {
    return (
      <div className={`border rounded-lg p-3 min-h-[100px] ${props.className || ''}`}>
        <div className="text-gray-500">Loading editor...</div>
      </div>
    );
  }

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

  return (
    <div className={props.className}>
      <ReactQuill
        theme="snow"
        value={props.value}
        onChange={props.onChange}
        modules={modules}
        formats={formats}
        placeholder={props.placeholder}
        style={{ height: props.rows ? `${props.rows * 20}px` : '100px' }}
      />
    </div>
  );
};

export default ClientOnlyRichTextEditor;