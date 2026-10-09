import { defineRailway, github, project, service } from 'railway/iac';

const source = github('joeychilson/sites', { branch: 'main', checkSuites: true });

function site(name: string, domain: string) {
  return service(name, {
    source,
    build: {
      buildCommand: `bun run --filter ${name} build`,
      watchPatterns: [`/sites/${name}/**`, '/package.json', '/bun.lock', '/bunfig.toml'],
    },
    start: `bun sites/${name}/build`,
    healthcheck: '/',
    domains: [domain],
    env: {
      HOST_HEADER: 'x-forwarded-host',
    },
  });
}

export default defineRailway(() => {
  return project('sites', {
    resources: [site('joeychilson', 'joeychilson.com'), site('turnscope', 'turnscope.app')],
  });
});
