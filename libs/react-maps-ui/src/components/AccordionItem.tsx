import { Chevron } from "@bratislava/react-maps-icons";
import { Content, Header, Item, Trigger } from "@radix-ui/react-accordion";
import { keyframes, styled } from "@stitches/react";
import cx from "classnames";
import { CSSProperties, ReactNode } from "react";

const AccordionChevron = styled(Chevron, {
  "[data-state=closed] &": { transform: "rotate(180deg)" },
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
  style?: CSSProperties;
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
  style,
}: IAccordionItemProps) => {
  return (
    //  https://github.com/radix-ui/primitives/issues/2309 not yet resolved
    //  eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //  @ts-ignore
    <Item
      value={value}
      className={cx("text-left w-full justify-between items-center", className)}
      style={style}
    >
      {/* https://github.com/radix-ui/primitives/issues/2309 not yet resolved */}
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <Header className="flex flex-col">
        {headerIsTrigger ? (
          //  https://github.com/radix-ui/primitives/issues/2309 not yet resolved
          //  eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //  @ts-ignore
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
              className={cx("flex gap-4 items-center", {
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
              className={cx("flex gap-4 h-12 px-6 items-center", {
                "bg-primary-soft text-foreground-lightmode":
                  paasDesign && isActive,
              })}
            >
              {rightSlot}
              {isOpenable && (
                //  https://github.com/radix-ui/primitives/issues/2309 not yet resolved
                //  eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //  @ts-ignore
                <Trigger className="p-1">
                  <AccordionChevron className="transition mr-[2px]" size="xs" />
                </Trigger>
              )}
            </div>
          </div>
        )}
      </Header>
      {/* https://github.com/radix-ui/primitives/issues/2309 not yet resolved */}
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <AccordionContent className="overflow-hidden">
        <div>{children}</div>
      </AccordionContent>
    </Item>
  );
};
