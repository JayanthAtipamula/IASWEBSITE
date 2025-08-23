import React, { useCallback } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

// Lexical nodes
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { LinkNode, AutoLinkNode } from '@lexical/link';

// Lexical HTML utilities
import { $generateHtmlFromNodes } from '@lexical/html';

// Lexical commands
import {
  FORMAT_TEXT_COMMAND,
  $getSelection,
  $isRangeSelection,
  EditorState,
} from 'lexical';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND } from '@lexical/list';
import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import { $setBlocksType } from '@lexical/selection';

interface SimpleLexicalEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

// Error boundary component
class SimpleLexicalErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Simple Lexical Editor Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[200px] p-4 border border-red-300 rounded bg-red-50 text-red-700">
          <p className="font-medium">Editor Error</p>
          <p className="text-sm mt-1">The editor encountered an error. Using fallback mode.</p>
          <textarea 
            className="w-full mt-2 p-2 border rounded"
            rows={8}
            placeholder="Fallback text editor..."
            defaultValue=""
          />
        </div>
      );
    }

    return this.props.children;
  }
}

// Basic toolbar component
function SimpleToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  const formatText = (format: 'bold' | 'italic' | 'underline') => {
    try {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, {
        [format]: true,
      });
    } catch (error) {
      console.error('Format text error:', error);
    }
  };

  const insertHeading = (headingSize: 'h1' | 'h2' | 'h3') => {
    try {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(headingSize));
        }
      });
    } catch (error) {
      console.error('Insert heading error:', error);
    }
  };

  const insertList = (listType: 'bullet' | 'number') => {
    try {
      if (listType === 'bullet') {
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
      } else {
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
      }
    } catch (error) {
      console.error('Insert list error:', error);
    }
  };

  const insertQuote = () => {
    try {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      });
    } catch (error) {
      console.error('Insert quote error:', error);
    }
  };

  const insertLink = () => {
    try {
      const url = prompt('Enter URL:');
      if (url) {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
      }
    } catch (error) {
      console.error('Insert link error:', error);
    }
  };

  return (
    <div className="toolbar flex flex-wrap items-center gap-2 p-2 border-b border-gray-300 bg-gray-50">
      <button
        type="button"
        onClick={() => formatText('bold')}
        className="px-2 py-1 text-sm font-bold border border-gray-300 rounded hover:bg-gray-100"
        title="Bold"
      >
        B
      </button>
      <button
        type="button"
        onClick={() => formatText('italic')}
        className="px-2 py-1 text-sm italic border border-gray-300 rounded hover:bg-gray-100"
        title="Italic"
      >
        I
      </button>
      <button
        type="button"
        onClick={() => formatText('underline')}
        className="px-2 py-1 text-sm underline border border-gray-300 rounded hover:bg-gray-100"
        title="Underline"
      >
        U
      </button>
      
      <div className="w-px h-6 bg-gray-300"></div>

      <button
        type="button"
        onClick={() => insertHeading('h1')}
        className="px-2 py-1 text-sm font-bold border border-gray-300 rounded hover:bg-gray-100"
        title="Heading 1"
      >
        H1
      </button>
      <button
        type="button"
        onClick={() => insertHeading('h2')}
        className="px-2 py-1 text-sm font-bold border border-gray-300 rounded hover:bg-gray-100"
        title="Heading 2"
      >
        H2
      </button>

      <div className="w-px h-6 bg-gray-300"></div>

      <button
        type="button"
        onClick={() => insertList('bullet')}
        className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
        title="Bullet List"
      >
        • List
      </button>
      <button
        type="button"
        onClick={() => insertList('number')}
        className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
        title="Numbered List"
      >
        1. List
      </button>

      <div className="w-px h-6 bg-gray-300"></div>

      <button
        type="button"
        onClick={insertQuote}
        className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
        title="Quote"
      >
        Quote
      </button>
      <button
        type="button"
        onClick={insertLink}
        className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
        title="Link"
      >
        Link
      </button>
    </div>
  );
}

// Simple onChange plugin without complex initialization
function SimpleOnChangePlugin({ onChange }: { onChange: (content: string) => void }) {
  const [editor] = useLexicalComposerContext();
  
  const handleChange = useCallback((editorState: EditorState) => {
    try {
      editor.read(() => {
        try {
          const htmlString = $generateHtmlFromNodes(editor, null);
          onChange(htmlString || '');
        } catch (error) {
          console.error('Error generating HTML:', error);
          onChange('');
        }
      });
    } catch (error) {
      console.error('Error in onChange:', error);
      onChange('');
    }
  }, [editor, onChange]);

  return <OnChangePlugin onChange={handleChange} />;
}

const SimpleLexicalEditor: React.FC<SimpleLexicalEditorProps> = ({ content, onChange, placeholder = "Start writing..." }) => {
  // Very basic initial config without problematic initialization
  const initialConfig = {
    namespace: 'SimpleBlogEditor',
    theme: {
      text: {
        bold: 'font-bold',
        italic: 'italic',
        underline: 'underline',
      },
      heading: {
        h1: 'text-3xl font-bold mb-4',
        h2: 'text-2xl font-bold mb-3',
      },
      list: {
        ol: 'list-decimal list-inside',
        ul: 'list-disc list-inside',
        listitem: 'mb-1',
      },
      quote: 'border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4',
      link: 'text-blue-600 underline hover:text-blue-800',
    },
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      LinkNode,
      AutoLinkNode,
    ],
    onError: (error: Error) => {
      console.error('Simple Lexical error:', error);
    },
    // No initial editor state to avoid parsing issues
  };

  return (
    <div className="lexical-editor border border-gray-300 rounded-lg overflow-hidden">
      <SimpleLexicalErrorBoundary>
        <LexicalComposer initialConfig={initialConfig}>
          <SimpleToolbarPlugin />
          <div className="relative">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className="min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] max-h-[1200px] p-4 sm:p-6 outline-none text-sm sm:text-base leading-relaxed resize-y focus:ring-2 focus:ring-blue-500 focus:ring-inset overflow-y-auto w-full"
                  style={{ 
                    caretColor: '#1f2937',
                    resize: 'vertical',
                    minHeight: '400px'
                  }}
                />
              }
              placeholder={
                <div className="absolute top-4 left-4 text-gray-400 pointer-events-none select-none">
                  {placeholder}
                </div>
              }
              ErrorBoundary={SimpleLexicalErrorBoundary}
            />
            <HistoryPlugin />
            <AutoFocusPlugin />
            <LinkPlugin />
            <ListPlugin />
            <SimpleOnChangePlugin onChange={onChange} />
          </div>
        </LexicalComposer>
      </SimpleLexicalErrorBoundary>
    </div>
  );
};

export default SimpleLexicalEditor;