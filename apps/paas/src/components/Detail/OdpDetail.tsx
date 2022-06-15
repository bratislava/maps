import { useTranslation } from "react-i18next";
import { ReactComponent as ResidentIcon } from "../../assets/icons/resident-active.svg";
import { Row } from "./Row";

export const OdpDetail = ({
  "Kód parkovacej zóny": parkingZoneCode,
  ADDITIONAL_INFO,
}) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col space-y-4">
      <div className="text-secondary">
        <ResidentIcon width={54} height={54} />
      </div>
      <div className="font-bold">{t("layers.residentsLayer.detail.title")}</div>
      <Row
        label={t("layers.residentsLayer.detail.cardValidity")}
        text={parkingZoneCode}
      />
      <Row label={ADDITIONAL_INFO} text=" " />
    </div>
  );
};

export default OdpDetail;
