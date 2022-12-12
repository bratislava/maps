import { Eye } from "@bratislava/react-maps-icons";
import { AccordionItem } from "@bratislava/react-maps-ui";
import { ReactNode } from "react";

export type LayerProps = {
  title: string;
  children?: ReactNode;
};

export const Layer = ({ title, children }: LayerProps) => {
  return (
    <AccordionItem value={title} title={title} rightSlot={<Eye size="sm" />}>
      {children}
    </AccordionItem>
  );
};
