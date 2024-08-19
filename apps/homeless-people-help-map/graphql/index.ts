import { useQuery, UseQueryOptions } from '@tanstack/react-query';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };

function fetcher<TData, TVariables>(query: string, variables?: TVariables) {
  return async (): Promise<TData> => {
    const res = await fetch("https://general-strapi.bratislava.sk/graphql", {
    method: "POST",
    ...({"headers":{"Content-Type":"application/json"}}),
      body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0];

      throw new Error(message);
    }

    return json.data;
  }
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  I18NLocaleCode: { input: any; output: any; }
  JSON: { input: any; output: any; }
  Long: { input: any; output: any; }
  Upload: { input: any; output: any; }
};

export type BooleanFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  contains?: InputMaybe<Scalars['Boolean']['input']>;
  containsi?: InputMaybe<Scalars['Boolean']['input']>;
  endsWith?: InputMaybe<Scalars['Boolean']['input']>;
  eq?: InputMaybe<Scalars['Boolean']['input']>;
  eqi?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['Boolean']['input']>;
  gte?: InputMaybe<Scalars['Boolean']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  lt?: InputMaybe<Scalars['Boolean']['input']>;
  lte?: InputMaybe<Scalars['Boolean']['input']>;
  ne?: InputMaybe<Scalars['Boolean']['input']>;
  not?: InputMaybe<BooleanFilterInput>;
  notContains?: InputMaybe<Scalars['Boolean']['input']>;
  notContainsi?: InputMaybe<Scalars['Boolean']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  notNull?: InputMaybe<Scalars['Boolean']['input']>;
  null?: InputMaybe<Scalars['Boolean']['input']>;
  or?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  startsWith?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Cvicka = {
  __typename?: 'Cvicka';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  fotka?: Maybe<UploadFileEntityResponse>;
  kategoriaSportoviska?: Maybe<Scalars['String']['output']>;
  latitude?: Maybe<Scalars['Float']['output']>;
  locale?: Maybe<Scalars['String']['output']>;
  localizations?: Maybe<CvickaRelationResponseCollection>;
  longitude?: Maybe<Scalars['Float']['output']>;
  navigovatLink?: Maybe<Scalars['String']['output']>;
  nazov?: Maybe<Scalars['String']['output']>;
  sport?: Maybe<Scalars['String']['output']>;
  umiestnenie?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  webLink?: Maybe<Scalars['String']['output']>;
};


export type CvickaLocalizationsArgs = {
  filters?: InputMaybe<CvickaFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type CvickaEntity = {
  __typename?: 'CvickaEntity';
  attributes?: Maybe<Cvicka>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type CvickaEntityResponse = {
  __typename?: 'CvickaEntityResponse';
  data?: Maybe<CvickaEntity>;
};

export type CvickaEntityResponseCollection = {
  __typename?: 'CvickaEntityResponseCollection';
  data: Array<CvickaEntity>;
  meta: ResponseCollectionMeta;
};

export type CvickaFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<CvickaFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  kategoriaSportoviska?: InputMaybe<StringFilterInput>;
  latitude?: InputMaybe<FloatFilterInput>;
  locale?: InputMaybe<StringFilterInput>;
  localizations?: InputMaybe<CvickaFiltersInput>;
  longitude?: InputMaybe<FloatFilterInput>;
  navigovatLink?: InputMaybe<StringFilterInput>;
  nazov?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<CvickaFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<CvickaFiltersInput>>>;
  sport?: InputMaybe<StringFilterInput>;
  umiestnenie?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
  webLink?: InputMaybe<StringFilterInput>;
};

export type CvickaInput = {
  fotka?: InputMaybe<Scalars['ID']['input']>;
  kategoriaSportoviska?: InputMaybe<Scalars['String']['input']>;
  latitude?: InputMaybe<Scalars['Float']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  navigovatLink?: InputMaybe<Scalars['String']['input']>;
  nazov?: InputMaybe<Scalars['String']['input']>;
  sport?: InputMaybe<Scalars['String']['input']>;
  umiestnenie?: InputMaybe<Scalars['String']['input']>;
  webLink?: InputMaybe<Scalars['String']['input']>;
};

export type CvickaRelationResponseCollection = {
  __typename?: 'CvickaRelationResponseCollection';
  data: Array<CvickaEntity>;
};

export type DateTimeFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  contains?: InputMaybe<Scalars['DateTime']['input']>;
  containsi?: InputMaybe<Scalars['DateTime']['input']>;
  endsWith?: InputMaybe<Scalars['DateTime']['input']>;
  eq?: InputMaybe<Scalars['DateTime']['input']>;
  eqi?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  ne?: InputMaybe<Scalars['DateTime']['input']>;
  not?: InputMaybe<DateTimeFilterInput>;
  notContains?: InputMaybe<Scalars['DateTime']['input']>;
  notContainsi?: InputMaybe<Scalars['DateTime']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  notNull?: InputMaybe<Scalars['Boolean']['input']>;
  null?: InputMaybe<Scalars['Boolean']['input']>;
  or?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  startsWith?: InputMaybe<Scalars['DateTime']['input']>;
};

