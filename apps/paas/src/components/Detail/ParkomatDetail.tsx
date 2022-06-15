import { useTranslation } from "react-i18next";
import { ReactComponent as ParkomatIcon } from "../../assets/icons/parkomat-active.svg";

const Row = ({ label, text }: { label: string; text: string }) => {
  if (text) {
    return (
      <div className="">
        <div>{label}</div>
        <div className="font-bold">{text}</div>
      </div>
    );
  } else {
    return null;
  }
};

export interface ParkomatFeatureProperties {
  Parkomat_ID: string;
  Location: string;
}

export const ParkomatDetail = ({
  Parkomat_ID: parkomatId,
  Location: location,
}: ParkomatFeatureProperties) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col space-y-4">
      <div className="text-secondary">
        <ParkomatIcon width={54} height={54} />
      </div>
      <div className="font-bold">{t("layers.parkomatsLayer.detail.title")}</div>
      <Row label={t("layers.parkomatsLayer.detail.location")} text={location} />
      <Row label={t("layers.parkomatsLayer.detail.id")} text={parkomatId} />
    </div>
  );
};
