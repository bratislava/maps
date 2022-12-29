# Bratislava maps

This repository provides libraries for creating map applications using mapbox and esri.

## Some of maps we developed

- [Paas zone map](https://cdn-api.bratislava.sk/static-pages/paas-map/index.html?lang=sk)
- [Cvicko sport grounds map](https://cdn-api.bratislava.sk/static-pages/cvicko-map/index.html?lang=sk)
- [Drinking fountains map](https://cdn-api.bratislava.sk/static-pages/drinking-fountains-map/index.html?lang=sk)
- [Greenary care map](https://cdn-api.bratislava.sk/static-pages/greenary-care-map/index.html?lang=sk)
- [Planting map](https://cdn-api.bratislava.sk/static-pages/planting-map/index.html?lang=sk)
- [Sport grounds map](https://cdn-api.bratislava.sk/static-pages/sport-grounds-map/index.html?lang=sk)

## Structure

This repository is an yarn workspace.

### Libraries

There are several libraries to handle different things. Those libraries are located inside `libs` folder and every library contains it's own `README.md` file with a little bit of documentation.

For now, we are not deploying our libraries anywhere so there is no versioning of them. They are just bundled into applications at build time. Drawback of this approach is that if we change anything in some library, it is immediately reflected to all map apps. So breaking changes brake all the apps.

### Applications

Inside the `apps` folder there are all of our map applications. It is a good start to look at them if you are starting to develop new application so you can see how to use our map libraries and how to connect to different services.

## Deployment

We are uploadig our built applications manually to our [CDN](https://cdn.bratislava.sk/buckets/static-pages/browse). To get access to it, please contact Martin Pinter.

There is a bucket called **static-pages** in which every map is uploaded to its subfolder.

> Tip: If you are uploading files through CDN GUI you can't upload folder which contains subfolders OR multiple folders at once due to some bug otherwise CDN will mess it up. So you have to upload every folder separately and when you want to upload subfolders, you have to create root folders manually through GUI.

After upploading, app is available at: `https://cdn-api.bratislava.sk/static-pages/<folder-name>/index.html`. Some maps are available also on `/sk.html` and `/en.html` urls for better SEO management.

### Iframes

Those deployments are currently embeded through iframes on several places:

bratislava.sk:
- https://bratislava.sk/doprava-a-mapy/mapy - vysadba a starostlivost
- https://bratislava.sk/zivotne-prostredie-a-vystavba/zelen/udrzba-a-tvorba-zelene/stromy-v-meste - vysadba zelene
- https://bratislava.sk/zivotne-prostredie-a-vystavba/zelen/udrzba-a-tvorba-zelene/stromy-v-meste/vysadba-stromov - vysadba zelene
- https://bratislava.sk/zivotne-prostredie-a-vystavba/zelen/udrzba-a-tvorba-zelene/stromy-v-meste/starostlivost-o-dreviny - starostlivost o zelen
- https://bratislava.sk/doprava-a-mapy/pitne-fontany - pitné fontány (zatial pod doprava a mapy, neskor sa mozno presunie na inu podstranku)

gmb.sk:
- https://www.gmb.sk/navstivte - navštívte galériu

10000stromov.sk:
- https://10000stromov.sk/zelena-mapa - vysadba zelene “zelena mapa” (historicky nazov)

cvicko.sk:
- https://cvicko.sk/ - homepage mapa
- https://cvicko.sk/most-snp/ - most snp (mapy pre jednotlive cvicka maju upravene zobrazenie)
- https://cvicko.sk/tyrsak/ - tyrsak
- https://cvicko.sk/apollo/ - apollo
- https://cvicko.sk/promenada/ - promenada
- https://cvicko.sk/nabrezie/ - nabrezie
- https://cvicko.sk/lanfranconi/ - lanfranconi

paas.sk:
- https://paas.sk/mapa-zon/ - mapa zón

## Developing

```
yarn workspace <app-name> dev
```

Where `<app-name>` is `name` property in corresponding `package.json` file.

## Building

```bash
yarn workspace <app-name> build

# Or you can suppress TS errors using
yarn workspace <app-name> build:suppress
```

## How to add new app

1. Duplicate folder of any existing app in `/apps` folder. You should choose app which is similar to your requirements.
3. Rename app in its `package.json` file.
6. Develeop.
7. It is recomended to create new mapbox styles for each new map and replace urls in `.env` files.
