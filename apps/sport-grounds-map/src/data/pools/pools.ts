import { FeatureCollection } from "geojson";
import { IPool } from "../types";

export const generateRawPoolData = (poolList: Array<IPool>): FeatureCollection => {
  const poolData: FeatureCollection = {
    type: "FeatureCollection",
    features: []
  }
  poolData.features = poolList.map(p => {
    const pool = p.attributes;
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [pool.longitude, pool.latitude],
      },
      properties: {
        name: pool.nazov,
        description: pool.popis,
        category: pool.kategoriaSportoviska,
        tags: pool.sport.split(', '),
        services: pool.sluzby.split(', '),
        openingHours: pool.otvaracieHodiny && pool.otvaracieHodiny.replace(/\n/g, '</br>'),
        address: pool.adresa,
        email: pool.email,
        website: pool.webLink,
        buyOnline: pool.listokLink,
        photo: pool.fotka?.data?.attributes?.formats?.small.url,
        navigate: pool.navigovatLink,
        note: pool.oznam,
      },
    }
  })

  return poolData;
}
