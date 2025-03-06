import { describe, expect, test } from "bun:test";
import app from '../../index';

describe("api/computeScore", () => {
    test("apiScore", async () => {
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
        expect(score).toBe(980);
    });
});
