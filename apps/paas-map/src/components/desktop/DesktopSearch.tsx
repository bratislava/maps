import { SearchBar } from "@bratislava/react-maps";
import cx from "classnames";
import { RefObject, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

export interface IDesktopSearchProps {
  areFiltersOpen: boolean;
}

export const DesktopSearch = ({ areFiltersOpen }: IDesktopSearchProps) => {
  const { t, i18n } = useTranslation();

  return (
    <div
      className={cx(
        "fixed top-[18px] left-10 w-72 z-10 shadow-lg rounded-lg transition-transform duration-500",
        {
          "translate-x-96": areFiltersOpen,
        },
      )}
    >
      <SearchBar placeholder={t("search")} language={i18n.language} direction="bottom" />
    </div>
  );
};
