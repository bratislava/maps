import { Eye, EyeCrossed } from "@bratislava/react-maps-icons";
import { Accordion, AccordionItem, Checkbox } from "@bratislava/react-maps-ui";
import cx from "classnames";
import { FC, ReactNode, useCallback } from "react";

export interface ILayer<L extends string> {
  value: L[] | L;
  label?: string;
  tooltip?: string;
  isActive?: boolean;
  component?: FC<{ isActive: boolean; onToggle: () => void }>;
}

export interface ILayerGroup<L extends string> {
  icon?: ReactNode;
  label: string;
  layers: ILayer<L>[] | ILayer<L>;
}

export interface ILayerProps<L extends string> {
  groups: ILayerGroup<L>[];
  onLayersVisibilityChange: (layers: L[], value: boolean) => void;
  paasDesign?: boolean;
}

export const Layers = <L extends string>({
  groups,
  onLayersVisibilityChange,
  paasDesign,
}: ILayerProps<L>) => {
  // const [currentTooltipType, setCurrentTooltipType] = useState<string | null>(null);
  // const [isTooltipModalOpen, setTooltipModalOpen] = useState<boolean>(false);

  // const openTooltipModal = useCallback(
  //   (type: string) => {
  //     if (isMobile && tooltips && tooltips[type]) {
  //       setCurrentTooltipType(type);
  //       setTooltipModalOpen(true);
  //     }
  //   },
  //   [tooltips, isMobile],
  // );

  // const closeTooltipModal = useCallback(() => {
  //   setTooltipModalOpen(false);
  // }, []);

  const isAnyLayerActive = useCallback((layers: ILayer<L> | ILayer<L>[]) => {
    return Array.isArray(layers)
      ? layers.some((l) => l.isActive)
      : layers.isActive ?? false;
  }, []);

  const layersToggleHandler = useCallback(
    (layers: ILayer<L> | ILayer<L>[]) => {
      const layerKeys = (
        Array.isArray(layers) ? layers.map((l) => l.value) : [layers.value]
      ).flat() as L[];
      isAnyLayerActive(layers)
        ? onLayersVisibilityChange(layerKeys, false)
        : onLayersVisibilityChange(layerKeys, true);
    },
    [isAnyLayerActive, onLayersVisibilityChange]
  );

  return (
    <div className="flex flex-col w-full">
      <Accordion type="multiple">
        {groups.map(({ label, layers, icon }, index) => {
          return (
            <AccordionItem
              value={label}
              isOpenable={Array.isArray(layers)}
              className={cx("transition-all bg-opacity-10 dark:bg-opacity-10", {
                "border-l-4": !paasDesign,
                "bg-gray-lightmode dark:bg-gray-darkmode border-primary":
                  isAnyLayerActive(layers) && !paasDesign,
                "border-background-lightmode dark:border-background-darkmode":
                  !isAnyLayerActive(layers),
              })}
              headerClassName="pl-5 py-1"
              key={index}
              title={
                <div className="flex gap-4 items-center">
                  {!!icon && icon}
                  <div>{label}</div>
                  {/* {tooltips && subLayers.length == 1 && (
                    <Popover
                      button={
                        <div
                          className="pt-[1px]"
                          onClick={() => {
                            openTooltipModal(subLayers[0]);
                          }}
                        >
                          <Information className="text-primary mt-[4px]" size="sm" />
                        </div>
                      }
                      panel={
                        <div className="flex flex-col gap-2">
                          <div className="text-md font-semibold">
                            {capitalizeFirstLetter(subLayers[0])}
                          </div>
                          <div className="">{capitalizeFirstLetter(tooltips[subLayers[0]])}</div>
                        </div>
                      }
                    />
                  )} */}
                </div>
              }
              rightSlot={
                <button
                  className="cursor-pointer p-1"
                  onClick={() => layersToggleHandler(layers)}
                >
                  {isAnyLayerActive(layers) ? (
                    <Eye width={18} height={18} />
                  ) : (
                    <EyeCrossed width={18} height={18} />
                  )}
                </button>
              }
            >
              <div className="flex flex-col gap-2">
                {Array.isArray(layers) &&
                  layers.map((layer, i) => {
                    return layer.component ? (
                      <button
                        key={i}
                        onClick={() => layersToggleHandler(layer)}
                      >
                        <layer.component
                          isActive={isAnyLayerActive(layer)}
                          onToggle={() => layersToggleHandler(layer)}
                        />
                      </button>
                    ) : (
                      <Checkbox
                        key={i}
                        id={
                          Array.isArray(layer.value)
                            ? layer.value.join("-")
                            : layer.value
                        }
                        label={
                          <div className="flex items-center gap-2">
                            <span className="pb-[2px]">{layer.label}</span>
                            {/* {tooltips && (
                              <>
                                {tooltips[type] ? (
                                  <Popover
                                    button={
                                      <div
                                        className="pt-[1px]"
                                        onClick={() => {
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
                            )} */}
                          </div>
                        }
                        checked={isAnyLayerActive(layer)}
                        onChange={() => layersToggleHandler(layer)}
                      />
                    );
                  })}
              </div>
            </AccordionItem>
          );
        })}
      </Accordion>

      {/* <Modal
        className="max-w-lg"
        isOpen={isTooltipModalOpen}
        title={capitalizeFirstLetter(currentTooltipType ?? "")}
        description={tooltips && capitalizeFirstLetter(tooltips[currentTooltipType ?? ""] ?? "")}
        onClose={closeTooltipModal}
      ></Modal> */}
    </div>
  );
};
