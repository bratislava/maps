import JSONPretty from "react-json-pretty";

export interface IJsonViewerProps {
  json: any;
}

export const JsonViewer = ({ json }: IJsonViewerProps) => {
  return (
    <JSONPretty
      data={json}
      theme={{
        main: "line-height:1.3;color:#6ce1fc;background:#222436;overflow:auto;padding:1rem;border-radius:0.5rem;",
        error:
          "line-height:1.3;color:#6ce1fc;background:#222436;overflow:auto;",
        key: "color:#478dff;",
        string: "color:#c3e88d;",
        value: "color:#ff7747;",
        boolean: "color:#ff7747;",
      }}
    />
  );
};
