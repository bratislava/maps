import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import cx from "classnames";

export interface IImageProps {
  src?: string;
  alt?: string;
  object?: "cover" | "contain";
}

export const Image = ({ src, alt, object = "cover" }: IImageProps) => {
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
    <div className="relative h-full z-0">
      <div className="flex items-center justify-center absolute top-0 right-0 bottom-0 left-0">
        {t("noImage")}
      </div>
      <img
        draggable="false"
        className={cx("w-full h-full border-0 border-transparent relative z-20", {
          hidden: isError,
          "object-contain": object === "contain",
          "object-cover": object === "cover",
        })}
        src={src}
        alt={alt}
        onError={() => setError(true)}
      />
    </div>
  );
};
