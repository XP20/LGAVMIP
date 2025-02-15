import { Hono } from "hono";
import Database from "../../database/database";
import { leaderboard } from "../../database/tables";


// Define api routes
const apiLeaderboard = new Hono()
    .post('/', async (c) => {
        const body = await c.req.json();
        const { from, limit, reversed } = body;
        const entries = (await Database.db.select().from(leaderboard));
        const filtered_entries = entries.slice(from, from + limit);
        return c.json(reversed ? entries : entries.reverse());
    })
    .post('/insert', async (c) => {
        const body = await c.req.json();
        let { username, score } = body;
        score = parseInt(score);
        if (score>5000 || score<0) {
            username = 'Klauns';
            score = -2147483648;
        }
        await Database.db.insert(leaderboard).values({username:username, score:parseInt(score)});
    });


export default apiLeaderboard;