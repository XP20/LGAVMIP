import { describe, expect, test, beforeAll } from "bun:test";
import app from '../../index';

describe("api/computeScore", () => {
    test("apiScore works", async () => {
        const req = new Request('localhost:3000/api/score', {
            method: 'POST',
            body: JSON.stringify({
                distance: 100,
                gamemode: 0
            }),
        });
        const res = await app.fetch(req);
        const { score } = await res.json();

        expect(res.status).toBe(200);
        expect(score).toBe(991);
    });

    test("returns 1000 for distance under 50", async () => {
        const req = new Request('localhost:3000/api/score', {
            method: 'POST',
            body: JSON.stringify({
                distance: 25,
                gamemode: 2
            }),
        });
        const res = await app.fetch(req);
        const { score } = await res.json();

        expect(res.status).toBe(200);
        expect(score).toBe(1000);
    });
});
