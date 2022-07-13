import { Feature } from "geojson";
import { evaluate } from "./index";

const feature: Feature = {
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [0, 0],
  },
  properties: {
    name: "Matej",
    city: "Kosice",
  },
};

describe("evaluate", () => {
  test('["all", ["==", "name", "Matej"], ["==", "city", "Kosice"]', async () => {
    const result = evaluate(["all", ["==", "name", "Matej"], ["==", "city", "Kosice"]], feature);
    expect(result).toBe(true);
  });

  test('["all", ["==", "name", "Matej"], ["==", "city", "Bratislava"]', async () => {
    const result = evaluate(
      ["all", ["==", "name", "Matej"], ["==", "city", "Bratislava"]],
      feature,
    );
    expect(result).toBe(false);
  });

  test('["any", ["==", "name", "Matej"], ["==", "city", "Bratislava"]', async () => {
    const result = evaluate(
      ["any", ["==", "name", "Matej"], ["==", "city", "Bratislava"]],
      feature,
    );
    expect(result).toBe(true);
  });

  test('["any", ["==", "name", "Martin"], ["==", "city", "Bratislava"]', async () => {
    const result = evaluate(
      ["any", ["==", "name", "Martin"], ["==", "city", "Bratislava"]],
      feature,
    );
    expect(result).toBe(false);
  });
});
