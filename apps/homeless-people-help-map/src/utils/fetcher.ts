// general-strapi base URL, defaults to production; override to test against another Strapi
const GENERAL_STRAPI_URL =
  import.meta.env.PUBLIC_GENERAL_STRAPI_URL ?? "https://general-strapi.bratislava.sk";

// Used by the hooks generated into graphql/index.ts (see codegen.yml)
export const fetcher = <TData, TVariables>(query: string, variables?: TVariables) => {
  return async (): Promise<TData> => {
    const res = await fetch(`${GENERAL_STRAPI_URL}/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0];

      throw new Error(message);
    }

    return json.data;
  };
};
