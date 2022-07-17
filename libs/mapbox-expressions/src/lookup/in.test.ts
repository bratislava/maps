import { Feature } from "geojson";
import { inside } from "./in";
import { evaluate } from "../index";

const feature: Feature = {
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [0, 0],
  },
  properties: {
    fruits: ["orange", "apple", "lemon"],
  },
};

describe("in", () => {
  test('["in", "orange", ["orange", "apple", "lemon"]]', async () => {
    const result = inside(["in", "orange", ["orange", "apple", "lemon"]], feature, evaluate);
    expect(result).toBe(true);
  });

  test('["in", "carrot", ["orange", "apple", "lemon"]]', async () => {
    const result = inside(["in", "carrot", ["orange", "apple", "lemon"]], feature, evaluate);
    expect(result).toBe(false);
  });

  test('["in", "orange", ["get", "fruits"]]', async () => {
    const result = inside(["in", "orange", ["get", "fruits"]], feature, evaluate);
    expect(result).toBe(true);
  });

  test('["in", "carrot", ["get", "fruits"]]', async () => {
    const result = inside(["in", "carrot", ["get", "fruits"]], feature, evaluate);
    expect(result).toBe(false);
  });
});
