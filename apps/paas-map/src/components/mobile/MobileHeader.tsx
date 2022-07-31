import { Funnel } from "@bratislava/react-maps-icons";
import { IconButton } from "@bratislava/react-maps-ui";
import { useTranslation } from "react-i18next";
import cx from "classnames";

export interface IMobileHeaderProps {
  onFunnelClick: () => void;
  onVisitorClick: () => void;
  onResidentClick: () => void;
  isVisitorOrResidentActive: boolean;
}

export const MobileHeader = ({
  onFunnelClick,
  onVisitorClick,
  onResidentClick,
  isVisitorOrResidentActive,
}: IMobileHeaderProps) => {
  const { t } = useTranslation();
  return (
    <div className="fixed top-4 flex left-4 right-4 z-10 gap-4">
      <div className="w-full flex bg-background-lightmode dark:bg-background-darkmode overflow-hidden rounded-lg">
        <button
          onClick={onVisitorClick}
          className={cx("flex-1 font-semibold", {
            "bg-primary text-secondary": isVisitorOrResidentActive,
          })}
        >
          {t("layers.visitors.title")}
        </button>
        <button
          onClick={onResidentClick}
          className={cx("flex-1 font-semibold", {
            "bg-secondary text-primary": !isVisitorOrResidentActive,
          })}
        >
          {t("layers.residents.title")}
        </button>
      </div>
      <IconButton className="shrink-0" onClick={onFunnelClick}>
        <Funnel size="lg" />
      </IconButton>
    </div>
  );
};
