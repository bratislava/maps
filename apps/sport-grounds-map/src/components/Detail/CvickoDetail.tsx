import { Chevron } from "@bratislava/react-maps-icons";
import { Tag } from "@bratislava/react-maps-ui";
import { Feature, Point } from "geojson";
import { useTranslation } from "react-i18next";
import { Image } from "./Image";
import { Row } from "./Row";

export interface CvickoDetailProps {
  feature: Feature<Point>;
  onClose: () => void;
  isMobile: boolean;
}

export const CvickoDetail = ({ feature, isMobile }: CvickoDetailProps) => {
  const { t } = useTranslation("translation", { keyPrefix: "layers.cvicko.detail" });
  const { t: mainT }: { t: (key: string) => string } = useTranslation();

  if (!feature) return null;

  const imagePath = '../../../public/images/workouts'
  const imgSrc = `${imagePath}/${feature.properties?.photo}`;

  return (
    <div
      className="relative flex flex-col justify-end text-foreground-lightmode dark:text-foreground-darkmode bg-background-lightmode dark:bg-background-darkmode w-full"
    >
      <Image src={imgSrc} isMobile={isMobile} />

      <div className="absolute top-[232px] left-6">
        <a
          href={feature.properties?.["wantToWorkout"]}
          target="_blank"
          rel="noreferrer"
          className="group font-semibold select-none cursor-pointer flex items-center gap-4 bg-primary text-white w-fit px-6 h-12 rounded-lg"
        >
          <span>{t("wantToGym")}</span>
          <div className="relative flex items-center">
            <div className="absolute transition-all right-1 w-0 group-hover:w-5 group-hover:-right-1 h-[2px] rounded-full bg-white"></div>
            <Chevron
              className="group-hover:translate-x-2 transition-transform"
              direction="right"
              size="sm"
            />
          </div>
        </a>
      </div>

      <div className="flex pl-4 pr-4 pt-12 pb-5 md:pb-5 md:pt-12 flex-col space-y-6">
        <a
          className="text-primary dark:text-primary-soft underline font-semibold"
          href={feature.properties?.["navigate"]}
          target="_blank"
          rel="noreferrer"
        >
          {t("navigate")}
        </a>

        <div>
          <Row label={t("name")} text={feature.properties?.["name"]} />
        </div>

        <div>
          <div className="mb-1 font-semibold">{t(`tags`)}</div>
          <div className="flex flex-wrap gap-2">
            {feature.properties?.["tags"]?.map((tag: unknown) => (
              <Tag
                className="font-semibold bg-primary-azure dark:text-background-darkmode"
                key={`${tag}`}
              >
                {mainT(`filters.tag.tags.${tag}`)}
              </Tag>
            ))}
          </div>
        </div>
        <Row label={t("sportGroundCategory")} text={feature.properties?.category} />
        <Row label={t("location")} text={feature.properties?.location} />
        <Row label={t("email")} text={feature.properties?.email} />
      </div>
    </div>
  )
};

export default CvickoDetail;
