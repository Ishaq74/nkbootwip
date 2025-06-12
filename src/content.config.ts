// src/content.config.ts
import { defineCollection } from 'astro:content';
import { supabase } from './lib/supabase';

async function loadSiteIdentity() {
  const { data, error } = await supabase.from('siteidentity').select('*');
  if (error) {
    console.error('Erreur loading siteidentity:', error);
    return [];
  }
  return data.map(item => ({
    id: item.id,
    slug: item.nom_site.toLowerCase().replace(/\s+/g, '-'),
    body: '',
    data: item,
  }));
}

async function loadDesign() {
  const { data, error } = await supabase.from('design').select('*');
  if (error) {
    console.error('Erreur loading design:', error);
    return [];
  }
  return data.map(item => ({
    id: item.id,
    slug: item.nom_du_theme.toLowerCase().replace(/\s+/g, '-'),
    body: '',
    data: item,
  }));
}

async function loadOrganizations() {
  const { data, error } = await supabase.from('organizations').select('*');
  if (error) {
    console.error('Erreur loading organizations:', error);
    return [];
  }
  return data.map(item => ({
    id: item.id,
    slug: item.name.toLowerCase().replace(/\s+/g, '-'),
    body: '',
    data: item,
  }));
}

async function loadUsers() {
  const { data, error } = await supabase.from('users').select('*');
  if (error) {
    console.error('Erreur loading users:', error);
    return [];
  }
  return data.map(item => ({
    id: item.id,
    slug: item.User.toLowerCase(),
    body: '',
    data: item,
  }));
}

export const collections = {
  siteidentity: defineCollection({ loader: loadSiteIdentity }),
  design: defineCollection({ loader: loadDesign }),
  organizations: defineCollection({ loader: loadOrganizations }),
  users: defineCollection({ loader: loadUsers }),
};
