import { ReactNode } from 'react';

export type ContentProps = {
  children?: ReactNode;
};

export const Content = ({ children }: ContentProps) => {
  return <div>{children}</div>;
};
