import { Feature } from "geojson";
import { any } from "./any";
import { evaluate } from "../index";

const feature: Feature = {
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [0, 0],
  },
  properties: {},
};

describe("any", () => {
  test('["any", true, true, true]', async () => {
    const result = any(["any", true, true, true], feature, evaluate);
    expect(result).toBe(true);
  });

  test('["any", false, false, false]', async () => {
    const result = any(["any", false, false, false], feature, evaluate);
    expect(result).toBe(false);
  });

  test('["any", false, true, false]', async () => {
    const result = any(["any", false, true, false], feature, evaluate);
    expect(result).toBe(true);
  });

  test('["any", true, false, true]', async () => {
    const result = any(["any", true, false, true], feature, evaluate);
    expect(result).toBe(true);
  });

  test('["any"]', async () => {
    const result = any(["any"], feature, evaluate);
    expect(result).toBe(false);
  });
});
