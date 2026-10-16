import { defineHandler } from 'void';

import { latestDownload } from '../src/server/release';

export const GET = defineHandler(async (c) => c.redirect(await latestDownload(), 302));
