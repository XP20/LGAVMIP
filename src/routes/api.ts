import { Hono } from "hono";
import apiLeaderboard from "./api/leaderboard";
import apiScore from "./api/computeScore";
import apiMP from "./api/MISAlpha";
import apiLocation from "./api/location";
//import apiMP from "./api/MIS2"
import apiKML from "./api/customGamemode";


// Define api routes
const routesApi = new Hono()
    .route('/leaderboard', apiLeaderboard)
    .route('/MP', apiMP)
    .route('/score', apiScore)
    .route('/location', apiLocation)
    //.route('/mp', apiMP)
    //.route('/uploadKML', apiKML);


export default routesApi;