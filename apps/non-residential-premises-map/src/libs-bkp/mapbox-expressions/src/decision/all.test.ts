import { Feature } from "geojson";
import { all } from "./all";
import { evaluate } from "../index";

const feature: Feature = {
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [0, 0],
  },
  properties: {},
};

describe("all", () => {
  test('["all", true, true, true]', async () => {
    const result = all(["all", true, true, true], feature, evaluate);
    expect(result).toBe(true);
  });

  test('["all", false, false, false]', async () => {
    const result = all(["all", false, false, false], feature, evaluate);
    expect(result).toBe(false);
  });

  test('["all", false, true, false]', async () => {
    const result = all(["all", false, true, false], feature, evaluate);
    expect(result).toBe(false);
  });

  test('["all", true, false, true]', async () => {
    const result = all(["all", true, false, true], feature, evaluate);
    expect(result).toBe(false);
  });

  test('["all"]', async () => {
    const result = all(["all"], feature, evaluate);
    expect(result).toBe(true);
  });
});
