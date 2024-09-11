import { Hono } from "hono";


// Define api routes
const routesApi = new Hono()
    .get('/test', (c) => c.text('Test api route'))


export default routesApi;