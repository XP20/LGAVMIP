import { describe, expect, test } from "bun:test";

// @ts-ignore
import apiKML, { parseKMLPolygonCoordinates } from "./customGamemode.js";


const validKML = `<?xml version="1.0" encoding="UTF-8"?>
<kml>
  <Document>
    <Placemark>
      <Polygon>
        <outerBoundaryIs>
          <LinearRing>
            <coordinates>
              24.123,56.789,0 24.124,56.790,0 24.125,56.791,0 24.123,56.789,0
            </coordinates>
          </LinearRing>
        </outerBoundaryIs>
      </Polygon>
    </Placemark>
  </Document>
</kml>`;

const invalidKML = `<kml><invalid></kml>`;

describe("KML coordinate parser", () => {
  test("parses valid polygon coordinates", async () => {
    const coords = await parseKMLPolygonCoordinates(validKML);
    expect(Array.isArray(coords)).toBe(true);
    expect(coords.length).toBeGreaterThanOrEqual(4);
    expect(coords[0][0]).toBeCloseTo(24.123);
    expect(coords[0][1]).toBeCloseTo(56.789);
  });

  test("throws error on malformed KML", async () => {
    await expect(parseKMLPolygonCoordinates(invalidKML)).rejects.toThrow();
  });
});

describe("KML upload endpoint", () => {
  test("returns 500 for invalid KML file", async () => {
    const formData = new FormData();
    formData.append("kmlFile", new Blob([invalidKML], { type: "text/xml" }));
    const req = new Request("http://localhost/", {
      method: "POST",
      body: formData,
    });
    const res = await apiKML.fetch(req);
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe("Failed to process KML file");
  });

  test("returns 404 for valid KML without response", async () => {
    const formData = new FormData();
    formData.append("kmlFile", new Blob([validKML], { type: "text/xml" }));
    const req = new Request("http://localhost/", {
      method: "POST",
      body: formData,
    });
    const res = await apiKML.fetch(req);
    expect(res.status).toBe(404);
  });

  test("ignores extra form fields and returns 404", async () => {
    const formData = new FormData();
    formData.append("kmlFile", new Blob([validKML], { type: "text/xml" }));
    formData.append("extraField", "test");
    const req = new Request("http://localhost/", {
      method: "POST",
      body: formData,
    });
    const res = await apiKML.fetch(req);
    expect(res.status).toBe(404);
  });

  test("returns 400 when no KML file is provided", async () => {
    const formData = new FormData();
    const req = new Request("http://localhost/", {
      method: "POST",
      body: formData,
    });
    const res = await apiKML.fetch(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("No KML file provided");
  });
});
