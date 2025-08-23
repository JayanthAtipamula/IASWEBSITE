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
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { HashtagNode } from '@lexical/hashtag';
import { TableNode, TableCellNode, TableRowNode } from '@lexical/table';

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
  $createTextNode,
  $createParagraphNode,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
} from 'lexical';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND } from '@lexical/list';
import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import { $setBlocksType } from '@lexical/selection';
import { INSERT_TABLE_COMMAND } from '@lexical/table';
import { $createCodeNode } from '@lexical/code';

interface AdvancedLexicalEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

// Safe HTML initialization plugin
function SafeHtmlInitializerPlugin({ html }: { html: string }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!html || !html.trim()) {
      console.log('ℹ️ SafeHtmlInitializerPlugin: No content to initialize');
      return;
    }

    console.log('📝 SafeHtmlInitializerPlugin: Initializing with content:', {
      hasHtml: !!html,
      htmlLength: html?.length || 0,
      htmlPreview: html?.substring(0, 100) || '(empty)'
    });

    // Initialize immediately without timeout to avoid reference issues
    try {
      editor.update(() => {
        const root = $getRoot();
        root.clear();

        const trimmedHtml = html.trim();
        const isHtmlContent = trimmedHtml.startsWith('<') && trimmedHtml.includes('>');

        if (isHtmlContent) {
          try {
            console.log('🎯 SafeHtmlInitializerPlugin: Parsing HTML content');
            const parser = new DOMParser();
            const dom = parser.parseFromString(trimmedHtml, 'text/html');
            const nodes = $generateNodesFromDOM(editor, dom);
            
            if (nodes && nodes.length > 0) {
              root.append(...nodes);
              console.log('✅ SafeHtmlInitializerPlugin: HTML content loaded successfully');
            } else {
              // Fallback to paragraph with text
              const paragraph = $createParagraphNode();
              paragraph.append($createTextNode(trimmedHtml));
              root.append(paragraph);
              console.log('⚠️ SafeHtmlInitializerPlugin: Used text fallback for HTML');
            }
          } catch (htmlError) {
            console.warn('HTML parsing failed, using text fallback:', htmlError);
            const paragraph = $createParagraphNode();
            paragraph.append($createTextNode(trimmedHtml));
            root.append(paragraph);
          }
        } else {
          // Handle as plain text
          console.log('📝 SafeHtmlInitializerPlugin: Loading as plain text');
          const paragraph = $createParagraphNode();
          paragraph.append($createTextNode(trimmedHtml));
          root.append(paragraph);
        }
      });
    } catch (error) {
      console.error('❌ SafeHtmlInitializerPlugin initialization error:', error);
    }
  }, [editor, html]);

  return null;
}

