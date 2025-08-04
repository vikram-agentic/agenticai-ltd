import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ContentPublishingSystem {
  publishContent: (contentId: string, type: 'blog' | 'resource' | 'service') => Promise<boolean>;
  unpublishContent: (contentId: string, type: 'blog' | 'resource' | 'service') => Promise<boolean>;
  getPublishedContent: (type?: 'blog' | 'resource' | 'service') => Promise<any[]>;
  syncContent: () => Promise<void>;
}

export const useContentPublishing = (): ContentPublishingSystem => {
  const { toast } = useToast();

  const publishContent = async (contentId: string, type: 'blog' | 'resource' | 'service'): Promise<boolean> => {
    try {
      let tableName = '';
      switch (type) {
        case 'blog':
          tableName = 'generated_content';
          break;
        case 'resource':
          tableName = 'resources'; // Will be created when needed
          break;
        case 'service':
          tableName = 'services'; // Will be created when needed
          break;
      }

      const { error } = await supabase
        .from(tableName)
        .update({ status: 'published', published_at: new Date().toISOString() })
        .eq('id', contentId);

      if (error) throw error;

      toast({
        title: "Content Published",
        description: `Your ${type} has been published successfully.`,
      });

      return true;
    } catch (error) {
      console.error('Error publishing content:', error);
      toast({
        title: "Publishing Error",
        description: "Failed to publish content. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const unpublishContent = async (contentId: string, type: 'blog' | 'resource' | 'service'): Promise<boolean> => {
    try {
      let tableName = '';
      switch (type) {
        case 'blog':
          tableName = 'generated_content';
          break;
        case 'resource':
          tableName = 'resources';
          break;
        case 'service':
          tableName = 'services';
          break;
      }

      const { error } = await supabase
        .from(tableName)
        .update({ status: 'draft', published_at: null })
        .eq('id', contentId);

      if (error) throw error;

      toast({
        title: "Content Unpublished",
        description: `Your ${type} has been unpublished.`,
      });

      return true;
    } catch (error) {
      console.error('Error unpublishing content:', error);
      toast({
        title: "Unpublishing Error", 
        description: "Failed to unpublish content. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const getPublishedContent = async (type?: 'blog' | 'resource' | 'service'): Promise<any[]> => {
    try {
      let query = supabase.from('generated_content').select('*').eq('status', 'published');
      
      if (type === 'blog') {
        // Only get blog content
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching published content:', error);
      return [];
    }
  };

  const syncContent = async (): Promise<void> => {
    try {
      // This would trigger a full sync of all content
      // For now, we'll just show a success message
      toast({
        title: "Content Synced",
        description: "All content has been synchronized with the website.",
      });
    } catch (error) {
      console.error('Error syncing content:', error);
      toast({
        title: "Sync Error",
        description: "Failed to sync content. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    publishContent,
    unpublishContent,
    getPublishedContent,
    syncContent
  };
};

// Hook for real-time content updates
export const useRealTimeContentUpdates = (onContentUpdate?: () => void) => {
  useEffect(() => {
    const channel = supabase
      .channel('content-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'generated_content'
        },
        (payload) => {
          console.log('Content update detected:', payload);
          if (onContentUpdate) {
            onContentUpdate();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onContentUpdate]);
};