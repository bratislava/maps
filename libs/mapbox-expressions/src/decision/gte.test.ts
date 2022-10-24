import { Feature } from "geojson";
import { gte } from "./gte";
import { evaluate } from "../index";

const feature: Feature = {
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [0, 0],
  },
  properties: {
    name: "Matej",
    age: 22,
    ageAsString: "22",
    isWorking: true,
  },
};

describe(">=", () => {
  test("number comparison - equal", async () => {
    const result = gte([">=", "age", 22], feature, evaluate);
    expect(result).toBe(true);
  });

  test("number comparison - greater", async () => {
    const result = gte([">=", "age", 23], feature, evaluate);
    expect(result).toBe(false);
  });

  test("number comparison - lower", async () => {
    const result = gte([">=", "age", 22], feature, evaluate);
    expect(result).toBe(true);
  });
});