// Comprehensive toolbar with all Lexical features
function AdvancedToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  const formatText = (format: 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code' | 'subscript' | 'superscript') => {
    try {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, {
        [format]: true,
      });
    } catch (error) {
      console.error('Format text error:', error);
    }
  };

  const insertHeading = (headingSize: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6') => {
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

  const insertList = (listType: 'bullet' | 'number' | 'check') => {
    try {
      if (listType === 'bullet') {
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
      } else if (listType === 'number') {
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

  const insertCodeBlock = () => {
    try {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createCodeNode());
        }
      });
    } catch (error) {
      console.error('Insert code block error:', error);
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

  const insertTable = () => {
    try {
      editor.dispatchCommand(INSERT_TABLE_COMMAND, { 
        rows: 3, 
        columns: 3,
        includeHeaders: true 
      });
    } catch (error) {
      console.error('Insert table error:', error);
    }
  };

  const handleIndent = () => {
    try {
      editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
    } catch (error) {
      console.error('Indent error:', error);
    }
  };

  const handleOutdent = () => {
    try {
      editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
    } catch (error) {
      console.error('Outdent error:', error);
    }
  };

  return (
    <div className="toolbar flex flex-wrap items-center gap-1 sm:gap-2 p-2 sm:p-3 border-b border-gray-300 bg-gray-50 overflow-x-auto">
      {/* Text formatting */}
      <div className="flex items-center gap-1">
        <button type="button" onClick={() => formatText('bold')} className="px-1.5 sm:px-2 py-1 text-xs sm:text-sm font-bold border border-gray-300 rounded hover:bg-gray-100 min-w-[28px] sm:min-w-[32px]" title="Bold">
          <strong>B</strong>
        </button>
        <button type="button" onClick={() => formatText('italic')} className="px-1.5 sm:px-2 py-1 text-xs sm:text-sm italic border border-gray-300 rounded hover:bg-gray-100 min-w-[28px] sm:min-w-[32px]" title="Italic">
          <em>I</em>
        </button>
        <button type="button" onClick={() => formatText('underline')} className="px-1.5 sm:px-2 py-1 text-xs sm:text-sm underline border border-gray-300 rounded hover:bg-gray-100 min-w-[28px] sm:min-w-[32px]" title="Underline">
          U
        </button>
        <button type="button" onClick={() => formatText('strikethrough')} className="px-1.5 sm:px-2 py-1 text-xs sm:text-sm line-through border border-gray-300 rounded hover:bg-gray-100 min-w-[28px] sm:min-w-[32px]" title="Strikethrough">
          S
        </button>
        <button type="button" onClick={() => formatText('code')} className="px-1.5 sm:px-2 py-1 text-xs font-mono bg-gray-200 border border-gray-300 rounded hover:bg-gray-100 min-w-[32px] sm:min-w-[36px]" title="Inline Code">
          &lt;/&gt;
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300"></div>

      {/* Headings */}
      <div className="flex items-center gap-1">
        <button type="button" onClick={() => insertHeading('h1')} className="px-1.5 sm:px-2 py-1 text-xs sm:text-sm font-bold border border-gray-300 rounded hover:bg-gray-100 min-w-[28px] sm:min-w-[32px]" title="Heading 1">
          H1
        </button>
        <button type="button" onClick={() => insertHeading('h2')} className="px-1.5 sm:px-2 py-1 text-xs sm:text-sm font-bold border border-gray-300 rounded hover:bg-gray-100 min-w-[28px] sm:min-w-[32px]" title="Heading 2">
          H2
        </button>
        <button type="button" onClick={() => insertHeading('h3')} className="px-1.5 sm:px-2 py-1 text-xs sm:text-sm font-bold border border-gray-300 rounded hover:bg-gray-100 min-w-[28px] sm:min-w-[32px]" title="Heading 3">
          H3
        </button>
        <button type="button" onClick={() => insertHeading('h4')} className="px-1.5 sm:px-2 py-1 text-xs sm:text-sm font-bold border border-gray-300 rounded hover:bg-gray-100 min-w-[28px] sm:min-w-[32px]" title="Heading 4">
          H4
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300"></div>

      {/* Lists */}
      <div className="flex items-center gap-1">
        <button type="button" onClick={() => insertList('bullet')} className="px-1.5 sm:px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded hover:bg-gray-100 min-w-[40px] sm:min-w-[50px]" title="Bullet List">
          • List
        </button>
        <button type="button" onClick={() => insertList('number')} className="px-1.5 sm:px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded hover:bg-gray-100 min-w-[40px] sm:min-w-[50px]" title="Numbered List">
          1. List
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300"></div>

      {/* Indentation */}
      <div className="flex items-center gap-1">
        <button type="button" onClick={handleOutdent} className="px-1.5 sm:px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded hover:bg-gray-100 min-w-[28px] sm:min-w-[32px]" title="Decrease Indent">
          ⇤
        </button>
        <button type="button" onClick={handleIndent} className="px-1.5 sm:px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded hover:bg-gray-100 min-w-[28px] sm:min-w-[32px]" title="Increase Indent">
          ⇥
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300"></div>

      {/* Advanced elements */}
      <div className="flex items-center gap-1">
        <button type="button" onClick={insertQuote} className="px-1.5 sm:px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded hover:bg-gray-100 min-w-[50px] sm:min-w-[60px]" title="Quote">
          <span className="hidden sm:inline">❝ </span>Quote
        </button>
        <button type="button" onClick={insertCodeBlock} className="px-1.5 sm:px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded hover:bg-gray-100 min-w-[50px] sm:min-w-[60px]" title="Code Block">
          <span className="hidden sm:inline">{ } </span>Code
        </button>
        <button type="button" onClick={insertLink} className="px-1.5 sm:px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded hover:bg-gray-100 min-w-[40px] sm:min-w-[50px]" title="Link">
          <span className="hidden sm:inline">🔗 </span>Link
        </button>
        <button type="button" onClick={insertTable} className="px-1.5 sm:px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded hover:bg-gray-100 min-w-[50px] sm:min-w-[60px]" title="Table">
          <span className="hidden sm:inline">▦ </span>Table
        </button>
      </div>
    </div>
  );
}

// Advanced onChange plugin with better error handling
function AdvancedOnChangePlugin({ onChange }: { onChange: (content: string) => void }) {
  const [editor] = useLexicalComposerContext();
  
  const handleChange = useCallback((editorState: EditorState) => {
    try {
      editor.read(() => {
        try {
          const htmlString = $generateHtmlFromNodes(editor, null);
          onChange(htmlString || '');
        } catch (htmlError) {
          console.error('HTML generation error:', htmlError);
          // Fallback: get text content
          try {
            const textContent = $getRoot().getTextContent();
            onChange(`<p>${textContent}</p>`);
          } catch (textError) {
            console.error('Text fallback error:', textError);
            onChange('');
          }
        }
      });
    } catch (error) {
      console.error('onChange error:', error);
      onChange('');
    }
  }, [editor, onChange]);

  return <OnChangePlugin onChange={handleChange} />;
}

// Error boundary for the editor
class AdvancedEditorErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): { hasError: boolean; error: Error } {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Advanced Lexical Editor Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[300px] p-4 border border-red-300 rounded bg-red-50 text-red-700">
          <p className="font-medium">🚨 Advanced Editor Error</p>
          <p className="text-sm mt-1">The advanced editor encountered an error. Please refresh the page.</p>
          <details className="mt-2 text-xs">
            <summary className="cursor-pointer">Error Details</summary>
            <pre className="mt-1 p-2 bg-red-100 rounded overflow-auto">
              {this.state.error?.message}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

const AdvancedLexicalEditor: React.FC<AdvancedLexicalEditorProps> = ({ content, onChange, placeholder = "Start writing your blog post..." }) => {
  const initialConfig = {
    namespace: 'AdvancedBlogEditor',
    theme: {
      text: {
        bold: 'font-bold',
        italic: 'italic',
        underline: 'underline',
        strikethrough: 'line-through',
        code: 'bg-gray-100 px-1 py-0.5 rounded font-mono text-sm',
        subscript: 'text-xs align-sub',
        superscript: 'text-xs align-super',
      },
      heading: {
        h1: 'text-4xl font-bold mb-6 text-gray-900',
        h2: 'text-3xl font-bold mb-5 text-gray-800',
        h3: 'text-2xl font-bold mb-4 text-gray-800',
        h4: 'text-xl font-bold mb-3 text-gray-700',
        h5: 'text-lg font-bold mb-2 text-gray-700',
        h6: 'text-base font-bold mb-2 text-gray-600',
      },
      list: {
        nested: {
          listitem: 'list-none',
        },
        ol: 'list-decimal list-inside ml-4',
        ul: 'list-disc list-inside ml-4',
        listitem: 'mb-1',
      },
      quote: 'border-l-4 border-blue-400 pl-4 italic text-gray-700 my-4 bg-blue-50 py-2',
      code: 'bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm my-4 overflow-x-auto',
      codeHighlight: {
        atrule: 'text-purple-400',
        attr: 'text-blue-400',
        boolean: 'text-orange-400',
        builtin: 'text-purple-400',
        cdata: 'text-gray-400',
        char: 'text-green-400',
        class: 'text-blue-400',
        'class-name': 'text-blue-400',
        comment: 'text-gray-500',
        constant: 'text-orange-400',
        deleted: 'text-red-400',
        doctype: 'text-gray-400',
        entity: 'text-orange-400',
        function: 'text-purple-400',
        important: 'text-red-400',
        inserted: 'text-green-400',
        keyword: 'text-purple-400',
        namespace: 'text-orange-400',
        number: 'text-orange-400',
        operator: 'text-gray-400',
        prolog: 'text-gray-400',
        property: 'text-blue-400',
        punctuation: 'text-gray-400',
        regex: 'text-green-400',
        selector: 'text-red-400',
        string: 'text-green-400',
        symbol: 'text-orange-400',
        tag: 'text-red-400',
        url: 'text-blue-400',
        variable: 'text-orange-400',
      },
      table: 'border-collapse border border-gray-300 w-full my-4',
      tableCell: 'border border-gray-300 p-3 min-w-[100px]',
      tableCellHeader: 'border border-gray-300 p-3 bg-gray-100 font-medium min-w-[100px]',
      tableRow: 'border-b border-gray-300',
      hashtag: 'text-blue-600 font-medium',
      link: 'text-blue-600 underline hover:text-blue-800 cursor-pointer',
      paragraph: 'mb-3',
    },
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      LinkNode,
      AutoLinkNode,
      CodeNode,
      CodeHighlightNode,
      HashtagNode,
      TableNode,
      TableCellNode,
      TableRowNode,
    ],
    onError: (error: Error) => {
      console.error('Advanced Lexical editor error:', error);
    },
  };

