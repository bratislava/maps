import { Tag } from "@bratislava/react-maps-ui";
import { ReactNode } from "react";
import { DetailLabel } from "./DetailLabel";
import { DetailValue } from "./DetailValue";

type IRowConditionalPropsTextOrTags =
  | {
    text?: string | ReactNode;
    tags?: never;
  }
  | {
    text?: never;
    tags?: string[];
  };

export type IRowProps = {
  label: string;
} & IRowConditionalPropsTextOrTags;

export const Row = ({ label, text, tags }: IRowProps) => {
  return text || tags?.filter((t) => t).length ? (
    <div className="flex flex-col">
      <DetailLabel>{label}</DetailLabel>
      {text ? (
        <DetailValue>{text}</DetailValue>
      ) : (
        <div className="flex mt-1 flex-row flex-wrap gap-2">
          {tags?.map((tag) => (
            <Tag className="bg-primary-soft text-foreground-lightmode" key={tag}>
              {tag}
            </Tag>
          ))}
        </div>
      )}
    </div>
  ) : null;
};
