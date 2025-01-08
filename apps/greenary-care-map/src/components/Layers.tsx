import { IFilterResult } from "@bratislava/react-mapbox";
import { Eye, Information } from "@bratislava/react-maps-icons";
import { Accordion, AccordionItem, Checkbox, Modal, Popover } from "@bratislava/react-maps-ui";
import cx from "classnames";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

export interface ILayerProps<T> {
  typeFilter: IFilterResult<T>;
  typeCategories: {
    label: string;
    types: string[];
  }[];
  typeTooltips: {
    [index: string]: string;
  };
  isMobile: boolean;
}

export const Layers = <T extends string>({
  typeFilter,
  typeCategories,
  typeTooltips,
  isMobile,
}: ILayerProps<T>) => {
  const [currentTooltipType, setCurrentTooltipType] = useState<string | null>(null);
  const [isTooltipModalOpen, setTooltipModalOpen] = useState<boolean>(false);

  const openTooltipModal = useCallback(
    (type: string) => {
      if (isMobile && typeTooltips[type]) {
        setCurrentTooltipType(type);
        setTooltipModalOpen(true);
      }
    },
    [typeTooltips, isMobile],
  );

  const closeTooltipModal = useCallback(() => {
    setTooltipModalOpen(false);
  }, []);

  const {
    t,
    i18n: { language },
  } = useTranslation();

  return (
    <div className="flex flex-col w-full">
      <Accordion type="multiple">
        {typeCategories.map(({ label, types }, index) => {
          return (
            <AccordionItem
              value={label}
              isOpenable={types.length > 1}
              className={cx(
                "border-l-4 pl-[20px] transition-all bg-opacity-10 dark:bg-opacity-10",
                {
                  "bg-gray-lightmode dark:bg-gray-darkmode border-primary":
                    typeFilter.isAnyKeyActive(types as T[]),
                  "border-background-lightmode dark:border-background-darkmode":
                    !typeFilter.isAnyKeyActive(types as T[]),
                },
              )}
              key={index}
              title={
                <div className="flex gap-2">
                  <div>{label}</div>
                  {types.length == 1 && language === "sk" && (
                    <Popover
                      button={({ toggle }) => (
                        <div
                          className="pt-[1px] cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isMobile) {
                              openTooltipModal(types[0]);
                            } else {
                              toggle();
                            }
                          }}
                        >
                          <Information className="text-primary mt-[4px]" size="sm" />
                        </div>
                      )}
                      panel={
                        <div className="flex flex-col gap-2 max-w-sm">
                          <div className="text-md font-semibold">{label}</div>
                          <div className="">{typeTooltips[types[0]]}</div>
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
                    typeFilter.isAnyKeyActive(types as T[])
                      ? typeFilter.setActive(types as T[], false)
                      : typeFilter.setActive(types as T[], true)
                  }
                >
                  <Eye size="sm" isCrossed={!typeFilter.isAnyKeyActive(types as T[])} />
                </button>
              }
            >
              <div className="flex flex-col gap-2 pb-4">
                {types.map((type) => {
                  return (
                    <Checkbox
                      key={type}
                      id={type}
                      label={
                        <div className="flex items-center gap-2">
                          {/* https://www.i18next.com/overview/typescript#type-error-template-literal */}
                          <span className="pb-[2px]">{t(`categories.${type}` as any)}</span>
                          {language === "sk" && (
                            <Popover
                              button={({ toggle }) => (
                                <div
                                  className="pt-[px] cursor-pointer"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (isMobile) {
                                      openTooltipModal(type);
                                    } else {
                                      toggle();
                                    }
                                  }}
                                >
                                  <Information className="text-primary mt-[2px]" size="sm" />
                                </div>
                              )}
                              panel={
                                <div className="flex flex-col gap-2 max-w-sm">
                                  <div className="text-md font-semibold">
                                    {/* https://www.i18next.com/overview/typescript#type-error-template-literal */}
                                    {t(`categories.${type}` as any)}
                                  </div>
                                  <div className="">{typeTooltips[type]}</div>
                                </div>
                              }
                            />
                          )}
                        </div>
                      }
                      checked={typeFilter.areKeysActive(type as T)}
                      onChange={() => typeFilter.toggleActive(type as T)}
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
        // https://www.i18next.com/overview/typescript#type-error-template-literal
        title={t(`categories.${currentTooltipType ?? ""}` as any)}
        description={typeTooltips[currentTooltipType ?? ""] ?? ""}
        onClose={closeTooltipModal}
      ></Modal>
    </div>
  );
};
