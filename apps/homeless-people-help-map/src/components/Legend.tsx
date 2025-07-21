import { ReactComponent as FountainMarkerIcon } from "../assets/icons/fountains/marker.svg";
import { ReactComponent as FixpointMarkerIcon } from "../assets/icons/fixpointsAndSyringeExchanges/fixpoint.svg";
import { ReactComponent as SyringeExchangeMarkerIcon } from "../assets/icons/fixpointsAndSyringeExchanges/syringe-exchange.svg";
import { ReactComponent as FixpointAndSyringeExchangeMarkerIcon } from "../assets/icons/fixpointsAndSyringeExchanges/fixpoint-and-syringe-exchange.svg";

import { ReactComponent as OvernightIcon } from "../assets/icons/layers/overnight.svg";
import { ReactComponent as CounselingIcon } from "../assets/icons/layers/counseling.svg";
import { ReactComponent as CultureIcon } from "../assets/icons/layers/culture.svg";
import { ReactComponent as NotaBeneIcon } from "../assets/icons/layers/nota-bene.svg";
import { ReactComponent as DrugsAndSexIcon } from "../assets/icons/layers/drugs-and-sex.svg";
import { ReactComponent as TerrainServiceIcon } from "../assets/icons/layers/terrain-service.svg";
import { ReactComponent as HygieneIcon } from "../assets/icons/layers/hygiene.svg";
import { ReactComponent as MealsIcon } from "../assets/icons/layers/meals.svg";
import { ReactComponent as MedicalTreatmentIcon } from "../assets/icons/layers/medical-treatment.svg";
import { ReactComponent as BuildingIcon } from "../assets/icons/buildings/castle.svg";
import { ReactComponent as PublicToiletsIcon } from "../assets/icons/toilets/marker-inactive.svg";
import { Tag } from "@bratislava/react-maps-ui";
import { colors } from "../utils/colors";
import { useTranslation } from "react-i18next";

export const Legend = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-12">
      <div className="flex flex-col gap-4">
        <Tag
          style={{ background: colors.counseling }}
          className="w-fit flex items-center gap-3 text-foreground-lightmode"
        >
          <CounselingIcon className="w-6 h-6" />
          {t("layers.counseling")}
        </Tag>
        <Tag
          style={{ background: colors.hygiene }}
          className="w-fit flex items-center gap-3 text-foreground-lightmode"
        >
          <HygieneIcon className="w-6 h-6" />
          {t("layers.hygiene")}
        </Tag>
        <Tag
          style={{ background: colors.overnight }}
          className="w-fit flex items-center gap-3 text-white"
        >
          <OvernightIcon className="w-6 h-6" />
          {t("layers.overnight")}
        </Tag>
        <Tag
          style={{ background: colors.meals }}
          className="w-fit flex items-center gap-3 text-foreground-lightmode"
        >
          <MealsIcon className="w-6 h-6" />
          {t("layers.meals")}
        </Tag>
        <Tag
          style={{ background: colors.medicalTreatment }}
          className="w-fit flex items-center gap-3 text-foreground-lightmode"
        >
          <MedicalTreatmentIcon className="w-6 h-6" />
          {t("layers.medicalTreatment")}
        </Tag>
        <Tag
          style={{ background: colors.culture }}
          className="w-fit flex items-center gap-3 text-white"
        >
          <CultureIcon className="w-6 h-6" />
          {t("layers.culture")}
        </Tag>
        <Tag
          style={{ background: colors.drugsAndSex }}
          className="w-fit flex items-center gap-3 text-white"
        >
          <DrugsAndSexIcon className="w-6 h-6" />
          {t("layers.drugsAndSex")}
        </Tag>
        <Tag
          style={{ background: colors.terrainServices }}
          className="w-fit flex items-center gap-3 text-white"
        >
          <TerrainServiceIcon className="w-6 h-6" />
          {t("layers.terrainServices")}
        </Tag>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex gap-2 items-center">
          <div className="bg-[#333] w-4 h-4 rounded-full"></div>
          <div>{t("legend.point")}</div>
        </div>
        <div className="flex gap-2 items-center">
          <FountainMarkerIcon />
          <div>{t("legend.drinkingFountain")}</div>
        </div>
        <div className="flex gap-2 items-center">
          <FixpointMarkerIcon />
          <div>{t("legend.fixpoint")}</div>
        </div>
        <div className="flex gap-2 items-center">
          <SyringeExchangeMarkerIcon />
          <div>{t("legend.syringeExchange")}</div>
        </div>
        <div className="flex gap-2 items-center">
          <FixpointAndSyringeExchangeMarkerIcon />
          <div>{t("legend.fixpointAndSyringeExchange")}</div>
        </div>
        <div className="flex gap-2 items-center">
          <PublicToiletsIcon />
          <div>{t("legend.publicToilet")}</div>
        </div>

        <div className="flex gap-2 items-center">
          <div className="bg-black opacity-40 w-4 h-[3px] rounded-full"></div>
          <div>{t("legend.districtBorder")}</div>
        </div>
        <div className="flex gap-2 items-center">
          <BuildingIcon className="w-12" />
          <div>{t("legend.orientationPoint")}</div>
        </div>
      </div>
    </div>
  );
};
