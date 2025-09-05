
import { createClient } from 'contentful';

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
});

export async function fetchFAQs() {
  const res = await client.getEntries({ content_type: 'faq' });
  return res.items;
}