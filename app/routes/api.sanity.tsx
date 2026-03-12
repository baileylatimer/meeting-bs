import { json } from "@remix-run/node";
import { createClient } from '@sanity/client';

// Sanity client is created lazily inside the loader to avoid
// module-level validation errors when env vars are not set.
function getSanityClient() {
  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET;

  if (!projectId || !dataset) {
    throw new Error('Sanity env vars SANITY_PROJECT_ID and SANITY_DATASET are required');
  }

  return createClient({
    projectId,
    dataset,
    useCdn: process.env.NODE_ENV === 'production',
    apiVersion: '2023-05-03',
  });
}

export async function loader() {
  try {
    const sanityClient = getSanityClient();

    const query = `*[_type == "project"]{
      _id,
      title,
      "slug": slug.current,
      excerpt,
      client,
      projectDate,
      technologies,
      "mainImageUrl": mainImage.asset->url
    }`;

    const projects = await sanityClient.fetch(query);

    if (!projects) {
      console.warn('No projects found in Sanity');
      return json([]);
    }

    return json(projects);
  } catch (error) {
    console.error('Error in Sanity API route:', {
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    });

    return json({
      error: 'Failed to fetch projects',
      details: error instanceof Error ? error.message : 'Unknown error occurred',
    }, { status: 500 });
  }
}
