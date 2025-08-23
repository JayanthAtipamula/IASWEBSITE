import { useState, useEffect, useCallback, useRef } from 'react';
import contentEditorService, { 
  ContentData, 
  ContentEditorOptions 
} from '../services/contentEditorService';

export interface UseFirebaseEditorOptions {
  collection: string;
  documentId: string;
  autoSave?: boolean;
  autoSaveInterval?: number;
  enableRealtimeSync?: boolean;
  initialContent?: string;
  initialTitle?: string;
  onError?: (error: Error) => void;
  onSaved?: (data: ContentData) => void;
  onLoaded?: (data: ContentData) => void;
}

export interface UseFirebaseEditorReturn {
  content: string;
  title: string;
  isLoading: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  error: string | null;
  updateContent: (newContent: string) => void;
  updateTitle: (newTitle: string) => void;
  saveNow: () => Promise<void>;
  reload: () => Promise<void>;
  clearError: () => void;
}

export const useFirebaseEditor = (options: UseFirebaseEditorOptions): UseFirebaseEditorReturn => {
  const [content, setContent] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Use refs to avoid stale closures
  const contentRef = useRef<string>('');
  const titleRef = useRef<string>('');
  const optionsRef = useRef<UseFirebaseEditorOptions>(options);
  
  // Update refs when values change
  useEffect(() => {
    contentRef.current = content;
  }, [content]);
  
  useEffect(() => {
    titleRef.current = title;
  }, [title]);
  
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);
  
  // Create service options
  const createServiceOptions = useCallback((): ContentEditorOptions => {
    const opts = optionsRef.current;
    return {
      collection: opts.collection,
      documentId: opts.documentId,
      autoSave: opts.autoSave ?? true,
      autoSaveInterval: opts.autoSaveInterval ?? 5000,
      onError: (err) => {
        console.error('Firebase Editor Error:', err);
        setError(err.message);
        setIsSaving(false);
        if (opts.onError) {
          opts.onError(err);
        }
      },
      onSaved: (data) => {
        console.log('Content saved successfully:', data.id);
        setLastSaved(new Date());
        setIsSaving(false);
        if (opts.onSaved) {
          opts.onSaved(data);
        }
      },
      onLoaded: (data) => {
        console.log('Content loaded successfully:', data.id);
        if (opts.onLoaded) {
          opts.onLoaded(data);
        }
      }
    };
  }, []);

  // Load initial content
  const loadContent = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`🔄 Loading content for ${options.collection}/${options.documentId}`);
      
      // Check if we have initial content to use
      if (options.initialContent !== undefined && options.initialContent !== '') {
        console.log(`📝 Using provided initial content:`, {
          initialContentLength: options.initialContent?.length || 0,
          initialTitle: options.initialTitle || '(no title)'
        });
        
        setContent(options.initialContent);
        setTitle(options.initialTitle || '');
        
        // Save initial content to Firebase for draft functionality
        console.log(`💾 Saving initial content to Firebase for auto-save...`);
        const serviceOptions = createServiceOptions();
        try {
          await contentEditorService.saveContent({
            content: options.initialContent,
            title: options.initialTitle || ''
          }, serviceOptions);
          console.log(`✅ Initial content saved to Firebase draft`);
        } catch (error) {
          console.error(`❌ Failed to save initial content:`, error);
        }
        
        setLastSaved(new Date());
        setIsLoading(false);
        
        if (options.onLoaded) {
          options.onLoaded({
            id: options.documentId,
            content: options.initialContent,
            title: options.initialTitle || '',
            lastModified: Date.now()
          });
        }
        
        return;
      }
      
      const serviceOptions = createServiceOptions();
      const data = await contentEditorService.loadContent(serviceOptions);
      
      if (data) {
        setContent(data.content);
        setTitle(data.title || '');
        setLastSaved(data.lastModified ? new Date(data.lastModified) : null);
        console.log(`✅ Content loaded from Firebase: ${data.content.length} characters`);
      } else {
        console.log(`⚠️ No content loaded for ${options.collection}/${options.documentId}`);
        setContent('');
        setTitle('');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error loading content';
      console.error('Error loading content:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [options.collection, options.documentId, createServiceOptions]);

  // Save content manually
  const saveNow = useCallback(async () => {
    try {
      setIsSaving(true);
      setError(null);
      
      console.log(`💾 Manual save for ${options.collection}/${options.documentId}`);
      
      const serviceOptions = createServiceOptions();
      const success = await contentEditorService.saveContent({
        content: contentRef.current,
        title: titleRef.current
      }, serviceOptions);
      
      if (!success) {
        throw new Error('Failed to save content');
      }
      
      console.log(`✅ Manual save completed successfully`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error saving content';
      console.error('Error saving content manually:', errorMessage);
      setError(errorMessage);
      setIsSaving(false);
    }
  }, [options.collection, options.documentId, createServiceOptions]);

  // Update content with auto-save
  const updateContent = useCallback((newContent: string) => {
    setContent(newContent);
    
    if (options.autoSave !== false) {
      const serviceOptions = createServiceOptions();
      contentEditorService.enableAutoSave({
        content: newContent,
        title: titleRef.current
      }, serviceOptions);
      
      console.log(`📝 Content updated (${newContent.length} chars), auto-save scheduled`);
    }
  }, [options.autoSave, createServiceOptions]);

  // Update title with auto-save
  const updateTitle = useCallback((newTitle: string) => {
    setTitle(newTitle);
    
    if (options.autoSave !== false) {
      const serviceOptions = createServiceOptions();
      contentEditorService.enableAutoSave({
        content: contentRef.current,
        title: newTitle
      }, serviceOptions);
      
      console.log(`📝 Title updated: "${newTitle}", auto-save scheduled`);
    }
  }, [options.autoSave, createServiceOptions]);

  // Reload content
  const reload = useCallback(async () => {
    await loadContent();
  }, [loadContent]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initial load
  useEffect(() => {
    loadContent();
  }, [loadContent]);

  // Setup real-time sync if enabled
  useEffect(() => {
    if (options.enableRealtimeSync && !isLoading) {
      console.log(`🔗 Setting up real-time sync for ${options.collection}/${options.documentId}`);
      
      const serviceOptions = createServiceOptions();
      const unsubscribe = contentEditorService.setupRealtimeSync(serviceOptions, (data) => {
        // Only update if content is different from current state
        if (data.content !== contentRef.current || data.title !== titleRef.current) {
          console.log(`🔄 Real-time update received, updating editor content`);
          setContent(data.content);
          setTitle(data.title || '');
          setLastSaved(data.lastModified ? new Date(data.lastModified) : null);
        }
      });
      
      return () => {
        console.log(`🛑 Cleaning up real-time sync for ${options.collection}/${options.documentId}`);
        unsubscribe();
      };
    }
  }, [options.enableRealtimeSync, options.collection, options.documentId, isLoading, createServiceOptions]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log(`🧹 Cleaning up Firebase editor for ${options.collection}/${options.documentId}`);
      
      // Clear auto-save timers
      const serviceOptions = createServiceOptions();
      contentEditorService.clearAutoSave(serviceOptions);
      
      // Cleanup real-time sync
      contentEditorService.cleanupRealtimeSync(serviceOptions);
    };
  }, [options.collection, options.documentId, createServiceOptions]);

  // Save pending changes before page unload
  useEffect(() => {
    const handleBeforeUnload = async (event: BeforeUnloadEvent) => {
      // Force save any pending changes
      await contentEditorService.forceSavePendingChanges();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return {
    content,
    title,
    isLoading,
    isSaving,
    lastSaved,
    error,
    updateContent,
    updateTitle,
    saveNow,
    reload,
    clearError
  };
};

export default useFirebaseEditor;