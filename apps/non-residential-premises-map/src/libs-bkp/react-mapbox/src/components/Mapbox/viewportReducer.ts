import { PartialViewport, Viewport } from '../../types';

export enum ViewportActionKind {
  Change = 'Change',
}

interface IViewportChangeAction {
  type: ViewportActionKind.Change;
  partialViewport: PartialViewport;
}

type ViewportAction = IViewportChangeAction;

export const mergeViewports = (
  viewport: Viewport,
  partialViewport: PartialViewport,
): Viewport => ({
  zoom: partialViewport.zoom ?? viewport.zoom,
  pitch: partialViewport.pitch ?? viewport.pitch,
  bearing: partialViewport.bearing ?? viewport.bearing,
  center: {
    lat: partialViewport.center?.lat ?? viewport.center.lat,
    lng: partialViewport.center?.lng ?? viewport.center.lng,
  },
  padding: {
    top: partialViewport.padding?.top ?? viewport.padding.top,
    right: partialViewport.padding?.right ?? viewport.padding.right,
    bottom: partialViewport.padding?.bottom ?? viewport.padding.bottom,
    left: partialViewport.padding?.left ?? viewport.padding.left,
  },
});

export const mergePartialViewports = (
  firstViewport: PartialViewport,
  secondViewport: PartialViewport,
): PartialViewport => ({
  zoom: secondViewport.zoom ?? firstViewport.zoom,
  pitch: secondViewport.pitch ?? firstViewport.pitch,
  bearing: secondViewport.bearing ?? firstViewport.bearing,
  center: {
    lat: secondViewport.center?.lat ?? firstViewport.center?.lat,
    lng: secondViewport.center?.lng ?? firstViewport.center?.lng,
  },
  padding: {
    top: secondViewport.padding?.top ?? firstViewport.padding?.top,
    right: secondViewport.padding?.right ?? firstViewport.padding?.right,
    bottom: secondViewport.padding?.bottom ?? firstViewport.padding?.bottom,
    left: secondViewport.padding?.left ?? firstViewport.padding?.left,
  },
});

export const areViewportsSame = (
  firstViewport: PartialViewport,
  secondViewport: PartialViewport,
): boolean => {
  const isZoomSame =
    Math.round((firstViewport.zoom ?? 0) * 100) ===
    Math.round((secondViewport.zoom ?? 0) * 100);

  const isPitchSame =
    Math.round((firstViewport.pitch ?? 0) * 100) ===
    Math.round((secondViewport.pitch ?? 0) * 100);

  const isBearingSame =
    Math.round((firstViewport.bearing ?? 0) * 100) ===
    Math.round((secondViewport.bearing ?? 0) * 100);

  const isPaddingTopSame =
    Math.round(firstViewport.padding?.top ?? 0) ===
    Math.round(secondViewport.padding?.top ?? 0);

  const isPaddingRightSame =
    Math.round(firstViewport.padding?.right ?? 0) ===
    Math.round(secondViewport.padding?.right ?? 0);

  const isPaddingBottomSame =
    Math.round(firstViewport.padding?.bottom ?? 0) ===
    Math.round(secondViewport.padding?.bottom ?? 0);

  const isPaddingLeftSame =
    Math.round(firstViewport.padding?.left ?? 0) ===
    Math.round(secondViewport.padding?.left ?? 0);

  const isPaddingSame =
    isPaddingTopSame &&
    isPaddingRightSame &&
    isPaddingBottomSame &&
    isPaddingLeftSame;

  const isLatSame =
    Math.round((firstViewport.center?.lat ?? 0) * 100000) ===
    Math.round((secondViewport.center?.lat ?? 0) * 100000);

  const isLngSame =
    Math.round((firstViewport.center?.lng ?? 0) * 100000) ===
    Math.round((secondViewport.center?.lng ?? 0) * 100000);

  const isCenterSame = isLatSame && isLngSame;

  return (
    isZoomSame && isPitchSame && isBearingSame && isPaddingSame && isCenterSame
  );
};

export const viewportReducer = (
  viewport: Viewport,
  action: ViewportAction,
): Viewport => {
  switch (action.type) {
    case ViewportActionKind.Change:
      return mergeViewports(viewport, action.partialViewport);
  }
};
