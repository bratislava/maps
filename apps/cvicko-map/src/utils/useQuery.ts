import { useCallback, useEffect, useState } from "react";

type Parser<T> = (query: string | null) => T;

export const useQuery = <T>(key: string, parser: Parser<T>) => {
  const [value, setValue] = useState<T>(parser(null));

  const queryChangeHandler = useCallback(() => {
    const query = new URLSearchParams(window.location.search).get(key);
    setValue(parser(query));
  }, [key, parser]);

  useEffect(() => {
    queryChangeHandler();
    window.addEventListener("locationchange", queryChangeHandler);
    return () => window.removeEventListener("locationchange", queryChangeHandler);
  }, [queryChangeHandler]);

  return value;
};
