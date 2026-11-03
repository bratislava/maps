// Strapi returns these lists in database order, which changes whenever an entry is
// published again. Sort by name with the UI language's collation instead.
export const sortByName = <T extends { Nazov?: string | null } | null>(
  items: T[],
  locale: string,
): T[] => {
  const collator = new Intl.Collator(locale);
  return [...items].sort((a, b) => collator.compare(a?.Nazov ?? "", b?.Nazov ?? ""));
};
