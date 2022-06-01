import { useTranslation } from "react-i18next";
import { ReactComponent as BranchIcon } from "../../assets/icons/branch-active.svg";

export interface BranchFeatureProperties {
  parkomatId: string;
  location: string;
}

export const BranchDetail = (props: BranchFeatureProperties) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col space-y-4">
      <div className="text-secondary">
        <BranchIcon width={54} height={54} />
      </div>
      <div className="font-bold">{t("layers.branchesLayer.detail.title")}</div>
      <div className="">
        <div>{t("layers.branchesLayer.detail.name")}</div>
        <div className="font-bold">{props["Názov"]}</div>
      </div>
      <div className="">
        <div>{t("layers.branchesLayer.detail.address")}</div>
        <div className="font-bold">{props["Adresa"]}</div>
      </div>
      <div className="">
        <div>{t("layers.branchesLayer.detail.place")}</div>
        <div className="font-bold">{props["Miesto"]}</div>
      </div>
      <div className="">
        <div>{t("layers.branchesLayer.detail.openingHours")}</div>
        <div className="font-bold">{props["Otváracie hodiny"]}</div>
      </div>
      {props["Spresňujúce informácie"] && (
        <div className="">
          <div>{t("layers.branchesLayer.detail.additionalInformation")}</div>
          <div className="font-bold">{props["Spresňujúce informácie"]}</div>
        </div>
      )}
    </div>
  );
};
