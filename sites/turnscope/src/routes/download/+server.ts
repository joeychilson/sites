import { redirect } from '@sveltejs/kit';
import { latestDownload } from '#lib/server/release.js';

/** Always the latest disk image, so the link can be shared and never goes stale. */
export async function GET() {
  redirect(302, await latestDownload(), { external: ['https://github.com'] });
}
