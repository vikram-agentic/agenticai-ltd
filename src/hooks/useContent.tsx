import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useRealTimeContentUpdates } from './useContentPublishing';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  status: 'published' | 'draft';
  created_at: string;
  updated_at: string;
  slug: string;
  meta_description?: string;
  featured_image_url?: string;
  categories?: string[];
  seo_tags?: string[];
}

export interface Resource {
  id: string;
  title: string;
  category: string;
  status: 'published' | 'draft';
  slug: string;
  description?: string;
  image?: string;
  created_at: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'inactive';
  slug: string;
  image?: string;
  created_at: string;
}

export const useContent = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('generated_content')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform data to match BlogPost interface
      const transformedData: BlogPost[] = (data || []).map(item => ({
        ...item,
        status: item.status as 'published' | 'draft'
      }));
      
      setBlogPosts(transformedData);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    }
  };

  const fetchResources = async () => {
    try {
      // Since we don't have a resources table yet, we'll use placeholder data
      // This will be replaced when the resources table is created
      const mockResources: Resource[] = [
        {
          id: '1',
          title: 'Enterprise RAG Implementation Guide',
          category: 'Guide',
          status: 'published',
          slug: 'enterprise-rag-guide',
          description: 'Complete guide to implementing production-ready RAG systems',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'AI Cost Optimization Strategies',
          category: 'Report',
          status: 'published',
          slug: 'ai-cost-optimization',
          description: 'Best practices for reducing AI infrastructure costs',
          created_at: new Date().toISOString()
        }
      ];
      setResources(mockResources);
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };

  const fetchServices = async () => {
    try {
      // Since we don't have a services table yet, we'll use placeholder data
      const mockServices: Service[] = [
        {
          id: '1',
          title: 'Custom AI Development',
          description: 'End-to-end AI solutions tailored to your needs',
          status: 'active',
          slug: 'custom-ai-development',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'AI Agent & Automation',
          description: 'Intelligent agents for complex workflows',
          status: 'active',
          slug: 'ai-agent-automation',
          created_at: new Date().toISOString()
        }
      ];
      setServices(mockServices);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const refreshContent = async () => {
    setLoading(true);
    await Promise.all([
      fetchBlogPosts(),
      fetchResources(),
      fetchServices()
    ]);
    setLoading(false);
  };

  useEffect(() => {
    refreshContent();
  }, []);

  // Set up real-time updates
  useRealTimeContentUpdates(() => {
    refreshContent();
  });

  return {
    blogPosts,
    resources,
    services,
    loading,
    refreshContent
  };
};