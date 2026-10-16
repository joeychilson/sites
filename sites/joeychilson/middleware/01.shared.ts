import { defineMiddleware } from 'void';

declare module 'void' {
  interface CloudContextVariables {
    shared: { path: string };
  }
}

// The layout makes the name a heading on the home page and a link home everywhere else.
export default defineMiddleware(async (c, next) => {
  c.set('shared', { path: c.req.path });
  await next();
});
