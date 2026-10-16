import { defineEnv, string } from 'void/env';

export default defineEnv({
  // Raises GitHub's limit above 60 requests an hour for the download link. Optional.
  GITHUB_TOKEN: string().optional(),
});
