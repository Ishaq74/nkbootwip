/// <reference types="astro/client" />

import type { CollectionEntry } from 'astro:content';

declare namespace App {
  interface Locals {
    site: CollectionEntry<'siteidentity'>['data'] | null;
    org: CollectionEntry<'organizations'>['data']['data'] | {};
    allOrgs: CollectionEntry<'organizations'>['data']['data'][];
    design: CollectionEntry<'design'>['data']['data'] | null;
    allUsers: CollectionEntry<'users'>['data']['data'][]; 
  }
}