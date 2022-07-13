import { Feature } from "geojson";
import { equals } from "./equals";
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

describe("==", () => {
  test("string comparison - equal", async () => {
    const result = equals(["==", "name", "Matej"], feature, evaluate);
    expect(result).toBe(true);
  });

  test("string comparison - unequal", async () => {
    const result = equals(["==", "name", "Martin"], feature, evaluate);
    expect(result).toBe(false);
  });

  test("boolean comparison - equal", async () => {
    const result = equals(["==", "isWorking", true], feature, evaluate);
    expect(result).toBe(true);
  });

  test("boolean comparison - unequal", async () => {
    const result = equals(["==", "isWorking", false], feature, evaluate);
    expect(result).toBe(false);
  });

  test("number comparison - equal", async () => {
    const result = equals(["==", "age", 22], feature, evaluate);
    expect(result).toBe(true);
  });

  test("number comparison - unequal", async () => {
    const result = equals(["==", "age", 21], feature, evaluate);
    expect(result).toBe(false);
  });

  test("number comparison - equal, different type", async () => {
    const result = equals(["==", "age", "22"], feature, evaluate);
    expect(result).toBe(false);
  });
});
