import React, { ReactNode, useEffect } from "react";
import cx from "classnames";
import { Chevron, X } from "@bratislava/react-maps-icons";
import { useTranslation } from "react-i18next";

export interface ISidebarProps {
  isVisible?: boolean;
  setVisible?: (isVisible: boolean | undefined) => void;
  children?: ReactNode;
  title?: string;
  position: "left" | "right";
  isMobile?: boolean;
}

export const Sidebar = ({
  isVisible,
  setVisible = () => void 0,
  children,
  title,
  position,
  isMobile = true,
}: ISidebarProps) => {
  const { t } = useTranslation();
  useEffect(() => {
    console.log(isVisible);
  }, [isVisible]);
  return (
    <div
      className={cx(
        "fixed top-0 bg-background bottom-0 w-96 h-full pr-0 transition-all duration-500 z-50",
        {
          "left-0": position === "left",
          "right-0": position === "right",
          "-translate-x-full": !isVisible && position === "left",
          "translate-x-full": !isVisible && position === "right",
        }
      )}
    >
      {isMobile ? (
        <button
          onClick={() => setVisible(false)}
          className="flex w-full items-center px-3 py-3 gap-2 bg-gray
        transition-all bg-opacity-0 hover:bg-opacity-10 focus:bg-opacity-10 active:bg-opacity-20"
        >
          <div className="flex p-2">
            <Chevron direction="left" className="text-primary" />
          </div>
          <h1 className="relative font-medium">{title}</h1>
        </button>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setVisible(!isVisible)}
          className={cx(
            "absolute bg-background z-20 py-8 transform hover:text-primary",
            {
              "left-0 -translate-x-full rounded-bl-lg": position === "right",
              "right-0 translate-x-full rounded-br-lg": position === "left",
            }
          )}
          onClick={() => {
            setVisible(!isVisible);
          }}
        >
          <div
            className={cx(
              "shadow-lg hidden sm:block absolute top-0 left-0 right-0 bottom-0 sm:shadow-lg",
              {
                "rounded-bl-lg": position === "right",
                "rounded-br-lg": position === "left",
              }
            )}
            style={{ zIndex: -20 }}
          ></div>
          <Chevron
            direction={position == "right" ? "left" : "right"}
            className={cx("transform transition-transform", {
              "rotate-180": isVisible,
            })}
          />
          <div
            className={cx(
              "hidden sm:block bg-background absolute w-4 min-h-full box-content top-0 pb-4",
              {
                "left-full": position === "right",
                "right-full": position === "left",
              }
            )}
          ></div>
        </div>
      )}

      <div
        className={cx(
          "space-y-6 w-full font-medium overflow-auto bg-background",
          {
            "shadow-lg h-full": !isMobile,
          }
        )}
      >
        {!isMobile && title && (
          <h1 className="text-lg font-semibold relative z-30 px-6 pt-6 pb-3">
            {title}
          </h1>
        )}
        {children}
      </div>

      {isMobile && (
        <button
          onClick={() => setVisible(false)}
          className="flex w-full sticky font-medium py-3 top-full gap-2 justify-center items-center bg-gray transition-all bg-opacity-10 hover:bg-opacity-20 focus:bg-opacity-20 active:bg-opacity-30 hover:underline"
        >
          <span>{t("close")}</span>
          <X className="text-primary" />
        </button>
      )}
    </div>
  );
};
