const { Hono } = require('hono');

// In-memory data store
const dataStore = [];

const apiMP = new Hono()
    .post('/', async (c) => {
        const body = await c.req.json();
        const { id, score } = body;
        dataStore[id] = score;

        // Create a response message
        const message = `Stored score for ID ${id}: ${score}`;
        const response = { message, scores: dataStore[id] };

        return c.json(response);
    })
    .get('/:id', async (c) => {
        const id = parseInt(c.req.param('id'));

        // Retrieve scores for the given ID
        const score = dataStore[id];

        return c.json({ id, score });
    });

export default apiMP;
