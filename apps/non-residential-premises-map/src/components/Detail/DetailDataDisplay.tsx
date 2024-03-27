import * as React from "react";
import { DataDisplay, ImageLightBox, Note } from "../../libs/react-maps-ui";
import { useArcgisAttachments } from "../../libs/react-use-arcgis";
import { Feature } from "geojson";
import { useTranslation } from "react-i18next";
import { colors } from "../../utils/colors";
import * as cx from "classnames";
import { ButtonLink } from "../ButtonLink";
import { ReactComponent as ImageIcon } from "../../assets/icons/imageicon.svg";
import { ReactComponent as GoogleStreetIcon } from "../../assets/icons/googlestreetview.svg";
import { useState } from "react";
import { GEOPORTAL_LAYER_URL } from "../../utils/const";
import RoundedIconButon from "../../libs/react-maps/src/components/Detail/RoundedIconButon";

export interface IDetailDataDisplayProps {
  feature: Feature;
  className?: string;
  isSingleFeature?: boolean;
}

export type TOccupacy = "forRent" | "occupied" | "free" | "other";

export const DetailDataDisplay = ({
  feature,
  className,
  isSingleFeature,
}: IDetailDataDisplayProps) => {
  const { t } = useTranslation("translation", { keyPrefix: "detail" });

  const [isModalOpen, setModalOpen] = useState(false);

  const occupancy: TOccupacy = feature?.properties?.occupancy;
  const contractLink: string = feature.properties?.linkNZ || "";
  const groundPlanLink: string = feature.properties?.ORIGINAL_podorys || "";
  const txtClrByOccupacy = occupancy === "forRent" ? "black" : "white";

  const emailSubjectPrefix =
    occupancy === "forRent"
      ? "Informácie o obchodnej súťaži: "
      : occupancy === "occupied"
      ? "Záujem o priestor: "
      : "Informácie o priestore: ";

  const { data: featureAttachments } = useArcgisAttachments(GEOPORTAL_LAYER_URL, feature?.id || 0);
  const images = featureAttachments?.length
    ? featureAttachments.map(
        (attachment) => `${GEOPORTAL_LAYER_URL}/${feature?.id}/attachments/${attachment.id}`,
      )
    : [feature?.properties?.picture || feature?.properties?.foto];

  // indefinite rents have date of 1.1.2100
  const rentUntil = feature?.properties?.rentUntil?.includes("2100")
    ? t("indefinite")
    : feature?.properties?.rentUntil;

  return (
    <div className={cx("relative flex flex-col space-y-4 p-4", className)}>
      {feature.properties?.competition && occupancy === "forRent" && isSingleFeature && (
        <div className="absolute -translate-y-12">
          <ButtonLink occupancy={occupancy} href={feature.properties?.competition}>
            {t("ongoingCompetition")}
          </ButtonLink>
        </div>
      )}

      <div className="flex flex-wrap">
        {feature.properties?.competition && occupancy === "forRent" && !isSingleFeature && (
          <a
            href={feature.properties?.competition}
            target="_blank"
            className="no-underline flex gap-2 items-center"
            rel="noreferrer"
          >
            <RoundedIconButon bgColor={colors[occupancy]} txtColor={txtClrByOccupacy}>
              {t("ongoingCompetition")}
            </RoundedIconButon>
          </a>
        )}

        <div
          style={{ backgroundColor: colors[occupancy], color: txtClrByOccupacy }}
          className={
            "flex gap-2 text-[white] rounded-full font-semibold h-9 items-center justify-center pl-4 pr-4 mr-2 mb-2 select-none"
          }
        >
          {t(occupancy)}
        </div>

        {images[0] && (
          <>
            <a
              className="no-underline flex gap-2 items-center"
              rel="noreferrer"
              onClick={() => setModalOpen(true)}
            >
              <RoundedIconButon
                icon={<ImageIcon width={20} height={20} />}
                txtColor={txtClrByOccupacy}
                bgColor={colors[occupancy]}
              >
                {t("premisePhotos")}
              </RoundedIconButon>
            </a>
            <ImageLightBox
              onClose={() => setModalOpen(false)}
              isOpen={isModalOpen}
              images={images}
              initialImageIndex={0}
            />
          </>
        )}

        {feature.properties?.streetView && (
          <a
            href={feature.properties.streetView}
            target="_blank"
            className="no-underline flex gap-2 items-center"
            rel="noreferrer"
          >
            <RoundedIconButon
              icon={<GoogleStreetIcon width={20} height={20} />}
              bgColor={colors[occupancy]}
              txtColor={txtClrByOccupacy}
            >
              {t("streetView")}
            </RoundedIconButon>
          </a>
        )}
      </div>

      <DataDisplay label={t(`locality`)} text={feature?.properties?.locality} />
      <DataDisplay label={t(`purpose`)} text={feature?.properties?.purpose} />
      <DataDisplay label={t(`lessee`)} text={feature?.properties?.lessee} />
      <DataDisplay label={t(`rentUntil`)} text={rentUntil} />
      <DataDisplay label={t(`description`)} text={feature?.properties?.description} />
      <DataDisplay
        label={t(`approximateArea`)}
        text={
          typeof feature?.properties?.approximateArea === "number" && (
            <span>
              {feature?.properties?.approximateArea.toFixed(2).replace(".", ",")} m
              <sup className="text-xs font-bold">2</sup>
            </span>
          )
        }
      />
      <DataDisplay
        label={t(`approximateRentPricePerYear`)}
        text={
          typeof feature?.properties?.approximateRentPricePerYear === "number" && (
            <span>
              {(Math.round(feature?.properties?.approximateRentPricePerYear / 10) * 10)
                .toFixed(2)
                .replace(".", ",")}{" "}
              €
            </span>
          )
        }
      />
      {contractLink && (
        <DataDisplay
          label={t(`contract`)}
          text={
            <a className="flex underline" rel="noreferrer" href={contractLink} target="_blank">
              {t("rentalContract")}
            </a>
          }
        />
      )}
      {groundPlanLink && (
        <DataDisplay
          label={t(`groundPlan`)}
          text={
            <a className="flex underline" rel="noreferrer" href={groundPlanLink} target="_blank">
              {t("spacePlan")}
            </a>
          }
        />
      )}
      <Note className={`flex flex-col gap-3 !bg-[#ebebeb] dark:text-[black]`}>
        <div className="flex-1">{t("contactUs")}</div>
        <a
          href={`mailto: spravanehnutelnosti@bratislava.sk?subject=${emailSubjectPrefix}${
            feature?.properties?.locality || ""
          }`}
          target="_blank"
          className="underline font-semibold"
          rel="noreferrer"
        >
          spravanehnutelnosti@bratislava.sk
        </a>
      </Note>
    </div>
  );
};
