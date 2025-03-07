# Bratislava maps

This repository provides libraries for creating map applications using mapbox and esri.

## Some of maps we developed

- [Paas zone map](https://static-pages.s3.bratislava.sk/paas-map/index.html?lang=sk)
- [Cvicko sport grounds map](https://static-pages.s3.bratislava.sk/cvicko-map/index.html?lang=sk)
- [Drinking fountains map](https://static-pages.s3.bratislava.sk/drinking-fountains-map/index.html?lang=sk)
- [Greenary care map](https://static-pages.s3.bratislava.sk/greenary-care-map/index.html?lang=sk)
- [Planting map](https://static-pages.s3.bratislava.sk/planting-map/index.html?lang=sk)
- [Sport grounds map](https://static-pages.s3.bratislava.sk/sport-grounds-map/index.html?lang=sk)

## Structure

This repository is an npm workspace.

### Libraries

There are several libraries to handle different things. Those libraries are located inside `libs` folder and every library contains it's own `README.md` file with a little bit of documentation.

For now, we are not deploying our libraries anywhere so there is no versioning of them. They are just bundled into applications at build time. Drawback of this approach is that if we change anything in some library, it is immediately reflected to all map apps. So breaking changes brake all the apps.

### Applications

Inside the `apps` folder there are all of our map applications. It is a good start to look at them if you are starting to develop new application so you can see how to use our map libraries and how to connect to different services.

## Deployment

We are uploadig our built applications to our [s3](https://console.s3.bratislava.sk/browser/static-pages). To get access to it, please contact @vidriduch or @mpinter.

There is an automation present for uploading files using github actions, or you can do a manual upload.

### Deployment staging

If anything is uploaded to master it will be deployed to [dev folder] (https://console.s3.bratislava.sk/browser/static-pages/dev) automatically.

### Deployment prod

If you want to deploy to production there is two ways using automation. You have to create new release and make a tag and name it, following naming patteron of [semver](https://semver.org/).

1. deploy single map - tag name should be `prod-<name-of-map-from-package>-v<sem-ver>` -> `prod-closures-and-restrictions-map-v1.2.3`
2. deploy all maps - tag name should be `prod-all-v<sem-ver>` -> `prod-all-v1.2.3`

There is a bucket called **static-pages** in which every map is uploaded to its subfolder.

> Tip: If you are uploading files through CDN GUI you can't upload folder which contains subfolders OR multiple folders at once due to some bug otherwise CDN will mess it up. So you have to upload every folder separately and when you want to upload subfolders, you have to create root folders manually through GUI.

After upploading, app is available at: `https://static-pages.s3.bratislava.sk/<folder-name>/index.html`. Some maps are available also on `/sk.html` and `/en.html` urls for better SEO management.

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

Install dependencies:

```bash
cd ./apps/<your-map>
npm install
```

After successful installation you can start developing using:

```bash
npm run dev -w <app-name>
npm run dev -w @bratislava/closures-and-restrictions-map
```

Where `<app-name>` is `name` property in corresponding `package.json` file.

## Building

```bash
npm run build -w <app-name>

# Or you can suppress TS errors using
npm run build:suppress -w <app-name>
```

## How to add new app

1. Duplicate folder of any existing app in `/apps` folder. You should choose app which is similar to your requirements.
2. Rename app in its `package.json` file.
3. Develeop.
4. It is recomended to create new mapbox styles for each new map and replace urls in `.env` files.

## Add Strapi integration to an existing app

> Before beginning - you may also choose to follow [this guide](https://the-guild.dev/graphql/codegen/docs/guides/react-vue) which may be more up to date. Prefer React Query integration.

Install dependencies

```bash
cd ./apps/your-map
npm install -D @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-operations @graphql-codegen/typescript-react-query
npm install @tanstack/react-query graphql graphql-tag
```

Add codegen.yml to the root of the maps/apps/your-map app:

```yml
schema: https://general-strapi.bratislava.sk/graphql
documents: "./graphql/queries/**/*.{gql,graphql}"
generates:
  graphql/index.ts:
    plugins:
      - typescript
      - typescript-operations
      - typescript-react-query
    config:
      fetcher:
        endpoint: "https://general-strapi.bratislava.sk/graphql"
        fetchParams:
          headers:
            Content-Type: "application/json"
```

Add at least 1 query to file matching `./graphql/queries/**/*.{gql,graphql}` - i.e. /maps/apps/your-map/graphql/queries/queries.gql, the following should work against 'general-strapi' endpoint:

```
query Fixpointy($locale: I18NLocaleCode!) {
  fixpoints(locale: $locale) {
    data {
      id
      attributes {
        Adresa
        Latitude
        Longitude
        Nazov
        createdAt
      }
    }
  }
}
```

Wrap your application in Query provider (additional config can be left empty)

```

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ...

const queryClient = new QueryClient();

// ...

  ReactDOM.render(
    // ...
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
    // ...
    rootElement,
  );
}

```

Add following to package.json `"scripts"` (or use `npx` in next step like so - `npx graphql-codegen`):

```
"codegen": "graphql-codegen",
```

Run codegen, you shouldn't see any errors:

```
npm run codegen
```

You can now import `useXQuery` hooks from `./graphql/index.ts` like so:

```
import { useFixpointyQuery } from "../../graphql";

// ...

// example usage with i18n and localized content
const { i18n } = useTranslation();
const { data, isLoading, error } = useFixpointyQuery({ locale: i18n.language });
```
