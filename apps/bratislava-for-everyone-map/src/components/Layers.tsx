import { IFilterResult } from "@bratislava/react-mapbox";
import { Eye, EyeCrossed, Information } from "@bratislava/react-maps-icons";
import { Accordion, AccordionItem, Checkbox, Modal, Popover } from "@bratislava/react-maps-ui";
import cx from "classnames";
import { useCallback, useState } from "react";
import { capitalizeFirstLetter } from "../../../planting-map/src/utils/utils";
import { colors } from "../utils/colors";
import { useTranslation } from "react-i18next";

export interface ILayerCategory {
  label: string;
  subLayers: string[];
}

export interface ILayerProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filter: IFilterResult<any>;
  layers: ILayerCategory[];
  tooltips?: {
    [index: string]: string;
  };
  isMobile: boolean;
}

export const Layers = ({ filter, layers, tooltips, isMobile }: ILayerProps) => {
  const [currentTooltipType, setCurrentTooltipType] = useState<string | null>(null);
  const [isTooltipModalOpen, setTooltipModalOpen] = useState<boolean>(false);
  const { t } = useTranslation();

  const openTooltipModal = useCallback(
    (type: string) => {
      if (isMobile && tooltips && tooltips[type]) {
        setCurrentTooltipType(type);
        setTooltipModalOpen(true);
      }
    },
    [tooltips, isMobile],
  );

  const closeTooltipModal = useCallback(() => {
    setTooltipModalOpen(false);
  }, []);

  return (
    <div className="flex flex-col w-full">
      <Accordion type="single">
        {layers.map(({ label, subLayers }, index) => {
          return (
            <AccordionItem
              value={label}
              isOpenable={subLayers.length > 1}
              style={{
                borderColor: filter.isAnyKeyActive(subLayers) ? colors[label] : "transparent",
              }}
              className={cx(
                "border-l-4 pl-[20px] transition-all bg-opacity-10 dark:bg-opacity-10",
                {
                  "bg-gray-lightmode dark:bg-gray-darkmode": filter.isAnyKeyActive(subLayers),
                  "border-background-lightmode dark:border-background-darkmode":
                    !filter.isAnyKeyActive(subLayers),
                },
              )}
              key={index}
              title={
                <div className="flex gap-2">
                  <div>{t(`layers.${label}`)}</div>
                  {tooltips && subLayers.length == 1 && (
                    <Popover
                      button={() => (
                        <div
                          className="pt-[1px]"
                          onClick={() => {
                            openTooltipModal(subLayers[0]);
                          }}
                        >
                          <Information className="text-primary mt-[4px]" size="sm" />
                        </div>
                      )}
                      panel={
                        <div className="flex flex-col gap-2">
                          <div className="text-md font-semibold">
                            {capitalizeFirstLetter(subLayers[0])}
                          </div>
                          <div className="">{capitalizeFirstLetter(tooltips[subLayers[0]])}</div>
                        </div>
                      }
                    />
                  )}
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
                  {filter.isAnyKeyActive(subLayers) ? (
                    <Eye width={18} height={18} />
                  ) : (
                    <EyeCrossed width={18} height={18} />
                  )}
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
                          {tooltips && (
                            <>
                              {tooltips[type] ? (
                                <Popover
                                  button={() => (
                                    <div
                                      className="pt-[1px]"
                                      onClick={() => {
                                        openTooltipModal(type);
                                      }}
                                    >
                                      <Information className="text-primary mt-[6px]" size="sm" />
                                    </div>
                                  )}
                                  panel={
                                    <div className="flex flex-col gap-2">
                                      <div className="text-md font-semibold">
                                        {capitalizeFirstLetter(type)}
                                      </div>
                                      <div className="">
                                        {capitalizeFirstLetter(tooltips[type])}
                                      </div>
                                    </div>
                                  }
                                />
                              ) : (
                                <div
                                  className="pt-[1px]"
                                  onClick={() => {
                                    openTooltipModal(type);
                                  }}
                                >
                                  <Information className="text-primary mt-[2px]" size="sm" />
                                </div>
                              )}
                            </>
                          )}
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

      <Modal
        overlayClassName="max-w-lg"
        isOpen={isTooltipModalOpen}
        title={capitalizeFirstLetter(currentTooltipType ?? "")}
        description={tooltips && capitalizeFirstLetter(tooltips[currentTooltipType ?? ""] ?? "")}
        onClose={closeTooltipModal}
      ></Modal>
    </div>
  );
};
