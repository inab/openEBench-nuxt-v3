export default defineEventHandler((event) => {
  const url = event.node.req.url || '';
  if (url.startsWith('/_nuxt/') && url.endsWith('.js')) {
    event.node.res.setHeader('Content-Type', 'application/javascript');
  }
  if (url.startsWith('/_nuxt/') && url.endsWith('.css')) {
    event.node.res.setHeader('Content-Type', 'text/css');
  }
});
