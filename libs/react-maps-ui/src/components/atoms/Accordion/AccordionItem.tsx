import React, { ReactNode } from "react";
import cx from "classnames";
import { Item, Header, Trigger, Content } from "@radix-ui/react-accordion";
import { ChevronDownSmall } from "@bratislava/react-maps-icons";
import { styled, keyframes } from "@stitches/react";

const AccordionChevron = styled(ChevronDownSmall, {
  "[data-state=open] &": { transform: "rotate(180deg)" },
});

const openKeyframes = keyframes({
  from: { height: 0 },
  to: { height: "var(--radix-accordion-content-height)" },
});

const closeKeyframes = keyframes({
  from: { height: "var(--radix-accordion-content-height)" },
  to: { height: 0 },
});

const AccordionContent = styled(Content, {
  '&[data-state="open"]': {
    animation: `${openKeyframes} 300ms ease-out forwards`,
  },
  '&[data-state="closed"]': {
    animation: `${closeKeyframes} 300ms ease-out forwards`,
  },
});

export interface IAccordionItemProps {
  value: string;
  title: string | ReactNode;
  children: ReactNode;
  rightSlot?: ReactNode;
  className?: string;
  isOpenable?: boolean;
}

export const AccordionItem = ({
  children,
  value,
  title,
  rightSlot,
  className,
  isOpenable = true,
}: IAccordionItemProps) => {
  return (
    <Item
      value={value}
      className={cx("text-left w-full justify-between items-center", className)}
    >
      <Header className="flex flex-col">
        <div className="py-3 pl-[20px] pr-6 flex items-center justify-between">
          <div>{title}</div>
          <div className="flex gap-4">
            {rightSlot}
            {isOpenable && (
              <Trigger className="p-1">
                <AccordionChevron
                  className="transition"
                  width={16}
                  height={16}
                />
              </Trigger>
            )}
          </div>
        </div>
      </Header>
      <AccordionContent className="overflow-hidden">
        <div className="pl-[28px] pr-8 pb-4">{children}</div>
      </AccordionContent>
    </Item>
  );
};
