import { error } from '@sveltejs/kit';
import * as v from 'valibot';
import { dev } from '$app/env';
import { prerender } from '$app/server';
import { findPost, listPosts } from '#lib/server/posts.js';

/** Newest first. Drafts and posts dated in the future show only in development. */
export const getPosts = prerender(() => listPosts({ drafts: dev }));

export const getPost = prerender(v.string(), async (slug) => {
  const post = await findPost(slug, { drafts: dev });
  if (!post) error(404, 'Not found');
  return post;
});
