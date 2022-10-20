import { ReactNode } from "react";

export const DataDisplay = ({
  label,
  text,
}: {
  label?: ReactNode | null;
  text?: string | number | null;
}) => {
  if (!text || (text === " " && !label)) {
    return null;
  } else {
    return (
      <div>
        <div className="font-light text-[14px]">{label}</div>
        {text.toString().startsWith("http") ? (
          <a
            href={text.toString()}
            className="underline font-semibold"
            target="_blank"
            rel="noreferrer"
          >
            {new URL(text.toString()).hostname.replace("www.", "")}
          </a>
        ) : text.toString().includes("@") ? (
          <a href={`mailto:${text}`} className="underline font-semibold">
            {text}
          </a>
        ) : (
          <div className="font-semibold">{text}</div>
        )}
      </div>
    );
  }
};
