import { notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

import { findPost, listPosts } from '@/lib/posts.server';

export const getPosts = createServerFn({ method: 'GET' }).handler(() => listPosts());

export const getPost = createServerFn({ method: 'GET' })
  .validator(z.object({ slug: z.string() }))
  .handler(({ data }) => {
    const post = findPost(data.slug);
    if (!post) {
      throw notFound();
    }
    return post;
  });
