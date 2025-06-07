import { defineCollection, reference, z } from 'astro:content';

const organizations = defineCollection({
  schema: z.object({
    name: z.string(),
    alternateName: z.array(z.string()).optional(),
    description: z.string().optional(),
    url: z.string().optional(),
    logo: z.string().optional(),
    image: z.string().optional(),
    email: z.string().email().optional(),
    telephone: z.string().optional(),
    faxNumber: z.string().optional(),

    address: z.object({
      streetAddress: z.string(),
      addressLocality: z.string(),
      addressRegion: z.string().optional(),
      postalCode: z.string(),
      addressCountry: z.string(),
    }).optional(),

    contactPoint: z.array(z.object({
      contactType: z.string(),
      telephone: z.string().optional(),
      email: z.string().email().optional(),
      hoursAvailable: z.string().optional(),
    })).optional(),

    founder: z.string().or(z.array(z.string())).optional(),
    foundingDate: z.string().optional(),
    foundingLocation: z.string().optional(),

    legalName: z.string().optional(),
    siret: z.string().optional(),
    vatID: z.string().optional(),
    nafCode: z.string().optional(),

    numberOfEmployees: z.number().optional(),
    employee: z.array(z.string()).optional(),
    parentOrganization: z.string().optional(),
    subOrganization: z.array(z.string()).optional(),

    sameAs: z.array(z.string()).optional(),
    slogan: z.string().optional(),
    awards: z.array(z.string()).optional(),

    geo: z.object({
      latitude: z.number(),
      longitude: z.number(),
    }).optional(),

    defaultLang: z.string().optional(),
    siteUrl: z.string().optional(),
    defaultCanonicalUrl: z.string().optional(),

    logoAlt: z.string().optional(),
    footerText: z.string().optional(),

    navLinks: z.array(z.object({
    name: z.string(),
    url: z.string().optional(),
    icon: z.string().optional(),
    dropdown: z.boolean().optional(),
    children: z.array(z.object({
        name: z.string(),
        url: z.string(),
        icon: z.string().optional(),
    })).optional()
    })).optional(),

    socialMedia: z.array(z.object({
      name: z.string(),
      iconClass: z.string(),
      url: z.string(),
    })).optional(),
  }),
});

const profiles = defineCollection({
  type: "content",
  schema: z.object({
    name: z.string(),
    bio: z.string().optional(),
    avatar: z.string().optional(),
    email: z.string().email().optional(),
    role: z.string().optional(),
    social: z.array(z.object({
      name: z.string(),
      url: z.string(),
    })).optional(),
  }),
});

const comments = defineCollection({
  type: "data",
  schema: z.object({
    postId: reference("posts"),
    author: reference("profiles"),
    content: z.string(),
    createdAt: z.string(),
    approved: z.boolean().optional(),
  }),
});


const postcategories = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    image: z.string().optional(),
  }),
});



const posts = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    summary: z.string().optional(),
    category: reference("postcategories"),
    author: reference("profiles"),
    coverImage: z.string().optional(),
    tags: z.array(z.string()).optional(),
    pubDate: z.string(),
    updatedDate: z.string().optional(),
    draft: z.boolean().optional(),
    featured: z.boolean().optional(),
    RelatedContent: z.array(z.string()).optional(),
  }),
});


export const collections = {
  organizations,
  profiles,
  comments,
  postcategories,
  posts
};
