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

  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    if (isMobile === null) {
      setVisible(false);
      return;
    }

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
