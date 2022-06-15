import { useTranslation } from "react-i18next";
import { Row } from "./Row";

export const OkpDetail = ({
  "Základná cena": price,
  "Čas spoplatnenia": chargingTime,
  ADDITIONAL_INFO,
}) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col space-y-4">
      <div className="">
        <div>{t("layers.visitorsLayer.detail.price")}</div>
        <div className="font-bold">{price.toFixed(2)} €</div>
      </div>

      <Row label={ADDITIONAL_INFO} text=" " />

      {/* <div className="">
        <div>{t('layers.visitorsLayer.detail.regulationTime')}</div>
        <div className="font-bold">{props['Čas regulácie']}</div>
      </div> */}
      <div className="">
        <div>{t("layers.visitorsLayer.detail.chargingTime")}</div>
        <div className="font-bold">{chargingTime}</div>
      </div>

      <div className="font-bold underline">
        <a target="_blank" href={t("paymentOptionsUrl")} rel="noreferrer">
          {t("paymentOptions")}
        </a>
      </div>
    </div>
  );
};

export default OkpDetail;
