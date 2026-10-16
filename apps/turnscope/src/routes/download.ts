import { createFileRoute } from '@tanstack/react-router';

import { latestDownload } from '@/lib/release.server';

export const Route = createFileRoute('/download')({
  server: {
    handlers: {
      GET: async () => Response.redirect(await latestDownload(), 302),
    },
  },
});
