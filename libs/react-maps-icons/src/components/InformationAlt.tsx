import { IIconComponentProps } from "../types";

export interface IInformationAltProps extends IIconComponentProps {
  className?: string;
}

export const InformationAlt = ({
  className,
}: IInformationAltProps) => {

  return (
    <div className={className}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.0011 8.6101C11.3811 8.6101 10.8711 8.1001 10.8711 7.4801C10.8711 6.8601 11.3811 6.3501 12.0011 6.3501C12.6211 6.3501 13.1311 6.8601 13.1311 7.4801C13.1311 8.1001 12.6211 8.6101 12.0011 8.6101Z" fill="currentColor" />
        <path d="M12.75 10.2598H11.25V16.8998H12.75V10.2598Z" fill="currentColor" />
      </svg>
    </div>
  );
};
