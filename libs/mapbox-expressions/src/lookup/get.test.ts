import { Feature } from "geojson";
import { get } from "./get";
import { evaluate } from "../index";

const feature: Feature = {
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [0, 0],
  },
  properties: {
    name: "Matej",
  },
};

describe("get", () => {
  test('["get", "name"]', async () => {
    const result = get(["get", "name"], feature, evaluate);
    expect(result).toBe("Matej");
  });

  test('["get", "age"]', async () => {
    const result = get(["get", "age"], feature, evaluate);
    expect(result).toBe(null);
  });
});
