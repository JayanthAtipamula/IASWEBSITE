import React, { useCallback, useEffect, useState, useRef } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

// Basic nodes only
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { LinkNode, AutoLinkNode } from '@lexical/link';

// Essential Lexical utilities
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import {
  EditorState,
  $getRoot,
  $createTextNode,
  $createParagraphNode,
} from 'lexical';

interface MinimalLexicalTestProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

// Ultra-minimal initialization plugin - ONLY initializes once
function MinimalInitializerPlugin({ content }: { content: string }) {
  const [editor] = useLexicalComposerContext();
  const [hasInitialized, setHasInitialized] = useState(false);
  const initContentRef = useRef(content);

  useEffect(() => {
    // CRITICAL: Only initialize once on mount to prevent keyboard interference
    if (hasInitialized) {
      console.log('⚠️ Skipping re-initialization to protect keyboard input');
      return;
    }

    // Only initialize if content changed from initial
    const shouldInitialize = !hasInitialized && content !== initContentRef.current;
    
    if (!shouldInitialize) {
      if (!hasInitialized) {
        // First mount with same content
        setHasInitialized(true);
        console.log('✅ Minimal Initializer: Using existing content, marking as initialized');
      }
      return;
    }

    console.log('🔄 Minimal Initializer: ONE-TIME initialization with content:', content.substring(0, 50));
    
    // Use setTimeout to avoid React lifecycle interference
    const timeoutId = setTimeout(() => {
      editor.update(() => {
        const root = $getRoot();
        root.clear();

        if (content && content.trim()) {
          if (content.includes('<') && content.includes('>')) {
            try {
              const parser = new DOMParser();
              const dom = parser.parseFromString(content, 'text/html');
              const nodes = $generateNodesFromDOM(editor, dom);
              if (nodes.length > 0) {
                root.append(...nodes);
              } else {
                const paragraph = $createParagraphNode();
                paragraph.append($createTextNode(content.replace(/<[^>]*>/g, '')));
                root.append(paragraph);
              }
            } catch (error) {
              console.warn('HTML parsing failed, using plain text');
              const paragraph = $createParagraphNode();
              paragraph.append($createTextNode(content));
              root.append(paragraph);
            }
          } else {
            const paragraph = $createParagraphNode();
            paragraph.append($createTextNode(content));
            root.append(paragraph);
          }
        } else {
          const paragraph = $createParagraphNode();
          root.append(paragraph);
        }
      });
      
      setHasInitialized(true);
      console.log('✅ Minimal Initializer: Initialization complete - keyboard should work normally');
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [editor, content, hasInitialized]);

  return null;
}

// Ultra-simple change handler - NO debouncing to avoid interference
function UltraSimpleOnChangePlugin({ onChange }: { onChange: (content: string) => void }) {
  const [editor] = useLexicalComposerContext();

  const handleChange = useCallback((editorState: EditorState) => {
    // IMMEDIATE processing - no debouncing to avoid keyboard interference
    editorState.read(() => {
      try {
        const htmlString = $generateHtmlFromNodes(editor);
        onChange(htmlString);
        console.log('📝 IMMEDIATE Content changed:', htmlString.substring(0, 30) + '...');
      } catch (error) {
        console.error('Error generating HTML:', error);
      }
    });
  }, [editor, onChange]);

  return <OnChangePlugin onChange={handleChange} />;
}

const MinimalLexicalTest: React.FC<MinimalLexicalTestProps> = ({ 
  content, 
  onChange, 
  placeholder = "Type here to test..." 
}) => {
  const initialConfig = {
    namespace: 'MinimalTest',
    theme: {
      text: {
        bold: 'font-bold',
        italic: 'italic',
      },
      heading: {
        h1: 'text-2xl font-bold',
        h2: 'text-xl font-bold',
        h3: 'text-lg font-bold',
      },
      list: {
        ol: 'list-decimal list-inside',
        ul: 'list-disc list-inside',
        listitem: 'mb-1',
      },
      quote: 'border-l-4 border-gray-300 pl-4 italic',
      link: 'text-blue-600 underline',
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
      console.error('Minimal Lexical error:', error);
    },
  };

  return (
    <div className="minimal-lexical-test border-2 border-red-300 rounded-lg p-4 bg-red-50">
      <div className="mb-2 text-sm font-bold text-red-700">
        🔬 MINIMAL LEXICAL TEST - Check keyboard input here
      </div>
      
      <div className="border border-gray-300 rounded bg-white">
        <LexicalComposer initialConfig={initialConfig}>
          <MinimalInitializerPlugin content={content} />
          
          <div className="relative">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className="min-h-[200px] p-4 outline-none text-base leading-normal resize-none focus:ring-2 focus:ring-blue-500"
                  style={{ caretColor: '#1f2937' }}
                  spellCheck={false}
                />
              }
              placeholder={
                <div className="absolute top-4 left-4 text-gray-400 pointer-events-none select-none">
                  {placeholder}
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            
            {/* Only essential plugins - NO AutoFocus to prevent interference */}
            <HistoryPlugin />
            <UltraSimpleOnChangePlugin onChange={onChange} />
          </div>
        </LexicalComposer>
      </div>
      
      <div className="mt-2 text-xs text-red-600">
        Instructions: Click in the editor above and type. Each character should appear on the same line.
        If you see line breaks after each character, the issue is confirmed.
      </div>
    </div>
  );
};

export default MinimalLexicalTest;