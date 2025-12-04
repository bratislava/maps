import { useEffect, useState } from "react";

import { Feature, FeatureCollection } from "geojson";

export const fetchFromArcgis = async (
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
  return json.count ?? 0;
};

const DEFAULT_OPTIONS: IUseArcgisOptions = {
  countPerRequest: 1000,
  pagination: true,
  format: "pgeojson",
};

export interface ArcgisResult {
  data: FeatureCollection;
  warning?: {
    filteredCount: number;
    totalCount: number;
    message: string;
  };
}

export const fetchAllFromArcgis = async (
  url: string,
  options?: IUseArcgisOptions
): Promise<ArcgisResult> => {
  return new Promise<ArcgisResult>(async (resolve, reject) => {
    let GLOBAL_FEATURE_ID = 0;
    let features: Feature[] = [];
    let totalFeaturesReceived = 0;
    let filteredCount = 0;

    const ops = options
      ? {
          ...DEFAULT_OPTIONS,
          ...options,
        }
      : DEFAULT_OPTIONS;

    if (ops.pagination) {
      const totalCount = await fetchCount(url);
      const requestCount =
        Math.ceil(totalCount / (ops.countPerRequest ?? 1000)) ?? 1;
      const chunks = await Promise.all(
        Array(requestCount)
          .fill(null)
          .map(async (chunk, index) => {
            const offset = (ops.countPerRequest ?? 1000) * index;
            const count = ops.countPerRequest;
            const format = ops.format;
            const data = await fetchFromArcgis(url, { offset, count, format });
            return data.features;
          })
      );

      const allFeatures = chunks.flat();
      totalFeaturesReceived = allFeatures.length;

      // gis server can return erroneous data and still return 200 status - skip them so that at least correct data get displayed
      features = allFeatures
        .filter(
          (feature: Feature) =>
            feature && feature.geometry && (feature.geometry as any).coordinates
        )
        .map((feature: Feature) => {
          GLOBAL_FEATURE_ID++;
          return {
            ...feature,
            id: GLOBAL_FEATURE_ID,
          };
        });

      filteredCount = totalFeaturesReceived - features.length;
    } else {
      const data = await fetchFromArcgis(url, { format: ops.format });
      totalFeaturesReceived = data.features.length;

      // gis server can return erroneous data and still return 200 status - skip them so that at least correct data get displayed
      const validFeatures = data.features.filter(
        (feature: Feature) =>
          feature && feature.geometry && (feature.geometry as any).coordinates
      );

      features = validFeatures.map((feature: Feature) => {
        GLOBAL_FEATURE_ID++;
        return {
          ...feature,
          id: GLOBAL_FEATURE_ID,
        };
      });

      filteredCount = totalFeaturesReceived - features.length;
    }

    const result: ArcgisResult = {
      data: {
        type: "FeatureCollection",
        features,
      } as FeatureCollection,
    };

    if (filteredCount > 0) {
      result.warning = {
        filteredCount,
        totalCount: totalFeaturesReceived,
        message: `${filteredCount} invalid feature(s) were filtered out from the data source`,
      };
      console.warn(`[ArcGIS] ${result.warning.message} (${url})`);
    }

    resolve(result);
  });
};

export interface Attachment {
  contentType: string;
  globalId: string;
  id: number;
  name: string;
  parentGlobalId: string;
  size: number;
  keywords?: string;
}

export const fetchAttachmentsFromArcgis = async (
  serverUrl: string,
  objectId: string | number
) => {
  return new Promise<Attachment[]>(async (resolve, reject) => {
    const res = await fetch(`${serverUrl}/${objectId}/attachments/?f=pjson`);
    const json = await res.json();
    resolve(json.attachmentInfos);
  });
};

interface IUseArcgisOptions {
  countPerRequest?: number;
  pagination?: boolean;
  format?: string;
}

export const useArcgis = (
  url: string | string[],
  options?: IUseArcgisOptions
) => {
  const [data, setData] = useState<FeatureCollection | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  useEffect(() => {
    setWarning(null);

    if (Array.isArray(url)) {
      Promise.all(url.map((u) => fetchAllFromArcgis(u, options))).then(
        (results) => {
          const warnings = results
            .filter((r) => r.warning)
            .map((r) => r.warning!.message);
          if (warnings.length > 0) {
            setWarning(warnings.join("; "));
          }

          setData({
            type: "FeatureCollection",
            features: results.reduce(
              (features, result) => [...features, ...result.data.features],
              [] as Feature[]
            ),
          });
        }
      );
    } else {
      fetchAllFromArcgis(url, options).then((result) => {
        if (result.warning) {
          setWarning(result.warning.message);
        }
        setData(result.data);
      });
    }
  }, [url]);

  return {
    data: data,
    warning: warning,
  };
};

export const useArcgisAttachments = (
  url: string,
  objectId: string | number | null
) => {
  const [data, setData] = useState<Attachment[] | null>(null);

  useEffect(() => {
    setData(null);
    if (objectId) {
      fetchAttachmentsFromArcgis(url, objectId).then((fetchedData) => {
        setData(fetchedData);
      });
    }
  }, [url, objectId]);

  return { data };
};
