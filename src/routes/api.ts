import { Hono } from "hono";
import apiLeaderboard from "./api/leaderboard";


// Define api routes
const routesApi = new Hono()
    .route('/leaderboard', apiLeaderboard);


export default routesApi;