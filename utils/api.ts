/* Pages */

import internal from "stream";

export interface Page {
  title: string;
  pageName: string;
  pageType: string;
  pageContent: string;
  ingress: string;
  heroImage: {
    url: string;
    description: string;
  };
  weight: number;
}

const PAGE_GRAPHQL_FIELDS = `
    title
    pageName
    pageType
    pageContent
    ingress
    heroImage {
        url
        description
    }
    weight
  `;

/* Blog Posts*/

export interface Post {
  slug: string;
  articleTitle: string;
  articleHeroImage: {
    url: string;
    fileName: string;
  };
  date: string;
  articleContent: string;
}

const POST_GRAPHQL_FIELDS = `
    slug
    articleTitle
    articleHeroImage {
    url
    fileName
    }
    date
    articleContent
`;

/*
TODO:

author {
  name
  image {
    url
  }
}
articleContent {
  json
  links {
    assets {
      block {
        sys {
          id
        }
        url
        description
      }
    }
  }
}
*/

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

/* Pages */

function extractPage(fetchResponse: any) {
  return fetchResponse?.data?.pageCollection?.items?.[0] as Page;
}

function extractPageEntries(fetchResponse: any) {
  return fetchResponse?.data?.pageCollection?.items as Page[];
}

export async function getAllPages() {
  const entries = await fetchGraphQL(
    `query {
          pageCollection(order: weight_ASC) {
              items {
                  ${PAGE_GRAPHQL_FIELDS}
              }
          }
      }`
  );

  return extractPageEntries(entries);
}

/* Blog posts */

function extractPost(fetchResponse: any) {
  return fetchResponse?.data?.blogPostCollection?.items?.[0] as Post;
}

function extractPostEntries(fetchResponse: any) {
  return fetchResponse?.data?.blogPostCollection?.items as Post[];
}

export async function getPreviewPostBySlug(slug: string) {
  console.log("SLUG", slug);
  const entry = await fetchGraphQL(
    `query {
        blogPostCollection(where: { slug: "${slug}" }, preview: true, limit: 1) {
            items {
                ${POST_GRAPHQL_FIELDS}
            }
        }
    }`,
    true
  );

  console.log("ENTRY", entry);

  return extractPost(entry);
}

export async function getAllPostsWithSlug() {
  const entries = await fetchGraphQL(
    `query {
        blogPostCollection(where: { slug_exists: true }, order: date_DESC) {
            items {
                ${POST_GRAPHQL_FIELDS}
            }
        }
    }`
  );

  return extractPostEntries(entries);
}

export async function getAllPostsForHome(preview: boolean) {
  const entries = await fetchGraphQL(
    `query {
        blogPostCollection(order: date_DESC, preview: ${
          preview ? "true" : "false"
        }) {
            items {
                ${POST_GRAPHQL_FIELDS}
            }
        }
    }`,
    preview
  );

  return extractPostEntries(entries);
}

export async function getPostAndMorePosts(slug: string, preview: boolean) {
  const entry = await fetchGraphQL(
    `query {
        blogPostCollection(where: { slug: "${slug}" }, preview: ${
      preview ? "true" : "false"
    }, limit: 1) {
            items {
                ${POST_GRAPHQL_FIELDS}
            }
        }
    }`,
    preview
  );

  const entries = await fetchGraphQL(
    `query {
        blogPostCollection(where: { slug_not_in: "${slug}" }, order: date_DESC, preview: ${
      preview ? "true" : "false"
    }, limit: 2) {
            items {
                ${POST_GRAPHQL_FIELDS}
            }
        }
    }`,
    preview
  );

  return {
    post: extractPost(entry),
    morePosts: extractPostEntries(entries),
  };
}
