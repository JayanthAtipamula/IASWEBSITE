import React, { useCallback, useEffect } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

// Lexical nodes
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { LinkNode, AutoLinkNode } from '@lexical/link';
import { CodeNode } from '@lexical/code';

// Lexical HTML utilities
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';

// Lexical commands and transformers
import { TRANSFORMERS } from '@lexical/markdown';
import {
  FORMAT_TEXT_COMMAND,
  $getSelection,
  $isRangeSelection,
  EditorState,
  $getRoot,
  $insertNodes,
  $createTextNode
} from 'lexical';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND } from '@lexical/list';
import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import { $setBlocksType } from '@lexical/selection';

interface LexicalEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

// Error boundary component for Lexical editor
class LexicalErrorBoundary extends React.Component<
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
    console.error('Lexical Editor Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[200px] p-4 border border-red-300 rounded bg-red-50 text-red-700">
          <p className="font-medium">Editor Error</p>
          <p className="text-sm mt-1">Something went wrong with the editor. Please refresh the page.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

// Plugin to initialize editor with HTML content
function HtmlInitializerPlugin({ html }: { html: string }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!html || !html.trim()) return;

    const trimmedHtml = html.trim();
    
    // Check if content is HTML (starts with < and contains tags) or already Lexical JSON
    const isHtmlContent = trimmedHtml.startsWith('<') || (trimmedHtml.includes('<') && trimmedHtml.includes('>'));
    
    editor.update(() => {
      try {
        const root = $getRoot();
        root.clear();
        
        if (isHtmlContent) {
          // Convert HTML to Lexical nodes
          const parser = new DOMParser();
          const dom = parser.parseFromString(trimmedHtml, 'text/html');
          const nodes = $generateNodesFromDOM(editor, dom);
          
          if (nodes.length > 0) {
            root.append(...nodes);
          } else {
            // If no nodes generated, add as text
            root.append($createTextNode(trimmedHtml));
          }
        } else {
          // Try to parse as JSON first
          try {
            const parsedJson = JSON.parse(trimmedHtml);
            if (parsedJson && typeof parsedJson === 'object' && parsedJson.root) {
              // This looks like valid Lexical JSON, but we need to set it outside update
              return;
            }
          } catch (jsonError) {
            // Not valid JSON, treat as plain text
          }
          
          // Add as plain text
          root.append($createTextNode(trimmedHtml));
        }
      } catch (error) {
        console.error('Error initializing editor content:', error);
        // Fallback: add content as plain text
        const root = $getRoot();
        root.clear();
        root.append($createTextNode(trimmedHtml));
      }
    });

    // Handle JSON case outside of update
    if (!isHtmlContent) {
      try {
        const parsedJson = JSON.parse(trimmedHtml);
        if (parsedJson && typeof parsedJson === 'object' && parsedJson.root) {
          const editorState = editor.parseEditorState(trimmedHtml);
          editor.setEditorState(editorState);
        }
      } catch (error) {
        // Already handled in update above
      }
    }
  }, [editor, html]);

  return null;
}

// Simplified toolbar component
function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  const formatText = (format: 'bold' | 'italic' | 'underline' | 'strikethrough') => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, {
      [format]: true,
    });
  };

  const insertHeading = (headingSize: 'h1' | 'h2' | 'h3') => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      }
    });
  };

  const insertList = (listType: 'bullet' | 'number') => {
    if (listType === 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    }
  };

  const insertQuote = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createQuoteNode());
      }
    });
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
    }
  };

  return (
    <div className="toolbar flex flex-wrap items-center gap-2 p-2 border-b border-gray-300 bg-gray-50">
      {/* Text formatting */}
      <div className="flex items-center gap-1">
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
        <button
          type="button"
          onClick={() => formatText('strikethrough')}
          className="px-2 py-1 text-sm line-through border border-gray-300 rounded hover:bg-gray-100"
          title="Strikethrough"
        >
          S
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300"></div>

      {/* Headings */}
      <div className="flex items-center gap-1">
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
        <button
          type="button"
          onClick={() => insertHeading('h3')}
          className="px-2 py-1 text-sm font-bold border border-gray-300 rounded hover:bg-gray-100"
          title="Heading 3"
        >
          H3
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300"></div>

      {/* Lists */}
      <div className="flex items-center gap-1">
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
      </div>

      <div className="w-px h-6 bg-gray-300"></div>

      {/* Other elements */}
      <div className="flex items-center gap-1">
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
    </div>
  );
}

// Plugin to handle content changes and convert to HTML
function MyOnChangePlugin({ onChange }: { onChange: (content: string) => void }) {
  const [editor] = useLexicalComposerContext();
  
  const handleChange = useCallback((editorState: EditorState) => {
    try {
      editor.update(() => {
        try {
          const htmlString = $generateHtmlFromNodes(editor);
          onChange(htmlString);
        } catch (error) {
          console.error('Error generating HTML from nodes:', error);
          // Fallback: return empty string
          onChange('');
        }
      });
    } catch (error) {
      console.error('Error in onChange handler:', error);
      // Fallback: return empty string
      onChange('');
    }
  }, [editor, onChange]);

  return <OnChangePlugin onChange={handleChange} />;
}

const LexicalEditor: React.FC<LexicalEditorProps> = ({ content, onChange, placeholder = "Start writing..." }) => {
  const initialConfig = {
    namespace: 'BlogEditor',
    theme: {
      text: {
        bold: 'font-bold',
        italic: 'italic',
        underline: 'underline',
        strikethrough: 'line-through',
      },
      heading: {
        h1: 'text-3xl font-bold mb-4',
        h2: 'text-2xl font-bold mb-3',
        h3: 'text-xl font-bold mb-2',
      },
      list: {
        nested: {
          listitem: 'list-none',
        },
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
      CodeNode,
    ],
    onError: (error: Error) => {
      console.error('Lexical error:', error);
    },
    // Don't set initial editorState here, we'll handle it in the plugin
  };

  return (
    <div className="lexical-editor border border-gray-300 rounded-lg overflow-hidden">
      <LexicalComposer initialConfig={initialConfig}>
        <HtmlInitializerPlugin html={content} />
        <ToolbarPlugin />
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="min-h-[200px] p-4 outline-none text-sm leading-relaxed resize-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                style={{ caretColor: '#1f2937' }}
              />
            }
            placeholder={
              <div className="absolute top-4 left-4 text-gray-400 pointer-events-none select-none">
                {placeholder}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <LinkPlugin />
          <ListPlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <MyOnChangePlugin onChange={onChange} />
        </div>
      </LexicalComposer>
    </div>
  );
};

export default LexicalEditor;