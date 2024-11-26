import { Hono } from "hono";
import apiLeaderboard from "./api/leaderboard";
import apiScore from "./api/computeScore";


// Define api routes
const routesApi = new Hono()
    .route('/leaderboard', apiLeaderboard)
    .route('/score', apiScore);


export default routesApi;