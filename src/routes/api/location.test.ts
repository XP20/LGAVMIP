import {
  getLatviaBox,
  getRndInteger,
  getNextInt,
  getSeededInt,
  point_in_polygon,
  getCoords,
  pregenSingle
// @ts-ignore
} from './location.js';
import { describe, expect, test } from "bun:test";

export const squarePolygon = [
  { lat: 0, lng: 0 },
  { lat: 0, lng: 1 },
  { lat: 1, lng: 1 },
  { lat: 1, lng: 0 }
];

export const pointInside = { lat: 0.5, lng: 0.5 };
export const pointOutside = { lat: 2, lng: 2 };

describe('Latvia box coordinate generation', () => {
  const bounds = [55.0, 20.0, 58.0, 28.0];

  test('produces coords within specified bounds', () => {
    for (let i = 0; i < 50; i++) {
      const result = getLatviaBox(bounds);
      expect(result.lat).toBeGreaterThanOrEqual(bounds[0]);
      expect(result.lat).toBeLessThanOrEqual(bounds[2]);
      expect(result.lng).toBeGreaterThanOrEqual(bounds[1]);
      expect(result.lng).toBeLessThanOrEqual(bounds[3]);
    }
  });

  test('returns object with lat/lng keys', () => {
    const result = getLatviaBox(bounds);
    expect(result).toHaveProperty('lat');
    expect(result).toHaveProperty('lng');
  });
});

describe('Polygon point inclusion', () => {
  test('identifies point inside polygon', () => {
    expect(point_in_polygon(pointInside, squarePolygon)).toBe(true);
  });

  test('identifies point outside polygon', () => {
    expect(point_in_polygon(pointOutside, squarePolygon)).toBe(false);
  });
});

describe('Random integer generator', () => {
  test('produces integer in given range', () => {
    for (let i = 0; i < 100; i++) {
      const val = getRndInteger(5, 10);
      expect(val).toBeGreaterThanOrEqual(5);
      expect(val).toBeLessThanOrEqual(10);
      expect(Number.isInteger(val)).toBe(true);
    }
  });
});

describe('Deterministic integer sequence', () => {
  test('generates expected next values', () => {
    expect(getNextInt(5, 100)).toBe(11);
    expect(getNextInt(11, 100)).toBe(23);
  });
});

describe('Seeded integer output', () => {
  test('returns same value for same seed', () => {
    const value1 = getSeededInt(7, 100, 5);
    const value2 = getSeededInt(7, 100, 5);
    expect(value1).toBe(value2);
  });

  test('returns base value for round 1', () => {
    expect(getSeededInt(7, 100, 1)).toBe(7);
  });
});

describe('Coordinate generator', () => {
  test('produces point inside polygon', () => {
    const game = [squarePolygon, [0, 0, 1, 1]];
    const coords = getCoords(game);
    expect(point_in_polygon(coords, squarePolygon)).toBe(true);
  });
});

describe('Pregenerated coordinate batch', () => {
  test('returns valid coords within polygon', async () => {
    const game = [squarePolygon, [0, 0, 1, 1]];
    const store = await pregenSingle(game);
    expect(store.length).toBeGreaterThan(0);
    for (const coord of store) {
      expect(coord.length).toBe(2);
      expect(point_in_polygon({ lat: coord[0], lng: coord[1] }, squarePolygon)).toBe(true);
    }
  }, 10000);
});
