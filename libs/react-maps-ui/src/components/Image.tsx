import { useEffect, useState } from "react";
import cx from "classnames";

export interface IImageProps {
  src?: string;
  alt?: string;
  isMobile?: boolean;
  imageMissingText: string;
}

export const Image = ({
  src,
  alt,
  isMobile,
  imageMissingText,
}: IImageProps) => {
  const [isError, setError] = useState(false);

  useEffect(() => {
    if (!src) {
      setError(true);
    } else {
      setError(false);
    }
  }, [src]);

  return (
    <div className="relative w-full h-64 z-0">
      <div className="flex items-center justify-center absolute top-0 right-0 bottom-0 left-0  bg-gray-lightmode dark:bg-gray-darkmode bg-opacity-10 dark:bg-opacity-10">
        {imageMissingText}
      </div>
      <img
        draggable="false"
        className={cx(
          "w-full h-full border-0 border-transparent object-cover relative z-20",
          {
            hidden: isError,
          }
        )}
        src={src}
        alt={alt}
        onError={() => setError(true)}
      />
      {isMobile && (
        <div className="fixed top-3 left-0 right-0 flex items-center justify-center z-20">
          <div className="w-12 h-[4px] rounded-full bg-[#D9D9D9]"></div>
        </div>
      )}
    </div>
  );
};