export type FileInfoInput = {
  alternativeText?: InputMaybe<Scalars['String']['input']>;
  caption?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type Fixpointy = {
  __typename?: 'Fixpointy';
  Adresa?: Maybe<Scalars['String']['output']>;
  Latitude?: Maybe<Scalars['Float']['output']>;
  Longitude?: Maybe<Scalars['Float']['output']>;
  Nazov?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  locale?: Maybe<Scalars['String']['output']>;
  localizations?: Maybe<FixpointyRelationResponseCollection>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


export type FixpointyLocalizationsArgs = {
  filters?: InputMaybe<FixpointyFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type FixpointyEntity = {
  __typename?: 'FixpointyEntity';
  attributes?: Maybe<Fixpointy>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type FixpointyEntityResponse = {
  __typename?: 'FixpointyEntityResponse';
  data?: Maybe<FixpointyEntity>;
};

export type FixpointyEntityResponseCollection = {
  __typename?: 'FixpointyEntityResponseCollection';
  data: Array<FixpointyEntity>;
  meta: ResponseCollectionMeta;
};

export type FixpointyFiltersInput = {
  Adresa?: InputMaybe<StringFilterInput>;
  Latitude?: InputMaybe<FloatFilterInput>;
  Longitude?: InputMaybe<FloatFilterInput>;
  Nazov?: InputMaybe<StringFilterInput>;
  and?: InputMaybe<Array<InputMaybe<FixpointyFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  locale?: InputMaybe<StringFilterInput>;
  localizations?: InputMaybe<FixpointyFiltersInput>;
  not?: InputMaybe<FixpointyFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<FixpointyFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type FixpointyInput = {
  Adresa?: InputMaybe<Scalars['String']['input']>;
  Latitude?: InputMaybe<Scalars['Float']['input']>;
  Longitude?: InputMaybe<Scalars['Float']['input']>;
  Nazov?: InputMaybe<Scalars['String']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type FixpointyRelationResponseCollection = {
  __typename?: 'FixpointyRelationResponseCollection';
  data: Array<FixpointyEntity>;
};

export type FloatFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  contains?: InputMaybe<Scalars['Float']['input']>;
  containsi?: InputMaybe<Scalars['Float']['input']>;
  endsWith?: InputMaybe<Scalars['Float']['input']>;
  eq?: InputMaybe<Scalars['Float']['input']>;
  eqi?: InputMaybe<Scalars['Float']['input']>;
  gt?: InputMaybe<Scalars['Float']['input']>;
  gte?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  lt?: InputMaybe<Scalars['Float']['input']>;
  lte?: InputMaybe<Scalars['Float']['input']>;
  ne?: InputMaybe<Scalars['Float']['input']>;
  not?: InputMaybe<FloatFilterInput>;
  notContains?: InputMaybe<Scalars['Float']['input']>;
  notContainsi?: InputMaybe<Scalars['Float']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  notNull?: InputMaybe<Scalars['Boolean']['input']>;
  null?: InputMaybe<Scalars['Boolean']['input']>;
  or?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  startsWith?: InputMaybe<Scalars['Float']['input']>;
};

export type GenericMorph = Cvicka | Fixpointy | I18NLocale | Kupaliska | LinkyPomoci | PitneFontanky | Rozkopavky | SluzbyPreLudiBezDomova | TerenneSluzby | UploadFile | UploadFolder | UsersPermissionsPermission | UsersPermissionsRole | UsersPermissionsUser;

export type I18NLocale = {
  __typename?: 'I18NLocale';
  code?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type I18NLocaleEntity = {
  __typename?: 'I18NLocaleEntity';
  attributes?: Maybe<I18NLocale>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type I18NLocaleEntityResponse = {
  __typename?: 'I18NLocaleEntityResponse';
  data?: Maybe<I18NLocaleEntity>;
};

export type I18NLocaleEntityResponseCollection = {
  __typename?: 'I18NLocaleEntityResponseCollection';
  data: Array<I18NLocaleEntity>;
  meta: ResponseCollectionMeta;
};

export type I18NLocaleFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<I18NLocaleFiltersInput>>>;
  code?: InputMaybe<StringFilterInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<I18NLocaleFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<I18NLocaleFiltersInput>>>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type IdFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contains?: InputMaybe<Scalars['ID']['input']>;
  containsi?: InputMaybe<Scalars['ID']['input']>;
  endsWith?: InputMaybe<Scalars['ID']['input']>;
  eq?: InputMaybe<Scalars['ID']['input']>;
  eqi?: InputMaybe<Scalars['ID']['input']>;
  gt?: InputMaybe<Scalars['ID']['input']>;
  gte?: InputMaybe<Scalars['ID']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  lt?: InputMaybe<Scalars['ID']['input']>;
  lte?: InputMaybe<Scalars['ID']['input']>;
  ne?: InputMaybe<Scalars['ID']['input']>;
  not?: InputMaybe<IdFilterInput>;
  notContains?: InputMaybe<Scalars['ID']['input']>;
  notContainsi?: InputMaybe<Scalars['ID']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  notNull?: InputMaybe<Scalars['Boolean']['input']>;
  null?: InputMaybe<Scalars['Boolean']['input']>;
  or?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  startsWith?: InputMaybe<Scalars['ID']['input']>;
};

export type IntFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  contains?: InputMaybe<Scalars['Int']['input']>;
  containsi?: InputMaybe<Scalars['Int']['input']>;
  endsWith?: InputMaybe<Scalars['Int']['input']>;
  eq?: InputMaybe<Scalars['Int']['input']>;
  eqi?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  ne?: InputMaybe<Scalars['Int']['input']>;
  not?: InputMaybe<IntFilterInput>;
  notContains?: InputMaybe<Scalars['Int']['input']>;
  notContainsi?: InputMaybe<Scalars['Int']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  notNull?: InputMaybe<Scalars['Boolean']['input']>;
  null?: InputMaybe<Scalars['Boolean']['input']>;
  or?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  startsWith?: InputMaybe<Scalars['Int']['input']>;
};

export type JsonFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['JSON']['input']>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars['JSON']['input']>>>;
  contains?: InputMaybe<Scalars['JSON']['input']>;
  containsi?: InputMaybe<Scalars['JSON']['input']>;
  endsWith?: InputMaybe<Scalars['JSON']['input']>;
  eq?: InputMaybe<Scalars['JSON']['input']>;
  eqi?: InputMaybe<Scalars['JSON']['input']>;
  gt?: InputMaybe<Scalars['JSON']['input']>;
  gte?: InputMaybe<Scalars['JSON']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['JSON']['input']>>>;
  lt?: InputMaybe<Scalars['JSON']['input']>;
  lte?: InputMaybe<Scalars['JSON']['input']>;
  ne?: InputMaybe<Scalars['JSON']['input']>;
  not?: InputMaybe<JsonFilterInput>;
  notContains?: InputMaybe<Scalars['JSON']['input']>;
  notContainsi?: InputMaybe<Scalars['JSON']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['JSON']['input']>>>;
  notNull?: InputMaybe<Scalars['Boolean']['input']>;
  null?: InputMaybe<Scalars['Boolean']['input']>;
  or?: InputMaybe<Array<InputMaybe<Scalars['JSON']['input']>>>;
  startsWith?: InputMaybe<Scalars['JSON']['input']>;
};

export type Kupaliska = {
  __typename?: 'Kupaliska';
  adresa?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  fotka?: Maybe<UploadFileEntityResponse>;
  kategoriaSportoviska?: Maybe<Scalars['String']['output']>;
  latitude?: Maybe<Scalars['Float']['output']>;
  listokLink?: Maybe<Scalars['String']['output']>;
  locale?: Maybe<Scalars['String']['output']>;
  localizations?: Maybe<KupaliskaRelationResponseCollection>;
  longitude?: Maybe<Scalars['Float']['output']>;
  navigovatLink?: Maybe<Scalars['String']['output']>;
  nazov?: Maybe<Scalars['String']['output']>;
  otvaracieHodiny?: Maybe<Scalars['String']['output']>;
  oznam?: Maybe<Scalars['String']['output']>;
  popis?: Maybe<Scalars['String']['output']>;
  sluzby?: Maybe<Scalars['String']['output']>;
  sport?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  webLink?: Maybe<Scalars['String']['output']>;
};


export type KupaliskaLocalizationsArgs = {
  filters?: InputMaybe<KupaliskaFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type KupaliskaEntity = {
  __typename?: 'KupaliskaEntity';
  attributes?: Maybe<Kupaliska>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type KupaliskaEntityResponse = {
  __typename?: 'KupaliskaEntityResponse';
  data?: Maybe<KupaliskaEntity>;
};

export type KupaliskaEntityResponseCollection = {
  __typename?: 'KupaliskaEntityResponseCollection';
  data: Array<KupaliskaEntity>;
  meta: ResponseCollectionMeta;
};

export type KupaliskaFiltersInput = {
  adresa?: InputMaybe<StringFilterInput>;
  and?: InputMaybe<Array<InputMaybe<KupaliskaFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  email?: InputMaybe<StringFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  kategoriaSportoviska?: InputMaybe<StringFilterInput>;
  latitude?: InputMaybe<FloatFilterInput>;
  listokLink?: InputMaybe<StringFilterInput>;
  locale?: InputMaybe<StringFilterInput>;
  localizations?: InputMaybe<KupaliskaFiltersInput>;
  longitude?: InputMaybe<FloatFilterInput>;
  navigovatLink?: InputMaybe<StringFilterInput>;
  nazov?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<KupaliskaFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<KupaliskaFiltersInput>>>;
  otvaracieHodiny?: InputMaybe<StringFilterInput>;
  oznam?: InputMaybe<StringFilterInput>;
  popis?: InputMaybe<StringFilterInput>;
  sluzby?: InputMaybe<StringFilterInput>;
  sport?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
  webLink?: InputMaybe<StringFilterInput>;
};

export type KupaliskaInput = {
  adresa?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  fotka?: InputMaybe<Scalars['ID']['input']>;
  kategoriaSportoviska?: InputMaybe<Scalars['String']['input']>;
  latitude?: InputMaybe<Scalars['Float']['input']>;
  listokLink?: InputMaybe<Scalars['String']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  navigovatLink?: InputMaybe<Scalars['String']['input']>;
  nazov?: InputMaybe<Scalars['String']['input']>;
  otvaracieHodiny?: InputMaybe<Scalars['String']['input']>;
  oznam?: InputMaybe<Scalars['String']['input']>;
  popis?: InputMaybe<Scalars['String']['input']>;
  sluzby?: InputMaybe<Scalars['String']['input']>;
  sport?: InputMaybe<Scalars['String']['input']>;
  webLink?: InputMaybe<Scalars['String']['input']>;
};

export type KupaliskaRelationResponseCollection = {
  __typename?: 'KupaliskaRelationResponseCollection';
  data: Array<KupaliskaEntity>;
};

export type LinkyPomoci = {
  __typename?: 'LinkyPomoci';
  Cena?: Maybe<Scalars['String']['output']>;
  Email?: Maybe<Scalars['String']['output']>;
  Nazov?: Maybe<Scalars['String']['output']>;
  Popis?: Maybe<Scalars['String']['output']>;
  Prevadzka?: Maybe<Scalars['String']['output']>;
  Prevadzkovatel?: Maybe<Scalars['String']['output']>;
  Telefon?: Maybe<Scalars['Long']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  locale?: Maybe<Scalars['String']['output']>;
  localizations?: Maybe<LinkyPomociRelationResponseCollection>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


export type LinkyPomociLocalizationsArgs = {
  filters?: InputMaybe<LinkyPomociFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type LinkyPomociEntity = {
  __typename?: 'LinkyPomociEntity';
  attributes?: Maybe<LinkyPomoci>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type LinkyPomociEntityResponse = {
  __typename?: 'LinkyPomociEntityResponse';
  data?: Maybe<LinkyPomociEntity>;
};

export type LinkyPomociEntityResponseCollection = {
  __typename?: 'LinkyPomociEntityResponseCollection';
  data: Array<LinkyPomociEntity>;
  meta: ResponseCollectionMeta;
};

export type LinkyPomociFiltersInput = {
  Cena?: InputMaybe<StringFilterInput>;
  Email?: InputMaybe<StringFilterInput>;
  Nazov?: InputMaybe<StringFilterInput>;
  Popis?: InputMaybe<StringFilterInput>;
  Prevadzka?: InputMaybe<StringFilterInput>;
  Prevadzkovatel?: InputMaybe<StringFilterInput>;
  Telefon?: InputMaybe<LongFilterInput>;
  and?: InputMaybe<Array<InputMaybe<LinkyPomociFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  locale?: InputMaybe<StringFilterInput>;
  localizations?: InputMaybe<LinkyPomociFiltersInput>;
  not?: InputMaybe<LinkyPomociFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<LinkyPomociFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type LinkyPomociInput = {
  Cena?: InputMaybe<Scalars['String']['input']>;
  Email?: InputMaybe<Scalars['String']['input']>;
  Nazov?: InputMaybe<Scalars['String']['input']>;
  Popis?: InputMaybe<Scalars['String']['input']>;
  Prevadzka?: InputMaybe<Scalars['String']['input']>;
  Prevadzkovatel?: InputMaybe<Scalars['String']['input']>;
  Telefon?: InputMaybe<Scalars['Long']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type LinkyPomociRelationResponseCollection = {
  __typename?: 'LinkyPomociRelationResponseCollection';
  data: Array<LinkyPomociEntity>;
};

export type LongFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['Long']['input']>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars['Long']['input']>>>;
  contains?: InputMaybe<Scalars['Long']['input']>;
  containsi?: InputMaybe<Scalars['Long']['input']>;
  endsWith?: InputMaybe<Scalars['Long']['input']>;
  eq?: InputMaybe<Scalars['Long']['input']>;
  eqi?: InputMaybe<Scalars['Long']['input']>;
  gt?: InputMaybe<Scalars['Long']['input']>;
  gte?: InputMaybe<Scalars['Long']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Long']['input']>>>;
  lt?: InputMaybe<Scalars['Long']['input']>;
  lte?: InputMaybe<Scalars['Long']['input']>;
  ne?: InputMaybe<Scalars['Long']['input']>;
  not?: InputMaybe<LongFilterInput>;
  notContains?: InputMaybe<Scalars['Long']['input']>;
  notContainsi?: InputMaybe<Scalars['Long']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Long']['input']>>>;
  notNull?: InputMaybe<Scalars['Boolean']['input']>;
  null?: InputMaybe<Scalars['Boolean']['input']>;
  or?: InputMaybe<Array<InputMaybe<Scalars['Long']['input']>>>;
  startsWith?: InputMaybe<Scalars['Long']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Change user password. Confirm with the current password. */
  changePassword?: Maybe<UsersPermissionsLoginPayload>;
  createCvicka?: Maybe<CvickaEntityResponse>;
  createCvickaLocalization?: Maybe<CvickaEntityResponse>;
  createFixpointy?: Maybe<FixpointyEntityResponse>;
  createFixpointyLocalization?: Maybe<FixpointyEntityResponse>;
  createKupaliska?: Maybe<KupaliskaEntityResponse>;
  createKupaliskaLocalization?: Maybe<KupaliskaEntityResponse>;
  createLinkyPomoci?: Maybe<LinkyPomociEntityResponse>;
  createLinkyPomociLocalization?: Maybe<LinkyPomociEntityResponse>;
  createPitneFontanky?: Maybe<PitneFontankyEntityResponse>;
  createPitneFontankyLocalization?: Maybe<PitneFontankyEntityResponse>;
  createRozkopavkyLocalization?: Maybe<RozkopavkyEntityResponse>;
  createSluzbyPreLudiBezDomova?: Maybe<SluzbyPreLudiBezDomovaEntityResponse>;
  createSluzbyPreLudiBezDomovaLocalization?: Maybe<SluzbyPreLudiBezDomovaEntityResponse>;
  createTerenneSluzby?: Maybe<TerenneSluzbyEntityResponse>;
  createTerenneSluzbyLocalization?: Maybe<TerenneSluzbyEntityResponse>;
  createUploadFile?: Maybe<UploadFileEntityResponse>;
  createUploadFolder?: Maybe<UploadFolderEntityResponse>;
  /** Create a new role */
  createUsersPermissionsRole?: Maybe<UsersPermissionsCreateRolePayload>;
  /** Create a new user */
  createUsersPermissionsUser: UsersPermissionsUserEntityResponse;
  deleteCvicka?: Maybe<CvickaEntityResponse>;
  deleteFixpointy?: Maybe<FixpointyEntityResponse>;
  deleteKupaliska?: Maybe<KupaliskaEntityResponse>;
  deleteLinkyPomoci?: Maybe<LinkyPomociEntityResponse>;
  deletePitneFontanky?: Maybe<PitneFontankyEntityResponse>;
  deleteRozkopavky?: Maybe<RozkopavkyEntityResponse>;
  deleteSluzbyPreLudiBezDomova?: Maybe<SluzbyPreLudiBezDomovaEntityResponse>;
  deleteTerenneSluzby?: Maybe<TerenneSluzbyEntityResponse>;
  deleteUploadFile?: Maybe<UploadFileEntityResponse>;
  deleteUploadFolder?: Maybe<UploadFolderEntityResponse>;
  /** Delete an existing role */
  deleteUsersPermissionsRole?: Maybe<UsersPermissionsDeleteRolePayload>;
  /** Delete an existing user */
  deleteUsersPermissionsUser: UsersPermissionsUserEntityResponse;
  /** Confirm an email users email address */
  emailConfirmation?: Maybe<UsersPermissionsLoginPayload>;
  /** Request a reset password token */
  forgotPassword?: Maybe<UsersPermissionsPasswordPayload>;
  login: UsersPermissionsLoginPayload;
  multipleUpload: Array<Maybe<UploadFileEntityResponse>>;
  /** Register a user */
  register: UsersPermissionsLoginPayload;
  removeFile?: Maybe<UploadFileEntityResponse>;
  /** Reset user password. Confirm with a code (resetToken from forgotPassword) */
  resetPassword?: Maybe<UsersPermissionsLoginPayload>;
  updateCvicka?: Maybe<CvickaEntityResponse>;
  updateFileInfo: UploadFileEntityResponse;
  updateFixpointy?: Maybe<FixpointyEntityResponse>;
  updateKupaliska?: Maybe<KupaliskaEntityResponse>;
  updateLinkyPomoci?: Maybe<LinkyPomociEntityResponse>;
  updatePitneFontanky?: Maybe<PitneFontankyEntityResponse>;
  updateRozkopavky?: Maybe<RozkopavkyEntityResponse>;
  updateSluzbyPreLudiBezDomova?: Maybe<SluzbyPreLudiBezDomovaEntityResponse>;
  updateTerenneSluzby?: Maybe<TerenneSluzbyEntityResponse>;
  updateUploadFile?: Maybe<UploadFileEntityResponse>;
  updateUploadFolder?: Maybe<UploadFolderEntityResponse>;
  /** Update an existing role */
  updateUsersPermissionsRole?: Maybe<UsersPermissionsUpdateRolePayload>;
  /** Update an existing user */
  updateUsersPermissionsUser: UsersPermissionsUserEntityResponse;
  upload: UploadFileEntityResponse;
};


export type MutationChangePasswordArgs = {
  currentPassword: Scalars['String']['input'];
  password: Scalars['String']['input'];
  passwordConfirmation: Scalars['String']['input'];
};


export type MutationCreateCvickaArgs = {
  data: CvickaInput;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationCreateCvickaLocalizationArgs = {
  data?: InputMaybe<CvickaInput>;
  id?: InputMaybe<Scalars['ID']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationCreateFixpointyArgs = {
  data: FixpointyInput;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationCreateFixpointyLocalizationArgs = {
  data?: InputMaybe<FixpointyInput>;
  id?: InputMaybe<Scalars['ID']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationCreateKupaliskaArgs = {
  data: KupaliskaInput;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationCreateKupaliskaLocalizationArgs = {
  data?: InputMaybe<KupaliskaInput>;
  id?: InputMaybe<Scalars['ID']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationCreateLinkyPomociArgs = {
  data: LinkyPomociInput;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationCreateLinkyPomociLocalizationArgs = {
  data?: InputMaybe<LinkyPomociInput>;
  id?: InputMaybe<Scalars['ID']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationCreatePitneFontankyArgs = {
  data: PitneFontankyInput;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationCreatePitneFontankyLocalizationArgs = {
  data?: InputMaybe<PitneFontankyInput>;
  id?: InputMaybe<Scalars['ID']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationCreateRozkopavkyLocalizationArgs = {
  data?: InputMaybe<RozkopavkyInput>;
  id?: InputMaybe<Scalars['ID']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationCreateSluzbyPreLudiBezDomovaArgs = {
  data: SluzbyPreLudiBezDomovaInput;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationCreateSluzbyPreLudiBezDomovaLocalizationArgs = {
  data?: InputMaybe<SluzbyPreLudiBezDomovaInput>;
  id?: InputMaybe<Scalars['ID']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationCreateTerenneSluzbyArgs = {
  data: TerenneSluzbyInput;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationCreateTerenneSluzbyLocalizationArgs = {
  data?: InputMaybe<TerenneSluzbyInput>;
  id?: InputMaybe<Scalars['ID']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationCreateUploadFileArgs = {
  data: UploadFileInput;
};


export type MutationCreateUploadFolderArgs = {
  data: UploadFolderInput;
};


export type MutationCreateUsersPermissionsRoleArgs = {
  data: UsersPermissionsRoleInput;
};


export type MutationCreateUsersPermissionsUserArgs = {
  data: UsersPermissionsUserInput;
};


export type MutationDeleteCvickaArgs = {
  id: Scalars['ID']['input'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationDeleteFixpointyArgs = {
  id: Scalars['ID']['input'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationDeleteKupaliskaArgs = {
  id: Scalars['ID']['input'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationDeleteLinkyPomociArgs = {
  id: Scalars['ID']['input'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationDeletePitneFontankyArgs = {
  id: Scalars['ID']['input'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationDeleteRozkopavkyArgs = {
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationDeleteSluzbyPreLudiBezDomovaArgs = {
  id: Scalars['ID']['input'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationDeleteTerenneSluzbyArgs = {
  id: Scalars['ID']['input'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationDeleteUploadFileArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUploadFolderArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUsersPermissionsRoleArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUsersPermissionsUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationEmailConfirmationArgs = {
  confirmation: Scalars['String']['input'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  input: UsersPermissionsLoginInput;
};


export type MutationMultipleUploadArgs = {
  field?: InputMaybe<Scalars['String']['input']>;
  files: Array<InputMaybe<Scalars['Upload']['input']>>;
  ref?: InputMaybe<Scalars['String']['input']>;
  refId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationRegisterArgs = {
  input: UsersPermissionsRegisterInput;
};


export type MutationRemoveFileArgs = {
  id: Scalars['ID']['input'];
};


export type MutationResetPasswordArgs = {
  code: Scalars['String']['input'];
  password: Scalars['String']['input'];
  passwordConfirmation: Scalars['String']['input'];
};


export type MutationUpdateCvickaArgs = {
  data: CvickaInput;
  id: Scalars['ID']['input'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationUpdateFileInfoArgs = {
  id: Scalars['ID']['input'];
  info?: InputMaybe<FileInfoInput>;
};


export type MutationUpdateFixpointyArgs = {
  data: FixpointyInput;
  id: Scalars['ID']['input'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationUpdateKupaliskaArgs = {
  data: KupaliskaInput;
  id: Scalars['ID']['input'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationUpdateLinkyPomociArgs = {
  data: LinkyPomociInput;
  id: Scalars['ID']['input'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationUpdatePitneFontankyArgs = {
  data: PitneFontankyInput;
  id: Scalars['ID']['input'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationUpdateRozkopavkyArgs = {
  data: RozkopavkyInput;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationUpdateSluzbyPreLudiBezDomovaArgs = {
  data: SluzbyPreLudiBezDomovaInput;
  id: Scalars['ID']['input'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationUpdateTerenneSluzbyArgs = {
  data: TerenneSluzbyInput;
  id: Scalars['ID']['input'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationUpdateUploadFileArgs = {
  data: UploadFileInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateUploadFolderArgs = {
  data: UploadFolderInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateUsersPermissionsRoleArgs = {
  data: UsersPermissionsRoleInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateUsersPermissionsUserArgs = {
  data: UsersPermissionsUserInput;
  id: Scalars['ID']['input'];
};


export type MutationUploadArgs = {
  field?: InputMaybe<Scalars['String']['input']>;
  file: Scalars['Upload']['input'];
  info?: InputMaybe<FileInfoInput>;
  ref?: InputMaybe<Scalars['String']['input']>;
  refId?: InputMaybe<Scalars['ID']['input']>;
};

export type Pagination = {
  __typename?: 'Pagination';
  page: Scalars['Int']['output'];
  pageCount: Scalars['Int']['output'];
  pageSize: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type PaginationArg = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  start?: InputMaybe<Scalars['Int']['input']>;
};

export type PitneFontanky = {
  __typename?: 'PitneFontanky';
  Fotky?: Maybe<UploadFileRelationResponseCollection>;
  Latitude?: Maybe<Scalars['Float']['output']>;
  Longitude?: Maybe<Scalars['Float']['output']>;
  Nazov?: Maybe<Scalars['String']['output']>;
  Rok_spustenia?: Maybe<Scalars['String']['output']>;
  Spravca?: Maybe<Scalars['String']['output']>;
  Stav?: Maybe<Scalars['String']['output']>;
  Typ?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  locale?: Maybe<Scalars['String']['output']>;
  localizations?: Maybe<PitneFontankyRelationResponseCollection>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


export type PitneFontankyFotkyArgs = {
  filters?: InputMaybe<UploadFileFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type PitneFontankyLocalizationsArgs = {
  filters?: InputMaybe<PitneFontankyFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type PitneFontankyEntity = {
  __typename?: 'PitneFontankyEntity';
  attributes?: Maybe<PitneFontanky>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type PitneFontankyEntityResponse = {
  __typename?: 'PitneFontankyEntityResponse';
  data?: Maybe<PitneFontankyEntity>;
};

export type PitneFontankyEntityResponseCollection = {
  __typename?: 'PitneFontankyEntityResponseCollection';
  data: Array<PitneFontankyEntity>;
  meta: ResponseCollectionMeta;
};

export type PitneFontankyFiltersInput = {
  Latitude?: InputMaybe<FloatFilterInput>;
  Longitude?: InputMaybe<FloatFilterInput>;
  Nazov?: InputMaybe<StringFilterInput>;
  Rok_spustenia?: InputMaybe<StringFilterInput>;
  Spravca?: InputMaybe<StringFilterInput>;
  Stav?: InputMaybe<StringFilterInput>;
  Typ?: InputMaybe<StringFilterInput>;
  and?: InputMaybe<Array<InputMaybe<PitneFontankyFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  locale?: InputMaybe<StringFilterInput>;
  localizations?: InputMaybe<PitneFontankyFiltersInput>;
  not?: InputMaybe<PitneFontankyFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<PitneFontankyFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type PitneFontankyInput = {
  Fotky?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  Latitude?: InputMaybe<Scalars['Float']['input']>;
  Longitude?: InputMaybe<Scalars['Float']['input']>;
  Nazov?: InputMaybe<Scalars['String']['input']>;
  Rok_spustenia?: InputMaybe<Scalars['String']['input']>;
  Spravca?: InputMaybe<Scalars['String']['input']>;
  Stav?: InputMaybe<Scalars['String']['input']>;
  Typ?: InputMaybe<Scalars['String']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type PitneFontankyRelationResponseCollection = {
  __typename?: 'PitneFontankyRelationResponseCollection';
  data: Array<PitneFontankyEntity>;
};

export enum PublicationState {
  Live = 'LIVE',
  Preview = 'PREVIEW'
}

export type Query = {
  __typename?: 'Query';
  cvicka?: Maybe<CvickaEntityResponse>;
  cvickas?: Maybe<CvickaEntityResponseCollection>;
  fixpoints?: Maybe<FixpointyEntityResponseCollection>;
  fixpointy?: Maybe<FixpointyEntityResponse>;
  i18NLocale?: Maybe<I18NLocaleEntityResponse>;
  i18NLocales?: Maybe<I18NLocaleEntityResponseCollection>;
  kupaliska?: Maybe<KupaliskaEntityResponse>;
  kupaliskas?: Maybe<KupaliskaEntityResponseCollection>;
  linkyPomoci?: Maybe<LinkyPomociEntityResponse>;
  linkyPomocis?: Maybe<LinkyPomociEntityResponseCollection>;
  me?: Maybe<UsersPermissionsMe>;
  pitneFontankies?: Maybe<PitneFontankyEntityResponseCollection>;
  pitneFontanky?: Maybe<PitneFontankyEntityResponse>;
  rozkopavky?: Maybe<RozkopavkyEntityResponse>;
  sluzbyPreLudiBezDomova?: Maybe<SluzbyPreLudiBezDomovaEntityResponse>;
  sluzbyPreLudiBezDomovas?: Maybe<SluzbyPreLudiBezDomovaEntityResponseCollection>;
  terenneSluzbies?: Maybe<TerenneSluzbyEntityResponseCollection>;
  terenneSluzby?: Maybe<TerenneSluzbyEntityResponse>;
  uploadFile?: Maybe<UploadFileEntityResponse>;
  uploadFiles?: Maybe<UploadFileEntityResponseCollection>;
  uploadFolder?: Maybe<UploadFolderEntityResponse>;
  uploadFolders?: Maybe<UploadFolderEntityResponseCollection>;
  usersPermissionsRole?: Maybe<UsersPermissionsRoleEntityResponse>;
  usersPermissionsRoles?: Maybe<UsersPermissionsRoleEntityResponseCollection>;
  usersPermissionsUser?: Maybe<UsersPermissionsUserEntityResponse>;
  usersPermissionsUsers?: Maybe<UsersPermissionsUserEntityResponseCollection>;
};


export type QueryCvickaArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type QueryCvickasArgs = {
  filters?: InputMaybe<CvickaFiltersInput>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryFixpointsArgs = {
  filters?: InputMaybe<FixpointyFiltersInput>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryFixpointyArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type QueryI18NLocaleArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryI18NLocalesArgs = {
  filters?: InputMaybe<I18NLocaleFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryKupaliskaArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type QueryKupaliskasArgs = {
  filters?: InputMaybe<KupaliskaFiltersInput>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryLinkyPomociArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type QueryLinkyPomocisArgs = {
  filters?: InputMaybe<LinkyPomociFiltersInput>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryPitneFontankiesArgs = {
  filters?: InputMaybe<PitneFontankyFiltersInput>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryPitneFontankyArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type QueryRozkopavkyArgs = {
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type QuerySluzbyPreLudiBezDomovaArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type QuerySluzbyPreLudiBezDomovasArgs = {
  filters?: InputMaybe<SluzbyPreLudiBezDomovaFiltersInput>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryTerenneSluzbiesArgs = {
  filters?: InputMaybe<TerenneSluzbyFiltersInput>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryTerenneSluzbyArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type QueryUploadFileArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryUploadFilesArgs = {
  filters?: InputMaybe<UploadFileFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryUploadFolderArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryUploadFoldersArgs = {
  filters?: InputMaybe<UploadFolderFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryUsersPermissionsRoleArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryUsersPermissionsRolesArgs = {
  filters?: InputMaybe<UsersPermissionsRoleFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryUsersPermissionsUserArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryUsersPermissionsUsersArgs = {
  filters?: InputMaybe<UsersPermissionsUserFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ResponseCollectionMeta = {
  __typename?: 'ResponseCollectionMeta';
  pagination: Pagination;
};

export type Rozkopavky = {
  __typename?: 'Rozkopavky';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  enabled: Scalars['Boolean']['output'];
  locale?: Maybe<Scalars['String']['output']>;
  localizations?: Maybe<RozkopavkyRelationResponseCollection>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type RozkopavkyEntity = {
  __typename?: 'RozkopavkyEntity';
  attributes?: Maybe<Rozkopavky>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type RozkopavkyEntityResponse = {
  __typename?: 'RozkopavkyEntityResponse';
  data?: Maybe<RozkopavkyEntity>;
};

export type RozkopavkyInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type RozkopavkyRelationResponseCollection = {
  __typename?: 'RozkopavkyRelationResponseCollection';
  data: Array<RozkopavkyEntity>;
};

export type SluzbyPreLudiBezDomova = {
  __typename?: 'SluzbyPreLudiBezDomova';
  Adresa?: Maybe<Scalars['String']['output']>;
  Cas?: Maybe<Scalars['String']['output']>;
  Email?: Maybe<Scalars['String']['output']>;
  Hygiena_osatenie?: Maybe<Scalars['String']['output']>;
  Kontaktne_centrum?: Maybe<Scalars['String']['output']>;
  Kultura?: Maybe<Scalars['String']['output']>;
  Latitude?: Maybe<Scalars['Float']['output']>;
  Longitude?: Maybe<Scalars['Float']['output']>;
  Mestska_cast?: Maybe<Scalars['String']['output']>;
  Navigacia?: Maybe<Scalars['String']['output']>;
  Navigovat?: Maybe<Scalars['String']['output']>;
  Nazov?: Maybe<Scalars['String']['output']>;
  Noclah_ubytovanie?: Maybe<Scalars['String']['output']>;
  Popis?: Maybe<Scalars['String']['output']>;
  Poskytovatel?: Maybe<Scalars['String']['output']>;
  Socialne_pravne_poradenstvo?: Maybe<Scalars['String']['output']>;
  Strava?: Maybe<Scalars['String']['output']>;
  Subor?: Maybe<UploadFileRelationResponseCollection>;
  Tagy?: Maybe<Scalars['String']['output']>;
  Telefon?: Maybe<Scalars['Long']['output']>;
  Telefon_popis?: Maybe<Scalars['String']['output']>;
  Web?: Maybe<Scalars['String']['output']>;
  Zdravotne_osetrenie?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  locale?: Maybe<Scalars['String']['output']>;
  localizations?: Maybe<SluzbyPreLudiBezDomovaRelationResponseCollection>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


export type SluzbyPreLudiBezDomovaSuborArgs = {
  filters?: InputMaybe<UploadFileFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type SluzbyPreLudiBezDomovaLocalizationsArgs = {
  filters?: InputMaybe<SluzbyPreLudiBezDomovaFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type SluzbyPreLudiBezDomovaEntity = {
  __typename?: 'SluzbyPreLudiBezDomovaEntity';
  attributes?: Maybe<SluzbyPreLudiBezDomova>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type SluzbyPreLudiBezDomovaEntityResponse = {
  __typename?: 'SluzbyPreLudiBezDomovaEntityResponse';
  data?: Maybe<SluzbyPreLudiBezDomovaEntity>;
};

export type SluzbyPreLudiBezDomovaEntityResponseCollection = {
  __typename?: 'SluzbyPreLudiBezDomovaEntityResponseCollection';
  data: Array<SluzbyPreLudiBezDomovaEntity>;
  meta: ResponseCollectionMeta;
};

export type SluzbyPreLudiBezDomovaFiltersInput = {
  Adresa?: InputMaybe<StringFilterInput>;
  Cas?: InputMaybe<StringFilterInput>;
  Email?: InputMaybe<StringFilterInput>;
  Hygiena_osatenie?: InputMaybe<StringFilterInput>;
  Kontaktne_centrum?: InputMaybe<StringFilterInput>;
  Kultura?: InputMaybe<StringFilterInput>;
  Latitude?: InputMaybe<FloatFilterInput>;
  Longitude?: InputMaybe<FloatFilterInput>;
  Mestska_cast?: InputMaybe<StringFilterInput>;
  Navigacia?: InputMaybe<StringFilterInput>;
  Navigovat?: InputMaybe<StringFilterInput>;
  Nazov?: InputMaybe<StringFilterInput>;
  Noclah_ubytovanie?: InputMaybe<StringFilterInput>;
  Popis?: InputMaybe<StringFilterInput>;
  Poskytovatel?: InputMaybe<StringFilterInput>;
  Socialne_pravne_poradenstvo?: InputMaybe<StringFilterInput>;
  Strava?: InputMaybe<StringFilterInput>;
  Tagy?: InputMaybe<StringFilterInput>;
  Telefon?: InputMaybe<LongFilterInput>;
  Telefon_popis?: InputMaybe<StringFilterInput>;
  Web?: InputMaybe<StringFilterInput>;
  Zdravotne_osetrenie?: InputMaybe<StringFilterInput>;
  and?: InputMaybe<Array<InputMaybe<SluzbyPreLudiBezDomovaFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  locale?: InputMaybe<StringFilterInput>;
  localizations?: InputMaybe<SluzbyPreLudiBezDomovaFiltersInput>;
  not?: InputMaybe<SluzbyPreLudiBezDomovaFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<SluzbyPreLudiBezDomovaFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type SluzbyPreLudiBezDomovaInput = {
  Adresa?: InputMaybe<Scalars['String']['input']>;
  Cas?: InputMaybe<Scalars['String']['input']>;
  Email?: InputMaybe<Scalars['String']['input']>;
  Hygiena_osatenie?: InputMaybe<Scalars['String']['input']>;
  Kontaktne_centrum?: InputMaybe<Scalars['String']['input']>;
  Kultura?: InputMaybe<Scalars['String']['input']>;
  Latitude?: InputMaybe<Scalars['Float']['input']>;
  Longitude?: InputMaybe<Scalars['Float']['input']>;
  Mestska_cast?: InputMaybe<Scalars['String']['input']>;
  Navigacia?: InputMaybe<Scalars['String']['input']>;
  Navigovat?: InputMaybe<Scalars['String']['input']>;
  Nazov?: InputMaybe<Scalars['String']['input']>;
  Noclah_ubytovanie?: InputMaybe<Scalars['String']['input']>;
  Popis?: InputMaybe<Scalars['String']['input']>;
  Poskytovatel?: InputMaybe<Scalars['String']['input']>;
  Socialne_pravne_poradenstvo?: InputMaybe<Scalars['String']['input']>;
  Strava?: InputMaybe<Scalars['String']['input']>;
  Subor?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  Tagy?: InputMaybe<Scalars['String']['input']>;
  Telefon?: InputMaybe<Scalars['Long']['input']>;
  Telefon_popis?: InputMaybe<Scalars['String']['input']>;
  Web?: InputMaybe<Scalars['String']['input']>;
  Zdravotne_osetrenie?: InputMaybe<Scalars['String']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type SluzbyPreLudiBezDomovaRelationResponseCollection = {
  __typename?: 'SluzbyPreLudiBezDomovaRelationResponseCollection';
  data: Array<SluzbyPreLudiBezDomovaEntity>;
};

export type StringFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  contains?: InputMaybe<Scalars['String']['input']>;
  containsi?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  eq?: InputMaybe<Scalars['String']['input']>;
  eqi?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  not?: InputMaybe<StringFilterInput>;
  notContains?: InputMaybe<Scalars['String']['input']>;
  notContainsi?: InputMaybe<Scalars['String']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  notNull?: InputMaybe<Scalars['Boolean']['input']>;
  null?: InputMaybe<Scalars['Boolean']['input']>;
  or?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type TerenneSluzby = {
  __typename?: 'TerenneSluzby';
  Cena_kapacita?: Maybe<Scalars['String']['output']>;
  Dostupnost?: Maybe<Scalars['String']['output']>;
  Lokalita_posobnosti?: Maybe<Scalars['String']['output']>;
  Nazov?: Maybe<Scalars['String']['output']>;
  Poskytovatel?: Maybe<Scalars['String']['output']>;
  Sluzba?: Maybe<Scalars['String']['output']>;
  Telefon?: Maybe<Scalars['Long']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  locale?: Maybe<Scalars['String']['output']>;
  localizations?: Maybe<TerenneSluzbyRelationResponseCollection>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


export type TerenneSluzbyLocalizationsArgs = {
  filters?: InputMaybe<TerenneSluzbyFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type TerenneSluzbyEntity = {
  __typename?: 'TerenneSluzbyEntity';
  attributes?: Maybe<TerenneSluzby>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type TerenneSluzbyEntityResponse = {
  __typename?: 'TerenneSluzbyEntityResponse';
  data?: Maybe<TerenneSluzbyEntity>;
};

export type TerenneSluzbyEntityResponseCollection = {
  __typename?: 'TerenneSluzbyEntityResponseCollection';
  data: Array<TerenneSluzbyEntity>;
  meta: ResponseCollectionMeta;
};

export type TerenneSluzbyFiltersInput = {
  Cena_kapacita?: InputMaybe<StringFilterInput>;
  Dostupnost?: InputMaybe<StringFilterInput>;
  Lokalita_posobnosti?: InputMaybe<StringFilterInput>;
  Nazov?: InputMaybe<StringFilterInput>;
  Poskytovatel?: InputMaybe<StringFilterInput>;
  Sluzba?: InputMaybe<StringFilterInput>;
  Telefon?: InputMaybe<LongFilterInput>;
  and?: InputMaybe<Array<InputMaybe<TerenneSluzbyFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  locale?: InputMaybe<StringFilterInput>;
  localizations?: InputMaybe<TerenneSluzbyFiltersInput>;
  not?: InputMaybe<TerenneSluzbyFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<TerenneSluzbyFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type TerenneSluzbyInput = {
  Cena_kapacita?: InputMaybe<Scalars['String']['input']>;
  Dostupnost?: InputMaybe<Scalars['String']['input']>;
  Lokalita_posobnosti?: InputMaybe<Scalars['String']['input']>;
  Nazov?: InputMaybe<Scalars['String']['input']>;
  Poskytovatel?: InputMaybe<Scalars['String']['input']>;
  Sluzba?: InputMaybe<Scalars['String']['input']>;
  Telefon?: InputMaybe<Scalars['Long']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type TerenneSluzbyRelationResponseCollection = {
  __typename?: 'TerenneSluzbyRelationResponseCollection';
  data: Array<TerenneSluzbyEntity>;
};

export type UploadFile = {
  __typename?: 'UploadFile';
  alternativeText?: Maybe<Scalars['String']['output']>;
  caption?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  ext?: Maybe<Scalars['String']['output']>;
  formats?: Maybe<Scalars['JSON']['output']>;
  hash: Scalars['String']['output'];
  height?: Maybe<Scalars['Int']['output']>;
  mime: Scalars['String']['output'];
  name: Scalars['String']['output'];
  previewUrl?: Maybe<Scalars['String']['output']>;
  provider: Scalars['String']['output'];
  provider_metadata?: Maybe<Scalars['JSON']['output']>;
  related?: Maybe<Array<Maybe<GenericMorph>>>;
  size: Scalars['Float']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  url: Scalars['String']['output'];
  width?: Maybe<Scalars['Int']['output']>;
};

export type UploadFileEntity = {
  __typename?: 'UploadFileEntity';
  attributes?: Maybe<UploadFile>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type UploadFileEntityResponse = {
  __typename?: 'UploadFileEntityResponse';
  data?: Maybe<UploadFileEntity>;
};

export type UploadFileEntityResponseCollection = {
  __typename?: 'UploadFileEntityResponseCollection';
  data: Array<UploadFileEntity>;
  meta: ResponseCollectionMeta;
};

export type UploadFileFiltersInput = {
  alternativeText?: InputMaybe<StringFilterInput>;
  and?: InputMaybe<Array<InputMaybe<UploadFileFiltersInput>>>;
  caption?: InputMaybe<StringFilterInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  ext?: InputMaybe<StringFilterInput>;
  folder?: InputMaybe<UploadFolderFiltersInput>;
  folderPath?: InputMaybe<StringFilterInput>;
  formats?: InputMaybe<JsonFilterInput>;
  hash?: InputMaybe<StringFilterInput>;
  height?: InputMaybe<IntFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  mime?: InputMaybe<StringFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<UploadFileFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<UploadFileFiltersInput>>>;
  previewUrl?: InputMaybe<StringFilterInput>;
  provider?: InputMaybe<StringFilterInput>;
  provider_metadata?: InputMaybe<JsonFilterInput>;
  size?: InputMaybe<FloatFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
  url?: InputMaybe<StringFilterInput>;
  width?: InputMaybe<IntFilterInput>;
};

export type UploadFileInput = {
  alternativeText?: InputMaybe<Scalars['String']['input']>;
  caption?: InputMaybe<Scalars['String']['input']>;
  ext?: InputMaybe<Scalars['String']['input']>;
  folder?: InputMaybe<Scalars['ID']['input']>;
  folderPath?: InputMaybe<Scalars['String']['input']>;
  formats?: InputMaybe<Scalars['JSON']['input']>;
  hash?: InputMaybe<Scalars['String']['input']>;
  height?: InputMaybe<Scalars['Int']['input']>;
  mime?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  previewUrl?: InputMaybe<Scalars['String']['input']>;
  provider?: InputMaybe<Scalars['String']['input']>;
  provider_metadata?: InputMaybe<Scalars['JSON']['input']>;
  size?: InputMaybe<Scalars['Float']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  width?: InputMaybe<Scalars['Int']['input']>;
};

export type UploadFileRelationResponseCollection = {
  __typename?: 'UploadFileRelationResponseCollection';
  data: Array<UploadFileEntity>;
};

export type UploadFolder = {
  __typename?: 'UploadFolder';
  children?: Maybe<UploadFolderRelationResponseCollection>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  files?: Maybe<UploadFileRelationResponseCollection>;
  name: Scalars['String']['output'];
  parent?: Maybe<UploadFolderEntityResponse>;
  path: Scalars['String']['output'];
  pathId: Scalars['Int']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


export type UploadFolderChildrenArgs = {
  filters?: InputMaybe<UploadFolderFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type UploadFolderFilesArgs = {
  filters?: InputMaybe<UploadFileFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type UploadFolderEntity = {
  __typename?: 'UploadFolderEntity';
  attributes?: Maybe<UploadFolder>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type UploadFolderEntityResponse = {
  __typename?: 'UploadFolderEntityResponse';
  data?: Maybe<UploadFolderEntity>;
};

export type UploadFolderEntityResponseCollection = {
  __typename?: 'UploadFolderEntityResponseCollection';
  data: Array<UploadFolderEntity>;
  meta: ResponseCollectionMeta;
};

export type UploadFolderFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<UploadFolderFiltersInput>>>;
  children?: InputMaybe<UploadFolderFiltersInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  files?: InputMaybe<UploadFileFiltersInput>;
  id?: InputMaybe<IdFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<UploadFolderFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<UploadFolderFiltersInput>>>;
  parent?: InputMaybe<UploadFolderFiltersInput>;
  path?: InputMaybe<StringFilterInput>;
  pathId?: InputMaybe<IntFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type UploadFolderInput = {
  children?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  files?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  parent?: InputMaybe<Scalars['ID']['input']>;
  path?: InputMaybe<Scalars['String']['input']>;
  pathId?: InputMaybe<Scalars['Int']['input']>;
};

export type UploadFolderRelationResponseCollection = {
  __typename?: 'UploadFolderRelationResponseCollection';
  data: Array<UploadFolderEntity>;
};

export type UsersPermissionsCreateRolePayload = {
  __typename?: 'UsersPermissionsCreateRolePayload';
  ok: Scalars['Boolean']['output'];
};

export type UsersPermissionsDeleteRolePayload = {
  __typename?: 'UsersPermissionsDeleteRolePayload';
  ok: Scalars['Boolean']['output'];
};

export type UsersPermissionsLoginInput = {
  identifier: Scalars['String']['input'];
  password: Scalars['String']['input'];
  provider?: Scalars['String']['input'];
};

export type UsersPermissionsLoginPayload = {
  __typename?: 'UsersPermissionsLoginPayload';
  jwt?: Maybe<Scalars['String']['output']>;
  user: UsersPermissionsMe;
};

export type UsersPermissionsMe = {
  __typename?: 'UsersPermissionsMe';
  blocked?: Maybe<Scalars['Boolean']['output']>;
  confirmed?: Maybe<Scalars['Boolean']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  role?: Maybe<UsersPermissionsMeRole>;
  username: Scalars['String']['output'];
};

export type UsersPermissionsMeRole = {
  __typename?: 'UsersPermissionsMeRole';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  type?: Maybe<Scalars['String']['output']>;
};

export type UsersPermissionsPasswordPayload = {
  __typename?: 'UsersPermissionsPasswordPayload';
  ok: Scalars['Boolean']['output'];
};

export type UsersPermissionsPermission = {
  __typename?: 'UsersPermissionsPermission';
  action: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  role?: Maybe<UsersPermissionsRoleEntityResponse>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type UsersPermissionsPermissionEntity = {
  __typename?: 'UsersPermissionsPermissionEntity';
  attributes?: Maybe<UsersPermissionsPermission>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type UsersPermissionsPermissionFiltersInput = {
  action?: InputMaybe<StringFilterInput>;
  and?: InputMaybe<Array<InputMaybe<UsersPermissionsPermissionFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  not?: InputMaybe<UsersPermissionsPermissionFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<UsersPermissionsPermissionFiltersInput>>>;
  role?: InputMaybe<UsersPermissionsRoleFiltersInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type UsersPermissionsPermissionRelationResponseCollection = {
  __typename?: 'UsersPermissionsPermissionRelationResponseCollection';
  data: Array<UsersPermissionsPermissionEntity>;
};

export type UsersPermissionsRegisterInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type UsersPermissionsRole = {
  __typename?: 'UsersPermissionsRole';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  permissions?: Maybe<UsersPermissionsPermissionRelationResponseCollection>;
  type?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  users?: Maybe<UsersPermissionsUserRelationResponseCollection>;
};


export type UsersPermissionsRolePermissionsArgs = {
  filters?: InputMaybe<UsersPermissionsPermissionFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type UsersPermissionsRoleUsersArgs = {
  filters?: InputMaybe<UsersPermissionsUserFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type UsersPermissionsRoleEntity = {
  __typename?: 'UsersPermissionsRoleEntity';
  attributes?: Maybe<UsersPermissionsRole>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type UsersPermissionsRoleEntityResponse = {
  __typename?: 'UsersPermissionsRoleEntityResponse';
  data?: Maybe<UsersPermissionsRoleEntity>;
};

export type UsersPermissionsRoleEntityResponseCollection = {
  __typename?: 'UsersPermissionsRoleEntityResponseCollection';
  data: Array<UsersPermissionsRoleEntity>;
  meta: ResponseCollectionMeta;
};

export type UsersPermissionsRoleFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<UsersPermissionsRoleFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  description?: InputMaybe<StringFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<UsersPermissionsRoleFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<UsersPermissionsRoleFiltersInput>>>;
  permissions?: InputMaybe<UsersPermissionsPermissionFiltersInput>;
  type?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
  users?: InputMaybe<UsersPermissionsUserFiltersInput>;
};

export type UsersPermissionsRoleInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  permissions?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  type?: InputMaybe<Scalars['String']['input']>;
  users?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};

export type UsersPermissionsUpdateRolePayload = {
  __typename?: 'UsersPermissionsUpdateRolePayload';
  ok: Scalars['Boolean']['output'];
};

export type UsersPermissionsUser = {
  __typename?: 'UsersPermissionsUser';
  blocked?: Maybe<Scalars['Boolean']['output']>;
  confirmed?: Maybe<Scalars['Boolean']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  email: Scalars['String']['output'];
  provider?: Maybe<Scalars['String']['output']>;
  role?: Maybe<UsersPermissionsRoleEntityResponse>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  username: Scalars['String']['output'];
};

export type UsersPermissionsUserEntity = {
  __typename?: 'UsersPermissionsUserEntity';
  attributes?: Maybe<UsersPermissionsUser>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type UsersPermissionsUserEntityResponse = {
  __typename?: 'UsersPermissionsUserEntityResponse';
  data?: Maybe<UsersPermissionsUserEntity>;
};

export type UsersPermissionsUserEntityResponseCollection = {
  __typename?: 'UsersPermissionsUserEntityResponseCollection';
  data: Array<UsersPermissionsUserEntity>;
  meta: ResponseCollectionMeta;
};

export type UsersPermissionsUserFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<UsersPermissionsUserFiltersInput>>>;
  blocked?: InputMaybe<BooleanFilterInput>;
  confirmationToken?: InputMaybe<StringFilterInput>;
  confirmed?: InputMaybe<BooleanFilterInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  email?: InputMaybe<StringFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  not?: InputMaybe<UsersPermissionsUserFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<UsersPermissionsUserFiltersInput>>>;
  password?: InputMaybe<StringFilterInput>;
  provider?: InputMaybe<StringFilterInput>;
  resetPasswordToken?: InputMaybe<StringFilterInput>;
  role?: InputMaybe<UsersPermissionsRoleFiltersInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
  username?: InputMaybe<StringFilterInput>;
};

export type UsersPermissionsUserInput = {
  blocked?: InputMaybe<Scalars['Boolean']['input']>;
  confirmationToken?: InputMaybe<Scalars['String']['input']>;
  confirmed?: InputMaybe<Scalars['Boolean']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  provider?: InputMaybe<Scalars['String']['input']>;
  resetPasswordToken?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['ID']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type UsersPermissionsUserRelationResponseCollection = {
  __typename?: 'UsersPermissionsUserRelationResponseCollection';
  data: Array<UsersPermissionsUserEntity>;
};

export type LinkyPomociQueryVariables = Exact<{
  locale: Scalars['I18NLocaleCode']['input'];
}>;


export type LinkyPomociQuery = { __typename?: 'Query', linkyPomocis?: { __typename?: 'LinkyPomociEntityResponseCollection', data: Array<{ __typename?: 'LinkyPomociEntity', id?: string | null, attributes?: { __typename?: 'LinkyPomoci', Cena?: string | null, Email?: string | null, Nazov?: string | null, Popis?: string | null, Prevadzka?: string | null, Prevadzkovatel?: string | null, Telefon?: any | null, createdAt?: any | null, locale?: string | null, publishedAt?: any | null, updatedAt?: any | null } | null }> } | null };

export type FixpointyQueryVariables = Exact<{
  locale: Scalars['I18NLocaleCode']['input'];
}>;


export type FixpointyQuery = { __typename?: 'Query', fixpoints?: { __typename?: 'FixpointyEntityResponseCollection', data: Array<{ __typename?: 'FixpointyEntity', id?: string | null, attributes?: { __typename?: 'Fixpointy', Adresa?: string | null, Latitude?: number | null, Longitude?: number | null, Nazov?: string | null, createdAt?: any | null } | null }> } | null };

export type TerenneSluzbyQueryVariables = Exact<{
  locale: Scalars['I18NLocaleCode']['input'];
}>;


export type TerenneSluzbyQuery = { __typename?: 'Query', terenneSluzbies?: { __typename?: 'TerenneSluzbyEntityResponseCollection', data: Array<{ __typename?: 'TerenneSluzbyEntity', id?: string | null, attributes?: { __typename?: 'TerenneSluzby', Cena_kapacita?: string | null, Dostupnost?: string | null, Lokalita_posobnosti?: string | null, Nazov?: string | null, Poskytovatel?: string | null, Sluzba?: string | null, Telefon?: any | null } | null }> } | null };

export type SluzbyPreLudiBezDomovaQueryVariables = Exact<{
  locale: Scalars['I18NLocaleCode']['input'];
}>;


export type SluzbyPreLudiBezDomovaQuery = { __typename?: 'Query', sluzbyPreLudiBezDomovas?: { __typename?: 'SluzbyPreLudiBezDomovaEntityResponseCollection', data: Array<{ __typename?: 'SluzbyPreLudiBezDomovaEntity', id?: string | null, attributes?: { __typename?: 'SluzbyPreLudiBezDomova', Adresa?: string | null, Cas?: string | null, Email?: string | null, Kontaktne_centrum?: string | null, Hygiena_osatenie?: string | null, Kultura?: string | null, Latitude?: number | null, Longitude?: number | null, Mestska_cast?: string | null, Navigacia?: string | null, Navigovat?: string | null, Nazov?: string | null, Noclah_ubytovanie?: string | null, Popis?: string | null, Poskytovatel?: string | null, Socialne_pravne_poradenstvo?: string | null, Strava?: string | null, Tagy?: string | null, Telefon?: any | null, Telefon_popis?: string | null, Web?: string | null, Zdravotne_osetrenie?: string | null, Subor?: { __typename?: 'UploadFileRelationResponseCollection', data: Array<{ __typename?: 'UploadFileEntity', id?: string | null, attributes?: { __typename?: 'UploadFile', url: string } | null }> } | null } | null }> } | null };

export type PitneFontankyQueryVariables = Exact<{
  locale: Scalars['I18NLocaleCode']['input'];
}>;


export type PitneFontankyQuery = { __typename?: 'Query', pitneFontankies?: { __typename?: 'PitneFontankyEntityResponseCollection', data: Array<{ __typename?: 'PitneFontankyEntity', id?: string | null, attributes?: { __typename?: 'PitneFontanky', Latitude?: number | null, Longitude?: number | null, Nazov?: string | null, Rok_spustenia?: string | null, Spravca?: string | null, Stav?: string | null, Typ?: string | null, Fotky?: { __typename?: 'UploadFileRelationResponseCollection', data: Array<{ __typename?: 'UploadFileEntity', id?: string | null, attributes?: { __typename?: 'UploadFile', url: string } | null }> } | null } | null }> } | null };


export const LinkyPomociDocument = `
    query LinkyPomoci($locale: I18NLocaleCode!) {
  linkyPomocis(locale: $locale) {
    data {
      id
      attributes {
        Cena
        Email
        Nazov
        Popis
        Prevadzka
        Prevadzkovatel
        Telefon
        createdAt
        locale
        publishedAt
        updatedAt
      }
    }
  }
}
    `;
export const useLinkyPomociQuery = <
      TData = LinkyPomociQuery,
      TError = unknown
    >(
      variables: LinkyPomociQueryVariables,
      options?: UseQueryOptions<LinkyPomociQuery, TError, TData>
    ) =>
    useQuery<LinkyPomociQuery, TError, TData>(
      ['LinkyPomoci', variables],
      fetcher<LinkyPomociQuery, LinkyPomociQueryVariables>(LinkyPomociDocument, variables),
      options
    );
export const FixpointyDocument = `
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
    `;
export const useFixpointyQuery = <
      TData = FixpointyQuery,
      TError = unknown
    >(
      variables: FixpointyQueryVariables,
      options?: UseQueryOptions<FixpointyQuery, TError, TData>
    ) =>
    useQuery<FixpointyQuery, TError, TData>(
      ['Fixpointy', variables],
      fetcher<FixpointyQuery, FixpointyQueryVariables>(FixpointyDocument, variables),
      options
    );
export const TerenneSluzbyDocument = `
    query TerenneSluzby($locale: I18NLocaleCode!) {
  terenneSluzbies(locale: $locale) {
    data {
      id
      attributes {
        Cena_kapacita
        Dostupnost
        Lokalita_posobnosti
        Nazov
        Poskytovatel
        Sluzba
        Telefon
      }
    }
  }
}
    `;
export const useTerenneSluzbyQuery = <
      TData = TerenneSluzbyQuery,
      TError = unknown
    >(
      variables: TerenneSluzbyQueryVariables,
      options?: UseQueryOptions<TerenneSluzbyQuery, TError, TData>
    ) =>
    useQuery<TerenneSluzbyQuery, TError, TData>(
      ['TerenneSluzby', variables],
      fetcher<TerenneSluzbyQuery, TerenneSluzbyQueryVariables>(TerenneSluzbyDocument, variables),
      options
    );
export const SluzbyPreLudiBezDomovaDocument = `
    query SluzbyPreLudiBezDomova($locale: I18NLocaleCode!) {
  sluzbyPreLudiBezDomovas(locale: $locale) {
    data {
      id
      attributes {
        Adresa
        Cas
        Email
        Kontaktne_centrum
        Hygiena_osatenie
        Kultura
        Latitude
        Longitude
        Mestska_cast
        Navigacia
        Navigovat
        Nazov
        Noclah_ubytovanie
        Popis
        Poskytovatel
        Socialne_pravne_poradenstvo
        Strava
        Subor {
          data {
            id
            attributes {
              url
            }
          }
        }
        Tagy
        Telefon
        Telefon_popis
        Web
        Zdravotne_osetrenie
      }
    }
  }
}
    `;
export const useSluzbyPreLudiBezDomovaQuery = <
      TData = SluzbyPreLudiBezDomovaQuery,
      TError = unknown
    >(
      variables: SluzbyPreLudiBezDomovaQueryVariables,
      options?: UseQueryOptions<SluzbyPreLudiBezDomovaQuery, TError, TData>
    ) =>
    useQuery<SluzbyPreLudiBezDomovaQuery, TError, TData>(
      ['SluzbyPreLudiBezDomova', variables],
      fetcher<SluzbyPreLudiBezDomovaQuery, SluzbyPreLudiBezDomovaQueryVariables>(SluzbyPreLudiBezDomovaDocument, variables),
      options
    );
export const PitneFontankyDocument = `
    query PitneFontanky($locale: I18NLocaleCode!) {
  pitneFontankies(locale: $locale) {
    data {
      id
      attributes {
        Fotky {
          data {
            id
            attributes {
              url
            }
          }
        }
        Latitude
        Longitude
        Nazov
        Rok_spustenia
        Spravca
        Stav
        Typ
      }
    }
  }
}
    `;
export const usePitneFontankyQuery = <
      TData = PitneFontankyQuery,
      TError = unknown
    >(
      variables: PitneFontankyQueryVariables,
      options?: UseQueryOptions<PitneFontankyQuery, TError, TData>
    ) =>
    useQuery<PitneFontankyQuery, TError, TData>(
      ['PitneFontanky', variables],
      fetcher<PitneFontankyQuery, PitneFontankyQueryVariables>(PitneFontankyDocument, variables),
      options
    );