  return (
    <div className="advanced-lexical-editor w-full border border-gray-300 rounded-lg overflow-hidden shadow-sm bg-white">
      <AdvancedEditorErrorBoundary>
        <LexicalComposer initialConfig={initialConfig} key={`composer-${content?.length || 0}`}>
          <SafeHtmlInitializerPlugin html={content} />
          <AdvancedToolbarPlugin />
          <div className="relative">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className="min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] max-h-[1200px] p-4 sm:p-6 outline-none text-sm sm:text-base leading-relaxed resize-y focus:ring-2 focus:ring-blue-500 focus:ring-inset overflow-y-auto w-full"
                  style={{ 
                    caretColor: '#3b82f6',
                    resize: 'vertical',
                    minHeight: '400px'
                  }}
                />
              }
              placeholder={
                <div className="absolute top-4 sm:top-6 left-4 sm:left-6 text-gray-400 pointer-events-none select-none text-sm sm:text-base">
                  {placeholder}
                </div>
              }
              ErrorBoundary={AdvancedEditorErrorBoundary}
            />
            <HistoryPlugin />
            <AutoFocusPlugin />
            <LinkPlugin />
            <ListPlugin />
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
            <AdvancedOnChangePlugin onChange={onChange} />
          </div>
        </LexicalComposer>
      </AdvancedEditorErrorBoundary>
    </div>
  );
};

export default AdvancedLexicalEditor;