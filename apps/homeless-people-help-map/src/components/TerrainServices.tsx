import { Accordion, AccordionItem, Checkbox } from "@bratislava/react-maps-ui";
import { useTranslation } from "react-i18next";
import { colors } from "../utils/colors";
import cx from "classnames";

const COLOR = colors.terrainServices;

export type TerrainServicesProps = {
  services: {
    key: string;
    title: string;
  }[];
  activeServiceKey: string | null;
  onServiceClick: (key: string) => void;
};

export const TerrainServices = ({
  services,
  activeServiceKey,
  onServiceClick,
}: TerrainServicesProps) => {
  const { t } = useTranslation();
  return (
    <div
      className={cx("flex flex-col gap-4 border-l-[4px]", {
        "bg-gray-lightmode/10 dark:bg-gray-darkmode/10": !!activeServiceKey,
      })}
      style={{
        borderColor: activeServiceKey ? COLOR : "transparent",
      }}
    >
      <Accordion type="multiple">
        <AccordionItem
          headerIsTrigger
          headerClassName="pl-[22px] pr-[2px]"
          value="terrainServices"
          title={t("terrainServices.title")}
        >
          <div className="px-6 pt-1 pb-3 flex flex-col gap-2 font-normal">
            {services.map(({ title, key }) => (
              <Checkbox
                id={key}
                color={COLOR}
                key={key}
                checked={activeServiceKey === key}
                label={title}
                onChange={() => onServiceClick(key)}
              />
            ))}
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
