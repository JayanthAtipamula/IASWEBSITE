import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Enter text...",
  className = "",
  rows = 3
}) => {
  // Configure toolbar modules
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link'],
      ['clean']
    ],
  };

  // Configure formats
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent',
    'align',
    'link'
  ];

  // Calculate height based on rows (approximately 24px per row)
  const minHeight = rows * 24;

  return (
    <div className={`${className}`}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
        style={{
          borderRadius: '0.375rem',
        }}
      />
      <style dangerouslySetInnerHTML={{
        __html: `
          .ql-editor {
            min-height: ${minHeight}px !important;
          }
          .ql-container {
            border-bottom-left-radius: 0.375rem !important;
            border-bottom-right-radius: 0.375rem !important;
            border-color: #d1d5db !important;
          }
          .ql-toolbar {
            border-top-left-radius: 0.375rem !important;
            border-top-right-radius: 0.375rem !important;
            border-color: #d1d5db !important;
          }
          .ql-toolbar.ql-snow {
            border: 1px solid #d1d5db !important;
          }
          .ql-container.ql-snow {
            border: 1px solid #d1d5db !important;
          }
        `
      }} />
    </div>
  );
};

export default RichTextEditor; 