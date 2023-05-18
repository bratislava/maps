import { ReactNode } from "react";

export interface IDetailValueProps {
  children?: string | ReactNode;
}

export const DetailValue = ({ children }: IDetailValueProps) => {
  return children ? <div>{children}</div> : <></>;
};
