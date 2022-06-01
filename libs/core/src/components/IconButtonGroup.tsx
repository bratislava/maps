import { Fragment, ReactNode } from 'react';
import cx from 'classnames';

interface IconButtonGroupProps {
  children: ReactNode[];
}

export const IconButtonGroup = ({ children }: IconButtonGroupProps) => {
  return (
    <div className="shadow-lg bg-background rounded-lg flex text-font flex-col">
      {children.map((child, key) => (
        <Fragment key={key}>
          {key !== 0 && (
            <div className="mx-1 h-[2px] bg-secondary opacity-10"></div>
          )}
          {child}
        </Fragment>
      ))}
    </div>
  );
};

export default IconButtonGroup;
