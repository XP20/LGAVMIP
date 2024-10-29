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
        return c.json(reversed ? entries.reverse() : entries);
    });


export default apiLeaderboard;