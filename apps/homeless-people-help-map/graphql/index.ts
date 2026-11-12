import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { fetcher } from '../src/utils/fetcher';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
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
  nei?: InputMaybe<Scalars['Boolean']['input']>;
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
  documentId: Scalars['ID']['output'];
  fotka?: Maybe<UploadFile>;
  kategoriaSportoviska?: Maybe<Scalars['String']['output']>;
  latitude?: Maybe<Scalars['Float']['output']>;
  locale?: Maybe<Scalars['String']['output']>;
  localizations: Array<Maybe<Cvicka>>;
  localizations_connection?: Maybe<CvickaRelationResponseCollection>;
  longitude?: Maybe<Scalars['Float']['output']>;
  navigovatLink?: Maybe<Scalars['String']['output']>;
  nazov?: Maybe<Scalars['String']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
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


export type CvickaLocalizations_ConnectionArgs = {
  filters?: InputMaybe<CvickaFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type CvickaEntityResponseCollection = {
  __typename?: 'CvickaEntityResponseCollection';
  nodes: Array<Cvicka>;
  pageInfo: Pagination;
};

export type CvickaFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<CvickaFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  documentId?: InputMaybe<IdFilterInput>;
  kategoriaSportoviska?: InputMaybe<StringFilterInput>;
  latitude?: InputMaybe<FloatFilterInput>;
  locale?: InputMaybe<StringFilterInput>;
  localizations?: InputMaybe<CvickaFiltersInput>;
  longitude?: InputMaybe<FloatFilterInput>;
  navigovatLink?: InputMaybe<StringFilterInput>;
  nazov?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<CvickaFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<CvickaFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
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
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  sport?: InputMaybe<Scalars['String']['input']>;
  umiestnenie?: InputMaybe<Scalars['String']['input']>;
  webLink?: InputMaybe<Scalars['String']['input']>;
};

export type CvickaRelationResponseCollection = {
  __typename?: 'CvickaRelationResponseCollection';
  nodes: Array<Cvicka>;
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
  nei?: InputMaybe<Scalars['DateTime']['input']>;
  not?: InputMaybe<DateTimeFilterInput>;
  notContains?: InputMaybe<Scalars['DateTime']['input']>;
  notContainsi?: InputMaybe<Scalars['DateTime']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  notNull?: InputMaybe<Scalars['Boolean']['input']>;
  null?: InputMaybe<Scalars['Boolean']['input']>;
  or?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  startsWith?: InputMaybe<Scalars['DateTime']['input']>;
};

