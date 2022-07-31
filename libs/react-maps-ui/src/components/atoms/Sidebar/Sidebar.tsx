import React, { ReactNode } from "react";
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
  return (
    <div
      className={cx(
        "fixed top-0 bottom-0 h-full transition-transform duration-500 z-50",
        {
          "left-0": position === "left",
          "right-0": position === "right",
          "-translate-x-full": !isVisible && position === "left",
          "translate-x-full": !isVisible && position === "right",
          "w-full": isMobile,
          "w-96": !isMobile,
        }
      )}
    >
      <div
        className={cx(
          "w-full h-full flex flex-col bg-background-lightmode dark:bg-background-darkmode dark:border-r-2 border-background-lightmode dark:border-gray-darkmode dark:border-opacity-20 pr-0 transition-all",
          {
            "overflow-auto": isMobile,
          }
        )}
      >
        {isMobile ? (
          <div className="sticky top-0 bg-background-lightmode dark:bg-background-darkmode z-50">
            <button
              onClick={() => setVisible(false)}
              className="flex w-full items-center px-3 py-3 gap-2 bg-gray-lightmode dark:bg-gray-darkmode
        transition-all bg-opacity-0 dark:bg-opacity-0 hover:bg-opacity-10 hover:dark:bg-opacity-10 focus:bg-opacity-10 focues:dark:bg-opacity-10 active:bg-opacity-20 active:dark:bg-opacity-20"
            >
              <div className="flex p-2">
                <Chevron direction="left" className="text-primary" />
              </div>
              <h1 className="relative font-medium">{title}</h1>
            </button>
          </div>
        ) : (
          <div
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setVisible(!isVisible)}
            className={cx(
              "absolute bg-background-lightmode dark:bg-background-darkmode z-20 dark:border-r-2 dark:border-b-2 dark:border-gray-darkmode dark:border-opacity-20 py-8 transform hover:text-primary transition-all",
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
                "pointer-events-none hidden transition-all sm:block bg-background-lightmode dark:bg-background-darkmode absolute w-4 min-h-full box-content top-0",
                {
                  "left-full": position === "right",
                  "right-full": position === "left",
                }
              )}
            ></div>
            <div
              className={cx(
                "pointer-events-none hidden transition-all sm:block bg-background-lightmode dark:bg-background-darkmode absolute w-4 h-4 box-content top-full dark:border-opacity-20 dark:border-gray-darkmode",
                {
                  "left-full dark:border-l-2": position === "right",
                  "right-full dark:border-r-2": position === "left",
                }
              )}
            ></div>
          </div>
        )}

        <div
          className={cx(
            "space-y-6 w-full grow font-medium overflow-auto bg-background pb-3",
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
            className="flex w-full sticky font-medium py-3 top-full gap-2 justify-center items-center bg-gray-lightmode dark:bg-gray-darkmode transition-all bg-opacity-10 dark:bg-opacity-10 hover:bg-opacity-20 hover:dark:bg-opacity-20 focus:bg-opacity-20 focus:dark:bg-opacity-20 active:bg-opacity-30 active:dark:bg-opacity-30 hover:underline"
          >
            <span>{t("close")}</span>
            <X className="text-primary" />
          </button>
        )}
      </div>
    </div>
  );
};
