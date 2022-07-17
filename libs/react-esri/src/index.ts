import { useState, useEffect } from "react";

import { Feature, FeatureCollection } from "geojson";

export const fetchFromArcgeo = async (
  url: string,
  {
    offset,
    count,
    format,
  }: {
    offset?: number;
    count?: number;
    format?: string;
  }
) => {
  return fetch(
    [
      `${url}/query?where=1=1`,
      "&outFields=*",
      "&returnGeometry=true",
      "&featureEncoding=esriDefault",
      offset ? `&resultOffset=${offset}` : "",
      count ? `&resultRecordCount=${count}` : "",
      format ? `&f=${format}` : "&f=pgeojson",
    ].join("")
  ).then((res) => res.json());
};

export const fetchCount = async (url: string) => {
  const res = await fetch(
    [
      `${url}/query?where=1=1`,
      "featureEncoding=esriDefault",
      "returnCountOnly=true",
      "f=pjson",
    ].join("&")
  );
  const json = await res.json();
  return json.count;
};

const DEFAULT_OPTIONS: IUseArcgeoOptions = {
  countPerRequest: 1000,
  pagination: true,
  format: "pgeojson",
};

export const fetchAllFromArcgeo = async (
  url: string,
  options?: IUseArcgeoOptions
) => {
  return new Promise<FeatureCollection>(async (resolve, reject) => {
    let GLOBAL_FEATURE_ID = 0;
    let features: Feature[] = [];

    const ops = options
      ? {
          ...DEFAULT_OPTIONS,
          ...options,
        }
      : DEFAULT_OPTIONS;

    if (ops.pagination) {
      const totalCount = await fetchCount(url);
      const requestCount = Math.ceil(
        totalCount / (ops.countPerRequest ?? 1000)
      );

      const chunks = await Promise.all(
        Array(requestCount)
          .fill(null)
          .map(async (chunk, index) => {
            const offset = (ops.countPerRequest ?? 1000) * index;
            const count = ops.countPerRequest;
            const format = ops.format;
            const data = await fetchFromArcgeo(url, { offset, count, format });
            return data.features;
          })
      );

      // filter out features which don't have geometry for some reason
      features = chunks
        .flat()
        .filter((feature) => feature.geometry)
        .map((feature) => {
          GLOBAL_FEATURE_ID++;
          return {
            ...feature,
            id: GLOBAL_FEATURE_ID,
          };
        });
    } else {
      const data = await fetchFromArcgeo(url, { format: ops.format });
      features = data.features;
    }

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

interface IUseArcgeoOptions {
  countPerRequest?: number;
  pagination?: boolean;
  format?: string;
}

export const useArcgeo = (
  url: string | string[],
  options?: IUseArcgeoOptions
) => {
  const [data, setData] = useState<FeatureCollection | null>(null);

  useEffect(() => {
    if (Array.isArray(url)) {
      Promise.all(url.map((u) => fetchAllFromArcgeo(u, options))).then(
        (results) => {
          setData({
            type: "FeatureCollection",
            features: results.reduce(
              (features, result) => [...features, ...result.features],
              [] as Feature[]
            ),
          });
        }
      );
    } else {
      fetchAllFromArcgeo(url, options).then((fetchedData) => {
        setData(fetchedData);
      });
    }
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
