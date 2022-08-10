import { PartialViewport, Viewport } from "../../types";

export enum ViewportActionKind {
  Change = "Change",
}

interface IViewportChangeAction {
  type: ViewportActionKind.Change;
  partialViewport: PartialViewport;
}

type ViewportAction = IViewportChangeAction;

export const mergeViewports = (
  viewport: Viewport,
  partialViewport: PartialViewport
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

export const viewportReducer = (
  viewport: Viewport,
  action: ViewportAction
): Viewport => {
  switch (action.type) {
    case ViewportActionKind.Change:
      return mergeViewports(viewport, action.partialViewport);
  }
};
