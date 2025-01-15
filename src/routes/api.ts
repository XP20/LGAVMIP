import { Hono } from "hono";
import apiLeaderboard from "./api/leaderboard";
import apiScore from "./api/computeScore";
import apiLocation from "./api/location";


// Define api routes
const routesApi = new Hono()
    .route('/leaderboard', apiLeaderboard)
    .route('/score', apiScore)
    .route('/location', apiLocation);


export default routesApi;