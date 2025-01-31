import { Feature, Point } from "geojson";
import { useTranslation } from "react-i18next";
import { Chevron } from "@bratislava/react-maps-icons";
import { Row } from "./Row";
import { Note, Popover, Tag, Image } from "@bratislava/react-maps-ui";

import { ReactComponent as ToiletsIcon } from "../../assets/icons/toilets.svg";
import { ReactComponent as ShowerIcon } from "../../assets/icons/shower.svg";
import { ReactComponent as TransportIcon } from "../../assets/icons/transport.svg";
import { ReactComponent as BikeIcon } from "../../assets/icons/bike.svg";
import { ReactComponent as ParkingIcon } from "../../assets/icons/parking.svg";
import { ReactComponent as PlaygroundIcon } from "../../assets/icons/playground.svg";
import { ReactComponent as BufetIcon } from "../../assets/icons/bufet.svg";
import { ReactComponent as ChangingRoomIcon } from "../../assets/icons/changingroom.svg";
import { ReactComponent as ChildrenPoolIcon } from "../../assets/icons/childenpool.svg";
import { ReactComponent as WellnessIcon } from "../../assets/icons/wellness.svg";
import { ReactComponent as RestaurantIcon } from "../../assets/icons/restauracia.svg";

export interface SwimmingPoolDetailProps {
  feature: Feature<Point>;
  onClose: () => void;
  isMobile: boolean;
  displayHeader: boolean;
}

type TService =
  | "toalety"
  | "sprcha"
  | "šatňa"
  | "ihrisko"
  | "bufet"
  | "parkovanie"
  | "bicykel"
  | "verejná doprava"
  | "wellness"
  | "reštaurácia"
  | "prezliekareň"
  | "detský bazén";

export const SwimmingPoolDetail = ({
  feature,
  isMobile,
  displayHeader,
}: SwimmingPoolDetailProps) => {
  const { t } = useTranslation("translation", { keyPrefix: "layers.swimmingPools.detail" });
  const { t: mainT } = useTranslation();

  if (!feature) return null;

  const imgSrc = feature.properties?.photo as string;

  const setServiceIcons = (service: string) => {
    const iconSize = 24;
    switch (service) {
      case "toalety":
        return <ToiletsIcon width={iconSize} height={iconSize} />;
      case "parkovanie":
        return <ParkingIcon width={iconSize} height={iconSize} />;
      case "mhd":
        return <TransportIcon width={iconSize} height={iconSize} />;
      case "bicykel":
        return <BikeIcon width={iconSize} height={iconSize} />;
      case "sprchy":
        return <ShowerIcon width={iconSize} height={iconSize} />;
      case "ihrisko":
        return <PlaygroundIcon width={iconSize} height={iconSize} />;
      case "bufet":
        return <BufetIcon width={iconSize} height={iconSize} />;
      case "šatňa":
        return <ChangingRoomIcon width={iconSize} height={iconSize} />;
      case "reštaurácia":
        return <RestaurantIcon width={iconSize} height={iconSize} />;
      case "wellness":
        return <WellnessIcon width={iconSize} height={iconSize} />;
      case "detský bazén":
        return <ChildrenPoolIcon width={iconSize} height={iconSize} />;
      default:
        null;
    }
  };

  return (
    <div className="flex relative flex-col justify-end text-foreground-lightmode dark:text-foreground-darkmode bg-background-lightmode dark:bg-background-darkmode w-full">
      <>
        {displayHeader && (
          <>
            <Image src={imgSrc} isMobile={isMobile} imageMissingText={mainT("noImage")} />

            <div className="absolute top-[232px] left-4">
              <a
                href={feature.properties?.["buyOnline"]}
                target="_blank"
                rel="noreferrer"
                className="group font-semibold select-none cursor-pointer flex items-center gap-4 bg-primary text-white w-fit px-6 h-12 rounded-lg"
              >
                <span>{t("purchaseTicket")}</span>
                <div className="relative flex items-center">
                  <div className="absolute transition-all right-1 w-0 group-hover:w-5 group-hover:-right-1 h-[2px] rounded-full bg-white"></div>
                  <Chevron
                    className="group-hover:translate-x-2 transition-transform"
                    direction="right"
                    size="sm"
                  />
                </div>
              </a>
            </div>
          </>
        )}

        <div
          className={`flex pl-4 pr-4 ${
            displayHeader ? "pt-12" : "pt-2"
          } pb-5 md:pb-5 md:pt-12 flex-col space-y-6`}
        >
          {displayHeader && (
            <a
              className="text-primary dark:text-primary-soft underline font-bold"
              href={feature.properties?.["navigate"]}
              target="_blank"
              rel="noreferrer"
            >
              {t("navigate")}
            </a>
          )}

          {feature.properties?.note && (
            <Note className={`flex flex-col gap-3 !bg-[#D0ECF8]`}>
              <div className="flex-1 font-semibold">Oznam</div>
              <div className="!font-normal">{feature.properties?.note}</div>
            </Note>
          )}
          <Row label={feature.properties?.name} text={feature.properties?.description} />

          <div>
            <div className="font-semibold">{t("openingHours")}</div>
            <div dangerouslySetInnerHTML={{ __html: feature.properties?.openingHours }} />
          </div>

          <div>
            <div className="mb-1 font-semibold">{t(`services`)}</div>
            <div className="grid grid-cols-10 grid-rows-1">
              {feature.properties?.services?.map((service: TService) => {
                const icon = setServiceIcons(service);
                return (
                  icon && (
                    <Popover
                      isSmall={true}
                      key={service}
                      button={({ open, close }) => (
                        <button
                          onMouseEnter={open}
                          onFocus={open}
                          onTouchStart={open}
                          onTouchEnd={close}
                          onMouseLeave={close}
                          onMouseDown={() => close()}
                        >
                          {setServiceIcons(service)}
                        </button>
                      )}
                      panel={<div>{t(service as any)}</div>}
                      allowedPlacements={["top"]}
                    />
                  )
                );
              })}
            </div>
          </div>

          <div>
            <div className="mb-1 font-semibold">{t(`tags`)}</div>
            <div className="flex flex-wrap gap-2">
              {feature.properties?.tags?.map((tag: unknown) => (
                <Tag
                  className="font-semibold bg-primary-azure dark:text-background-darkmode"
                  key={`${tag}`}
                >
                  {/* https://www.i18next.com/overview/typescript#type-error-template-literal */}
                  {mainT(`filters.tag.tags.${tag}` as any)}
                </Tag>
              ))}
            </div>
          </div>

          <Row label={t("sportGroundCategory")} text={feature.properties?.category} />
          <Row label={t("address")} text={feature.properties?.address} />
          <Row label={t("email")} text={feature.properties?.email} />
        </div>
      </>
    </div>
  );
};

export default SwimmingPoolDetail;
