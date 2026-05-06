/**
 * Supabase Mock Client for Kitobi.io
 * This file is prepared for future Supabase integration.
 * For now, it uses localStorage to simulate a database.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

let supabaseClient: any = null;

export const getSupabase = () => {
  if (!supabaseClient && supabaseUrl && supabaseAnonKey) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseClient;
};

export type UserPlan = 'Gratuit' | 'Pro' | 'Entreprise';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  plan: UserPlan;
  usage_count: number;
  last_usage_reset: string;
  tool_usage: Record<string, number>;
  is_admin?: boolean;
}

const MOCK_USER_KEY = 'kitobi_user_profile';

export const getMockUser = (): UserProfile | null => {
  const saved = localStorage.getItem(MOCK_USER_KEY);
  if (!saved) return null;
  
  const user = JSON.parse(saved) as UserProfile;
  if (!user.tool_usage) user.tool_usage = {};
  
  const lastReset = new Date(user.last_usage_reset);
  const now = new Date();
  if (lastReset.toDateString() !== now.toDateString()) {
    user.usage_count = 0;
    user.last_usage_reset = now.toISOString();
    saveMockUser(user);
  }
  
  return user;
};

export const saveMockUser = async (user: UserProfile) => {
  localStorage.setItem(MOCK_USER_KEY, JSON.stringify(user));
  
  // If Supabase is configured, we could sync here
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase
        .from('profiles')
        .upsert({ 
          id: user.id, 
          email: user.email, 
          plan: user.plan, 
          usage_count: user.usage_count,
          tool_usage: user.tool_usage,
          last_usage_reset: user.last_usage_reset
        });
    } catch (error) {
      console.error('Supabase Sync Error:', error);
    }
  }
};

export const mockLogin = (email: string, name?: string): UserProfile => {
  const existing = getMockUser();
  if (existing && existing.email === email) return existing;
  
  const newUser: UserProfile = {
    id: Math.random().toString(36).substring(7),
    email,
    full_name: name || email.split('@')[0],
    avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    plan: 'Gratuit',
    usage_count: 0,
    last_usage_reset: new Date().toISOString(),
    tool_usage: {},
    is_admin: email.includes('admin'),
  };
  
  saveMockUser(newUser);
  return newUser;
};

export const mockLogout = () => {
  localStorage.removeItem(MOCK_USER_KEY);
};

export const upgradePlan = (plan: UserPlan): UserProfile | null => {
  const user = getMockUser();
  if (!user) return null;
  
  user.plan = plan;
  saveMockUser(user);
  return user;
};

export const incrementUsage = (toolId: string, isApiTool: boolean = false, toolTier: 'Free' | 'Pro' | 'Entreprise' = 'Free'): { allowed: boolean; count: number; limit: number; isTrialEnd?: boolean; needsUpgrade?: boolean } => {
  const user = getMockUser();
  if (!user) return { allowed: true, count: 0, limit: Infinity };
  
  const planHierarchy = { 'Gratuit': 0, 'Pro': 1, 'Entreprise': 2 };
  const tierHierarchy = { 'Free': 0, 'Pro': 1, 'Entreprise': 2 };
  
  const userLevel = planHierarchy[user.plan];
  const toolLevel = tierHierarchy[toolTier];
  
  if (userLevel < toolLevel) {
    if (user.plan === 'Gratuit' && isApiTool) {
      const toolCount = user.tool_usage[toolId] || 0;
      if (toolCount >= 3) {
        return { allowed: false, count: toolCount, limit: 3, isTrialEnd: true, needsUpgrade: true };
      }
      user.tool_usage[toolId] = toolCount + 1;
      saveMockUser(user);
      return { allowed: true, count: user.tool_usage[toolId], limit: 3 };
    }
    
    return { allowed: false, count: 0, limit: 0, needsUpgrade: true };
  }

  if (user.plan !== 'Gratuit') {
    return { allowed: true, count: 0, limit: Infinity };
  }

  const dailyLimit = 5;
  if (user.usage_count >= dailyLimit) {
    return { allowed: false, count: user.usage_count, limit: dailyLimit };
  }
  
  user.usage_count += 1;
  saveMockUser(user);
  return { allowed: true, count: user.usage_count, limit: dailyLimit };
};
