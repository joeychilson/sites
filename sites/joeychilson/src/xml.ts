const entities: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
};

export function escapeXml(text: string): string {
  return text.replace(/[&<>"']/g, (char) => entities[char]);
}

export function xmlResponse(body: string, contentType: string): Response {
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n${body}`, {
    headers: {
      'Content-Type': `${contentType}; charset=utf-8`,
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
