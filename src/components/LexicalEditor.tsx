import React, { useCallback, useEffect, useState } from 'react';
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
  FORMAT_ELEMENT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  $getSelection,
  $isRangeSelection,
  EditorState,
  $getRoot,
  $createTextNode,
  CAN_UNDO_COMMAND,
  CAN_REDO_COMMAND
} from 'lexical';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND } from '@lexical/list';
import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import { $setBlocksType, $getSelectionStyleValueForProperty, $patchStyleText } from '@lexical/selection';

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
          } catch {
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
      } catch {
        // Already handled in update above
      }
    }
  }, [editor, html]);

  return null;
}

// Enhanced toolbar component with all features
function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [fontSize, setFontSize] = useState('15px');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontColor, setFontColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');

  useEffect(() => {
    const updateToolbar = () => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        setIsBold(selection.hasFormat('bold'));
        setIsItalic(selection.hasFormat('italic'));
        setIsUnderline(selection.hasFormat('underline'));
        setIsCode(selection.hasFormat('code'));
        
        // Get font size
        const fontSizeValue = $getSelectionStyleValueForProperty(selection, 'font-size', '15px');
        setFontSize(fontSizeValue);
        
        // Get font family
        const fontFamilyValue = $getSelectionStyleValueForProperty(selection, 'font-family', 'Arial');
        setFontFamily(fontFamilyValue);
        
        // Get font color
        const colorValue = $getSelectionStyleValueForProperty(selection, 'color', '#000000');
        setFontColor(colorValue);
        
        // Get background color
        const bgColorValue = $getSelectionStyleValueForProperty(selection, 'background-color', '#ffffff');
        setBgColor(bgColorValue);
      }
    };

    const unregisterMergeListener = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });

    const unregisterCommand = editor.registerCommand(
      CAN_UNDO_COMMAND,
      (canUndo: boolean) => {
        setCanUndo(canUndo);
        return false;
      },
      1
    );

    const unregisterCommand2 = editor.registerCommand(
      CAN_REDO_COMMAND,
      (canRedo: boolean) => {
        setCanRedo(canRedo);
        return false;
      },
      1
    );

    return () => {
      unregisterMergeListener();
      unregisterCommand();
      unregisterCommand2();
    };
  }, [editor]);

  const formatText = (format: 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code') => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const handleUndo = () => {
    editor.dispatchCommand(UNDO_COMMAND, undefined);
  };

  const handleRedo = () => {
    editor.dispatchCommand(REDO_COMMAND, undefined);
  };

  const handleFontSizeChange = (newSize: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, {
          'font-size': newSize,
        });
      }
    });
    setFontSize(newSize);
  };

  const handleFontFamilyChange = (newFamily: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, {
          'font-family': newFamily,
        });
      }
    });
    setFontFamily(newFamily);
  };

  const handleColorChange = (color: string, property: 'color' | 'background-color') => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, {
          [property]: color,
        });
      }
    });
    if (property === 'color') {
      setFontColor(color);
    } else {
      setBgColor(color);
    }
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

  const handleAlignment = (alignment: 'left' | 'center' | 'right' | 'justify') => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment);
  };

  return (
    <div className="toolbar flex flex-wrap items-center gap-2 p-2 border-b border-gray-200 bg-white shadow-sm">
      {/* Undo/Redo */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={handleUndo}
          disabled={!canUndo}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          title="Undo"
        >
          ↶
        </button>
        <button
          type="button"
          onClick={handleRedo}
          disabled={!canRedo}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          title="Redo"
        >
          ↷
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300"></div>

      {/* Format Dropdown */}
      <div className="relative">
        <select
          className="px-3 py-1 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => {
            const value = e.target.value;
            if (value === 'paragraph') {
              // Convert to paragraph
            } else if (value.startsWith('h')) {
              insertHeading(value as 'h1' | 'h2' | 'h3');
            }
          }}
        >
          <option value="paragraph">Normal</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>
      </div>

      {/* Font Family */}
      <div className="relative">
        <select
          value={fontFamily}
          onChange={(e) => handleFontFamilyChange(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Arial">Arial</option>
          <option value="Georgia">Georgia</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Helvetica">Helvetica</option>
          <option value="Courier New">Courier New</option>
        </select>
      </div>

      {/* Font Size */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => {
            const currentSize = parseInt(fontSize);
            if (currentSize > 8) {
              handleFontSizeChange(`${currentSize - 1}px`);
            }
          }}
          className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
          title="Decrease Font Size"
        >
          -
        </button>
        <input
          type="text"
          value={fontSize.replace('px', '')}
          onChange={(e) => handleFontSizeChange(`${e.target.value}px`)}
          className="w-12 px-1 py-1 text-sm text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={() => {
            const currentSize = parseInt(fontSize);
            if (currentSize < 72) {
              handleFontSizeChange(`${currentSize + 1}px`);
            }
          }}
          className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
          title="Increase Font Size"
        >
          +
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300"></div>

      {/* Text formatting */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => formatText('bold')}
          className={`px-3 py-1 text-sm font-bold border rounded hover:bg-gray-100 ${
            isBold ? 'bg-blue-100 border-blue-300' : 'border-gray-300'
          }`}
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => formatText('italic')}
          className={`px-3 py-1 text-sm italic border rounded hover:bg-gray-100 ${
            isItalic ? 'bg-blue-100 border-blue-300' : 'border-gray-300'
          }`}
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => formatText('underline')}
          className={`px-3 py-1 text-sm underline border rounded hover:bg-gray-100 ${
            isUnderline ? 'bg-blue-100 border-blue-300' : 'border-gray-300'
          }`}
          title="Underline"
        >
          U
        </button>
        <button
          type="button"
          onClick={() => formatText('code')}
          className={`px-3 py-1 text-sm font-mono border rounded hover:bg-gray-100 ${
            isCode ? 'bg-blue-100 border-blue-300' : 'border-gray-300'
          }`}
          title="Code"
        >
          &lt;/&gt;
        </button>
      </div>

      {/* Link */}
      <button
        type="button"
        onClick={insertLink}
        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
        title="Link"
      >
        🔗
      </button>

      {/* Colors */}
      <div className="flex items-center gap-1">
        <div className="relative">
          <input
            type="color"
            value={fontColor}
            onChange={(e) => handleColorChange(e.target.value, 'color')}
            className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
            title="Text Color"
          />
          <span className="absolute -bottom-1 left-1 text-xs font-bold">A</span>
        </div>
        <div className="relative">
          <input
            type="color"
            value={bgColor}
            onChange={(e) => handleColorChange(e.target.value, 'background-color')}
            className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
            title="Background Color"
          />
        </div>
      </div>

      {/* Insert Menu */}
      <div className="relative">
        <select
          className="px-3 py-1 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => {
            const value = e.target.value;
            if (value === 'bullet-list') {
              insertList('bullet');
            } else if (value === 'number-list') {
              insertList('number');
            } else if (value === 'quote') {
              insertQuote();
            }
            e.target.value = 'insert';
          }}
          defaultValue="insert"
        >
          <option value="insert">Insert</option>
          <option value="bullet-list">Bullet List</option>
          <option value="number-list">Numbered List</option>
          <option value="quote">Quote</option>
        </select>
      </div>

      {/* Alignment */}
      <div className="relative">
        <select
          className="px-3 py-1 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => {
            const value = e.target.value as 'left' | 'center' | 'right' | 'justify';
            handleAlignment(value);
          }}
          defaultValue="left"
        >
          <option value="left">Left Align</option>
          <option value="center">Center</option>
          <option value="right">Right Align</option>
          <option value="justify">Justify</option>
        </select>
      </div>
    </div>
  );
}

// Plugin to handle content changes and convert to HTML
function MyOnChangePlugin({ onChange }: { onChange: (content: string) => void }) {
  const [editor] = useLexicalComposerContext();
  
  const handleChange = useCallback((_editorState: EditorState) => {
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
        code: 'bg-gray-100 px-1 py-0.5 rounded text-sm font-mono',
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
      code: 'bg-gray-100 border border-gray-200 rounded p-4 my-2 font-mono text-sm overflow-x-auto',
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