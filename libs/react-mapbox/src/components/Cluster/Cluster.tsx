import { Feature, Point } from 'geojson';
import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import Supercluster from 'supercluster';
import { filterContext } from '../Filter/Filter';
import { mapboxContext } from '../Mapbox/Mapbox';

export interface IClusterChildProps {
  key: number | string;
  features: Feature<Point>[];
  isCluster: boolean;
  clusterExpansionZoom: number | null;
  lat: number;
  lng: number;
}

export interface IClusterProps {
  features: Feature[];
  children: FC<IClusterChildProps>;
  radius?: number;
}

export const Cluster = ({
  children,
  features,
  radius = 100,
}: IClusterProps) => {
  const { isFeatureVisible } = useContext(filterContext);

  const pointFeatures = useMemo(
    () =>
      features.filter(
        (f) => f.geometry.type === 'Point',
      ) as Supercluster.PointFeature<Supercluster.AnyProps>[],
    [features],
  );

  const { map } = useContext(mapboxContext);

  const [clusters, setClusters] = useState<IClusterChildProps[]>([]);

  useEffect(() => {
    const recalculate = (): void => {
      if (!map) return;

      const zoom = map.getZoom();
      const bounds = map.getBounds();

      const bbox: [number, number, number, number] = [
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth(),
      ];

      const supercluster = new Supercluster({ radius, maxZoom: 30 });
      supercluster.load(
        pointFeatures.filter((f) =>
          isFeatureVisible === undefined ? true : isFeatureVisible(f),
        ),
      );

      const newClusters = supercluster
        .getClusters(bbox, zoom ?? 0)
        .map((cluster, key) => {
          const isCluster = cluster.properties.cluster_id !== undefined;

          if (isCluster) {
            const features = supercluster.getLeaves(
              cluster.properties.cluster_id,
              Infinity,
            );
            return {
              key: features[0].id ?? key,
              features,
              lng: cluster.geometry.coordinates[0],
              lat: cluster.geometry.coordinates[1],
              isCluster,
              clusterExpansionZoom: supercluster.getClusterExpansionZoom(
                cluster.properties.cluster_id,
              ),
            };
          } else {
            return {
              key: cluster.id ?? key,
              features: [cluster],
              lng: cluster.geometry.coordinates[0],
              lat: cluster.geometry.coordinates[1],
              isCluster,
              clusterExpansionZoom: null,
            };
          }
        });

      setClusters(newClusters);
    };

    recalculate();
    const timer = setTimeout(recalculate, 10);
    map?.on('move', recalculate);
    return () => {
      map?.off('move', recalculate);
      clearTimeout(timer);
    };
  }, [map, isFeatureVisible, pointFeatures, radius]);

  return <>{clusters.map((cluster) => children(cluster))}</>;
};
