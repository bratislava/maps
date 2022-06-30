import { Row } from "./Row";
import { useTranslation } from "react-i18next";
import { Feature } from "geojson";
import { useState, useEffect } from "react";

export interface DetailProps {
  features: Feature[];
}

export const Detail = ({ features }: DetailProps) => {
  const { t } = useTranslation();

  const [rows, setRows] = useState<{ label: string; text: any }[]>([]);

  useEffect(() => {
    setRows([]);
    const firstFeature = features[0];
    if (firstFeature) {
      setRows(
        Object.keys(firstFeature["properties"] as any).map((label) => ({
          label,
          text: firstFeature?.properties?.[label],
        })),
      );
    }
  }, [features, setRows]);

  return !features[0] ? null : (
    <>
      <div className="flex flex-col space-y-4 p-8 pt-4 overflow-auto max-h-screen">
        <div className="flex flex-col space-y-4">
          {rows.map(({ label, text }) => (
            <Row key={label} label={label} text={text} />
          ))}
        </div>
      </div>
      {/* <pre className="p-2 h-72 bg-black text-white overflow-auto">
        <code>{JSON.stringify(feature?.properties, null, 2)}</code>
      </pre> */}
    </>
  );
};

export default Detail;
