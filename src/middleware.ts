// DANS : src/middleware.ts

import { getCollection } from 'astro:content';
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  
  // 1. Récupérer l'identité du site (on suppose qu'il n'y en a qu'une)
  const siteidentityEntries = await getCollection('siteidentity');
  const siteEntry = siteidentityEntries.length > 0 ? siteidentityEntries[0] : null;

  // Si aucune identité de site n'est trouvée, on initialise tout à null/vide
  if (!siteEntry) {
    context.locals.site = null;
    context.locals.org = {};
    context.locals.allOrgs = [];
    context.locals.design = null;
    return next();
  }

  // 2. Récupérer en parallèle toutes les organisations et tous les designs
  const [allOrgsEntries, allDesignsEntries] = await Promise.all([
    getCollection('organizations'),
    getCollection('design')
  ]);

  // 3. Filtrer et extraire les données des organisations liées à ce site
  const allOrgsData = allOrgsEntries
    .filter(entry => entry.data.data.siteidentity_id === siteEntry.id)
    .map(entry => entry.data.data);

  // 4. Déterminer l'organisation principale
  let mainOrgData = {};
  if (allOrgsData.length > 0) {
    // Essayer de trouver l'organisation nommée 'nkboot'
    const specificOrg = allOrgsData.find(o => o.name === 'nkboot');
    // Sinon, prendre la première de la liste comme fallback
    mainOrgData = specificOrg || allOrgsData[0];
  }

  // 5. Trouver le design lié à ce site
  const designEntry = allDesignsEntries.find(entry => entry.data.data.siteidentity_id === siteEntry.id);
  const designData = designEntry ? designEntry.data.data : null;

  // 6. Stocker toutes les données dans context.locals
  context.locals.site = siteEntry.data;
  context.locals.org = mainOrgData;
  context.locals.allOrgs = allOrgsData;
  context.locals.design = designData;

  // 7. Passer au rendu de la page
  return next();
});