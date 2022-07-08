import { IFilterResult } from "@bratislava/react-maps-core";
import { Eye, EyeCrossed, Information } from "@bratislava/react-maps-icons";
import { Accordion, AccordionItem, Checkbox, Modal, Popover } from "@bratislava/react-maps-ui";
import cx from "classnames";
import { useCallback, useState } from "react";
import { capitalizeFirstLetter } from "../utils/utils";

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

  return (
    <div className="flex flex-col w-full">
      <Accordion>
        {typeCategories.map(({ label, types }, index) => {
          return (
            <AccordionItem
              value={label}
              isOpenable={types.length > 1}
              className={cx("border-l-4 transition-all bg-opacity-10 dark:bg-opacity-10", {
                "bg-gray-lightmode dark:bg-gray-darkmode border-primary": typeFilter.isAnyKeyActive(
                  types as T[],
                ),
                "border-background-lightmode dark:border-background-darkmode":
                  !typeFilter.isAnyKeyActive(types as T[]),
              })}
              key={index}
              title={
                <div className="flex gap-2">
                  <div>{label}</div>
                  {types.length == 1 && (
                    <Popover
                      button={
                        <div
                          className="pt-[1px]"
                          onClick={(e) => {
                            openTooltipModal(types[0]);
                          }}
                        >
                          <Information className="text-primary mt-[4px]" size="sm" />
                        </div>
                      }
                      panel={
                        <div className="flex flex-col gap-2">
                          <div className="text-md font-semibold">
                            {capitalizeFirstLetter(types[0])}
                          </div>
                          <div className="">{capitalizeFirstLetter(typeTooltips[types[0]])}</div>
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
                  {typeFilter.isAnyKeyActive(types as T[]) ? (
                    <Eye width={18} height={18} />
                  ) : (
                    <EyeCrossed width={18} height={18} />
                  )}
                </button>
              }
            >
              <div className="flex flex-col gap-2">
                {types.map((type) => {
                  return (
                    <Checkbox
                      key={type}
                      id={type}
                      label={
                        <div className="flex items-center gap-2">
                          <span className="pb-[2px]">{type}</span>
                          {typeTooltips[type] ? (
                            <Popover
                              button={
                                <div
                                  className="pt-[1px]"
                                  onClick={(e) => {
                                    openTooltipModal(type);
                                  }}
                                >
                                  <Information className="text-primary mt-[6px]" size="sm" />
                                </div>
                              }
                              panel={
                                <div className="flex flex-col gap-2">
                                  <div className="text-md font-semibold">
                                    {capitalizeFirstLetter(type)}
                                  </div>
                                  <div className="">
                                    {capitalizeFirstLetter(typeTooltips[type])}
                                  </div>
                                </div>
                              }
                            />
                          ) : (
                            <div
                              className="pt-[1px]"
                              onClick={(e) => {
                                openTooltipModal(type);
                              }}
                            >
                              <Information className="text-primary mt-[2px]" size="sm" />
                            </div>
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
        className="max-w-lg"
        isOpen={isTooltipModalOpen}
        title={capitalizeFirstLetter(currentTooltipType ?? "")}
        description={capitalizeFirstLetter(typeTooltips[currentTooltipType ?? ""] ?? "")}
        onClose={closeTooltipModal}
      ></Modal>
    </div>
  );
};
