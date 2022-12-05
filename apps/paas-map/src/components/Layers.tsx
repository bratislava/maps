import { IFilterResult } from "@bratislava/react-mapbox";
import { Chevron, Eye, Information } from "@bratislava/react-maps-icons";
import { Modal, Popover } from "@bratislava/react-maps-ui";
import * as Accordion from "@radix-ui/react-accordion";
import { keyframes, styled } from "@stitches/react";
import cx from "classnames";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Icon, IIconProps } from "./Icon";

const slideDown = keyframes({
  from: { height: 0 },
  to: { height: "var(--radix-accordion-content-height)" },
});

const slideUp = keyframes({
  from: { height: "var(--radix-accordion-content-height)" },
  to: { height: 0 },
});

const StyledAccordionContent = styled(Accordion.Content, {
  '&[data-state="open"]': {
    animation: `${slideDown} 300ms cubic-bezier(0.87, 0, 0.13, 1)`,
  },
  '&[data-state="closed"]': {
    animation: `${slideUp} 300ms cubic-bezier(0.87, 0, 0.13, 1)`,
  },
});

const StyledChevron = styled(Chevron, {
  transition: "transform 300ms cubic-bezier(0.87, 0, 0.13, 1)",
  "[data-state=open] &": { transform: "rotate(180deg)" },
});

const PrimaryLayerButton = ({
  title,
  isActive,
  toggle,
  icon,
  tooltip,
  isMobile,
  onMobileTooltipClick,
}: {
  title: string;
  icon: IIconProps["icon"];
  isActive: boolean;
  toggle: () => void;
  tooltip: string;
  isMobile: boolean;
  onMobileTooltipClick: (title: string, description: ReactNode) => void;
}) => {
  return (
    <>
      <button
        onClick={toggle}
        className={cx("flex w-full justify-between items-center gap-2 px-6 py-2", {
          "bg-gray-lightmode bg-opacity-10 dark:bg-gray-darkmode dark:bg-opacity-10": isActive,
        })}
      >
        <div className="flex items-center gap-2">
          <Icon icon={icon} size={40} />
          <span className="font-semibold">{title}</span>
          <Popover
            button={({ toggle }) => (
              <div
                className="mt-[2px]"
                onClick={(e) => {
                  e.stopPropagation();
                  if (isMobile) {
                    onMobileTooltipClick(title, tooltip);
                  } else {
                    toggle();
                  }
                }}
              >
                <Information className="text-primary mt-[4px]" size="default" />
              </div>
            )}
            panel={
              <div className="flex flex-col gap-2 w-[400px]">
                <div className="text-md font-semibold">{title}</div>
                <div className="">{tooltip}</div>
              </div>
            }
          />
        </div>
        <div>
          <Eye size="sm" isCrossed={!isActive} />
        </div>
      </button>
    </>
  );
};

const SecondaryLayerButton = ({
  title,
  isActive,
  toggle,
  isMobile,
  tooltip,
  onMobileTooltipClick,
}: {
  tooltip?: ReactNode | string;
  title: string;
  isActive: boolean;
  toggle: () => void;
  isMobile: boolean;
  onMobileTooltipClick: (title: string, description: ReactNode) => void;
}) => {
  return (
    <div className="flex w-full justify-between items-center gap-2">
      <div className="flex items-center gap-2 py-2 pl-6">
        <span className="font-semibold">{title}</span>
        {tooltip && (
          <Popover
            button={({ toggle }) => (
              <div
                className="mt-[2px] cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  if (isMobile) {
                    onMobileTooltipClick(title, tooltip);
                  } else {
                    toggle();
                  }
                }}
              >
                <Information className="text-primary mt-[4px]" size="default" />
              </div>
            )}
            panel={
              <div className="flex flex-col gap-2 w-[400px]">
                <div className="text-md font-semibold">{title}</div>
                <div className="">{tooltip}</div>
              </div>
            }
          />
        )}
      </div>
      <div
        className={cx("flex items-center h-12 px-6 gap-6", {
          "bg-primary-soft text-foreground-lightmode": isActive,
        })}
      >
        <button onClick={toggle}>
          <Eye size="sm" isCrossed={!isActive} />
        </button>
        <Accordion.Trigger className="p-[2px]">
          <StyledChevron direction="bottom" size="xs" />
        </Accordion.Trigger>
      </div>
    </div>
  );
};

