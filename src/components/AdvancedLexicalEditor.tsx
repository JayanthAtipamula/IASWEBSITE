import React, { useCallback, useEffect, useState, useRef } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { LinkNode, AutoLinkNode } from '@lexical/link';
import { CodeNode, CodeHighlightNode } from '@lexical/code';
import { TableNode, TableCellNode, TableRowNode } from '@lexical/table';

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
  $createParagraphNode,
  CAN_UNDO_COMMAND,
  CAN_REDO_COMMAND,
} from 'lexical';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { $createCodeNode } from '@lexical/code';
import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND } from '@lexical/list';
import { $setBlocksType, $getSelectionStyleValueForProperty, $patchStyleText } from '@lexical/selection';

// Firebase
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

interface AdvancedLexicalEditorProps {
  content: string;
  editorState?: string; // New prop for JSON editor state
  onChange: (content: string) => void;
  onStateChange?: (state: string) => void; // New prop for state changes
  onSave?: (content: string, editorState?: string) => void; // Manual save callback
  placeholder?: string;
  documentId?: string;
  collection?: string;
  autoSave?: boolean;
  autoSaveInterval?: number;
  showSaveButton?: boolean; // Show save button in toolbar
}

// Color palette
const COLOR_PALETTE = [
  '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
  '#800000', '#008000', '#000080', '#808000', '#800080', '#008080', '#C0C0C0',
  '#808080', '#FF9999', '#99FF99', '#9999FF', '#FFFF99', '#FF99FF', '#99FFFF'
];

// Enhanced error boundary component for better error handling
class CustomLexicalErrorBoundary extends React.Component<
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
    console.error('Advanced Lexical Editor Error:', error, errorInfo);
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

