import { Feature, Point } from "geojson";
import { useTranslation } from "react-i18next";
import { Row } from "./Row";

export interface DetailProps {
  feature: Feature<Point> | null;
  onClose: () => void;
  isMobile: boolean;
}

const FountainDetail = ({ feature }: DetailProps) => {
  const { t } = useTranslation();

  if (!feature) return null;

  return (
    <div className="px-8 pb-3 rounded-bl-lg sm:pt-8 pb-26 flex flex-col justify-end text-foreground-lightmode dark:text-foreground-darkmode bg-background-lightmode dark:bg-background-darkmode md:pb-8 w-full">
      <div className="mt-8 hidden sm:block text-black dark:text-white">
        <Row label={t("detail.location")} text={feature.properties?.["location"]} />
      </div>
      <h2 className="font-semibold sm:hidden h-12 flex items-center">
        {feature.properties?.["location"]}
      </h2>
    </div>
  );

};

export default FountainDetail;
