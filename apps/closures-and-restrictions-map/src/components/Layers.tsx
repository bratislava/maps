import { IFilterResult } from "@bratislava/react-mapbox";
import { Eye, Information } from "@bratislava/react-maps-icons";
import { Accordion, AccordionItem, Checkbox, Modal, Popover } from "@bratislava/react-maps-ui";
import cx from "classnames";
import { ReactNode, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { capitalizeFirstLetter } from "../../../planting-map/src/utils/utils";
import { ITooltip } from "./App";
import { Icon } from "./Icon";

export interface ILayerCategory {
  label: string;
  icon: ReactNode;
  subLayers: string[];
}

export interface ILayerProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filter: IFilterResult<any>;
}

export const Layers = ({ filter }: ILayerProps) => {
  const { t, i18n }: { t: (key: string) => string; i18n: { language: string } } = useTranslation();

  const layers: Array<ILayerCategory> = [
    {
      label: t("layers.digups.title"),
      icon: <Icon icon="digup" size={40} />,
      subLayers: ["digups"],
    },
    {
      label: t("layers.closures.title"),
      icon: <Icon icon="closure" size={40} />,
      subLayers: ["closures"],
    },
    {
      label: t("layers.disorders.title"),
      icon: <Icon icon="disorder" size={40} />,
      subLayers: ["disorders"],
    },
    // {
    //   label: t("layers.repairs.title"),
    //   icon: <Icon icon="repair" size={40} />,
    //   subLayers: ["repairs"],
    // },
  ];

  return (
    <div className="flex flex-col w-full">
      <Accordion type="multiple">
        {layers.map(({ label, icon, subLayers }, index) => {
          return (
            <AccordionItem
              value={label}
              isOpenable={subLayers.length > 1}
              className={cx(
                "border-l-4 pl-[20px] transition-all bg-opacity-10 dark:bg-opacity-10",
                {
                  "bg-gray-lightmode dark:bg-gray-darkmode border-primary":
                    filter.isAnyKeyActive(subLayers),
                  "border-background-lightmode dark:border-background-darkmode":
                    !filter.isAnyKeyActive(subLayers),
                },
              )}
              key={index}
              title={
                <div className="flex items-center py-2 gap-2">
                  <div>{icon}</div>
                  <div>{label}</div>
                </div>
              }
              rightSlot={
                <button
                  className="cursor-pointer p-1"
                  onClick={() =>
                    filter.isAnyKeyActive(subLayers)
                      ? filter.setActive(subLayers, false)
                      : filter.setActive(subLayers, true)
                  }
                >
                  <Eye size="sm" isCrossed={!filter.isAnyKeyActive(subLayers)} />
                </button>
              }
            >
              <div className="flex flex-col gap-2">
                {subLayers.map((type) => {
                  return (
                    <Checkbox
                      key={type}
                      id={type}
                      label={
                        <div className="flex items-center gap-2">
                          <span className="pb-[2px]">{type}</span>
                        </div>
                      }
                      checked={filter.areKeysActive(type)}
                      onChange={() => filter.toggleActive(type)}
                    />
                  );
                })}
              </div>
            </AccordionItem>
          );
        })}
      </Accordion>

    </div>
  );
};
