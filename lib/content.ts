import { supabase } from './supabaseClient';
import { ContentBlock } from '@/types';

// Simple in-memory cache to avoid re-fetching static content too often
const contentCache: Record<string, ContentBlock> = {};

export async function getContentBlock(key: string): Promise<ContentBlock | null> {
  if (contentCache[key]) {
    return contentCache[key];
  }

  const { data, error } = await supabase
    .from('content_blocks')
    .select('*')
    .eq('key', key)
    .single();

  if (error) {
    console.error(`Error fetching content block '${key}':`, error);
    return null;
  }

  if (data) {
    contentCache[key] = data;
    return data;
  }

  return null;
}
