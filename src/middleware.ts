// DANS : src/middleware.ts

import { getCollection } from 'astro:content';
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  
  // Fonction utilitaire sécurisée pour récupérer les collections
  const getAndCleanCollection = async (collectionName) => {
    try {
      const entries = await getCollection(collectionName);
      return entries.filter(entry => entry && entry.data);
    } catch (e) {
      console.error(`[Middleware] Collection "${collectionName}" introuvable ou erreur de lecture:`, e);
      return [];
    }
  };

  // 1. CHARGEMENT DE TOUTES LES COLLECTIONS EN PARALLÈLE
  const [
    siteidentityEntries, 
    organizationsEntries, 
    usersEntries, 
    postsEntries, 
    postcategoriesEntries,
    designsEntries
  ] = await Promise.all([
    getAndCleanCollection('siteidentity'),
    getAndCleanCollection('organizations'),
    getAndCleanCollection('users'),
    getAndCleanCollection('posts'),
    getAndCleanCollection('postcategories'),
    getAndCleanCollection('design'),
  ]);

  // 2. DÉFINITION DU SITE ACTUEL
  const siteEntry = siteidentityEntries.length > 0 ? siteidentityEntries[0] : null;
  const siteId = siteEntry?.id;

  // Si aucun site n'est trouvé, on arrête et on initialise des valeurs vides
  if (!siteId) {
    context.locals.site = null;
    context.locals.org = {};
    context.locals.allOrgs = [];
    context.locals.design = null;
    context.locals.allUsers = [];
    context.locals.allPosts = [];
    context.locals.allPostCategories = [];
    return next();
  }

  // --- FILTRAGE COHÉRENT DE TOUTES LES DONNÉES PAR siteId ---

  // 3. Organisations
  const allOrgsFilteredEntries = organizationsEntries.filter(entry => entry.data.data.siteidentity_id === siteId);
  const allOrgsData = allOrgsFilteredEntries.map(entry => entry.data.data);
  let mainOrgData = allOrgsData.length > 0 ? (allOrgsData.find(o => o.name === 'nkboot') || allOrgsData[0]) : {};

  // 4. Utilisateurs
  const allUsersFilteredEntries = usersEntries.filter(entry => entry.data.data.siteidentity_id === siteId);

  // 5. Articles (Posts) - On suppose un champ siteidentity_id dans les posts
  const allPostsFilteredEntries = postsEntries.filter(entry => entry.data.siteidentity_id === siteId);

  // 6. Catégories d'articles (PostCategories) - On suppose un champ siteidentity_id dans les catégories
  const allPostCategoriesFilteredEntries = postcategoriesEntries.filter(entry => entry.data.siteidentity_id === siteId);

  // 7. Design
  const designEntry = designsEntries.find(entry => entry.data.data.siteidentity_id === siteId);
  const designData = designEntry ? designEntry.data.data : null;

  // --- INJECTION DES DONNÉES DANS context.locals ---

  context.locals.site = siteEntry.data;
  context.locals.org = mainOrgData;
  context.locals.allOrgs = allOrgsData;
  context.locals.design = designData;

  // On passe les listes d'entrées complètes et FILTRÉES au QueryLoop
  context.locals.allUsers = allUsersFilteredEntries;
  context.locals.allPosts = allPostsFilteredEntries;
  context.locals.allPostCategories = allPostCategoriesFilteredEntries;

  return next();
});