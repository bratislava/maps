# React Esri

This library exports two hooks for fetching Arcgeo data

## useArcgeo

This hook can be used for fetching all the data from some Arcgeo feature server.

### Usage

```ts
const { data } = useArcgeo(url, options);
```

Hook returns data property, which is simple `Promise<FeatureCollection>`.

Your url should look similar to these:

Our selfhosted geoportal: `https://geoportal.bratislava.sk/hsite/rest/services/zp/STROMY/MapServer/0`

Arcgis Online: `https://services8.arcgis.com/pRlN1m0su5BYaFAS/ArcGIS/rest/services/orezy_a_vyruby_2022_OTMZ_zobrazenie/FeatureServer/0`

### Options

```ts
interface IUseArcgeoOptions {
  pagination?: boolean; // default: true
  countPerRequest?: number; // default: 1000
  format?: string; // default: "pgeojson"
}
```

#### `pagination`

default: `true`

According to [this article](https://support.esri.com/en/technical-article/000012579) some instances of Arcgeo does not support pagination because of the underlying database system.

When this happens to you, you have to set `pagination` option to `false`.
If pagination is disabled you can fetch only first 2000 features by default. This default is set on Arcgeo side. To increase this count on your layer, please contact Jakub Hruby (jakub.hruby@bratislava.sk).

When `pagination` is set to `false`, `countPerRequest` option is ignored.

#### `countPerRequest`

default: `1000`

Library is sending multiple request to fetch all the data. This option sets how many features you want to fetch per request.

When `pagination` is set to `false`, this option is ignored.

#### `format`

default: `"pgeojson"`

For some reason there are multiple names for the same format in Arcgeo. For most of the times you don't have to change this, but in some cases you want to change it to just `"geojson"`.

To see what formats your layer supports, go to `/query` page of your feature server and look at the format select box.
