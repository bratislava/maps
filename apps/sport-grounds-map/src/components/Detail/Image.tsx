import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import cx from "classnames";

export interface IImageProps {
  src?: string;
  alt?: string;
}

export const Image = ({ src, alt }: IImageProps) => {
  const { t } = useTranslation();
  const [isError, setError] = useState(false);
  useEffect(() => {
    if (!src) {
      setError(true);
    } else {
      setError(false);
    }
  }, [src]);
  return (
    <div className="relative h-64 z-0">
      <div className="flex items-center justify-center absolute top-0 right-0 bottom-0 left-0 bg-gray-lightmode dark:bg-gray-darkmode bg-opacity-10 dark:bg-opacity-10">
        {t("noImage")}
      </div>
      <img
        className={cx("w-full h-full border-0 border-transparent relative z-20", {
          hidden: isError,
        })}
        src={src}
        alt={alt}
        onError={() => setError(true)}
      />
    </div>
  );
};
