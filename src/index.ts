import { serve } from 'bun';
import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';

// Initialize Hono app
const app = new Hono();

// Serve public directory
app.use('/public/*', serveStatic({ root: './' }));

// Serve pages
app.get('/', serveStatic({ path: './pages/index.html' }));

// Open on port
serve({
  fetch: app.fetch,
  port: 3000,
});