export type DeleteMutationResponse = {
  __typename?: 'DeleteMutationResponse';
  documentId: Scalars['ID']['output'];
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
  documentId: Scalars['ID']['output'];
  locale?: Maybe<Scalars['String']['output']>;
  localizations: Array<Maybe<Fixpointy>>;
  localizations_connection?: Maybe<FixpointyRelationResponseCollection>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


export type FixpointyLocalizationsArgs = {
  filters?: InputMaybe<FixpointyFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type FixpointyLocalizations_ConnectionArgs = {
  filters?: InputMaybe<FixpointyFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type FixpointyEntityResponseCollection = {
  __typename?: 'FixpointyEntityResponseCollection';
  nodes: Array<Fixpointy>;
  pageInfo: Pagination;
};

export type FixpointyFiltersInput = {
  Adresa?: InputMaybe<StringFilterInput>;
  Latitude?: InputMaybe<FloatFilterInput>;
  Longitude?: InputMaybe<FloatFilterInput>;
  Nazov?: InputMaybe<StringFilterInput>;
  and?: InputMaybe<Array<InputMaybe<FixpointyFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  documentId?: InputMaybe<IdFilterInput>;
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
  nodes: Array<Fixpointy>;
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
  nei?: InputMaybe<Scalars['Float']['input']>;
  not?: InputMaybe<FloatFilterInput>;
  notContains?: InputMaybe<Scalars['Float']['input']>;
  notContainsi?: InputMaybe<Scalars['Float']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  notNull?: InputMaybe<Scalars['Boolean']['input']>;
  null?: InputMaybe<Scalars['Boolean']['input']>;
  or?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  startsWith?: InputMaybe<Scalars['Float']['input']>;
};

export type GenericMorph = Cvicka | Fixpointy | I18NLocale | Kupaliska | LinkyPomoci | PitneFontanky | ReviewWorkflowsWorkflow | ReviewWorkflowsWorkflowStage | Rozkopavky | SluzbyPreLudiBezDomova | TerenneSluzby | UploadFile | UsersPermissionsPermission | UsersPermissionsRole | UsersPermissionsUser;

export type I18NLocale = {
  __typename?: 'I18NLocale';
  code?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  documentId: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type I18NLocaleEntityResponseCollection = {
  __typename?: 'I18NLocaleEntityResponseCollection';
  nodes: Array<I18NLocale>;
  pageInfo: Pagination;
};

export type I18NLocaleFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<I18NLocaleFiltersInput>>>;
  code?: InputMaybe<StringFilterInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  documentId?: InputMaybe<IdFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<I18NLocaleFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<I18NLocaleFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
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
  nei?: InputMaybe<Scalars['ID']['input']>;
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
  nei?: InputMaybe<Scalars['Int']['input']>;
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
  nei?: InputMaybe<Scalars['JSON']['input']>;
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
  documentId: Scalars['ID']['output'];
  email?: Maybe<Scalars['String']['output']>;
  fotka?: Maybe<UploadFile>;
  kategoriaSportoviska?: Maybe<Scalars['String']['output']>;
  latitude?: Maybe<Scalars['Float']['output']>;
  listokLink?: Maybe<Scalars['String']['output']>;
  locale?: Maybe<Scalars['String']['output']>;
  localizations: Array<Maybe<Kupaliska>>;
  localizations_connection?: Maybe<KupaliskaRelationResponseCollection>;
  longitude?: Maybe<Scalars['Float']['output']>;
  navigovatLink?: Maybe<Scalars['String']['output']>;
  nazov?: Maybe<Scalars['String']['output']>;
  otvaracieHodiny?: Maybe<Scalars['String']['output']>;
  oznam?: Maybe<Scalars['String']['output']>;
  popis?: Maybe<Scalars['String']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
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


export type KupaliskaLocalizations_ConnectionArgs = {
  filters?: InputMaybe<KupaliskaFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type KupaliskaEntityResponseCollection = {
  __typename?: 'KupaliskaEntityResponseCollection';
  nodes: Array<Kupaliska>;
  pageInfo: Pagination;
};

export type KupaliskaFiltersInput = {
  adresa?: InputMaybe<StringFilterInput>;
  and?: InputMaybe<Array<InputMaybe<KupaliskaFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  documentId?: InputMaybe<IdFilterInput>;
  email?: InputMaybe<StringFilterInput>;
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
  publishedAt?: InputMaybe<DateTimeFilterInput>;
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
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  sluzby?: InputMaybe<Scalars['String']['input']>;
  sport?: InputMaybe<Scalars['String']['input']>;
  webLink?: InputMaybe<Scalars['String']['input']>;
};

export type KupaliskaRelationResponseCollection = {
  __typename?: 'KupaliskaRelationResponseCollection';
  nodes: Array<Kupaliska>;
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
  documentId: Scalars['ID']['output'];
  locale?: Maybe<Scalars['String']['output']>;
  localizations: Array<Maybe<LinkyPomoci>>;
  localizations_connection?: Maybe<LinkyPomociRelationResponseCollection>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


export type LinkyPomociLocalizationsArgs = {
  filters?: InputMaybe<LinkyPomociFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type LinkyPomociLocalizations_ConnectionArgs = {
  filters?: InputMaybe<LinkyPomociFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type LinkyPomociEntityResponseCollection = {
  __typename?: 'LinkyPomociEntityResponseCollection';
  nodes: Array<LinkyPomoci>;
  pageInfo: Pagination;
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
  documentId?: InputMaybe<IdFilterInput>;
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
  nodes: Array<LinkyPomoci>;
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
  nei?: InputMaybe<Scalars['Long']['input']>;
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
  createCvicka?: Maybe<Cvicka>;
  createFixpointy?: Maybe<Fixpointy>;
  createKupaliska?: Maybe<Kupaliska>;
  createLinkyPomoci?: Maybe<LinkyPomoci>;
  createPitneFontanky?: Maybe<PitneFontanky>;
  createReviewWorkflowsWorkflow?: Maybe<ReviewWorkflowsWorkflow>;
  createReviewWorkflowsWorkflowStage?: Maybe<ReviewWorkflowsWorkflowStage>;
  createSluzbyPreLudiBezDomova?: Maybe<SluzbyPreLudiBezDomova>;
  createTerenneSluzby?: Maybe<TerenneSluzby>;
  /** Create a new role */
  createUsersPermissionsRole?: Maybe<UsersPermissionsCreateRolePayload>;
  /** Create a new user */
  createUsersPermissionsUser: UsersPermissionsUserEntityResponse;
  deleteCvicka?: Maybe<DeleteMutationResponse>;
  deleteFixpointy?: Maybe<DeleteMutationResponse>;
  deleteKupaliska?: Maybe<DeleteMutationResponse>;
  deleteLinkyPomoci?: Maybe<DeleteMutationResponse>;
  deletePitneFontanky?: Maybe<DeleteMutationResponse>;
  deleteReviewWorkflowsWorkflow?: Maybe<DeleteMutationResponse>;
  deleteReviewWorkflowsWorkflowStage?: Maybe<DeleteMutationResponse>;
  deleteRozkopavky?: Maybe<DeleteMutationResponse>;
  deleteSluzbyPreLudiBezDomova?: Maybe<DeleteMutationResponse>;
  deleteTerenneSluzby?: Maybe<DeleteMutationResponse>;
  deleteUploadFile?: Maybe<UploadFile>;
  /** Delete an existing role */
  deleteUsersPermissionsRole?: Maybe<UsersPermissionsDeleteRolePayload>;
  /** Delete an existing user */
  deleteUsersPermissionsUser: UsersPermissionsUserEntityResponse;
  /** Confirm an email users email address */
  emailConfirmation?: Maybe<UsersPermissionsLoginPayload>;
  /** Request a reset password token */
  forgotPassword?: Maybe<UsersPermissionsPasswordPayload>;
  login: UsersPermissionsLoginPayload;
  /** Register a user */
  register: UsersPermissionsLoginPayload;
  /** Reset user password. Confirm with a code (resetToken from forgotPassword) */
  resetPassword?: Maybe<UsersPermissionsLoginPayload>;
  updateCvicka?: Maybe<Cvicka>;
  updateFixpointy?: Maybe<Fixpointy>;
  updateKupaliska?: Maybe<Kupaliska>;
  updateLinkyPomoci?: Maybe<LinkyPomoci>;
  updatePitneFontanky?: Maybe<PitneFontanky>;
  updateReviewWorkflowsWorkflow?: Maybe<ReviewWorkflowsWorkflow>;
  updateReviewWorkflowsWorkflowStage?: Maybe<ReviewWorkflowsWorkflowStage>;
  updateRozkopavky?: Maybe<Rozkopavky>;
  updateSluzbyPreLudiBezDomova?: Maybe<SluzbyPreLudiBezDomova>;
  updateTerenneSluzby?: Maybe<TerenneSluzby>;
  updateUploadFile: UploadFile;
  /** Update an existing role */
  updateUsersPermissionsRole?: Maybe<UsersPermissionsUpdateRolePayload>;
  /** Update an existing user */
  updateUsersPermissionsUser: UsersPermissionsUserEntityResponse;
};


export type MutationChangePasswordArgs = {
  currentPassword: Scalars['String']['input'];
  password: Scalars['String']['input'];
  passwordConfirmation: Scalars['String']['input'];
};


export type MutationCreateCvickaArgs = {
  data: CvickaInput;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  status?: InputMaybe<PublicationStatus>;
};


export type MutationCreateFixpointyArgs = {
  data: FixpointyInput;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  status?: InputMaybe<PublicationStatus>;
};


export type MutationCreateKupaliskaArgs = {
  data: KupaliskaInput;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  status?: InputMaybe<PublicationStatus>;
};


export type MutationCreateLinkyPomociArgs = {
  data: LinkyPomociInput;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  status?: InputMaybe<PublicationStatus>;
};


export type MutationCreatePitneFontankyArgs = {
  data: PitneFontankyInput;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  status?: InputMaybe<PublicationStatus>;
};


export type MutationCreateReviewWorkflowsWorkflowArgs = {
  data: ReviewWorkflowsWorkflowInput;
  status?: InputMaybe<PublicationStatus>;
};


export type MutationCreateReviewWorkflowsWorkflowStageArgs = {
  data: ReviewWorkflowsWorkflowStageInput;
  status?: InputMaybe<PublicationStatus>;
};


export type MutationCreateSluzbyPreLudiBezDomovaArgs = {
  data: SluzbyPreLudiBezDomovaInput;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  status?: InputMaybe<PublicationStatus>;
};


export type MutationCreateTerenneSluzbyArgs = {
  data: TerenneSluzbyInput;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  status?: InputMaybe<PublicationStatus>;
};


export type MutationCreateUsersPermissionsRoleArgs = {
  data: UsersPermissionsRoleInput;
};


export type MutationCreateUsersPermissionsUserArgs = {
  data: UsersPermissionsUserInput;
};


export type MutationDeleteCvickaArgs = {
  documentId: Scalars['ID']['input'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationDeleteFixpointyArgs = {
  documentId: Scalars['ID']['input'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationDeleteKupaliskaArgs = {
  documentId: Scalars['ID']['input'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationDeleteLinkyPomociArgs = {
  documentId: Scalars['ID']['input'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationDeletePitneFontankyArgs = {
  documentId: Scalars['ID']['input'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationDeleteReviewWorkflowsWorkflowArgs = {
  documentId: Scalars['ID']['input'];
};


export type MutationDeleteReviewWorkflowsWorkflowStageArgs = {
  documentId: Scalars['ID']['input'];
};


export type MutationDeleteRozkopavkyArgs = {
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationDeleteSluzbyPreLudiBezDomovaArgs = {
  documentId: Scalars['ID']['input'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationDeleteTerenneSluzbyArgs = {
  documentId: Scalars['ID']['input'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
};


export type MutationDeleteUploadFileArgs = {
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


export type MutationRegisterArgs = {
  input: UsersPermissionsRegisterInput;
};


export type MutationResetPasswordArgs = {
  code: Scalars['String']['input'];
  password: Scalars['String']['input'];
  passwordConfirmation: Scalars['String']['input'];
};


export type MutationUpdateCvickaArgs = {
  data: CvickaInput;
  documentId: Scalars['ID']['input'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  status?: InputMaybe<PublicationStatus>;
};


export type MutationUpdateFixpointyArgs = {
  data: FixpointyInput;
  documentId: Scalars['ID']['input'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  status?: InputMaybe<PublicationStatus>;
};


export type MutationUpdateKupaliskaArgs = {
  data: KupaliskaInput;
  documentId: Scalars['ID']['input'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  status?: InputMaybe<PublicationStatus>;
};


export type MutationUpdateLinkyPomociArgs = {
  data: LinkyPomociInput;
  documentId: Scalars['ID']['input'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  status?: InputMaybe<PublicationStatus>;
};


export type MutationUpdatePitneFontankyArgs = {
  data: PitneFontankyInput;
  documentId: Scalars['ID']['input'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  status?: InputMaybe<PublicationStatus>;
};


export type MutationUpdateReviewWorkflowsWorkflowArgs = {
  data: ReviewWorkflowsWorkflowInput;
  documentId: Scalars['ID']['input'];
  status?: InputMaybe<PublicationStatus>;
};


export type MutationUpdateReviewWorkflowsWorkflowStageArgs = {
  data: ReviewWorkflowsWorkflowStageInput;
  documentId: Scalars['ID']['input'];
  status?: InputMaybe<PublicationStatus>;
};


export type MutationUpdateRozkopavkyArgs = {
  data: RozkopavkyInput;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  status?: InputMaybe<PublicationStatus>;
};


export type MutationUpdateSluzbyPreLudiBezDomovaArgs = {
  data: SluzbyPreLudiBezDomovaInput;
  documentId: Scalars['ID']['input'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  status?: InputMaybe<PublicationStatus>;
};


export type MutationUpdateTerenneSluzbyArgs = {
  data: TerenneSluzbyInput;
  documentId: Scalars['ID']['input'];
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  status?: InputMaybe<PublicationStatus>;
};


export type MutationUpdateUploadFileArgs = {
  id: Scalars['ID']['input'];
  info?: InputMaybe<FileInfoInput>;
};


export type MutationUpdateUsersPermissionsRoleArgs = {
  data: UsersPermissionsRoleInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateUsersPermissionsUserArgs = {
  data: UsersPermissionsUserInput;
  id: Scalars['ID']['input'];
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
  Fotky: Array<Maybe<UploadFile>>;
  Fotky_connection?: Maybe<UploadFileRelationResponseCollection>;
  Latitude?: Maybe<Scalars['Float']['output']>;
  Longitude?: Maybe<Scalars['Float']['output']>;
  Nazov?: Maybe<Scalars['String']['output']>;
  Rok_spustenia?: Maybe<Scalars['String']['output']>;
  Spravca?: Maybe<Scalars['String']['output']>;
  Stav?: Maybe<Scalars['String']['output']>;
  Typ?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  documentId: Scalars['ID']['output'];
  locale?: Maybe<Scalars['String']['output']>;
  localizations: Array<Maybe<PitneFontanky>>;
  localizations_connection?: Maybe<PitneFontankyRelationResponseCollection>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


export type PitneFontankyFotkyArgs = {
  filters?: InputMaybe<UploadFileFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type PitneFontankyFotky_ConnectionArgs = {
  filters?: InputMaybe<UploadFileFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type PitneFontankyLocalizationsArgs = {
  filters?: InputMaybe<PitneFontankyFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type PitneFontankyLocalizations_ConnectionArgs = {
  filters?: InputMaybe<PitneFontankyFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type PitneFontankyEntityResponseCollection = {
  __typename?: 'PitneFontankyEntityResponseCollection';
  nodes: Array<PitneFontanky>;
  pageInfo: Pagination;
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
  documentId?: InputMaybe<IdFilterInput>;
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
  nodes: Array<PitneFontanky>;
};

export enum PublicationFilter {
  HasPublishedVersion = 'HAS_PUBLISHED_VERSION',
  HasPublishedVersionDocument = 'HAS_PUBLISHED_VERSION_DOCUMENT',
  Modified = 'MODIFIED',
  NeverPublished = 'NEVER_PUBLISHED',
  NeverPublishedDocument = 'NEVER_PUBLISHED_DOCUMENT',
  PublishedWithoutDraft = 'PUBLISHED_WITHOUT_DRAFT',
  PublishedWithDraft = 'PUBLISHED_WITH_DRAFT',
  Unmodified = 'UNMODIFIED'
}

export enum PublicationStatus {
  Draft = 'DRAFT',
  Published = 'PUBLISHED'
}

export type Query = {
  __typename?: 'Query';
  cvicka?: Maybe<Cvicka>;
  cvickas: Array<Maybe<Cvicka>>;
  cvickas_connection?: Maybe<CvickaEntityResponseCollection>;
  fixpoints: Array<Maybe<Fixpointy>>;
  fixpoints_connection?: Maybe<FixpointyEntityResponseCollection>;
  fixpointy?: Maybe<Fixpointy>;
  i18NLocale?: Maybe<I18NLocale>;
  i18NLocales: Array<Maybe<I18NLocale>>;
  i18NLocales_connection?: Maybe<I18NLocaleEntityResponseCollection>;
  kupaliska?: Maybe<Kupaliska>;
  kupaliskas: Array<Maybe<Kupaliska>>;
  kupaliskas_connection?: Maybe<KupaliskaEntityResponseCollection>;
  linkyPomoci?: Maybe<LinkyPomoci>;
  linkyPomocis: Array<Maybe<LinkyPomoci>>;
  linkyPomocis_connection?: Maybe<LinkyPomociEntityResponseCollection>;
  me?: Maybe<UsersPermissionsMe>;
  pitneFontankies: Array<Maybe<PitneFontanky>>;
  pitneFontankies_connection?: Maybe<PitneFontankyEntityResponseCollection>;
  pitneFontanky?: Maybe<PitneFontanky>;
  reviewWorkflowsWorkflow?: Maybe<ReviewWorkflowsWorkflow>;
  reviewWorkflowsWorkflowStage?: Maybe<ReviewWorkflowsWorkflowStage>;
  reviewWorkflowsWorkflowStages: Array<Maybe<ReviewWorkflowsWorkflowStage>>;
  reviewWorkflowsWorkflowStages_connection?: Maybe<ReviewWorkflowsWorkflowStageEntityResponseCollection>;
  reviewWorkflowsWorkflows: Array<Maybe<ReviewWorkflowsWorkflow>>;
  reviewWorkflowsWorkflows_connection?: Maybe<ReviewWorkflowsWorkflowEntityResponseCollection>;
  rozkopavky?: Maybe<Rozkopavky>;
  sluzbyPreLudiBezDomova?: Maybe<SluzbyPreLudiBezDomova>;
  sluzbyPreLudiBezDomovas: Array<Maybe<SluzbyPreLudiBezDomova>>;
  sluzbyPreLudiBezDomovas_connection?: Maybe<SluzbyPreLudiBezDomovaEntityResponseCollection>;
  terenneSluzbies: Array<Maybe<TerenneSluzby>>;
  terenneSluzbies_connection?: Maybe<TerenneSluzbyEntityResponseCollection>;
  terenneSluzby?: Maybe<TerenneSluzby>;
  uploadFile?: Maybe<UploadFile>;
  uploadFiles: Array<Maybe<UploadFile>>;
  uploadFiles_connection?: Maybe<UploadFileEntityResponseCollection>;
  usersPermissionsRole?: Maybe<UsersPermissionsRole>;
  usersPermissionsRoles: Array<Maybe<UsersPermissionsRole>>;
  usersPermissionsRoles_connection?: Maybe<UsersPermissionsRoleEntityResponseCollection>;
  usersPermissionsUser?: Maybe<UsersPermissionsUser>;
  usersPermissionsUsers: Array<Maybe<UsersPermissionsUser>>;
  usersPermissionsUsers_connection?: Maybe<UsersPermissionsUserEntityResponseCollection>;
};


export type QueryCvickaArgs = {
  documentId: Scalars['ID']['input'];
  hasPublishedVersion?: InputMaybe<Scalars['Boolean']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  publicationFilter?: InputMaybe<PublicationFilter>;
  status?: InputMaybe<PublicationStatus>;
};


export type QueryCvickasArgs = {
  filters?: InputMaybe<CvickaFiltersInput>;
  hasPublishedVersion?: InputMaybe<Scalars['Boolean']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  pagination?: InputMaybe<PaginationArg>;
  publicationFilter?: InputMaybe<PublicationFilter>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  status?: InputMaybe<PublicationStatus>;
};


export type QueryCvickas_ConnectionArgs = {
  filters?: InputMaybe<CvickaFiltersInput>;
  hasPublishedVersion?: InputMaybe<Scalars['Boolean']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  pagination?: InputMaybe<PaginationArg>;
  publicationFilter?: InputMaybe<PublicationFilter>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  status?: InputMaybe<PublicationStatus>;
};


export type QueryFixpointsArgs = {
  filters?: InputMaybe<FixpointyFiltersInput>;
  hasPublishedVersion?: InputMaybe<Scalars['Boolean']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  pagination?: InputMaybe<PaginationArg>;
  publicationFilter?: InputMaybe<PublicationFilter>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  status?: InputMaybe<PublicationStatus>;
};


export type QueryFixpoints_ConnectionArgs = {
  filters?: InputMaybe<FixpointyFiltersInput>;
  hasPublishedVersion?: InputMaybe<Scalars['Boolean']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  pagination?: InputMaybe<PaginationArg>;
  publicationFilter?: InputMaybe<PublicationFilter>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  status?: InputMaybe<PublicationStatus>;
};


export type QueryFixpointyArgs = {
  documentId: Scalars['ID']['input'];
  hasPublishedVersion?: InputMaybe<Scalars['Boolean']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  publicationFilter?: InputMaybe<PublicationFilter>;
  status?: InputMaybe<PublicationStatus>;
};


export type QueryI18NLocaleArgs = {
  documentId: Scalars['ID']['input'];
  hasPublishedVersion?: InputMaybe<Scalars['Boolean']['input']>;
  publicationFilter?: InputMaybe<PublicationFilter>;
  status?: InputMaybe<PublicationStatus>;
};


export type QueryI18NLocalesArgs = {
  filters?: InputMaybe<I18NLocaleFiltersInput>;
  hasPublishedVersion?: InputMaybe<Scalars['Boolean']['input']>;
  pagination?: InputMaybe<PaginationArg>;
  publicationFilter?: InputMaybe<PublicationFilter>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  status?: InputMaybe<PublicationStatus>;
};


export type QueryI18NLocales_ConnectionArgs = {
  filters?: InputMaybe<I18NLocaleFiltersInput>;
  hasPublishedVersion?: InputMaybe<Scalars['Boolean']['input']>;
  pagination?: InputMaybe<PaginationArg>;
  publicationFilter?: InputMaybe<PublicationFilter>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  status?: InputMaybe<PublicationStatus>;
};


export type QueryKupaliskaArgs = {
  documentId: Scalars['ID']['input'];
  hasPublishedVersion?: InputMaybe<Scalars['Boolean']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  publicationFilter?: InputMaybe<PublicationFilter>;
  status?: InputMaybe<PublicationStatus>;
};


export type QueryKupaliskasArgs = {
  filters?: InputMaybe<KupaliskaFiltersInput>;
  hasPublishedVersion?: InputMaybe<Scalars['Boolean']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  pagination?: InputMaybe<PaginationArg>;
  publicationFilter?: InputMaybe<PublicationFilter>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  status?: InputMaybe<PublicationStatus>;
};


export type QueryKupaliskas_ConnectionArgs = {
  filters?: InputMaybe<KupaliskaFiltersInput>;
  hasPublishedVersion?: InputMaybe<Scalars['Boolean']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  pagination?: InputMaybe<PaginationArg>;
  publicationFilter?: InputMaybe<PublicationFilter>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  status?: InputMaybe<PublicationStatus>;
};


export type QueryLinkyPomociArgs = {
  documentId: Scalars['ID']['input'];
  hasPublishedVersion?: InputMaybe<Scalars['Boolean']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  publicationFilter?: InputMaybe<PublicationFilter>;
  status?: InputMaybe<PublicationStatus>;
};


export type QueryLinkyPomocisArgs = {
  filters?: InputMaybe<LinkyPomociFiltersInput>;
  hasPublishedVersion?: InputMaybe<Scalars['Boolean']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  pagination?: InputMaybe<PaginationArg>;
  publicationFilter?: InputMaybe<PublicationFilter>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  status?: InputMaybe<PublicationStatus>;
};


export type QueryLinkyPomocis_ConnectionArgs = {
  filters?: InputMaybe<LinkyPomociFiltersInput>;
  hasPublishedVersion?: InputMaybe<Scalars['Boolean']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  pagination?: InputMaybe<PaginationArg>;
  publicationFilter?: InputMaybe<PublicationFilter>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  status?: InputMaybe<PublicationStatus>;
};


export type QueryPitneFontankiesArgs = {
  filters?: InputMaybe<PitneFontankyFiltersInput>;
  hasPublishedVersion?: InputMaybe<Scalars['Boolean']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  pagination?: InputMaybe<PaginationArg>;
  publicationFilter?: InputMaybe<PublicationFilter>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  status?: InputMaybe<PublicationStatus>;
};


export type QueryPitneFontankies_ConnectionArgs = {
  filters?: InputMaybe<PitneFontankyFiltersInput>;
  hasPublishedVersion?: InputMaybe<Scalars['Boolean']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  pagination?: InputMaybe<PaginationArg>;
  publicationFilter?: InputMaybe<PublicationFilter>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  status?: InputMaybe<PublicationStatus>;
};


export type QueryPitneFontankyArgs = {
  documentId: Scalars['ID']['input'];
  hasPublishedVersion?: InputMaybe<Scalars['Boolean']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  publicationFilter?: InputMaybe<PublicationFilter>;
  status?: InputMaybe<PublicationStatus>;
};


export type QueryReviewWorkflowsWorkflowArgs = {
  documentId: Scalars['ID']['input'];
  hasPublishedVersion?: InputMaybe<Scalars['Boolean']['input']>;
  publicationFilter?: InputMaybe<PublicationFilter>;
  status?: InputMaybe<PublicationStatus>;
};


export type QueryReviewWorkflowsWorkflowStageArgs = {
  documentId: Scalars['ID']['input'];
  hasPublishedVersion?: InputMaybe<Scalars['Boolean']['input']>;
  publicationFilter?: InputMaybe<PublicationFilter>;
  status?: InputMaybe<PublicationStatus>;
};


export type QueryReviewWorkflowsWorkflowStagesArgs = {
  filters?: InputMaybe<ReviewWorkflowsWorkflowStageFiltersInput>;
  hasPublishedVersion?: InputMaybe<Scalars['Boolean']['input']>;
  pagination?: InputMaybe<PaginationArg>;
  publicationFilter?: InputMaybe<PublicationFilter>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  status?: InputMaybe<PublicationStatus>;
};


export type QueryReviewWorkflowsWorkflowStages_ConnectionArgs = {
  filters?: InputMaybe<ReviewWorkflowsWorkflowStageFiltersInput>;
  hasPublishedVersion?: InputMaybe<Scalars['Boolean']['input']>;
  pagination?: InputMaybe<PaginationArg>;
  publicationFilter?: InputMaybe<PublicationFilter>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  status?: InputMaybe<PublicationStatus>;
};


export type QueryReviewWorkflowsWorkflowsArgs = {
  filters?: InputMaybe<ReviewWorkflowsWorkflowFiltersInput>;
  hasPublishedVersion?: InputMaybe<Scalars['Boolean']['input']>;
  pagination?: InputMaybe<PaginationArg>;
  publicationFilter?: InputMaybe<PublicationFilter>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  status?: InputMaybe<PublicationStatus>;
};


export type QueryReviewWorkflowsWorkflows_ConnectionArgs = {
  filters?: InputMaybe<ReviewWorkflowsWorkflowFiltersInput>;
  hasPublishedVersion?: InputMaybe<Scalars['Boolean']['input']>;
  pagination?: InputMaybe<PaginationArg>;
  publicationFilter?: InputMaybe<PublicationFilter>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  status?: InputMaybe<PublicationStatus>;
};


export type QueryRozkopavkyArgs = {
  hasPublishedVersion?: InputMaybe<Scalars['Boolean']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  publicationFilter?: InputMaybe<PublicationFilter>;
  status?: InputMaybe<PublicationStatus>;
};


export type QuerySluzbyPreLudiBezDomovaArgs = {
  documentId: Scalars['ID']['input'];
  hasPublishedVersion?: InputMaybe<Scalars['Boolean']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  publicationFilter?: InputMaybe<PublicationFilter>;
  status?: InputMaybe<PublicationStatus>;
};


export type QuerySluzbyPreLudiBezDomovasArgs = {
  filters?: InputMaybe<SluzbyPreLudiBezDomovaFiltersInput>;
  hasPublishedVersion?: InputMaybe<Scalars['Boolean']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  pagination?: InputMaybe<PaginationArg>;
  publicationFilter?: InputMaybe<PublicationFilter>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  status?: InputMaybe<PublicationStatus>;
};


export type QuerySluzbyPreLudiBezDomovas_ConnectionArgs = {
  filters?: InputMaybe<SluzbyPreLudiBezDomovaFiltersInput>;
  hasPublishedVersion?: InputMaybe<Scalars['Boolean']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  pagination?: InputMaybe<PaginationArg>;
  publicationFilter?: InputMaybe<PublicationFilter>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  status?: InputMaybe<PublicationStatus>;
};


export type QueryTerenneSluzbiesArgs = {
  filters?: InputMaybe<TerenneSluzbyFiltersInput>;
  hasPublishedVersion?: InputMaybe<Scalars['Boolean']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  pagination?: InputMaybe<PaginationArg>;
  publicationFilter?: InputMaybe<PublicationFilter>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  status?: InputMaybe<PublicationStatus>;
};


export type QueryTerenneSluzbies_ConnectionArgs = {
  filters?: InputMaybe<TerenneSluzbyFiltersInput>;
  hasPublishedVersion?: InputMaybe<Scalars['Boolean']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  pagination?: InputMaybe<PaginationArg>;
  publicationFilter?: InputMaybe<PublicationFilter>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  status?: InputMaybe<PublicationStatus>;
};


export type QueryTerenneSluzbyArgs = {
  documentId: Scalars['ID']['input'];
  hasPublishedVersion?: InputMaybe<Scalars['Boolean']['input']>;
  locale?: InputMaybe<Scalars['I18NLocaleCode']['input']>;
  publicationFilter?: InputMaybe<PublicationFilter>;
  status?: InputMaybe<PublicationStatus>;
};


export type QueryUploadFileArgs = {
  documentId: Scalars['ID']['input'];
  hasPublishedVersion?: InputMaybe<Scalars['Boolean']['input']>;
  publicationFilter?: InputMaybe<PublicationFilter>;
  status?: InputMaybe<PublicationStatus>;
};


export type QueryUploadFilesArgs = {
  filters?: InputMaybe<UploadFileFiltersInput>;
  hasPublishedVersion?: InputMaybe<Scalars['Boolean']['input']>;
  pagination?: InputMaybe<PaginationArg>;
  publicationFilter?: InputMaybe<PublicationFilter>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  status?: InputMaybe<PublicationStatus>;
};


export type QueryUploadFiles_ConnectionArgs = {
  filters?: InputMaybe<UploadFileFiltersInput>;
  hasPublishedVersion?: InputMaybe<Scalars['Boolean']['input']>;
  pagination?: InputMaybe<PaginationArg>;
  publicationFilter?: InputMaybe<PublicationFilter>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  status?: InputMaybe<PublicationStatus>;
};


export type QueryUsersPermissionsRoleArgs = {
  documentId: Scalars['ID']['input'];
  hasPublishedVersion?: InputMaybe<Scalars['Boolean']['input']>;
  publicationFilter?: InputMaybe<PublicationFilter>;
  status?: InputMaybe<PublicationStatus>;
};


export type QueryUsersPermissionsRolesArgs = {
  filters?: InputMaybe<UsersPermissionsRoleFiltersInput>;
  hasPublishedVersion?: InputMaybe<Scalars['Boolean']['input']>;
  pagination?: InputMaybe<PaginationArg>;
  publicationFilter?: InputMaybe<PublicationFilter>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  status?: InputMaybe<PublicationStatus>;
};


export type QueryUsersPermissionsRoles_ConnectionArgs = {
  filters?: InputMaybe<UsersPermissionsRoleFiltersInput>;
  hasPublishedVersion?: InputMaybe<Scalars['Boolean']['input']>;
  pagination?: InputMaybe<PaginationArg>;
  publicationFilter?: InputMaybe<PublicationFilter>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  status?: InputMaybe<PublicationStatus>;
};


export type QueryUsersPermissionsUserArgs = {
  documentId: Scalars['ID']['input'];
  hasPublishedVersion?: InputMaybe<Scalars['Boolean']['input']>;
  publicationFilter?: InputMaybe<PublicationFilter>;
  status?: InputMaybe<PublicationStatus>;
};


export type QueryUsersPermissionsUsersArgs = {
  filters?: InputMaybe<UsersPermissionsUserFiltersInput>;
  hasPublishedVersion?: InputMaybe<Scalars['Boolean']['input']>;
  pagination?: InputMaybe<PaginationArg>;
  publicationFilter?: InputMaybe<PublicationFilter>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  status?: InputMaybe<PublicationStatus>;
};


export type QueryUsersPermissionsUsers_ConnectionArgs = {
  filters?: InputMaybe<UsersPermissionsUserFiltersInput>;
  hasPublishedVersion?: InputMaybe<Scalars['Boolean']['input']>;
  pagination?: InputMaybe<PaginationArg>;
  publicationFilter?: InputMaybe<PublicationFilter>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  status?: InputMaybe<PublicationStatus>;
};

export type ReviewWorkflowsWorkflow = {
  __typename?: 'ReviewWorkflowsWorkflow';
  contentTypes: Scalars['JSON']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  documentId: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  stageRequiredToPublish?: Maybe<ReviewWorkflowsWorkflowStage>;
  stages: Array<Maybe<ReviewWorkflowsWorkflowStage>>;
  stages_connection?: Maybe<ReviewWorkflowsWorkflowStageRelationResponseCollection>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


export type ReviewWorkflowsWorkflowStagesArgs = {
  filters?: InputMaybe<ReviewWorkflowsWorkflowStageFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type ReviewWorkflowsWorkflowStages_ConnectionArgs = {
  filters?: InputMaybe<ReviewWorkflowsWorkflowStageFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ReviewWorkflowsWorkflowEntityResponseCollection = {
  __typename?: 'ReviewWorkflowsWorkflowEntityResponseCollection';
  nodes: Array<ReviewWorkflowsWorkflow>;
  pageInfo: Pagination;
};

export type ReviewWorkflowsWorkflowFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ReviewWorkflowsWorkflowFiltersInput>>>;
  contentTypes?: InputMaybe<JsonFilterInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  documentId?: InputMaybe<IdFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<ReviewWorkflowsWorkflowFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ReviewWorkflowsWorkflowFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  stageRequiredToPublish?: InputMaybe<ReviewWorkflowsWorkflowStageFiltersInput>;
  stages?: InputMaybe<ReviewWorkflowsWorkflowStageFiltersInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type ReviewWorkflowsWorkflowInput = {
  contentTypes?: InputMaybe<Scalars['JSON']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  stageRequiredToPublish?: InputMaybe<Scalars['ID']['input']>;
  stages?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};

export type ReviewWorkflowsWorkflowStage = {
  __typename?: 'ReviewWorkflowsWorkflowStage';
  color?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  documentId: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  workflow?: Maybe<ReviewWorkflowsWorkflow>;
};

export type ReviewWorkflowsWorkflowStageEntityResponseCollection = {
  __typename?: 'ReviewWorkflowsWorkflowStageEntityResponseCollection';
  nodes: Array<ReviewWorkflowsWorkflowStage>;
  pageInfo: Pagination;
};

export type ReviewWorkflowsWorkflowStageFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ReviewWorkflowsWorkflowStageFiltersInput>>>;
  color?: InputMaybe<StringFilterInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  documentId?: InputMaybe<IdFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<ReviewWorkflowsWorkflowStageFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ReviewWorkflowsWorkflowStageFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
  workflow?: InputMaybe<ReviewWorkflowsWorkflowFiltersInput>;
};

export type ReviewWorkflowsWorkflowStageInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  workflow?: InputMaybe<Scalars['ID']['input']>;
};

export type ReviewWorkflowsWorkflowStageRelationResponseCollection = {
  __typename?: 'ReviewWorkflowsWorkflowStageRelationResponseCollection';
  nodes: Array<ReviewWorkflowsWorkflowStage>;
};

export type Rozkopavky = {
  __typename?: 'Rozkopavky';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  documentId: Scalars['ID']['output'];
  enabled: Scalars['Boolean']['output'];
  locale?: Maybe<Scalars['String']['output']>;
  localizations: Array<Maybe<Rozkopavky>>;
  localizations_connection?: Maybe<RozkopavkyRelationResponseCollection>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type RozkopavkyInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type RozkopavkyRelationResponseCollection = {
  __typename?: 'RozkopavkyRelationResponseCollection';
  nodes: Array<Rozkopavky>;
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
  Subor: Array<Maybe<UploadFile>>;
  Subor_connection?: Maybe<UploadFileRelationResponseCollection>;
  Tagy?: Maybe<Scalars['String']['output']>;
  Telefon?: Maybe<Scalars['Long']['output']>;
  Telefon_popis?: Maybe<Scalars['String']['output']>;
  Web?: Maybe<Scalars['String']['output']>;
  Zdravotne_osetrenie?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  documentId: Scalars['ID']['output'];
  locale?: Maybe<Scalars['String']['output']>;
  localizations: Array<Maybe<SluzbyPreLudiBezDomova>>;
  localizations_connection?: Maybe<SluzbyPreLudiBezDomovaRelationResponseCollection>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


export type SluzbyPreLudiBezDomovaSuborArgs = {
  filters?: InputMaybe<UploadFileFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type SluzbyPreLudiBezDomovaSubor_ConnectionArgs = {
  filters?: InputMaybe<UploadFileFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type SluzbyPreLudiBezDomovaLocalizationsArgs = {
  filters?: InputMaybe<SluzbyPreLudiBezDomovaFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type SluzbyPreLudiBezDomovaLocalizations_ConnectionArgs = {
  filters?: InputMaybe<SluzbyPreLudiBezDomovaFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type SluzbyPreLudiBezDomovaEntityResponseCollection = {
  __typename?: 'SluzbyPreLudiBezDomovaEntityResponseCollection';
  nodes: Array<SluzbyPreLudiBezDomova>;
  pageInfo: Pagination;
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
  documentId?: InputMaybe<IdFilterInput>;
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
  nodes: Array<SluzbyPreLudiBezDomova>;
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
  nei?: InputMaybe<Scalars['String']['input']>;
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
  documentId: Scalars['ID']['output'];
  locale?: Maybe<Scalars['String']['output']>;
  localizations: Array<Maybe<TerenneSluzby>>;
  localizations_connection?: Maybe<TerenneSluzbyRelationResponseCollection>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


export type TerenneSluzbyLocalizationsArgs = {
  filters?: InputMaybe<TerenneSluzbyFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type TerenneSluzbyLocalizations_ConnectionArgs = {
  filters?: InputMaybe<TerenneSluzbyFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type TerenneSluzbyEntityResponseCollection = {
  __typename?: 'TerenneSluzbyEntityResponseCollection';
  nodes: Array<TerenneSluzby>;
  pageInfo: Pagination;
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
  documentId?: InputMaybe<IdFilterInput>;
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
  nodes: Array<TerenneSluzby>;
};

export type UploadFile = {
  __typename?: 'UploadFile';
  alternativeText?: Maybe<Scalars['String']['output']>;
  caption?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  documentId: Scalars['ID']['output'];
  ext?: Maybe<Scalars['String']['output']>;
  focalPoint?: Maybe<Scalars['JSON']['output']>;
  formats?: Maybe<Scalars['JSON']['output']>;
  hash: Scalars['String']['output'];
  height?: Maybe<Scalars['Int']['output']>;
  mime: Scalars['String']['output'];
  name: Scalars['String']['output'];
  previewUrl?: Maybe<Scalars['String']['output']>;
  provider: Scalars['String']['output'];
  provider_metadata?: Maybe<Scalars['JSON']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  related?: Maybe<Array<Maybe<GenericMorph>>>;
  size: Scalars['Float']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  url: Scalars['String']['output'];
  width?: Maybe<Scalars['Int']['output']>;
};

export type UploadFileEntityResponseCollection = {
  __typename?: 'UploadFileEntityResponseCollection';
  nodes: Array<UploadFile>;
  pageInfo: Pagination;
};

export type UploadFileFiltersInput = {
  alternativeText?: InputMaybe<StringFilterInput>;
  and?: InputMaybe<Array<InputMaybe<UploadFileFiltersInput>>>;
  caption?: InputMaybe<StringFilterInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  documentId?: InputMaybe<IdFilterInput>;
  ext?: InputMaybe<StringFilterInput>;
  focalPoint?: InputMaybe<JsonFilterInput>;
  formats?: InputMaybe<JsonFilterInput>;
  hash?: InputMaybe<StringFilterInput>;
  height?: InputMaybe<IntFilterInput>;
  mime?: InputMaybe<StringFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<UploadFileFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<UploadFileFiltersInput>>>;
  previewUrl?: InputMaybe<StringFilterInput>;
  provider?: InputMaybe<StringFilterInput>;
  provider_metadata?: InputMaybe<JsonFilterInput>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  size?: InputMaybe<FloatFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
  url?: InputMaybe<StringFilterInput>;
  width?: InputMaybe<IntFilterInput>;
};

export type UploadFileRelationResponseCollection = {
  __typename?: 'UploadFileRelationResponseCollection';
  nodes: Array<UploadFile>;
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
  documentId: Scalars['ID']['output'];
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
  documentId: Scalars['ID']['output'];
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  role?: Maybe<UsersPermissionsRole>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type UsersPermissionsPermissionFiltersInput = {
  action?: InputMaybe<StringFilterInput>;
  and?: InputMaybe<Array<InputMaybe<UsersPermissionsPermissionFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  documentId?: InputMaybe<IdFilterInput>;
  not?: InputMaybe<UsersPermissionsPermissionFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<UsersPermissionsPermissionFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  role?: InputMaybe<UsersPermissionsRoleFiltersInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type UsersPermissionsPermissionRelationResponseCollection = {
  __typename?: 'UsersPermissionsPermissionRelationResponseCollection';
  nodes: Array<UsersPermissionsPermission>;
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
  documentId: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  permissions: Array<Maybe<UsersPermissionsPermission>>;
  permissions_connection?: Maybe<UsersPermissionsPermissionRelationResponseCollection>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  users: Array<Maybe<UsersPermissionsUser>>;
  users_connection?: Maybe<UsersPermissionsUserRelationResponseCollection>;
};


export type UsersPermissionsRolePermissionsArgs = {
  filters?: InputMaybe<UsersPermissionsPermissionFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type UsersPermissionsRolePermissions_ConnectionArgs = {
  filters?: InputMaybe<UsersPermissionsPermissionFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type UsersPermissionsRoleUsersArgs = {
  filters?: InputMaybe<UsersPermissionsUserFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type UsersPermissionsRoleUsers_ConnectionArgs = {
  filters?: InputMaybe<UsersPermissionsUserFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type UsersPermissionsRoleEntityResponseCollection = {
  __typename?: 'UsersPermissionsRoleEntityResponseCollection';
  nodes: Array<UsersPermissionsRole>;
  pageInfo: Pagination;
};

export type UsersPermissionsRoleFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<UsersPermissionsRoleFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  description?: InputMaybe<StringFilterInput>;
  documentId?: InputMaybe<IdFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<UsersPermissionsRoleFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<UsersPermissionsRoleFiltersInput>>>;
  permissions?: InputMaybe<UsersPermissionsPermissionFiltersInput>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  type?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
  users?: InputMaybe<UsersPermissionsUserFiltersInput>;
};

export type UsersPermissionsRoleInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  permissions?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
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
  documentId: Scalars['ID']['output'];
  email: Scalars['String']['output'];
  provider?: Maybe<Scalars['String']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  role?: Maybe<UsersPermissionsRole>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  username: Scalars['String']['output'];
};

export type UsersPermissionsUserEntityResponse = {
  __typename?: 'UsersPermissionsUserEntityResponse';
  data?: Maybe<UsersPermissionsUser>;
};

export type UsersPermissionsUserEntityResponseCollection = {
  __typename?: 'UsersPermissionsUserEntityResponseCollection';
  nodes: Array<UsersPermissionsUser>;
  pageInfo: Pagination;
};

export type UsersPermissionsUserFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<UsersPermissionsUserFiltersInput>>>;
  blocked?: InputMaybe<BooleanFilterInput>;
  confirmed?: InputMaybe<BooleanFilterInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  documentId?: InputMaybe<IdFilterInput>;
  email?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<UsersPermissionsUserFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<UsersPermissionsUserFiltersInput>>>;
  provider?: InputMaybe<StringFilterInput>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  role?: InputMaybe<UsersPermissionsRoleFiltersInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
  username?: InputMaybe<StringFilterInput>;
};

export type UsersPermissionsUserInput = {
  blocked?: InputMaybe<Scalars['Boolean']['input']>;
  confirmationToken?: InputMaybe<Scalars['String']['input']>;
  confirmed?: InputMaybe<Scalars['Boolean']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  provider?: InputMaybe<Scalars['String']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  resetPasswordToken?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['ID']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type UsersPermissionsUserRelationResponseCollection = {
  __typename?: 'UsersPermissionsUserRelationResponseCollection';
  nodes: Array<UsersPermissionsUser>;
};

export type LinkyPomociQueryVariables = Exact<{
  locale: Scalars['I18NLocaleCode']['input'];
}>;


export type LinkyPomociQuery = { __typename?: 'Query', linkyPomocis: Array<{ __typename?: 'LinkyPomoci', documentId: string, Cena?: string | null, Email?: string | null, Nazov?: string | null, Popis?: string | null, Prevadzka?: string | null, Prevadzkovatel?: string | null, Telefon?: any | null, createdAt?: any | null, locale?: string | null, publishedAt?: any | null, updatedAt?: any | null } | null> };

export type FixpointyQueryVariables = Exact<{
  locale: Scalars['I18NLocaleCode']['input'];
}>;


export type FixpointyQuery = { __typename?: 'Query', fixpoints: Array<{ __typename?: 'Fixpointy', documentId: string, Adresa?: string | null, Latitude?: number | null, Longitude?: number | null, Nazov?: string | null, createdAt?: any | null } | null> };

export type TerenneSluzbyQueryVariables = Exact<{
  locale: Scalars['I18NLocaleCode']['input'];
}>;


export type TerenneSluzbyQuery = { __typename?: 'Query', terenneSluzbies: Array<{ __typename?: 'TerenneSluzby', documentId: string, Cena_kapacita?: string | null, Dostupnost?: string | null, Lokalita_posobnosti?: string | null, Nazov?: string | null, Poskytovatel?: string | null, Sluzba?: string | null, Telefon?: any | null } | null> };

export type SluzbyPreLudiBezDomovaQueryVariables = Exact<{
  locale: Scalars['I18NLocaleCode']['input'];
}>;


export type SluzbyPreLudiBezDomovaQuery = { __typename?: 'Query', sluzbyPreLudiBezDomovas: Array<{ __typename?: 'SluzbyPreLudiBezDomova', documentId: string, Adresa?: string | null, Cas?: string | null, Email?: string | null, Kontaktne_centrum?: string | null, Hygiena_osatenie?: string | null, Kultura?: string | null, Latitude?: number | null, Longitude?: number | null, Mestska_cast?: string | null, Navigacia?: string | null, Navigovat?: string | null, Nazov?: string | null, Noclah_ubytovanie?: string | null, Popis?: string | null, Poskytovatel?: string | null, Socialne_pravne_poradenstvo?: string | null, Strava?: string | null, Tagy?: string | null, Telefon?: any | null, Telefon_popis?: string | null, Web?: string | null, Zdravotne_osetrenie?: string | null, Subor: Array<{ __typename?: 'UploadFile', documentId: string, url: string } | null> } | null> };

export type PitneFontankyQueryVariables = Exact<{
  locale: Scalars['I18NLocaleCode']['input'];
}>;


export type PitneFontankyQuery = { __typename?: 'Query', pitneFontankies: Array<{ __typename?: 'PitneFontanky', documentId: string, Latitude?: number | null, Longitude?: number | null, Nazov?: string | null, Rok_spustenia?: string | null, Spravca?: string | null, Stav?: string | null, Typ?: string | null, Fotky: Array<{ __typename?: 'UploadFile', documentId: string, url: string } | null> } | null> };


export const LinkyPomociDocument = `
    query LinkyPomoci($locale: I18NLocaleCode!) {
  linkyPomocis(locale: $locale, sort: "Nazov:asc") {
    documentId
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
    documentId
    Adresa
    Latitude
    Longitude
    Nazov
    createdAt
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
  terenneSluzbies(locale: $locale, sort: "Nazov:asc") {
    documentId
    Cena_kapacita
    Dostupnost
    Lokalita_posobnosti
    Nazov
    Poskytovatel
    Sluzba
    Telefon
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
    documentId
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
      documentId
      url
    }
    Tagy
    Telefon
    Telefon_popis
    Web
    Zdravotne_osetrenie
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
    documentId
    Fotky {
      documentId
      url
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