const SubLayerButton = ({
  title,
  isActive,
  toggle,
  icon,
  isMobile,
  tooltip,
  onMobileTooltipClick,
}: {
  tooltip?: ReactNode | string;
  title: string;
  icon: IIconProps["icon"];
  isActive: boolean;
  toggle: () => void;
  isMobile: boolean;
  onMobileTooltipClick: (title: string, description: ReactNode) => void;
}) => {
  return (
    <button
      onClick={toggle}
      className={cx("flex w-full justify-between items-center gap-2 px-6 py-2", {
        "bg-gray-lightmode bg-opacity-10 dark:bg-gray-darkmode dark:bg-opacity-10": isActive,
      })}
    >
      <div className="flex items-center gap-2">
        <Icon icon={icon} size={40} />
        <span className="font-semibold">{title}</span>
        {tooltip && (
          <Popover
            button={({ toggle }) => (
              <div
                className="mt-[2px] cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  if (isMobile) {
                    onMobileTooltipClick(title, tooltip);
                  } else {
                    toggle();
                  }
                }}
              >
                <Information className="text-primary mt-[4px]" size="default" />
              </div>
            )}
            panel={
              <div className="flex flex-col gap-2 w-[400px]">
                <div className="text-md font-semibold">{title}</div>
                <div className="">{tooltip}</div>
              </div>
            }
          />
        )}
      </div>
      <div>
        <Eye size="sm" isCrossed={!isActive} />
      </div>
    </button>
  );
};

export interface ILayerProps<LF extends string, MF extends string> {
  layerFilter: IFilterResult<LF>;
  markerFilter: IFilterResult<MF>;
  isMobile: boolean;
}

