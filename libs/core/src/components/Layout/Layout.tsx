import React, { ReactNode, useState, useEffect, useContext } from "react";
import { mapContext } from "../Map/Map";

export interface ILayoutProps {
  isOnlyMobile?: boolean;
  isOnlyDesktop?: boolean;
  children?: ReactNode;
}

export const Layout = ({
  isOnlyMobile = false,
  isOnlyDesktop = false,
  children,
}: ILayoutProps) => {
  const { isMobile } = useContext(mapContext);

  useEffect(() => {
    console.log("Layout", isMobile);
  }, [isMobile]);

  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    if (isOnlyMobile) {
      setVisible(isMobile);
    } else if (isOnlyDesktop) {
      setVisible(!isMobile);
    } else {
      setVisible(true);
    }
  }, [isOnlyMobile, isOnlyDesktop, setVisible, isMobile]);

  return <>{isVisible && children}</>;
};
