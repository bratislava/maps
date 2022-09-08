# Bratislava maps

This repository provides libraries for creating map applications using mapbox and esri.

## Structure

This repository is an yarn workspace.

### Libraries

There are several libraries to handle different things. Those libraries are located inside `libs` folder and every library contains it's own `README.md` file with a little bit of documentation.

For now, we are not deploying our libraries anywhere. They are just bundled into applications at build time.

### Applications

Inside the `apps` folder there are all of our map applications. It is a good start to look at them if you are starting to develop new application so you can see how to use our map libraries and how to connect to different services.

We are uploadig our built applications manually to our [CDN](https://cdn.bratislava.sk/buckets/static-pages/browse).

There is a bucket called "static-pages" in which every map is uploaded to its subfolder.

## Developing

```
yarn workspace <app-name> dev
```

## Building

```bash
yarn workspace <app-name> build

# or you can suppress TS errors using
yarn workspace <app-name> build:suppress
```

## How to add new app

1. Duplicate folder of any existing app in `/apps` folder. You should choose app which is similar to your requirements.
3. Rename app in its `package.json` file.
6. Develeop.
7. It is recomended to create new mapbox styles for each new map and replace urls in `.env` files.
