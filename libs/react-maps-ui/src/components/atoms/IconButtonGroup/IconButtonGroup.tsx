import cx from "classnames";
import { Fragment, ReactNode, useEffect, useState } from "react";

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
          "shadow-lg bg-background-lightmode dark:bg-background-darkmode rounded-lg flex text-font flex-col transform border-2 border-background-lightmode dark:border-gray-darkmode dark:border-opacity-20 transition-all"
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
              <div className="mx-auto h-[2px] w-8 bg-gray-lightmode dark:bg-gray-darkmode opacity-20"></div>
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
