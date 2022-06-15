import { UdrDetail } from "./UdrDetail";
import { OkpDetail } from "./OkpDetail";
import { OdpDetail } from "./OdpDetail";
import { ParkomatDetail } from "./ParkomatDetail";
import { AssistantDetail } from "./AssistantDetail";
import { BranchDetail } from "./BranchDetail";
import { PartnerDetail } from "./PartnerDetail";

export interface DetailProps {
  features: any[];
}

export const Detail = ({ features }: DetailProps) => {
  return (
    <div className="p-8 pb-26 h-full flex flex-col justify-end space-y-4 md:pb-8 md:pt-5 w-full">
      {features.map((feature: any, index) => {
        if (
          feature.source === "UDR_DATA" ||
          feature.source === "UDR_PLANNED_DATA"
        ) {
          return <UdrDetail key={index} {...feature.properties} />;
        } else if (feature.source === "OKP_DATA") {
          return <OkpDetail key={index} {...feature.properties} />;
        } else if (
          feature.source === "ODP_DATA" ||
          feature.source === "ODP_PLANNED_DATA"
        ) {
          return <OdpDetail key={index} {...feature.properties} />;
        } else if (feature.source === "PARKOMATS_DATA") {
          return <ParkomatDetail key={index} {...feature.properties} />;
        } else if (
          feature.source === "ASSISTANTS_DATA" ||
          feature.source === "ASSISTANTS_RU_DATA"
        ) {
          return <AssistantDetail key={index} {...feature.properties} />;
        } else if (feature.source === "BRANCHES_DATA") {
          return <BranchDetail key={index} {...feature.properties} />;
        } else if (feature.source === "PARTNERS_DATA") {
          return <PartnerDetail key={index} {...feature.properties} />;
        } else {
          return null;
        }
      })}
    </div>
  );
};

export default Detail;
