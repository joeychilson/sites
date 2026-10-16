import handler from '@tanstack/react-start/server-entry';

// public/_headers covers static files only, so pages the Worker renders, like 404s, get them here.
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
};

export default {
  async fetch(request) {
    const response = await handler.fetch(request);
    // Copied, because a redirect's headers can't be changed.
    const secured = new Response(response.body, response);
    for (const [name, value] of Object.entries(securityHeaders)) {
      secured.headers.set(name, value);
    }
    return secured;
  },
} satisfies ExportedHandler<Env>;
