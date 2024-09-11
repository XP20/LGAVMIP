import { serve } from 'bun';
import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import routesPages from './routes/pages';
import routesApi from './routes/api';

const PORT = 3000;


// Initialize Hono app
const app = new Hono();

// Serve public directory
app.use('/public/*', serveStatic({ root: './' }));

// Serve routes
app.route('/', routesPages);
app.route('/api', routesApi);

export default {
  fetch: app.fetch,
  port: PORT,
};
