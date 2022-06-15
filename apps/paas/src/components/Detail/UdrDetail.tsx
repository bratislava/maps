import { useTranslation } from "react-i18next";
import { ReactComponent as VisitorIcon } from "../../assets/icons/visitor-active.svg";
import { Row } from "./Row";

export const UdrDetail = ({ Názov: name, "UDR ID": id, ADDITIONAL_INFO }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col space-y-4">
      <div className="text-secondary">
        <VisitorIcon width={54} height={54} />
      </div>
      <div className="font-bold">{t("layers.visitorsLayer.detail.title")}</div>
      <Row label={t("layers.visitorsLayer.detail.location")} text={name} />
      <Row label={t("layers.visitorsLayer.detail.code")} text={id} />
      <Row label={ADDITIONAL_INFO} text=" " />
    </div>
  );
};

export default UdrDetail;
