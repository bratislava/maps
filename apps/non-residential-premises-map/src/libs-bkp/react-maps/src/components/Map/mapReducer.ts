import { LngLat, Viewport } from '../../../../react-mapbox';

export enum MapActionKind {
  EnableDarkmode = 'EnableDarkmode',
  DisableDarkmode = 'DisableDarkmode',
  ToggleDarkmode = 'ToggleDarkmode',
  SetDarkmode = 'SetDarkmode',
  SetSatellite = 'SetSatellite',
  SetFullscreen = 'SetFullscreen',
  ChangeViewport = 'ChangeViewport',
  EnableGeolocation = 'EnableGeolocation',
  DisableGeolocation = 'DisableGeolocation',
  AddSearchMarker = 'AddSearchMarker',
  RemoveSearchMarker = 'RemoveSearchMarker',
}

interface IMapEnableDarkmodeAction {
  type: MapActionKind.EnableDarkmode;
}

interface IMapDisableDarkmodeAction {
  type: MapActionKind.DisableDarkmode;
}

interface IMapToggleDarkmodeAction {
  type: MapActionKind.ToggleDarkmode;
}

interface IMapSetDarkmodeAction {
  type: MapActionKind.SetDarkmode;
  value: boolean;
}

interface IMapSetSatelliteAction {
  type: MapActionKind.SetSatellite;
  value: boolean;
}

interface IMapSetFullscreenAction {
  type: MapActionKind.SetFullscreen;
  value: boolean;
}

interface IMapChangeViewportAction {
  type: MapActionKind.ChangeViewport;
  viewport: Viewport;
}

interface IMapEnableGeolocationAction {
  type: MapActionKind.EnableGeolocation;
  geolocationMarkerLngLat: LngLat;
}

interface IMapDisableGeolocationAction {
  type: MapActionKind.DisableGeolocation;
}

interface IMapAddSearchMarkerAction {
  type: MapActionKind.AddSearchMarker;
  searchMarkerLngLat: LngLat;
}

interface IMapRemoveSearchMarkerAction {
  type: MapActionKind.RemoveSearchMarker;
}

export type MapAction =
  | IMapEnableDarkmodeAction
  | IMapDisableDarkmodeAction
  | IMapToggleDarkmodeAction
  | IMapSetDarkmodeAction
  | IMapSetSatelliteAction
  | IMapSetFullscreenAction
  | IMapChangeViewportAction
  | IMapEnableGeolocationAction
  | IMapDisableGeolocationAction
  | IMapAddSearchMarkerAction
  | IMapRemoveSearchMarkerAction;

export interface IMapState {
  isSatellite: boolean;
  isDarkmode: boolean;
  isFullscreen: boolean;
  viewport: Viewport;
  isGeolocation: boolean;
  geolocationMarkerLngLat: LngLat | null;
  searchMarkerLngLat: LngLat | null;
}

export const mapReducer = (state: IMapState, action: MapAction): IMapState => {
  switch (action.type) {
    case MapActionKind.EnableDarkmode: {
      return {
        ...state,
        isSatellite: false,
        isDarkmode: true,
      };
    }

    case MapActionKind.DisableDarkmode: {
      return {
        ...state,
        isSatellite: false,
        isDarkmode: false,
      };
    }

    case MapActionKind.ToggleDarkmode: {
      return {
        ...state,
        isSatellite: false,
        isDarkmode: !state.isDarkmode,
      };
    }

    case MapActionKind.SetDarkmode: {
      return {
        ...state,
        isSatellite: false,
        isDarkmode: action.value,
      };
    }

    case MapActionKind.SetSatellite: {
      return {
        ...state,
        isSatellite: action.value,
      };
    }

    case MapActionKind.SetFullscreen: {
      return {
        ...state,
        isFullscreen: action.value,
      };
    }

    case MapActionKind.ChangeViewport: {
      return {
        ...state,
        viewport: action.viewport,
      };
    }

    case MapActionKind.EnableGeolocation: {
      return {
        ...state,
        isGeolocation: true,
        geolocationMarkerLngLat: action.geolocationMarkerLngLat,
      };
    }

    case MapActionKind.DisableGeolocation: {
      return {
        ...state,
        isGeolocation: false,
        geolocationMarkerLngLat: null,
      };
    }

    case MapActionKind.AddSearchMarker: {
      return {
        ...state,
        searchMarkerLngLat: action.searchMarkerLngLat,
      };
    }

    case MapActionKind.RemoveSearchMarker: {
      return {
        ...state,
        searchMarkerLngLat: null,
      };
    }
  }
};
