import { Document } from "@contentful/rich-text-types";

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
  ingress: {
    json: Document;
  } | null;
  content: {
    json: Document;
  } | null;
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
    json
  }
  content {
    json
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

export async function getPage(slug: string, preview?: boolean) {
  const entry = await fetchGraphQL(
    `query {
      pageCollection(
        where: { slug: "${slug}" },
        preview: ${preview ? "true" : "false"},
        limit: 1
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
  excerpt: {
    json: Document;
  } | null;
  content: {
    json: Document;
  } | null;
  heroImage: Asset | null;
  // imageGallery: Asset[] | null;
  // author: Entry | null;
}

const BLOG_POST_GRAPHQL_FIELDS = `
  title
  slug
  date
  excerpt {
    json
  }
  content {
    json
  }
  heroImage {
    ${ASSET_GRAPHQL_FIELDS}
  }
`;

function extractBlogPost(fetchResponse: any) {
  return fetchResponse?.data?.blogPostCollection?.items?.[0] as BlogPost;
}

function extractBlogPosts(fetchResponse: any) {
  return fetchResponse?.data?.blogPostCollection?.items as BlogPost[];
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

export async function getBlogPosts(limit?: number, preview?: boolean) {
  const entries = await fetchGraphQL(
    `query {
      blogPostCollection(
        order: date_DESC,
        limit: ${limit ? "null" : limit},
        preview: ${preview ? "true" : "false"}
      ) {
        items {
          ${BLOG_POST_GRAPHQL_FIELDS}
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