export const Layers = <LF extends string, MF extends string>({
  layerFilter,
  markerFilter,
  isMobile,
}: ILayerProps<LF, MF>) => {
  const { t } = useTranslation();

  const [isTooltipModalOpen, setTooltipModalOpen] = useState<boolean>(false);
  const [tooltipTitle, setTooltipTitle] = useState("");
  const [tooltipDescription, setTooltipDescription] = useState<ReactNode>("");

  const openMobileModalTooltip = useCallback((title: string, description: ReactNode) => {
    setTooltipTitle(title);
    setTooltipDescription(description);
    setTooltipModalOpen(true);
  }, []);

  const [value, setValue] = useState<string[]>([]);

  const visitorsLayerOpenedValue = useMemo(() => ["payment"], []);
  const residentLayerOpenedValue = useMemo(() => ["support"], []);

  useEffect(() => {
    if (layerFilter.activeKeys.includes("visitors" as LF)) {
      setValue(visitorsLayerOpenedValue);
    } else if (layerFilter.activeKeys.includes("residents" as LF)) {
      setValue(residentLayerOpenedValue);
    }
  }, [layerFilter.activeKeys, residentLayerOpenedValue, visitorsLayerOpenedValue]);

  return (
    <>
      <Accordion.Root value={value} onValueChange={setValue} type="multiple">
        {/* VISITORS */}
        <PrimaryLayerButton
          onMobileTooltipClick={openMobileModalTooltip}
          isActive={layerFilter.isAnyKeyActive(["visitors"] as LF[])}
          toggle={() => layerFilter.setActive("visitors" as LF)}
          icon="visitor"
          title={t("layers.visitors.title")}
          tooltip={t("layers.visitors.tooltip")}
          isMobile={isMobile}
        />

        {/* RESIDENTS */}
        <PrimaryLayerButton
          onMobileTooltipClick={openMobileModalTooltip}
          isActive={layerFilter.isAnyKeyActive(["residents"] as LF[])}
          toggle={() => layerFilter.setActive("residents" as LF)}
          icon="resident"
          title={t("layers.residents.title")}
          tooltip={t("layers.residents.tooltip")}
          isMobile={isMobile}
        />

        {/* PAYMENT */}
        <Accordion.Item value="payment">
          <Accordion.Header>
            <SecondaryLayerButton
              isMobile={isMobile}
              onMobileTooltipClick={openMobileModalTooltip}
              isActive={markerFilter.isAnyKeyActive([
                "parkomats",
                "assistants",
                "partners",
              ] as MF[])}
              toggle={() =>
                markerFilter.setActive(
                  ["parkomats", "assistants", "partners"] as MF[],
                  !markerFilter.isAnyKeyActive(["parkomats", "assistants", "partners"] as MF[]),
                )
              }
              title={t("layerGroups.payment.title")}
              tooltip={
                <Trans i18nKey="layerGroups.payment.tooltip">
                  before
                  <a
                    className="underline text-secondary font-semibold dark:text-primary"
                    href={t("layerGroups.payment.tooltipLink")}
                    target="_blank"
                    rel="noreferrer"
                  >
                    link
                  </a>
                  after
                </Trans>
              }
            />
          </Accordion.Header>
          <StyledAccordionContent className="overflow-hidden">
            <SubLayerButton
              isMobile={isMobile}
              onMobileTooltipClick={openMobileModalTooltip}
              icon="parkomat"
              isActive={markerFilter.isAnyKeyActive(["parkomats"] as MF[])}
              toggle={() => markerFilter.toggleActive("parkomats" as MF)}
              title={t("layers.parkomats.title")}
            />
            <SubLayerButton
              isMobile={isMobile}
              onMobileTooltipClick={openMobileModalTooltip}
              icon="assistant"
              isActive={markerFilter.isAnyKeyActive(["assistants"] as MF[])}
              toggle={() => markerFilter.toggleActive("assistants" as MF)}
              title={t("layers.assistants.title")}
            />
            <SubLayerButton
              isMobile={isMobile}
              onMobileTooltipClick={openMobileModalTooltip}
              icon="partner"
              isActive={markerFilter.isAnyKeyActive(["partners"] as MF[])}
              toggle={() => markerFilter.toggleActive("partners" as MF)}
              title={t("layers.partners.title")}
            />
          </StyledAccordionContent>
        </Accordion.Item>

        {/* PARKING */}
        <Accordion.Item value="parking">
          <Accordion.Header>
            <SecondaryLayerButton
              isMobile={isMobile}
              onMobileTooltipClick={openMobileModalTooltip}
              isActive={markerFilter.isAnyKeyActive([
                "parking-lots",
                "garages",
                "p-plus-r",
              ] as MF[])}
              toggle={() =>
                markerFilter.setActive(
                  ["parking-lots"] as MF[],
                  !markerFilter.isAnyKeyActive(["parking-lots", "garages", "p-plus-r"] as MF[]),
                )
              }
              title={t("layerGroups.parking.title")}
            />
          </Accordion.Header>
          <StyledAccordionContent className="overflow-hidden">
            <SubLayerButton
              isMobile={isMobile}
              onMobileTooltipClick={openMobileModalTooltip}
              icon="parking-lot"
              isActive={markerFilter.isAnyKeyActive(["parking-lots"] as MF[])}
              toggle={() => markerFilter.toggleActive("parking-lots" as MF)}
              title={t("layers.parking-lots.title")}
            />
            <SubLayerButton
              isMobile={isMobile}
              onMobileTooltipClick={openMobileModalTooltip}
              icon="garage"
              isActive={markerFilter.isAnyKeyActive(["garages"] as MF[])}
              toggle={() => markerFilter.toggleActive("garages" as MF)}
              title={t("layers.garages.title")}
            />
            <SubLayerButton
              isMobile={isMobile}
              onMobileTooltipClick={openMobileModalTooltip}
              icon="p-plus-r"
              isActive={markerFilter.isAnyKeyActive(["p-plus-r"] as MF[])}
              toggle={() => markerFilter.toggleActive("p-plus-r" as MF)}
              title={t("layers.p-plus-r.title")}
              tooltip={
                <a
                  className="underline text-secondary font-semibold dark:text-primary"
                  href="https://paas.sk/zachytne-parkoviska/"
                  target="_blank"
                  rel="noreferrer"
                >
                  {t("layers.p-plus-r.tooltip")}
                </a>
              }
            />
          </StyledAccordionContent>
        </Accordion.Item>

        {/* SUPPORT */}
        <Accordion.Item value="support">
          <Accordion.Header>
            <SecondaryLayerButton
              isMobile={isMobile}
              onMobileTooltipClick={openMobileModalTooltip}
              isActive={markerFilter.isAnyKeyActive(["branches"] as MF[])}
              toggle={() =>
                markerFilter.setActive(
                  ["branches"] as MF[],
                  !markerFilter.isAnyKeyActive(["branches"] as MF[]),
                )
              }
              title={t("layerGroups.support.title")}
              tooltip={
                <Trans i18nKey="layerGroups.support.tooltip">
                  before
                  <a
                    className="underline text-secondary font-semibold"
                    href={t("layerGroups.support.tooltipLink")}
                    target="_blank"
                    rel="noreferrer"
                  >
                    link
                  </a>
                  middle
                  <a
                    className="underline text-secondary font-semibold"
                    href={t("layerGroups.support.tooltipPhone")}
                  >
                    phone
                  </a>
                  after
                </Trans>
              }
            />
          </Accordion.Header>
          <StyledAccordionContent className="overflow-hidden">
            <SubLayerButton
              isMobile={isMobile}
              onMobileTooltipClick={openMobileModalTooltip}
              icon="branch"
              isActive={markerFilter.isAnyKeyActive(["branches"] as MF[])}
              toggle={() => markerFilter.toggleActive("branches" as MF)}
              title={t("layers.branches.title")}
            />
          </StyledAccordionContent>
        </Accordion.Item>
      </Accordion.Root>

      <Modal
        overlayClassName="max-w-lg"
        isOpen={isTooltipModalOpen}
        title={tooltipTitle}
        description={tooltipDescription}
        onClose={() => setTooltipModalOpen(false)}
      ></Modal>
    </>
  );
};