// Ultra-conservative initialization plugin - ONLY initializes on mount or true external changes
function EnhancedFirebaseInitializerPlugin({ 
  content, 
  editorState, 
  initialContentRef 
}: { 
  content: string; 
  editorState?: string; 
  initialContentRef: React.MutableRefObject<string> 
}) {
  const [editor] = useLexicalComposerContext();
  const [hasInitialized, setHasInitialized] = useState(false);
  const initContentRef = useRef(content);
  const initStateRef = useRef(editorState);

  useEffect(() => {
    // CRITICAL: Ultra-conservative initialization to prevent keyboard interference
    // Only initialize once on mount to avoid cursor issues
    
    if (hasInitialized) {
      console.log('⚠️ Skipping re-initialization to protect keyboard input - already initialized');
      return;
    }
    
    const hasEditorState = editorState && editorState.trim();
    const hasContent = content && content.trim();
    
    // Only initialize if we have new content from external source (not user typing)
    const isFirstMount = !hasInitialized;
    const shouldInitialize = isFirstMount && (hasEditorState || hasContent);
    
    if (!shouldInitialize) {
      if (isFirstMount) {
        // Mark as initialized even with empty content to prevent re-initialization
        setHasInitialized(true);
        console.log('✅ Empty editor initialized - ready for typing');
      }
      return;
    }
    
    console.log('🔄 Ultra-Conservative Initializer (ONE-TIME ONLY):', {
      isFirstMount,
      hasEditorState,
      hasContent,
      contentPreview: (content || '').substring(0, 50) + '...',
      action: hasEditorState ? 'Loading JSON state' : hasContent ? 'Loading HTML content' : 'Initial empty setup'
    });
    
    const initializeContentSafely = () => {
      try {
        // Method 1: Try to use editor state first (most reliable)
        if (hasEditorState) {
          console.log('✅ Loading from JSON editor state (preferred method)');
          try {
            const parsedState = JSON.parse(editorState);
            const newEditorState = editor.parseEditorState(parsedState);
            editor.setEditorState(newEditorState);
            setHasInitialized(true);
            console.log('✅ JSON state loaded successfully - keyboard protected');
            return;
          } catch (parseError) {
            console.warn('⚠️ JSON state parsing failed, falling back to HTML:', parseError);
          }
        }
        
        // Method 2: HTML content (only if no state available)
        if (hasContent) {
          console.log('⚠️ Loading from HTML content (fallback method)');
          editor.update(() => {
            const root = $getRoot();
            root.clear();
            
            const isHtmlContent = content.startsWith('<') || (content.includes('<') && content.includes('>'));
            
            if (isHtmlContent) {
              try {
                const parser = new DOMParser();
                const dom = parser.parseFromString(content, 'text/html');
                const nodes = $generateNodesFromDOM(editor, dom);
                
                if (nodes.length > 0) {
                  root.append(...nodes);
                } else {
                  // Fallback for empty HTML
                  const paragraph = $createParagraphNode();
                  paragraph.append($createTextNode(content.replace(/<[^>]*>/g, '')));
                  root.append(paragraph);
                }
              } catch (htmlError) {
                console.warn('HTML parsing failed, using plain text:', htmlError);
                const paragraph = $createParagraphNode();
                paragraph.append($createTextNode(content));
                root.append(paragraph);
              }
            } else {
              // Plain text
              const paragraph = $createParagraphNode();
              paragraph.append($createTextNode(content));
              root.append(paragraph);
            }
          });
          setHasInitialized(true);
          console.log('✅ HTML content loaded successfully - keyboard protected');
          return;
        }
        
        // Method 3: Initialize empty editor (first mount only)
        if (isFirstMount) {
          editor.update(() => {
            const root = $getRoot();
            if (root.getChildren().length === 0) {
              const paragraph = $createParagraphNode();
              root.append(paragraph);
            }
          });
          setHasInitialized(true);
          console.log('✅ Empty editor initialized - ready for typing');
        }
        
      } catch (error) {
        console.error('❌ Content initialization error:', error);
        // Emergency fallback - ensure editor has content
        if (!hasInitialized) {
          editor.update(() => {
            const root = $getRoot();
            root.clear();
            const paragraph = $createParagraphNode();
            root.append(paragraph);
          });
          setHasInitialized(true);
          console.log('🚨 Emergency fallback initialization completed');
        }
      }
    };

    // CRITICAL: Use setTimeout to avoid interfering with React's rendering cycle
    // This prevents cursor and focus issues
    const timeoutId = setTimeout(() => {
      initializeContentSafely();
    }, 0);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [editor, content, editorState, hasInitialized]);

  return null;
}

// Color picker component
function ColorPicker({ 
  color, 
  onChange, 
  title 
}: { 
  color: string; 
  onChange: (color: string) => void; 
  title: string; 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [hexInput, setHexInput] = useState(color);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Update hex input when color prop changes
  useEffect(() => {
    setHexInput(color);
  }, [color]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleColorSelect = (selectedColor: string) => {
    setHexInput(selectedColor);
    onChange(selectedColor);
    setIsOpen(false);
  };


  return (
    <div className="relative" ref={pickerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 border border-gray-300 rounded-md cursor-pointer flex items-center justify-center hover:border-gray-400 transition-all duration-200 shadow-sm"
        style={{ backgroundColor: color }}
        title={title}
      >
        {title.includes('Text') && (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" style={{ 
            color: color === '#000000' ? '#ffffff' : '#000000',
            filter: color === '#000000' ? 'none' : 'drop-shadow(1px 1px 1px rgba(255,255,255,0.8))'
          }}>
            <path d="M2.5 4v3h5v12h3V7h5V4h-13zm19 5h-9v3h3v7h3v-7h3V9z"/>
          </svg>
        )}
        {title.includes('Background') && (
          <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.71 5.63l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-3.12 3.12-1.93-1.91-1.41 1.41 1.42 1.42L3 16.25V21h4.75l8.92-8.92 1.42 1.42 1.41-1.41-1.91-1.93 3.12-3.12c.39-.39.39-1.02 0-1.41zM6.92 19L5 17.08l8.06-8.06 1.92 1.92L6.92 19z"/>
          </svg>
        )}
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 p-3 bg-white border border-gray-300 rounded shadow-lg z-50 min-w-[200px]">
          <div className="grid grid-cols-7 gap-1 mb-3">
            {COLOR_PALETTE.map((paletteColor) => (
              <button
                key={paletteColor}
                type="button"
                onClick={() => handleColorSelect(paletteColor)}
                className="w-6 h-6 border border-gray-200 rounded hover:scale-110"
                style={{ backgroundColor: paletteColor }}
                title={paletteColor}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={hexInput}
              onChange={(e) => setHexInput(e.target.value)}
              placeholder="#000000"
              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (/^#[0-9A-F]{6}$/i.test(hexInput)) {
                    onChange(hexInput);
                    setIsOpen(false);
                  }
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                if (/^#[0-9A-F]{6}$/i.test(hexInput)) {
                  onChange(hexInput);
                  setIsOpen(false);
                }
              }}
              className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Comprehensive toolbar component
function ComprehensiveToolbarPlugin({ 
  onSave, 
  showSaveButton = false 
}: { 
  onSave?: (content: string, editorState?: string) => void;
  showSaveButton?: boolean;
}) {
  const [editor] = useLexicalComposerContext();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [fontSize, setFontSize] = useState('16px');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontColor, setFontColor] = useState('#000000');
  const [blockType, setBlockType] = useState('paragraph');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const updateToolbar = () => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        // Update text formatting states
        setIsBold(selection.hasFormat('bold'));
        setIsItalic(selection.hasFormat('italic'));
        setIsUnderline(selection.hasFormat('underline'));
        setIsStrikethrough(selection.hasFormat('strikethrough'));
        setIsCode(selection.hasFormat('code'));
        setIsSubscript(selection.hasFormat('subscript'));
        setIsSuperscript(selection.hasFormat('superscript'));
        
        // Update style properties with proper defaults and parsing
        const fontSizeValue = $getSelectionStyleValueForProperty(selection, 'font-size', '16px') || '16px';
        setFontSize(fontSizeValue);
        
        const fontFamilyValue = $getSelectionStyleValueForProperty(selection, 'font-family', 'Arial') || 'Arial';
        setFontFamily(fontFamilyValue);
        
        const colorValue = $getSelectionStyleValueForProperty(selection, 'color', '#000000') || '#000000';
        setFontColor(colorValue);
      }
    };

    // Register update listener with proper error handling
    const unregisterMergeListener = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        try {
          updateToolbar();
        } catch (error) {
          console.error('Error updating toolbar:', error);
        }
      });
    });

    const unregisterCommand1 = editor.registerCommand(
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
      unregisterCommand1();
      unregisterCommand2();
    };
  }, [editor]);

  // Text formatting functions
  const formatText = (format: 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code' | 'subscript' | 'superscript') => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const clearFormatting = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        // Clear all text formats
        const formats = ['bold', 'italic', 'underline', 'strikethrough', 'code', 'subscript', 'superscript'] as const;
        formats.forEach(format => {
          if (selection.hasFormat(format)) {
            selection.toggleFormat(format);
          }
        });
        
        // Clear styles
        $patchStyleText(selection, {
          'font-size': null,
          'font-family': null,
          'color': null,
          'background-color': null,
        });
      }
    });
  };

  const handleUndo = () => editor.dispatchCommand(UNDO_COMMAND, undefined);
  const handleRedo = () => editor.dispatchCommand(REDO_COMMAND, undefined);

  const handleFontSizeChange = (newSize: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { 'font-size': newSize });
      }
    });
    setFontSize(newSize);
  };

  const handleFontFamilyChange = (newFamily: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { 'font-family': newFamily });
      }
    });
    setFontFamily(newFamily);
  };

  const handleColorChange = (color: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        // Apply color to selected text or current selection
        $patchStyleText(selection, { 'color': color });
      }
    });
    
    // Update local state immediately
    setFontColor(color);
  };

  // Text transformations
  const transformText = (transformation: 'lowercase' | 'uppercase' | 'capitalize') => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const text = selection.getTextContent();
        let transformedText = '';
        
        switch (transformation) {
          case 'lowercase':
            transformedText = text.toLowerCase();
            break;
          case 'uppercase':
            transformedText = text.toUpperCase();
            break;
          case 'capitalize':
            transformedText = text.replace(/\w\S*/g, (txt) => 
              txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
            break;
        }
        
        selection.insertText(transformedText);
      }
    });
  };

  // Block formatting
  const formatBlock = (blockType: string) => {
    if (blockType === 'paragraph') {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createParagraphNode());
        }
      });
    } else if (blockType.startsWith('h')) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(blockType as 'h1' | 'h2' | 'h3'));
        }
      });
    } else if (blockType === 'quote') {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      });
    } else if (blockType === 'code-block') {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createCodeNode());
        }
      });
    }
    setBlockType(blockType);
  };

  // List functions
  const insertList = (listType: 'bullet' | 'number') => {
    if (listType === 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else if (listType === 'number') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    }
  };

  // Removed insertLink, insertImage, and insertTable functions per user request
  // These functions were supporting the removed toolbar buttons

  // Alignment
  const handleAlignment = (alignment: 'left' | 'center' | 'right' | 'justify') => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment);
  };

  // Manual save function
  const handleSave = useCallback(async () => {
    if (!onSave) return;
    
    setIsSaving(true);
    try {
      editor.getEditorState().read(() => {
        try {
          // Generate HTML content
          const htmlString = $generateHtmlFromNodes(editor);
          
          // Generate JSON editor state
          const editorState = JSON.stringify(editor.getEditorState().toJSON());
          
          // Call the save callback
          onSave(htmlString, editorState);
          
          console.log('✅ Manual save completed');
        } catch (error) {
          console.error('❌ Error during manual save:', error);
        }
      });
    } finally {
      setIsSaving(false);
    }
  }, [editor, onSave]);

  return (
    <div className="toolbar flex flex-wrap items-center gap-2 p-4 border-b border-gray-200 bg-gray-50 shadow-sm">
      {/* Save Button */}
      {showSaveButton && (
        <>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm transition-all duration-200"
            title="Save Content"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Save
              </>
            )}
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1"></div>
        </>
      )}

      {/* Undo/Redo */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={handleUndo}
          disabled={!canUndo}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
          title="Undo (Ctrl+Z)"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        </button>
        <button
          type="button"
          onClick={handleRedo}
          disabled={!canRedo}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
          title="Redo (Ctrl+Y)"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2m18-10l-6-6m6 6l-6 6" />
          </svg>
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Block Format Dropdown */}
      <div className="relative">
        <select
          value={blockType}
          onChange={(e) => formatBlock(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
        >
          <option value="paragraph">Normal</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="quote">Quote</option>
          <option value="code-block">Code Block</option>
        </select>
      </div>

      {/* Font Family */}
      <div className="relative">
        <select
          value={fontFamily}
          onChange={(e) => handleFontFamilyChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
        >
          <option value="Arial">Arial</option>
          <option value="Georgia">Georgia</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Helvetica">Helvetica</option>
          <option value="Courier New">Courier New</option>
          <option value="Verdana">Verdana</option>
          <option value="Comic Sans MS">Comic Sans MS</option>
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
          className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 flex items-center justify-center transition-all duration-200 shadow-sm"
          title="Decrease Font Size"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <input
          type="text"
          value={fontSize.replace('px', '')}
          onChange={(e) => handleFontSizeChange(`${e.target.value}px`)}
          className="w-12 px-2 py-2 text-sm text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
        />
        <button
          type="button"
          onClick={() => {
            const currentSize = parseInt(fontSize);
            if (currentSize < 72) {
              handleFontSizeChange(`${currentSize + 1}px`);
            }
          }}
          className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 flex items-center justify-center transition-all duration-200 shadow-sm"
          title="Increase Font Size"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Text formatting */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => formatText('bold')}
          className={`p-2 border rounded-md hover:bg-gray-100 transition-all duration-200 shadow-sm ${
            isBold ? 'bg-blue-100 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-600 hover:text-gray-900'
          }`}
          title="Bold (Ctrl+B)"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4v2h1.5v10H6v2h6c2.2 0 4-1.8 4-4v-1c0-1.5-.8-2.8-2-3.4.6-.6 1-1.4 1-2.3V7c0-1.7-1.3-3-3-3H6zm3 2h3c.6 0 1 .4 1 1v1c0 .6-.4 1-1 1H9V6zm0 5h3.5c.8 0 1.5.7 1.5 1.5v1c0 .8-.7 1.5-1.5 1.5H9v-4z"/>
          </svg>
        </button>
        <button
          type="button"
          onClick={() => formatText('italic')}
          className={`p-2 border rounded-md hover:bg-gray-100 transition-all duration-200 shadow-sm ${
            isItalic ? 'bg-blue-100 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-600 hover:text-gray-900'
          }`}
          title="Italic (Ctrl+I)"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4h-8z"/>
          </svg>
        </button>
        <button
          type="button"
          onClick={() => formatText('underline')}
          className={`p-2 border rounded-md hover:bg-gray-100 transition-all duration-200 shadow-sm ${
            isUnderline ? 'bg-blue-100 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-600 hover:text-gray-900'
          }`}
          title="Underline (Ctrl+U)"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/>
          </svg>
        </button>
        <button
          type="button"
          onClick={() => formatText('strikethrough')}
          className={`p-2 border rounded-md hover:bg-gray-100 transition-all duration-200 shadow-sm ${
            isStrikethrough ? 'bg-blue-100 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-600 hover:text-gray-900'
          }`}
          title="Strikethrough"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7.24 8.75c-.26-.48-.39-1.03-.39-1.67 0-.61.13-1.16.4-1.67.26-.5.63-.93 1.11-1.29.48-.35 1.05-.63 1.7-.83.66-.19 1.39-.29 2.18-.29.81 0 1.54.11 2.21.34.66.22 1.23.54 1.69.94.47.4.83.88 1.08 1.43.25.55.38 1.15.38 1.81h-3.01c0-.31-.05-.59-.15-.85-.09-.27-.24-.49-.44-.68-.2-.19-.45-.33-.75-.44-.3-.1-.66-.16-1.06-.16-.39 0-.74.04-1.03.13-.29.09-.53.21-.72.36-.19.16-.34.34-.44.55-.1.21-.15.43-.15.66 0 .48.25.88.74 1.21.38.25.77.48 1.41.7H7.39c-.05-.08-.11-.17-.15-.26zM21 12v-2H3v2h9.62c.18.07.4.14.55.2.37.17.66.34.87.51.21.17.35.36.43.57.07.2.11.43.11.69 0 .23-.05.45-.14.66-.09.2-.23.38-.42.53-.19.15-.42.26-.71.35-.29.08-.63.13-1.01.13-.43 0-.83-.04-1.18-.13-.35-.09-.65-.22-.89-.39-.25-.17-.44-.37-.59-.62-.15-.24-.22-.5-.22-.78H12c0 .55.08 1.13.24 1.58.16.45.37.85.65 1.21.28.35.6.66.98.92.37.26.78.48 1.22.65.44.17.9.3 1.38.39.48.08.96.13 1.44.13.8 0 1.53-.09 2.18-.28.66-.19 1.23-.45 1.7-.78.47-.33.84-.73 1.1-1.2.26-.47.38-1.01.38-1.61 0-.5-.13-.98-.38-1.44-.25-.45-.59-.85-1.01-1.18-.42-.33-.93-.63-1.52-.89-.59-.25-1.25-.47-1.97-.65H21z"/>
          </svg>
        </button>
        <button
          type="button"
          onClick={() => formatText('code')}
          className={`p-2 border rounded-md hover:bg-gray-100 transition-all duration-200 shadow-sm ${
            isCode ? 'bg-blue-100 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-600 hover:text-gray-900'
          }`}
          title="Inline Code"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </button>
      </div>

      {/* Subscript/Superscript */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => formatText('subscript')}
          className={`p-2 border rounded-md hover:bg-gray-100 transition-all duration-200 shadow-sm flex items-center justify-center ${
            isSubscript ? 'bg-blue-100 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-600 hover:text-gray-900'
          }`}
          title="Subscript"
        >
          <span className="text-sm font-medium">
            X₂
          </span>
        </button>
        <button
          type="button"
          onClick={() => formatText('superscript')}
          className={`p-2 border rounded-md hover:bg-gray-100 transition-all duration-200 shadow-sm flex items-center justify-center ${
            isSuperscript ? 'bg-blue-100 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-600 hover:text-gray-900'
          }`}
          title="Superscript"
        >
          <span className="text-sm font-medium">
            X²
          </span>
        </button>
      </div>

      {/* Clear Formatting */}
      <button
        type="button"
        onClick={clearFormatting}
        className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-all duration-200 shadow-sm"
        title="Clear Formatting"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Colors */}
      <div className="flex items-center gap-2">
        <ColorPicker
          color={fontColor}
          onChange={handleColorChange}
          title="Text Color"
        />
      </div>

      <div className="w-px h-6 bg-gray-300"></div>

      {/* Text Transformations */}
      <div className="relative">
        <select
          className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
          onChange={(e) => {
            const value = e.target.value;
            if (value === 'lowercase' || value === 'uppercase' || value === 'capitalize') {
              transformText(value);
              e.target.value = 'transform'; // Reset to default
            }
          }}
          defaultValue="transform"
        >
          <option value="transform">Transform</option>
          <option value="lowercase">lowercase</option>
          <option value="uppercase">UPPERCASE</option>
          <option value="capitalize">Capitalize</option>
        </select>
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Lists */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => insertList('bullet')}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-300 rounded-md transition-all duration-200 shadow-sm"
          title="Bullet List"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zM8 19h12v-2H8v2zm0-6h12v-2H8v2zm0-8v2h12V5H8z"/>
          </svg>
        </button>
        <button
          type="button"
          onClick={() => insertList('number')}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-300 rounded-md transition-all duration-200 shadow-sm"
          title="Numbered List"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h12V5H7zm0 14h12v-2H7v2zm0-6h12v-2H7v2z"/>
          </svg>
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Alignment */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => handleAlignment('left')}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-300 rounded-md transition-all duration-200 shadow-sm"
          title="Align Left"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => handleAlignment('center')}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-300 rounded-md transition-all duration-200 shadow-sm"
          title="Align Center"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M8 12h8m-8 6h16" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => handleAlignment('right')}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-300 rounded-md transition-all duration-200 shadow-sm"
          title="Align Right"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M12 12h8M4 18h16" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => handleAlignment('justify')}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-300 rounded-md transition-all duration-200 shadow-sm"
          title="Justify"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300"></div>

      {/* Insert Menu - Removed Link, Image, and Table buttons per user request */}
      {/* <div className="flex items-center gap-1">
        Removed: 🔗 Link, 🖼️ Image, 📊 Table buttons
      </div> */}
    </div>
  );
}

