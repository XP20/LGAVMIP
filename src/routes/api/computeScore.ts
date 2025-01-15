import { Hono } from "hono";

const apiScore = new Hono()
    .post('/', async (c) => {
        const body = await c.req.json();
        const {distance} = body;
        const maxScore = 1000; //score value at 0 meters/100% accurate guess
        const punishmentFactor = 5; //controls how quickly the score drops off with inaccuracy, the closer to 0, the more punishing
        const writtenDistance = (distance / (distance > 5000 ? 1000 : 1)).toFixed(2);
        let tempScore = maxScore/((distance/(maxScore*punishmentFactor))+1); // asymptotically goes down to 0 as distance from real guess tends to infinity, gives too high of a score for shitty guesses so need a secondary factor to take care of far-guess edge cases
        tempScore = tempScore - Math.pow(distance, 5)*Math.pow(10, -2*punishmentFactor); // high-order power that pulls down the score at extreme distances
        if (tempScore<0) tempScore=0;
        let score = Math.ceil(tempScore);
        if (distance<50) score = 1000;

        const a = {score:score};
        return c.json(a);
    });

export default apiScore;