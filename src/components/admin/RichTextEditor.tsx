import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Placeholder from '@tiptap/extension-placeholder';
import { uploadImage } from '../../services/fileUploadService';

// Define the Level type for headings
type Level = 1 | 2 | 3 | 4 | 5 | 6;

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  content, 
  onChange,
  placeholder = 'Write something...'
}) => {
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [showTableOptions, setShowTableOptions] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsImageUploading(true);
      const file = files[0];
      const imageUrl = await uploadImage(file);
      
      // Insert image at current cursor position
      editor.chain().focus().setImage({ src: imageUrl, alt: file.name }).run();
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsImageUploading(false);
      // Reset the input
      e.target.value = '';
    }
  };

  const addLink = () => {
    if (linkUrl) {
      // If text is selected, we update the link on the selection
      if (editor.state.selection.empty && linkText) {
        editor
          .chain()
          .focus()
          .insertContent(`<a href="${linkUrl}" target="_blank">${linkText}</a>`)
          .run();
      } else {
        editor
          .chain()
          .focus()
          .extendMarkRange('link')
          .setLink({ href: linkUrl, target: '_blank' })
          .run();
      }
    }

    // Reset and close modal
    setLinkUrl('');
    setLinkText('');
    setIsLinkModalOpen(false);
  };

  const insertTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
    
    setShowTableOptions(true);
  };

  // Helper function to determine if a button should be active
  const isActive = (type: string, options = {}) => {
    return editor.isActive(type, options) ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100';
  };

  return (
    <div className="rich-text-editor border border-gray-300 rounded-md overflow-hidden">
      {/* Main Toolbar */}
      <div className="bg-white border-b border-gray-200 p-2">
        <div className="flex flex-wrap items-center gap-1">
          {/* Text Formatting Group */}
          <div className="flex items-center mr-2 border-r pr-2 border-gray-200">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 rounded ${isActive('bold')}`}
              title="Bold (Ctrl+B)"
            >
              <span className="font-bold">B</span>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded ${isActive('italic')}`}
              title="Italic (Ctrl+I)"
            >
              <span className="italic">I</span>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`p-2 rounded ${isActive('strike')}`}
              title="Strikethrough"
            >
              <span className="line-through">S</span>
            </button>
          </div>

          {/* Paragraph Styles Group */}
          <div className="flex items-center mr-2 border-r pr-2 border-gray-200">
            <select
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value === 0) {
                  editor.chain().focus().setParagraph().run();
                } else {
                  // Cast to Level type only for valid heading levels
                  const level = value as Level;
                  editor.chain().focus().toggleHeading({ level }).run();
                }
              }}
              className="p-2 rounded border border-gray-200 bg-white"
              value={
                editor.isActive('heading', { level: 1 })
                  ? '1'
                  : editor.isActive('heading', { level: 2 })
                  ? '2'
                  : editor.isActive('heading', { level: 3 })
                  ? '3'
                  : '0'
              }
            >
              <option value="0">Paragraph</option>
              <option value="1">Heading 1</option>
              <option value="2">Heading 2</option>
              <option value="3">Heading 3</option>
            </select>
          </div>

          {/* Lists Group */}
          <div className="flex items-center mr-2 border-r pr-2 border-gray-200">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded ${isActive('bulletList')}`}
              title="Bullet List"
            >
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
              </span>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded ${isActive('orderedList')}`}
              title="Numbered List"
            >
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="10" y1="6" x2="21" y2="6"></line>
                  <line x1="10" y1="12" x2="21" y2="12"></line>
                  <line x1="10" y1="18" x2="21" y2="18"></line>
                  <path d="M4 6h1v4"></path>
                  <path d="M4 10h2"></path>
                  <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
                </svg>
              </span>
            </button>
          </div>

          {/* Insert Group */}
          <div className="flex items-center">
            {/* Link */}
            <button
              type="button"
              onClick={() => setIsLinkModalOpen(true)}
              className={`p-2 rounded ${isActive('link')}`}
              title="Insert Link"
            >
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
              </span>
            </button>

            {/* Image upload */}
            <label className="p-2 rounded hover:bg-gray-100 cursor-pointer" title="Insert Image">
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
              </span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isImageUploading}
              />
            </label>

            {/* Table */}
            <div className="relative">
              <button
                type="button"
                onClick={insertTable}
                className="p-2 rounded hover:bg-gray-100"
                title="Insert Table"
                onMouseEnter={() => editor.isActive('table') && setShowTableOptions(true)}
              >
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="3" y1="9" x2="21" y2="9"></line>
                    <line x1="3" y1="15" x2="21" y2="15"></line>
                    <line x1="9" y1="3" x2="9" y2="21"></line>
                    <line x1="15" y1="3" x2="15" y2="21"></line>
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Table Options - Only shown when a table is active */}
        {editor.isActive('table') && showTableOptions && (
          <div 
            className="flex flex-wrap items-center gap-1 mt-2 pt-2 border-t border-gray-200"
            onMouseLeave={() => setShowTableOptions(false)}
          >
            <div className="text-sm text-gray-500 mr-2">Table:</div>
            <button
              type="button"
              onClick={() => editor.chain().focus().addColumnBefore().run()}
              className="p-1 rounded hover:bg-gray-100 text-sm"
              title="Add Column Before"
            >
              Add Column Before
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              className="p-1 rounded hover:bg-gray-100 text-sm"
              title="Add Column After"
            >
              Add Column After
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().addRowBefore().run()}
              className="p-1 rounded hover:bg-gray-100 text-sm"
              title="Add Row Before"
            >
              Add Row Before
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().addRowAfter().run()}
              className="p-1 rounded hover:bg-gray-100 text-sm"
              title="Add Row After"
            >
              Add Row After
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().deleteColumn().run()}
              className="p-1 rounded hover:bg-gray-100 text-sm"
              title="Delete Column"
            >
              Delete Column
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().deleteRow().run()}
              className="p-1 rounded hover:bg-gray-100 text-sm"
              title="Delete Row"
            >
              Delete Row
            </button>
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().deleteTable().run();
                setShowTableOptions(false);
              }}
              className="p-1 rounded hover:bg-gray-100 text-sm text-red-600"
              title="Delete Table"
            >
              Delete Table
            </button>
          </div>
        )}
      </div>

      {/* Editor Content */}
      <EditorContent 
        editor={editor} 
        className="prose max-w-none p-4 min-h-[300px] focus:outline-none bg-white"
      />

      {/* Loading indicator for image uploads */}
      {isImageUploading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
          <div className="text-center">
            <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-2 text-sm text-gray-600">Uploading image...</p>
          </div>
        </div>
      )}

      {/* Link Modal */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Insert Link</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL
                </label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Text (optional)
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Link text"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsLinkModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={addLink}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Insert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor; 