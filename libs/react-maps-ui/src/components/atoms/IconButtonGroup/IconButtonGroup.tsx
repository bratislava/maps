import React, { Fragment, ReactNode, useEffect, useState } from "react";
import cx from "classnames";

interface IconButtonGroupProps {
  children: ReactNode[];
}

export const IconButtonGroup = ({ children }: IconButtonGroupProps) => {
  const [childrenLength, setChildrenLength] = useState(0);
  const [pressedChild, setPressedChild] = useState<number | null>(null);

  useEffect(() => {
    setChildrenLength(children.length);
  }, [children]);

  return (
    <div
      style={{
        perspective: "100px",
      }}
    >
      <div
        className={cx(
          "shadow-lg bg-background rounded-lg flex text-font flex-col transform transition-transform"
        )}
        style={{
          transform:
            pressedChild === 0
              ? "rotateX(15deg)"
              : pressedChild === childrenLength - 1
              ? "rotateX(-15deg)"
              : "",
        }}
      >
        {children.map((child, key) => (
          <Fragment key={key}>
            {key !== 0 && (
              <div className="mx-2 h-[2px] bg-gray opacity-20"></div>
            )}
            <div
              onMouseDown={() => {
                setPressedChild(key);
              }}
              onTouchStart={() => {
                setPressedChild(key);
              }}
              onMouseUp={() => {
                setPressedChild(null);
              }}
              onMouseLeave={() => {
                setPressedChild(null);
              }}
              onTouchCancel={() => {
                setPressedChild(null);
              }}
              onTouchEnd={() => {
                setPressedChild(null);
              }}
            >
              {child}
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default IconButtonGroup;
