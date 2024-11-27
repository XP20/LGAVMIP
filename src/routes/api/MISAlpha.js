const { Hono } = require('hono');

// In-memory data store
const dataStore = [];

const apiMP = new Hono()
    .post('/', async (c) => {
        const body = await c.req.json();
        const { id, score } = body;
        let winState = 0;
        let recieveTime = Date.now()
        dataStore[id] = [score, winState, recieveTime];
        // Create a response message
        const message = `Stored score for ID ${id}: ${score}`;
        const response = { message, scores: dataStore[id] };

        return c.json(response);
    })
    .get('/:id', async (c) => {
        const id = parseInt(c.req.param('id'));
        if (Date.now()-dataStore[id][2]>10000) dataStore[id][0] = undefined; //timeout if connection lost
        const score = dataStore[id][0];
        return c.json({ id, score });
    });

export default apiMP;
