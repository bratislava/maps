import { useState, useEffect } from "react";

import { FeatureCollection } from "geojson";

export const fetchFromArcgeo = async (
  url: string,
  offset: number,
  count: number
) => {
  return fetch(
    [
      `${url}/query?where=OBJECTID+%3E%3D+0`,
      "outFields=*",
      "returnGeometry=true",
      "featureEncoding=esriDefault",
      `resultOffset=${offset}`,
      `resultRecordCount=${count}`,
      "f=pgeojson",
    ].join("&")
  ).then((res) => res.json());
};

export const fetchCount = async (url: string) => {
  const res = await fetch(
    [
      `${url}/query?where=OBJECTID+%3E%3D+0`,
      "featureEncoding=esriDefault",
      "returnCountOnly=true",
      "f=pjson",
    ].join("&")
  );
  const json = await res.json();
  return json.count;
};

export const fetchAllFromArcgeo = async (
  url: string,
  countPerRequest: number
) => {
  return new Promise<FeatureCollection>(async (resolve, reject) => {
    const totalCount = await fetchCount(url);
    const requestCount = Math.ceil(totalCount / countPerRequest);

    const chunks = await Promise.all(
      Array(requestCount)
        .fill(null)
        .map(async (chunk, index) => {
          const offset = countPerRequest * index;
          const count = countPerRequest;
          const data = await fetchFromArcgeo(url, offset, count);
          return data.features;
        })
    );

    let GLOBAL_FEATURE_ID = 0;

    // filter out features which don't have geometry for some reason
    const features = chunks
      .flat()
      .filter((feature) => feature.geometry)
      .map((feature) => {
        GLOBAL_FEATURE_ID++;
        return {
          ...feature,
          id: GLOBAL_FEATURE_ID,
        };
      });

    resolve({
      type: "FeatureCollection",
      features,
    } as FeatureCollection);
  });
};

export interface Attachment {
  contentType: string;
  globalId: string;
  id: number;
  name: string;
  parentGlobalId: string;
  size: number;
}

export const fetchAttachmentsFromArcgeo = async (
  serverUrl: string,
  objectId: string | number
) => {
  return new Promise<Attachment[]>(async (resolve, reject) => {
    const res = await fetch(`${serverUrl}/${objectId}/attachments/?f=pjson`);
    const json = await res.json();
    resolve(json.attachmentInfos);
  });
};

export const useArcgeo = (url: string, countPerRequest: number = 1000) => {
  const [data, setData] = useState<FeatureCollection | null>(null);

  useEffect(() => {
    fetchAllFromArcgeo(url, countPerRequest).then((fetchedData) => {
      setData(fetchedData);
    });
  }, [url]);

  return {
    data: data,
  };
};

export const useArcgeoAttachments = (
  url: string,
  objectId: string | number | null
) => {
  const [data, setData] = useState<Attachment[] | null>(null);

  useEffect(() => {
    setData(null);
    if (objectId) {
      fetchAttachmentsFromArcgeo(url, objectId).then((fetchedData) => {
        setData(fetchedData);
      });
    }
  }, [url, objectId]);

  return { data };
};
