/* eslint-disable spaced-comment */
/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly PUBLIC_MAPBOX_PUBLIC_TOKEN: string;
  readonly PUBLIC_MAPBOX_LIGHT_STYLE: string;
  readonly PUBLIC_MAPBOX_DARK_STYLE: string;
  readonly PUBLIC_MAPBOX_LAYER_PREFIX: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
