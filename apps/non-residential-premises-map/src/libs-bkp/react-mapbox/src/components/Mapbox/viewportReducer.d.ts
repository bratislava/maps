import { PartialViewport, Viewport } from '../../types';
export declare enum ViewportActionKind {
    Change = "Change"
}
interface IViewportChangeAction {
    type: ViewportActionKind.Change;
    partialViewport: PartialViewport;
}
type ViewportAction = IViewportChangeAction;
export declare const mergeViewports: (viewport: Viewport, partialViewport: PartialViewport) => Viewport;
export declare const mergePartialViewports: (firstViewport: PartialViewport, secondViewport: PartialViewport) => PartialViewport;
export declare const areViewportsSame: (firstViewport: PartialViewport, secondViewport: PartialViewport) => boolean;
export declare const viewportReducer: (viewport: Viewport, action: ViewportAction) => Viewport;
export {};
