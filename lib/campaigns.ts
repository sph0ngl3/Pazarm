import { supabase } from './supabaseClient';
import { Campaign } from '@/types';

export async function fetchActiveCampaigns(): Promise<Campaign[]> {
  const now = new Date().toISOString();
  
  // Fetch active campaigns
  // Logic: is_active = true AND (start_date <= now OR null) AND (end_date >= now OR null)
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('is_active', true)
    .order('priority', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching campaigns:', error);
    return [];
  }

  // Filter dates in JS if needed (Supabase filters can be complex for null dates)
  return (data || []).filter(c => {
    const startOk = !c.start_date || new Date(c.start_date) <= new Date();
    const endOk = !c.end_date || new Date(c.end_date) >= new Date();
    return startOk && endOk;
  });
}

export async function fetchCampaignById(id: string): Promise<Campaign | null> {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching campaign:', error);
    return null;
  }

  return data;
}
