import { IFilterResult } from "@bratislava/react-mapbox";
import { Chevron, Eye, EyeCrossed, Information } from "@bratislava/react-maps-icons";
import * as Accordion from "@radix-ui/react-accordion";
import { keyframes, styled } from "@stitches/react";
import cx from "classnames";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
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
}: {
  title: string;
  icon: IIconProps["icon"];
  isActive: boolean;
  toggle: () => void;
  tooltip: string;
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
        <div className="mt-[2px] text-primary">
          <Information size="default" />
        </div>
      </div>
      <div>{isActive ? <Eye width={18} height={18} /> : <EyeCrossed width={18} height={18} />}</div>
    </button>
  );
};

const SecondaryLayerButton = ({
  title,
  isActive,
  toggle,
}: {
  title: string;
  isActive: boolean;
  toggle: () => void;
}) => {
  return (
    <div className="flex w-full justify-between items-center gap-2">
      <div className="flex items-center gap-2 py-2 pl-6">
        <span className="font-semibold">{title}</span>
      </div>
      <div
        className={cx("flex items-center h-12 px-6 gap-6", {
          "bg-primary-soft text-foreground-lightmode": isActive,
        })}
      >
        <button onClick={toggle}>
          {isActive ? <Eye width={18} height={18} /> : <EyeCrossed width={18} height={18} />}
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
}: {
  title: string;
  icon: IIconProps["icon"];
  isActive: boolean;
  toggle: () => void;
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
      </div>
      <div>{isActive ? <Eye width={18} height={18} /> : <EyeCrossed width={18} height={18} />}</div>
    </button>
  );
};

export interface ILayerProps<LF extends string, MF extends string> {
  layerFilter: IFilterResult<LF>;
  markerFilter: IFilterResult<MF>;
}

export const Layers = <LF extends string, MF extends string>({
  layerFilter,
  markerFilter,
}: ILayerProps<LF, MF>) => {
  const { t } = useTranslation();

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
    <Accordion.Root value={value} onValueChange={setValue} type="multiple">
      {/* VISITORS */}
      <PrimaryLayerButton
        isActive={layerFilter.isAnyKeyActive(["visitors"] as LF[])}
        toggle={() => layerFilter.setActive("visitors" as LF)}
        icon="visitor"
        title={t("layers.visitors.title")}
        tooltip={t("layers.visitors.tooltip")}
      />

      {/* RESIDENTS */}
      <PrimaryLayerButton
        isActive={layerFilter.isAnyKeyActive(["residents"] as LF[])}
        toggle={() => layerFilter.setActive("residents" as LF)}
        icon="resident"
        title={t("layers.residents.title")}
        tooltip={t("layers.residents.tooltip")}
      />

      {/* PAYMENT */}
      <Accordion.Item value="payment">
        <Accordion.Header>
          <SecondaryLayerButton
            isActive={markerFilter.isAnyKeyActive(["parkomats", "assistants", "partners"] as MF[])}
            toggle={() =>
              markerFilter.setActive(
                ["parkomats", "assistants", "partners"] as MF[],
                !markerFilter.isAnyKeyActive(["parkomats", "assistants", "partners"] as MF[]),
              )
            }
            title={t("layerGroups.payment.title")}
          />
        </Accordion.Header>
        <StyledAccordionContent className="overflow-hidden">
          <SubLayerButton
            icon="parkomat"
            isActive={markerFilter.isAnyKeyActive(["parkomats"] as MF[])}
            toggle={() => markerFilter.toggleActive("parkomats" as MF)}
            title={t("layers.parkomats.title")}
          />
          <SubLayerButton
            icon="assistant"
            isActive={markerFilter.isAnyKeyActive(["assistants"] as MF[])}
            toggle={() => markerFilter.toggleActive("assistants" as MF)}
            title={t("layers.assistants.title")}
          />
          <SubLayerButton
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
            isActive={markerFilter.isAnyKeyActive(["parking-lots"] as MF[])}
            toggle={() =>
              markerFilter.setActive(
                ["parking-lots"] as MF[],
                !markerFilter.isAnyKeyActive(["parking-lots"] as MF[]),
              )
            }
            title={t("layerGroups.parking.title")}
          />
        </Accordion.Header>
        <StyledAccordionContent className="overflow-hidden">
          <SubLayerButton
            icon="parking-lot"
            isActive={markerFilter.isAnyKeyActive(["parking-lots"] as MF[])}
            toggle={() => markerFilter.toggleActive("parking-lots" as MF)}
            title={t("layers.parking-lots.title")}
          />
        </StyledAccordionContent>
      </Accordion.Item>

      {/* SUPPORT */}
      <Accordion.Item value="support">
        <Accordion.Header>
          <SecondaryLayerButton
            isActive={markerFilter.isAnyKeyActive(["branches"] as MF[])}
            toggle={() =>
              markerFilter.setActive(
                ["branches"] as MF[],
                !markerFilter.isAnyKeyActive(["branches"] as MF[]),
              )
            }
            title={t("layerGroups.support.title")}
          />
        </Accordion.Header>
        <StyledAccordionContent className="overflow-hidden">
          <SubLayerButton
            icon="branch"
            isActive={markerFilter.isAnyKeyActive(["branches"] as MF[])}
            toggle={() => markerFilter.toggleActive("branches" as MF)}
            title={t("layers.branches.title")}
          />
        </StyledAccordionContent>
      </Accordion.Item>
    </Accordion.Root>
  );
};