// Keyboard shortcuts plugin
function KeyboardShortcutsPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case '1':
            if (event.altKey) {
              event.preventDefault();
              editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                  $setBlocksType(selection, () => $createHeadingNode('h1'));
                }
              });
            }
            break;
          case '2':
            if (event.altKey) {
              event.preventDefault();
              editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                  $setBlocksType(selection, () => $createHeadingNode('h2'));
                }
              });
            }
            break;
          case '3':
            if (event.altKey) {
              event.preventDefault();
              editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                  $setBlocksType(selection, () => $createHeadingNode('h3'));
                }
              });
            }
            break;
          case 'e':
            if (event.altKey) {
              event.preventDefault();
              editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                  $setBlocksType(selection, () => $createCodeNode());
                }
              });
            }
            break;
          case 'q':
            if (event.altKey) {
              event.preventDefault();
              editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                  $setBlocksType(selection, () => $createQuoteNode());
                }
              });
            }
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [editor]);

  return null;
}

// Firebase save/load plugin
function FirebasePlugin({ 
  documentId, 
  collection, 
  content, 
  onChange 
}: { 
  documentId?: string; 
  collection?: string; 
  content: string; 
  onChange: (content: string) => void; 
}) {
  // Firebase integration is handled through plugins

  const saveToFirebase = useCallback(async (content: string) => {
    if (!documentId || !collection) return;
    
    try {
      const docRef = doc(db, collection, documentId);
      // Check if document exists first
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        await updateDoc(docRef, {
          content: content,
          updatedAt: new Date(),
        });
        console.log('Content saved to Firebase');
      } else {
        console.log('Document does not exist, skipping save');
      }
    } catch (error) {
      console.error('Error saving to Firebase:', error);
    }
  }, [documentId, collection]);

  const loadFromFirebase = useCallback(async () => {
    if (!documentId || !collection) return;
    
    try {
      const docRef = doc(db, collection, documentId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.content && data.content !== content) {
          onChange(data.content);
        }
      }
    } catch (error) {
      console.error('Error loading from Firebase:', error);
    }
  }, [documentId, collection, content, onChange]);

  useEffect(() => {
    loadFromFirebase();
  }, [loadFromFirebase]);

  // Expose save function globally for manual saves
  useEffect(() => {
    (window as unknown as { saveEditorContent: () => void }).saveEditorContent = () => saveToFirebase(content);
  }, [saveToFirebase, content]);

  return null;
}

