import { useState } from "react";
import { X } from "@bratislava/react-maps-icons";
import { AnimateHeight, DataDisplay, IconButton, ImageLightBox } from "@bratislava/react-maps-ui";
import { Feature } from "geojson";
import { Image } from "../Image";
import { DetailDataDisplay } from "./DetailDataDisplay";
import cx from "classnames";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export interface ISingleFeatureDetailProps {
  feature: Feature;
  onClose: () => void;
  isExpanded: boolean;
}

export const SingleFeatureDetail = ({
  feature,
  onClose,
  isExpanded,
}: ISingleFeatureDetailProps) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const { t } = useTranslation("translation", { keyPrefix: "detail" });

  return (
    <motion.div layout className="flex flex-col max-h-screen overflow-auto">
      <AnimateHeight isVisible={feature?.properties?.picture && isExpanded}>
        <>
          <motion.button className="w-full" layout onClick={() => setModalOpen(true)}>
            <Image object="cover" src={feature?.properties?.picture} />
          </motion.button>
          <ImageLightBox
            onClose={() => setModalOpen(false)}
            isOpen={isModalOpen}
            images={[feature?.properties?.picture]}
            initialImageIndex={0}
          />
        </>
      </AnimateHeight>

      <IconButton
        className={cx(
          "hidden w-8 h-8 rounded-full absolute right-6 top-6 md:flex items-center justify-center",
          { "!shadow-none": !feature?.properties?.picture },
        )}
        onClick={onClose}
      >
        <X size="sm" />
      </IconButton>

      <AnimateHeight isVisible={!isExpanded}>
        <div className="py-4 px-6">
          <DataDisplay label={t("lessee")} text={feature.properties?.lessee} />
        </div>
      </AnimateHeight>

      <AnimateHeight isVisible={isExpanded}>
        <DetailDataDisplay feature={feature} />
      </AnimateHeight>
    </motion.div>
  );
};
