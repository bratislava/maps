import { IIconComponentProps } from "../types";

export interface IInformationAltProps extends IIconComponentProps {
  className?: string;
}

export const InformationAlt = ({
  className,
}: IInformationAltProps) => {

  return (
    <div className={className}>
      <svg
        width={24}
        height={24}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.001 8.61c-.62 0-1.13-.51-1.13-1.13 0-.62.51-1.13 1.13-1.13.62 0 1.13.51 1.13 1.13 0 .62-.51 1.13-1.13 1.13ZM12.75 10.26h-1.5v6.64h1.5v-6.64Z"
          fill="#333"
        />
      </svg>
    </div>
  );
};
