import cx from 'classnames';
import * as React from 'react';

interface IProps {
  hasError?: boolean;
}

export const Input = ({
  className,
  hasError,
  ...props
}: React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> &
  IProps) => (
  <input
    className={cx(
      'bg-white border-2 border-highlight h-12 rounded-lg px-3 outline-none',
      className
    )}
    {...props}
  />
);

export default Input;
