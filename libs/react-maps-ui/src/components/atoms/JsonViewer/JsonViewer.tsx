import JSONPretty from "react-json-pretty";

export interface IJsonViewerProps {
  json: any;
}

export const JsonViewer = ({ json }: IJsonViewerProps) => {
  return (
    <div>
      <JSONPretty
        className="overflow-hidden font-bold border-2 border-background-darkmode dark:border-gray-darkmode/20 rounded-lg"
        data={json}
        theme={{
          main: "line-height:1.3;color:#6ce1fc;background:#333333;overflow:auto;padding:1rem;",
          error:
            "line-height:1.3;color:#6ce1fc;background:#333333;overflow:auto;",
          key: "color:#478dff;",
          string: "color:#c3e88d;",
          value: "color:#ff7747;",
          boolean: "color:#ff7747;",
        }}
      />
    </div>
  );
};
