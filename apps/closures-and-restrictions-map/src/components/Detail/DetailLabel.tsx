export interface IDetailLabelProps {
  children: string;
}

export const DetailLabel = ({ children }: IDetailLabelProps) => {
  return <div className="font-light text-[14px]">{children}</div>;
};