// Autosave plugin
function AutoSavePlugin({ 
  content, 
  onSave, 
  interval = 5000 
}: { 
  content: string; 
  onSave: (content: string) => void; 
  interval?: number; 
}) {
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onSave(content);
    }, interval);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [content, onSave, interval]);

  return null;
}

// Enhanced change plugin that saves both HTML and JSON state
// Uses stable debouncing to prevent keyboard interference
function EnhancedOnChangePlugin({ 
  onChange, 
  onStateChange 
}: { 
  onChange: (content: string) => void;
  onStateChange?: (state: string) => void;
}) {
  const [editor] = useLexicalComposerContext();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const handleChange = useCallback((editorState: EditorState) => {
    // CRITICAL: Use stable debouncing pattern to avoid keyboard interference
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Use stable 50ms debounce as per memory guidelines
    timeoutRef.current = setTimeout(() => {
      try {
        editorState.read(() => {
          try {
            // Generate HTML for backward compatibility
            const htmlString = $generateHtmlFromNodes(editor);
            onChange(htmlString);
            
            // Generate JSON editor state for full preservation
            if (onStateChange) {
              const stateJson = JSON.stringify(editorState.toJSON());
              onStateChange(stateJson);
              console.log('🔄 Content updated: HTML + JSON state saved');
            } else {
              console.log('🔄 Content updated: HTML only saved');
            }
            
          } catch (error) {
            console.error('❌ Error generating content:', error);
            // Don't call onChange with empty string on error to prevent content loss
          }
        });
      } catch (error) {
        console.error('❌ Error in onChange:', error);
      }
    }, 50); // ✅ STABLE 50ms debounce - prevents keyboard interference
  }, [editor, onChange, onStateChange]);

  // Cleanup timeout on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return <OnChangePlugin onChange={handleChange} />;
}

