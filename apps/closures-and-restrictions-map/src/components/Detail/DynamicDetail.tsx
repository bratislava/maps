import { ImageLightBox, Note } from "@bratislava/react-maps-ui";
import RoundedIconButon from "@bratislava/react-maps/src/components/Detail/RoundedIconButon";
import { Attachment, useArcgisAttachments } from "@bratislava/react-use-arcgis";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as ClosureIcon } from "../../assets/icons/closure.svg";
import { ReactComponent as DigupIcon } from "../../assets/icons/digup.svg";
import { ReactComponent as DisorderIcon } from "../../assets/icons/disorder.svg";
import { ReactComponent as GoogleStreet } from "../../assets/icons/googlestreetview.svg";
import { ReactComponent as ImageIcon } from "../../assets/icons/imageicon.svg";
import { IFeatureProps } from "../../types/featureTypes";
import { DIGUPS_URL, DISORDERS_URL, OLD_TOWN_DATA_URL } from "../../utils/urls";
import { Row } from "./Row";

interface IDetail {
  featureProps: IFeatureProps;
  streetViewUrl: string;
  isMobile?: boolean;
}

type TAttachmentKeyword = "fotografie_miesta_poruchy" | "dokumenty" | "obchadzkove_trasy";

export const DynamicDetail: React.FC<IDetail> = ({ featureProps, streetViewUrl, isMobile }) => {
  const [imageModal, setImageModal] = useState({ isOpen: false, imgSrc: [] as Array<string> });

  const {
    objectId,
    subject,
    infoForResidents,
    address,
    type,
    startTimestamp,
    endTimestamp,
    fullSize,
    investor,
    owner,
    contractor,
    length,
    width,
    layer,
    originalProperties,
    startTime,
    endTime,
    dateOfPassage,
  } = featureProps;

  const {
    t,
    i18n: { language },
  } = useTranslation("translation", {
    keyPrefix: `layers.${layer as "digups" | "closures" | "disorders" | "repairs"}.detail`,
  });

  // single source of truth for all available categories live in layer filter translation
  const { t: categoryTranslation } = useTranslation("translation", {
    keyPrefix: "filters.type.types",
  });

  const { t: mainT }: { t: (key: string) => string } = useTranslation();

  const { data: digupsAttachments } = useArcgisAttachments(DIGUPS_URL, objectId || 0);

  const { data: oldTownAttachments } = useArcgisAttachments(
    OLD_TOWN_DATA_URL,
    objectId || originalProperties?.objectid || 0,
  );

  const { data: disordersAttachments } = useArcgisAttachments(
    DISORDERS_URL,
    objectId || originalProperties?.objectid || 0,
  );

  const filterAttachments = (
    attachments: Array<Attachment> | null,
    url: string,
    attachementFilter: TAttachmentKeyword,
  ): Array<string> => {
    const urlList: Array<string> = [];
    if (!attachments || attachments.length < 1) return urlList;
    const validAttachments = attachments.filter((a) => a?.keywords === attachementFilter);

    validAttachments.forEach((a) => {
      urlList.push(`${url}/${objectId || originalProperties?.objectid}/attachment/${a.id}`);
    });

    return urlList;
  };

  const imageUrlList =
    layer === "disorders"
      ? filterAttachments(disordersAttachments, DISORDERS_URL, "fotografie_miesta_poruchy")
      : [];
  const documentUrlList =
    layer === "disorders"
      ? filterAttachments(disordersAttachments, DISORDERS_URL, "dokumenty")
      : originalProperties?.__oldTownMarker
      ? filterAttachments(oldTownAttachments, OLD_TOWN_DATA_URL, "dokumenty")
      : filterAttachments(digupsAttachments, DIGUPS_URL, "dokumenty");
  const alternativeRouteUrlList =
    layer !== "disorders" && originalProperties?.__oldTownMarker
      ? filterAttachments(oldTownAttachments, OLD_TOWN_DATA_URL, "obchadzkove_trasy")
      : filterAttachments(digupsAttachments, DIGUPS_URL, "obchadzkove_trasy") || [];

  const displayLocaleDate = (timeStamp: number | null, time: string | null = null): string => {
    if (!timeStamp) return "";

    const dateFormat = new Date(timeStamp).toLocaleString(language, {
      day: "numeric",
      year: "numeric",
      month: "numeric",
    });

    return !time ? dateFormat : `${dateFormat} - ${time}`;
  };

  const icon = () => {
    switch (layer) {
      case "closures":
        return (
          <ClosureIcon width={40} height={40} className="rounded-full text-white bg-closure" />
        );
      case "digups":
        return <DigupIcon width={40} height={40} className="rounded-full text-white bg-digup" />;
      case "disorders":
        return (
          <DisorderIcon width={40} height={40} className="rounded-full text-white bg-disorder" />
        );
      default:
        return <></>;
    }
  };

  const handleThemeTxtColor = () => {
    switch (layer) {
      case "closures":
        return "text-closure";
      case "digups":
        return "text-digup";
      case "disorders":
        return "text-disorder";
      default:
        return "";
    }
  };

  const contractorTextValue =
    !contractor || contractor === "other" ? t("missingContractorFallback") : contractor;

  return (
    <div
      className={`flex flex-col justify-end w-full gap-4 pl-4 pr-4 ${
        isMobile ? "pt-4" : "pt-5"
      } pb-4`}
    >
      {!isMobile && (
        <div className={`flex gap-4 items-center ${handleThemeTxtColor()}`}>
          {icon()}
          <div className="font-semibold">{t("title")}</div>
        </div>
      )}
      <div className="font-semibold">{subject}</div>
      <div className="flex flex-wrap">
        {imageUrlList.length > 0 && (
          <button
            className="no-underline flex gap-2 items-center"
            onClick={() => setImageModal({ isOpen: true, imgSrc: imageUrlList })}
          >
            <RoundedIconButon
              icon={<ImageIcon width={20} height={20} />}
              bgColor="#E5EFF3"
              txtColor="#005F88"
            >
              {t("photosOfPlace")}
            </RoundedIconButon>
          </button>
        )}
        {alternativeRouteUrlList.length > 0 && (
          <a
            className="no-underline flex gap-2 items-center"
            rel="noreferrer"
            onClick={() => setImageModal({ isOpen: true, imgSrc: alternativeRouteUrlList })}
          >
            <RoundedIconButon
              icon={<ImageIcon width={20} height={20} />}
              bgColor="#E5EFF3"
              txtColor="#005F88"
            >
              {t("alternateRoute")}
            </RoundedIconButon>
          </a>
        )}
        {streetViewUrl.length > 0 && (
          <a
            href={streetViewUrl}
            target="_blank"
            className="no-underline flex gap-2 items-center"
            rel="noreferrer"
          >
            <RoundedIconButon
              icon={<GoogleStreet width={20} height={20} />}
              bgColor="#E5EFF3"
              txtColor="#005F88"
            >
              {t("streetView")}
            </RoundedIconButon>
          </a>
        )}
      </div>

      {infoForResidents && (
        <div className="flex flex-col gap-2">
          {infoForResidents.split("\n").map((paragraph) => (
            <p key={paragraph.slice(-10)}>{paragraph}</p>
          ))}
        </div>
      )}
      <Row label={t("address")} text={address} />

      <Row
        label={t("category")}
        text={type.map((categoryType) => categoryTranslation(categoryType as any)).join(", ")}
      />
      {layer === "disorders" && <Row label={t("owner")} text={owner} />}
      <Row label={t("startDate")} text={displayLocaleDate(startTimestamp, startTime)} />
      <Row label={t("dateOfPassage")} text={displayLocaleDate(dateOfPassage || null)} />
      <Row label={t("endDate")} text={displayLocaleDate(endTimestamp, endTime)} />
      {!!fullSize && (
        <Row
          label={t("fullSize")}
          text={
            <span>
              {`${fullSize} m`}
              <sup>2</sup>
            </span>
          }
        />
      )}
      {!!length && <Row label={t("length")} text={`${length} m`} />}
      {!!width && <Row label={t("width")} text={`${width} m`} />}
      <Row label={t("investor")} text={investor} />
      {layer !== "disorders" && <Row label={t("owner")} text={owner} />}
      {layer !== "disorders" && <Row label={t("contractor")} text={contractorTextValue} />}

      {layer !== "disorders" && documentUrlList && documentUrlList.length > 0 && (
        <div>
          <div className="font-semibold">{t("permission")}</div>
          <div>
            {documentUrlList?.map((attachment, index) => {
              return (
                <a
                  className="flex underline"
                  rel="noreferrer"
                  href={attachment}
                  target="_blank"
                  key={index}
                >
                  {`${t("showDocument")} ${documentUrlList.length > 1 ? index + 1 : ""}`}
                </a>
              );
            })}
          </div>
        </div>
      )}

      <Note className={`flex flex-col gap-3 !bg-[#FCF2E6]`}>
        <div className="flex-1 dark:text-text">{t("problemHint")}</div>
        <a
          href={t("reportProblemLink")}
          target="_blank"
          className="underline font-semibold text-[#E07B04]"
          rel="noreferrer"
        >
          {t("reportProblem")}
        </a>
      </Note>

      {imageModal.imgSrc.length > 0 && (
        <ImageLightBox
          onClose={() => setImageModal({ isOpen: false, imgSrc: [] })}
          isOpen={imageModal.isOpen}
          images={imageModal.imgSrc}
          initialImageIndex={0}
        />
      )}
    </div>
  );
};
