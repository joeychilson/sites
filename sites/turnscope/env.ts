import { defineEnv, string } from 'void/env';

export default defineEnv({
  // Optional: raises GitHub's API limit above 60 requests an hour for the download redirect.
  GITHUB_TOKEN: string().optional(),
});
