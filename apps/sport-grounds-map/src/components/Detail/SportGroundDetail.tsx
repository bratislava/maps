import { Feature, Point } from "geojson";
import { useTranslation } from "react-i18next";
import { Icon } from "../Icon";
import { X } from "@bratislava/react-maps-icons";
import { Row } from "./Row";
import { Tag } from "@bratislava/react-maps-ui";

export interface SportGroundDetailProps {
  feature: Feature<Point> | null;
  onClose: () => void;
  isExpanded: boolean;
}

export const SportGroundDetail = ({ feature, onClose, isExpanded }: SportGroundDetailProps) => {
  const { t }: { t: (key: string) => string } = useTranslation();

  if (!feature) return null;

  return isExpanded ? (
    <>
      <div className="p-8 pb-26 flex flex-col justify-end text-foreground-lightmode dark:text-foreground-darkmode bg-background-lightmode dark:bg-background-darkmode md:pb-8 md:pt-5 w-full">
        <button className="hidden sm:block absolute right-4 top-8 p-2" onClick={onClose}>
          <X />
        </button>
        <div className="flex flex-col space-y-4">
          <div className="text-white bg-primary w-fit rounded-full">
            <Icon size={48} icon={feature.properties?.icon} />
          </div>
          <div className="font-bold font-md pb-4 text-[20px]">
            {t(`layers.sportGrounds.detail.title`)}
          </div>
          <Row label={t(`layers.sportGrounds.detail.name`)} text={feature.properties?.["name"]} />

          <div>
            <div className="mb-1">{t(`layers.sportGrounds.detail.tags`)}</div>
            <div className="flex flex-wrap gap-2">
              {feature.properties?.["tags"]?.map((tag: unknown) => (
                <Tag
                  className="font-semibold bg-primary-soft dark:text-background-darkmode"
                  key={`${tag}`}
                >
                  {t(`filters.tag.tags.${tag}`)}
                </Tag>
              ))}
            </div>
          </div>

          <Row label={t(`layers.sportGrounds.detail.type`)} text={feature.properties?.["type"]} />
          <Row
            label={t(`layers.sportGrounds.detail.address`)}
            text={feature.properties?.["address"]}
          />
          <Row
            label={t(`layers.sportGrounds.detail.contact`)}
            text={feature.properties?.["contact"]}
          />
          <Row
            label={t(`layers.sportGrounds.detail.operator`)}
            text={feature.properties?.["operator"]}
          />
          <Row label={t(`layers.sportGrounds.detail.phone`)} text={feature.properties?.["phone"]} />
          <Row label={t(`layers.sportGrounds.detail.email`)} text={feature.properties?.["email"]} />
          <Row
            label={t(`layers.sportGrounds.detail.website`)}
            text={feature.properties?.["website"]}
          />
          <Row
            label={t(`layers.sportGrounds.detail.openingHours`)}
            text={feature.properties?.["openingHours"]}
          />
          <Row
            label={t(`layers.sportGrounds.detail.entrace`)}
            text={feature.properties?.["entrace"]}
          />
          <Row label={t(`layers.sportGrounds.detail.note`)} text={feature.properties?.["note"]} />
        </div>
      </div>
      {/* <pre className="p-2 h-72 bg-black text-white overflow-auto">
        <code>{JSON.stringify(feature?.properties, null, 2)}</code>
      </pre> */}
    </>
  ) : (
    <div className="mx-6 text-foreground-lightmode dark:text-foreground-darkmode font-semibold mt-8">
      {feature.properties?.["name"]}
    </div>
  );
};

export default SportGroundDetail;
