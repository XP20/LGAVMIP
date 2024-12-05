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
        let score;
        if (dataStore[id]!=undefined) {
            score = dataStore[id][0];
            if (Date.now()-dataStore[id][2]>10000) {
                dataStore[id] = undefined; //timeout if connection lost
                score = undefined;
            }
        } else score = undefined;
        return c.json({ id, score });
    })
    .get('/assignid/:id', async (c) => { //Why the fuck doesnt this work if it's just /assignid/? needs a fake id that diesn't get used otherwise frontend sees id:undefined rather than assignedID:(id) 
        let assignedID;
        for (let index = 0; index < dataStore.length+1; index++) {
            if (dataStore[index] == undefined) {
                assignedID = index;
                break;
            }
        }
        return c.json({assignedID});
    });

export default apiMP;
