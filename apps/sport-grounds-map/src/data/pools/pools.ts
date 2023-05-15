import { FeatureCollection } from "geojson";
import pools from "./pools.json"
import { IPool } from "../types";

const generateRawPoolData = (poolList: Array<IPool>): FeatureCollection => {
  const poolData: FeatureCollection = {
    type: "FeatureCollection",
    features: []
  }
  poolData.features = poolList.map(pool => {
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [pool.Y, pool.X],
      },
      properties: {
        name: pool.Nazov_SK,
        description: pool.Popis,
        category: pool["Kategoria sportoviska_SK"],
        tags: pool.Sport_SK.split(', '),
        services: pool.Sluzby_SK.split(', '),
        openingHours: pool["Otvaracie hodiny_SK"],
        address: pool.Adresa_SK,
        email: pool.Email_SK,
        website: pool.Web,
        buyOnline: pool.Listok,
        photo: pool.Fotka,
        navigate: pool.Navigovat,
      },
    }
  })

  return poolData;
}

export const rawDataPools: FeatureCollection = generateRawPoolData(pools);
