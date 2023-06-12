import { IFilterResult } from "@bratislava/react-mapbox";
import { Eye } from "@bratislava/react-maps-icons";
import { Accordion, AccordionItem, Checkbox } from "@bratislava/react-maps-ui";
import cx from "classnames";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
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
  const { t }: { t: (key: string) => string; i18n: { language: string } } = useTranslation();

  const layers: Array<ILayerCategory> = [
    {
      label: t("layers.closures.title"),
      icon: <Icon icon="closure" size={40} />,
      subLayers: ["closures"],
    },
    {
      label: t("layers.digups.title"),
      icon: <Icon icon="digup" size={40} />,
      subLayers: ["digups"],
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

  const isDisabled = (layer: string) => {
    const activeStatusKeys = filter.activeKeys;
    const disabled = activeStatusKeys.length === 1 && activeStatusKeys.includes(layer);
    return disabled;
  };

  const layerHandler = (layer: string) => {
    if (isDisabled(layer)) return;
    filter.toggleActive(layer);
  };

  const existingLayers = layers.filter((layer) => filter.keys.includes(layer.subLayers[0]));

  return (
    <div className="flex flex-col w-full">
      <Accordion type="multiple">
        {existingLayers.map(({ label, icon, subLayers }, index) => {
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
                <button className="cursor-pointer p-1" onClick={() => layerHandler(subLayers[0])}>
                  <div style={{ opacity: isDisabled(subLayers[0]) ? ".5" : "1" }}>
                    <Eye size="sm" isCrossed={!filter.isAnyKeyActive(subLayers)} />
                  </div>
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
