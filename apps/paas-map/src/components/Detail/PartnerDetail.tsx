import { useTranslation } from "react-i18next";
import { ReactComponent as PartnerIcon } from "../../assets/icons/partner-active.svg";
import { Row } from "./Row";

export const PartnerDetail = ({ Partner: name, Adresa: address }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col space-y-4">
      <div className="text-secondary">
        <PartnerIcon width={54} height={54} />
      </div>
      <div className="font-bold">{t("layers.partnersLayer.detail.title")}</div>
      <Row label={t("layers.partnersLayer.detail.name")} text={name} />
      <Row label={t("layers.partnersLayer.detail.address")} text={address} />
    </div>
  );
};
