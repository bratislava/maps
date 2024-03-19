import { Feedback } from "@bratislava/react-maps-ui";
import { useTranslation } from "react-i18next";
import { ITerrainService } from "../../utils/types";
import { TerrainServiceDetail } from "./TerrainServiceDetail";

export type TerrainServiceDetail = {
  service: ITerrainService;
};

type TerrainServiceDetailType = {
  service: ITerrainService;
};

export const TerrainServiceSingleWrapper = ({
  service: { title, provider, phone, price, areas },
}: TerrainServiceDetailType) => {
  const { t: mainT } = useTranslation();

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="font-semibold pt-1 pr-12">{title}</div>
      <TerrainServiceDetail provider={provider} phone={phone} price={price} areas={areas} />
      <Feedback
        problemHint={mainT("problemHint")}
        reportProblemLink={mainT("reportProblemLink")}
        reportProblem={mainT("reportProblem")}
      />
    </div>
  );
};
