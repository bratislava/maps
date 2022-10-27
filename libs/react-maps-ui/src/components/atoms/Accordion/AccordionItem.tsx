import { Chevron } from "@bratislava/react-maps-icons";
import { Content, Header, Item, Trigger } from "@radix-ui/react-accordion";
import { keyframes, styled } from "@stitches/react";
import cx from "classnames";
import { ReactNode } from "react";

const AccordionChevron = styled(Chevron, {
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
  isActive?: boolean;
  paasDesign?: boolean;
  headerIsTrigger?: boolean;
  headerClassName?: string;
}

export const AccordionItem = ({
  children,
  value,
  title,
  rightSlot,
  className,
  isActive = false,
  isOpenable = true,
  paasDesign = false,
  headerIsTrigger = false,
  headerClassName,
}: IAccordionItemProps) => {
  return (
    <Item
      value={value}
      className={cx("text-left w-full justify-between items-center", className)}
    >
      <Header className="flex flex-col">
        {headerIsTrigger ? (
          <Trigger
            className={cx(
              "flex w-full gap-4 items-center justify-between",
              {
                "": paasDesign,
              },
              headerClassName
            )}
          >
            <div>{title}</div>
            <div
              className={cx("flex gap-4 h-12 px-6 items-center", {
                "bg-primary-soft text-foreground-lightmode":
                  paasDesign && isActive,
              })}
            >
              {rightSlot}
              {isOpenable && (
                <div className="p-1">
                  <AccordionChevron className="transition mr-[2px]" size="xs" />
                </div>
              )}
            </div>
          </Trigger>
        ) : (
          <div
            className={cx(
              "flex w-full gap-4 items-center justify-between",
              {
                "": paasDesign,
              },
              headerClassName
            )}
          >
            <div>{title}</div>
            <div
              className={cx("flex gap-4 h-12 px-6", {
                "bg-primary-soft text-foreground-lightmode":
                  paasDesign && isActive,
              })}
            >
              {rightSlot}
              {isOpenable && (
                <Trigger className="p-1">
                  <AccordionChevron className="transition mr-[2px]" size="xs" />
                </Trigger>
              )}
            </div>
          </div>
        )}
      </Header>
      <AccordionContent className="overflow-hidden">
        <div>{children}</div>
      </AccordionContent>
    </Item>
  );
};
