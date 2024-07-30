import { Document } from "@contentful/rich-text-types";
import { Config } from "./config";

export interface ContentWithLinks {
  json: Document;
  links: {
    assets: {
      block: {
        sys: {
          id: string;
        };
        url: string;
        title: string;
        width: string;
        height: string;
        description: string;
      }[];
    };
  };
}

const CONTENT_WITH_LINKS_FIELDS = `
  json
  links {
    assets {
      block {
        sys {
          id
        }
        url
        title
        width
        height
        description
      }
    }
  }
`;

/* Assets */

export interface Asset {
  url: string;
  description: string;
  title: string;
  fileName: string;
}

const ASSET_GRAPHQL_FIELDS = `
  url
  description
  title
  fileName
`;

/* Pages */

export interface Page {
  title: string;
  slug: string;
  ingress: ContentWithLinks | null;
  content: ContentWithLinks | null;
  heroImage: Asset | null;
  menuTitle: string;
  menuWeight: number;
  showInMenu: boolean;
  parentPage: {
    slug: string;
  } | null;
}

const PAGE_GRAPHQL_FIELDS = `
  title
  slug
  ingress {
    ${CONTENT_WITH_LINKS_FIELDS}
  }
  content {
    ${CONTENT_WITH_LINKS_FIELDS}
  }
  heroImage {
    ${ASSET_GRAPHQL_FIELDS}
  }
  menuTitle
  menuWeight
  showInMenu
  parentPage {
    slug
  }
`;

function extractPage(fetchResponse: any) {
  return fetchResponse?.data?.pageCollection?.items?.[0] as Page;
}

function extractPages(fetchResponse: any) {
  return fetchResponse?.data?.pageCollection?.items as Page[];
}

export async function getPages(preview?: boolean) {
  const entries = await fetchGraphQL(
    `query {
      pageCollection(
        order: sys_publishedAt_ASC,
      ) {
        items {
          ${PAGE_GRAPHQL_FIELDS}
        }
      }
    }`,
    preview
  );

  return extractPages(entries);
}

export async function getPageSlugs(preview?: boolean) {
  const entries = await fetchGraphQL(
    `query {
      pageCollection(
        order: sys_publishedAt_ASC,
      ) {
        items {
          slug
        }
      }
    }`,
    preview
  );

  return extractPages(entries);
}

export async function getPage(slug: string, preview?: boolean) {
  const entry = await fetchGraphQL(
    `query {
      pageCollection(
        where: { slug: "${slug}" },
        limit: 1,
        preview: ${preview ? "true" : "false"},
      ) {
        items {
          ${PAGE_GRAPHQL_FIELDS}
        }
      }
    }`,
    preview
  );

  return extractPage(entry);
}

/* Blog posts */

export interface BlogPost {
  title: string;
  slug: string;
  date: string;
  excerpt: ContentWithLinks | null;
  content: ContentWithLinks | null;
  heroImage: Asset | null;
  category: [String];

  // imageGallery: Asset[] | null;
  // author: Entry | null;
}

export interface BlogPostMetaData {
  total: number;
  skip: number;
  limit: number;
}

export interface BlogPostCollection {
  blogPosts: BlogPost[];
  metaData: BlogPostMetaData;
}

const BLOG_POST_GRAPHQL_FIELDS = `
  title
  slug
  date
  excerpt {
    ${CONTENT_WITH_LINKS_FIELDS}
  }
  content {
    ${CONTENT_WITH_LINKS_FIELDS}
  }
  heroImage {
    ${ASSET_GRAPHQL_FIELDS}
  }
  category
`;

function extractBlogPost(fetchResponse: any) {
  return fetchResponse?.data?.blogPostCollection?.items?.[0] as BlogPost;
}

function extractBlogPosts(fetchResponse: any) {
  return fetchResponse?.data?.blogPostCollection?.items as BlogPost[];
}

function extractBlogPostCollectionMetaData(fetchResponse: any) {
  return {
    total: fetchResponse?.data?.blogPostCollection?.total || 0,
    skip: fetchResponse?.data?.blogPostCollection?.skip || 0,
    limit: fetchResponse?.data?.blogPostCollection?.limit || 0,
  } as BlogPostMetaData;
}

export async function getBlogPost(slug: string, preview?: boolean) {
  const entry = await fetchGraphQL(
    `query {
      blogPostCollection(
        where: { slug: "${slug}" },
        preview: ${preview ? "true" : "false"},
        limit: 1
      ) {
        items {
          ${BLOG_POST_GRAPHQL_FIELDS}
        }
      }
    }`,
    preview
  );

  return extractBlogPost(entry);
}

export async function getBlogPostCollection(
  limit: number,
  preview?: boolean
): Promise<BlogPostCollection> {
  const data = await fetchGraphQL(
    `query {
      blogPostCollection(
        order: date_DESC,
        limit: ${limit},
        preview: ${preview ? "true" : "false"}
      ) {
        total
        items {
          ${BLOG_POST_GRAPHQL_FIELDS}
        }
      }
    }`,
    preview
  );

  const blogPosts = extractBlogPosts(data);
  const metaData = extractBlogPostCollectionMetaData(data);

  return {
    blogPosts,
    metaData,
  };
}

export async function getPaginatedBlogPostCollection(
  page: number,
  preview?: boolean
): Promise<BlogPostCollection> {
  const skip = page === 1 ? 0 : (page - 1) * Config.pagination.pageSize;

  const data = await fetchGraphQL(
    `query {
      blogPostCollection(
        order: date_DESC,
        limit: ${Config.pagination.pageSize},
        skip: ${skip},
        preview: ${preview ? "true" : "false"}
      ) {
        total
        items {
          ${BLOG_POST_GRAPHQL_FIELDS}
        }
      }
    }`,
    preview
  );

  const blogPosts = extractBlogPosts(data);
  const metaData = extractBlogPostCollectionMetaData(data);

  return {
    blogPosts,
    metaData,
  };
}

export async function getBlogPostSlugs(preview?: boolean) {
  const entries = await fetchGraphQL(
    `query {
      blogPostCollection(
        order: date_DESC,
        preview: ${preview ? "true" : "false"}
      ) {
        items {
          slug
        }
      }
    }`,
    preview
  );

  return extractBlogPosts(entries);
}

async function fetchGraphQL(query: Object, preview = false) {
  return fetch(
    `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          preview
            ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
            : process.env.CONTENTFUL_ACCESS_TOKEN
        }`,
      },
      body: JSON.stringify({ query }),
    }
  ).then((response) => response.json());
}
