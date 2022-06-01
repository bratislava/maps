import React, { forwardRef, ReactNode, useEffect, useState } from "react";
import { ChevronLeftSmall, Close } from "@bratislava/mapbox-maps-icons";
import cx from "classnames";
import { useTranslation } from "react-i18next";
import { getDistrictOptions } from "../utils/districts";
import { Select } from "@bratislava/mapbox-maps-ui";
import { TemporalQuery } from "@js-joda/core";

interface FilterProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  selectedDistrict: string;
  onDistrictChange: (district: string) => void;
  moveSearchBarOutsideOfSideBarOnLargeScreen?: boolean;
  showDistrictSelect?: boolean;
}

export const Filter = forwardRef<HTMLDivElement, FilterProps>(
  (
    {
      isOpen,
      onClose,
      children,
      title,
      onDistrictChange,
      selectedDistrict,
      moveSearchBarOutsideOfSideBarOnLargeScreen,
      showDistrictSelect = TemporalQuery,
    },
    ref
  ) => {
    const { t } = useTranslation();

    const [districtOptions, setDistrictOptions] = useState(
      getDistrictOptions()
    );

    const [selectedDistrictObject, setSelectedDistrictObject] =
      useState<{ key: string; label: string }>(null);

    useEffect(() => {
      setSelectedDistrictObject(
        districtOptions.find(
          (districtOption) => districtOption.key === selectedDistrict
        ) ?? null
      );
    }, [districtOptions, selectedDistrict]);

    useEffect(() => {
      onDistrictChange(
        selectedDistrictObject ? selectedDistrictObject.key : null
      );
    }, [onDistrictChange, selectedDistrictObject]);

    return (
      <div
        ref={ref}
        className={cx(
          `
            fixed bottom-0 top-0 h-full w-full flex flex-col bg-background duration-500 ease-in-out transform transition-transform overflow-auto
            sm:top-20 sm:w-96 sm:pt-20 z-20 sm:z-auto
          `,
          {
            "md:pt-6": moveSearchBarOutsideOfSideBarOnLargeScreen,
            "shadow-lg translate-x-0": isOpen,
            "translate-x-full sm:-translate-x-full shadow-none": !isOpen,
          }
        )}
      >
        <button
          onClick={onClose}
          className="flex items-center space-x-4 sm:hidden p-8"
        >
          <ChevronLeftSmall width={20} height={20} className="text-secondary" />
          <span className="text-md font-medium">{title}</span>
        </button>
        {showDistrictSelect && (
          <div className="px-8 pb-4 flex flex-col gap-4">
            <div className="flex justify-between">
              <span className="font-bold text-[20px]">Filter</span>
            </div>
            <Select
              className="w-full"
              value={selectedDistrictObject}
              options={districtOptions}
              onChange={setSelectedDistrictObject}
            />
          </div>
        )}
        <div className="flex-1 flex">{children}</div>
        <div className="py-4 sm:hidden left-0 md:left-auto bottom-8 md:bottom-auto md:top-6 md:right-4 flex justify-center w-full md:w-auto">
          <button onClick={onClose} className="flex items-center group">
            <span>{t("maps:close")}</span>
            <Close className="text-secondary group-hover:text-primary" />
          </button>
        </div>
      </div>
    );
  }
);

export default Filter;
