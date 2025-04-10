import { Hono } from "hono";
import { serveStatic } from 'hono/bun';


// Define page routes
const routesPages = new Hono()
    .get('/', serveStatic({ path: './src/pages/index.html' }))
    .get('/start', serveStatic({ path: './src/pages/start.html' }))
    .get('/result', serveStatic({ path: './src/pages/endscreen.html' }))
    .get('/gamemodes', serveStatic({path: './src/pages/gamemodeSelector.html'}))
    .get('/upload', serveStatic({path: './src/pages/kmlTest.html'}))


export default routesPages;
