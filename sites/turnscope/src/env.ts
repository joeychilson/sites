import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
  GITHUB_TOKEN: {
    description:
      'A GitHub token for reading the latest release, raising the API’s limit from 60 calls an hour, shared by everyone behind the same address. Optional.',
    schema: (value) => value || undefined,
  },
});
