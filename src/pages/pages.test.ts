import { describe, expect, test, beforeAll } from "bun:test";
import app from "../index";

const URL = 'http://127.0.0.1:3000/';
const DOCTYPE = 'text/html';


describe("pages/index.html", async () => {
    const req = new Request(URL, { method: 'GET' });
    const res = await fetch(req);
    const html = await res.text();

    const dom_parser = new DOMParser();
    const doc = dom_parser.parseFromString(html, DOCTYPE);

    test("Start", async () => {
        const start = doc.querySelector('[data-testid="start"]');

        expect(start instanceof HTMLAnchorElement).toBeTrue();
        expect(start.href).toBe("/start");
    });

    test("Leaderboard", async () => {
        const leaderboard = doc.querySelector('[data-testid="leaderboard"]');

        expect(leaderboard instanceof HTMLButtonElement).toBeTrue();
        expect(leaderboard.onclick).toBeDefined();
    });
});
