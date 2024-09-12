import { Hono } from "hono";
import { serveStatic } from 'hono/bun';


// Define page routes
const routesPages = new Hono()
    .get('/', serveStatic({ path: './src/pages/index.html' }))
    .get('/start', serveStatic({ path: './src/pages/start.html' }))


export default routesPages;