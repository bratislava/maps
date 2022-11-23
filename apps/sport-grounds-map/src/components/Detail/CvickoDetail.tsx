import { Chevron, X } from "@bratislava/react-maps-icons";
import { Tag } from "@bratislava/react-maps-ui";
import { Feature, Point } from "geojson";
import { useTranslation } from "react-i18next";
import { Image } from "./Image";
import { Row } from "./Row";
import { motion } from "framer-motion";

export interface CvickoDetailProps {
  feature: Feature<Point>;
  onClose: () => void;
  isExpanded: boolean;
}

export const CvickoDetail = ({ feature, onClose, isExpanded }: CvickoDetailProps) => {
  const { t } = useTranslation("translation", { keyPrefix: "layers.cvicko.detail" });
  const { t: mainT }: { t: (key: string) => string } = useTranslation();

  if (!feature) return null;

  const imgSrc = feature.properties?.photo ?? null;

  return isExpanded ? (
    <motion.div
      layoutId="detail"
      className="relative flex flex-col justify-end text-foreground-lightmode dark:text-foreground-darkmode bg-background-lightmode dark:bg-background-darkmode w-full"
    >
      <motion.button
        layoutId="detail-close-button"
        className="hidden z-20 sm:block absolute right-4 top-6 p-2 bg-white dark:bg-gray-darkmode dark:bg-opacity-20 rounded-full"
        onClick={onClose}
      >
        <X size="xs" />
      </motion.button>

      <motion.div layoutId="detail-image" className="h-fit overflow-hidden">
        <Image src={imgSrc} />
      </motion.div>

      <motion.div layoutId="detail-button" className="absolute top-[232px] left-6">
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
      </motion.div>

      <div className="flex p-6 pt-12 pb-26 md:pb-8 md:pt-12 flex-col space-y-6">
        <motion.a
          layoutId="detail-navigate-link"
          className="text-primary dark:text-primary-soft underline font-semibold"
          href={feature.properties?.["navigate"]}
          target="_blank"
          rel="noreferrer"
        >
          {t("navigate")}
        </motion.a>

        <motion.div layoutId="detail-feature-name">
          <Row label={t("name")} text={feature.properties?.["name"]} />
        </motion.div>

        <motion.div layoutId="detail-tags">
          <div className="mb-1 font-light">{t(`tags`)}</div>
          <div className="flex flex-wrap gap-2">
            {feature.properties?.["tags"]?.map((tag: unknown) => (
              <Tag
                className="font-semibold bg-primary-soft dark:text-background-darkmode"
                key={`${tag}`}
              >
                {mainT(`filters.tag.tags.${tag}`)}
              </Tag>
            ))}
          </div>
        </motion.div>
        <Row label={t("location")} text={feature.properties?.["location"]} />
        <Row label={t("email")} text={feature.properties?.["email"]} />
        <Row label={t("website")} text={feature.properties?.["website"]} />
      </div>
    </motion.div>
  ) : (
    <motion.div
      layoutId="detail"
      className="relative flex flex-col justify-end text-foreground-lightmode dark:text-foreground-darkmode bg-background-lightmode dark:bg-background-darkmode w-full"
    >
      <motion.button
        layoutId="detail-close-button"
        className="hidden z-20 sm:block absolute right-4 top-6 p-2 bg-white dark:bg-gray-darkmode dark:bg-opacity-20 rounded-full scale-0"
        onClick={onClose}
      >
        <X size="xs" />
      </motion.button>

      <motion.div layoutId="detail-image" className="h-0 overflow-hidden">
        <Image src={imgSrc} />
      </motion.div>

      <motion.div layoutId="detail-button" className="absolute top-[0] left-6 hidden">
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
      </motion.div>

      <div className="flex p-6 pt-5 pb-26 md:pb-8 md:pt-12 flex-col gap-6">
        <motion.a
          layoutId="detail-navigate-link"
          className="text-primary dark:text-primary-soft underline font-semibold hidden"
          href={feature.properties?.["navigate"]}
          target="_blank"
          rel="noreferrer"
        >
          {t("navigate")}
        </motion.a>

        <motion.div layoutId="detail-feature-name">
          <Row label={t("name")} text={feature.properties?.["name"]} />
        </motion.div>

        <motion.div layoutId="detail-tags" className="hidden">
          <div className="mb-1 font-light">{t(`tags`)}</div>
          <div className="flex flex-wrap gap-2">
            {feature.properties?.["tags"]?.map((tag: unknown) => (
              <Tag
                className="font-semibold bg-primary-soft dark:text-background-darkmode"
                key={`${tag}`}
              >
                {mainT(`filters.tag.tags.${tag}`)}
              </Tag>
            ))}
          </div>
        </motion.div>
        <Row className="hidden" label={t("location")} text={feature.properties?.["location"]} />
        <Row className="hidden" label={t("email")} text={feature.properties?.["email"]} />
        <Row className="hidden" label={t("website")} text={feature.properties?.["website"]} />
      </div>
    </motion.div>
  );
};

export default CvickoDetail;