const AdvancedLexicalEditor: React.FC<AdvancedLexicalEditorProps> = ({ 
  content, 
  editorState,
  onChange, 
  onStateChange,
  onSave,
  placeholder = "Start writing...",
  documentId,
  collection,
  autoSave = false, // Changed to false by default
  autoSaveInterval = 5000,
  showSaveButton = false
}) => {
  const initialContentRef = useRef(content);
  
  const initialConfig = {
    namespace: 'AdvancedEditor',
    theme: {
      text: {
        bold: 'font-bold',
        italic: 'italic',
        underline: 'underline',
        strikethrough: 'line-through',
        code: 'bg-gray-100 px-1 py-0.5 rounded text-sm font-mono',
        subscript: 'align-sub text-xs',
        superscript: 'align-super text-xs',
      },
      heading: {
        h1: 'text-4xl font-bold mb-4 mt-6',
        h2: 'text-3xl font-bold mb-3 mt-5',
        h3: 'text-2xl font-bold mb-2 mt-4',
      },
      list: {
        nested: {
          listitem: 'list-none',
        },
        ol: 'list-decimal list-inside ml-4',
        ul: 'list-disc list-inside ml-4',
        listitem: 'mb-1',
      },
      quote: 'border-l-4 border-blue-300 pl-4 italic text-gray-700 my-4 bg-blue-50 py-2',
      link: 'text-blue-600 underline hover:text-blue-800 cursor-pointer',
      code: 'bg-gray-900 text-green-400 p-4 my-4 rounded font-mono text-sm overflow-x-auto block',
      table: 'border-collapse border border-gray-300 my-4',
      tableCell: 'border border-gray-300 px-2 py-1',
      tableCellHeader: 'border border-gray-300 px-2 py-1 bg-gray-100 font-bold',
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
      TableNode,
      TableCellNode,
      TableRowNode,
    ],
    onError: (error: Error) => {
      console.error('Advanced Lexical error:', error);
    },
  };

  const [currentEditorState, setCurrentEditorState] = useState<string>('');

  // Manual save function for Firebase
  const handleManualSave = useCallback(async (content: string, state?: string) => {
    if (documentId && collection) {
      try {
        const docRef = doc(db, collection, documentId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const updateData: any = {
            content: content,
            updatedAt: new Date(),
          };
          
          // Save editor state if available for full preservation
          if (state) {
            updateData.editorState = state;
          }
          
          await updateDoc(docRef, updateData);
          console.log('✅ Manual save to Firebase completed:', {
            contentLength: content.length,
            hasEditorState: !!state
          });
          return true;
        } else {
          console.log('⚠️ Document does not exist, skipping manual save');
          return false;
        }
      } catch (error) {
        console.error('❌ Manual save error:', error);
        throw error;
      }
    }
    return false;
  }, [documentId, collection]);

  const handleAutoSave = useCallback((content: string, state?: string) => {
    if (documentId && collection) {
      const saveToFirebase = async () => {
        try {
          const docRef = doc(db, collection, documentId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const updateData: any = {
              content: content,
              updatedAt: new Date(),
            };
            
            // Save editor state if available for full preservation
            if (state) {
              updateData.editorState = state;
            }
            
            await updateDoc(docRef, updateData);
            console.log('✅ Auto-saved to Firebase:', {
              contentLength: content.length,
              hasEditorState: !!state
            });
          } else {
            console.log('⚠️ Document does not exist, skipping auto-save');
          }
        } catch (error) {
          console.error('❌ Auto-save error:', error);
        }
      };
      saveToFirebase();
    }
  }, [documentId, collection]);

  const handleStateChange = useCallback((state: string) => {
    setCurrentEditorState(state);
    if (onStateChange) {
      onStateChange(state);
    }
  }, [onStateChange]);

  // Determine the save function to use
  const saveFunction = onSave || (documentId && collection ? handleManualSave : undefined);

  return (
    <div className="advanced-lexical-editor border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
      <LexicalComposer initialConfig={initialConfig}>
        <EnhancedFirebaseInitializerPlugin 
          content={content} 
          editorState={editorState}
          initialContentRef={initialContentRef} 
        />
        <ComprehensiveToolbarPlugin 
          onSave={saveFunction}
          showSaveButton={showSaveButton || (!!documentId && !!collection && !autoSave)}
        />
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="min-h-[400px] p-6 outline-none text-base leading-relaxed resize-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                style={{ caretColor: '#1f2937' }}
                spellCheck={false}
              />
            }
            placeholder={
              <div className="absolute top-6 left-6 text-gray-400 pointer-events-none select-none text-base">
                {placeholder}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          {/* AutoFocus disabled to prevent cursor interference during typing */}
          {/* {(!content || content.trim() === '' || content === '<p></p>') && (
            <AutoFocusPlugin defaultSelection="rootEnd" />
          )} */}
          <LinkPlugin />
          <ListPlugin />
          <TablePlugin hasCellMerge={false} hasCellBackgroundColor={false} />
          <TabIndentationPlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <KeyboardShortcutsPlugin />
          <FirebasePlugin 
            documentId={documentId} 
            collection={collection} 
            content={content} 
            onChange={onChange} 
          />
          {autoSave && (
            <AutoSavePlugin 
              content={content} 
              onSave={(content) => handleAutoSave(content, currentEditorState)} 
              interval={autoSaveInterval} 
            />
          )}
          <EnhancedOnChangePlugin 
            onChange={onChange} 
            onStateChange={handleStateChange}
          />
        </div>
      </LexicalComposer>
    </div>
  );
};

export default AdvancedLexicalEditor;