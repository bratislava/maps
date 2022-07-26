import { useCallback, useEffect, useRef, useState } from "react";

export const useClickOutside = <T extends HTMLElement | null>(
  callback: (e: MouseEvent) => void
) => {
  const ref = useRef<T | null>(null);

  const [isClicked, setClicked] = useState(false);

  const onClickOutside = useCallback(
    (e: MouseEvent) => {
      if (!isClicked) {
        callback(e);
      }
    },
    [callback, isClicked]
  );

  useEffect(() => {
    ref.current?.addEventListener("mousedown", () => setClicked(true));

    const realCallback = (e: MouseEvent) => {
      onClickOutside(e);
      setClicked(false);
    };

    document.addEventListener("click", realCallback);

    return () => {
      document.removeEventListener("click", realCallback);
    };
  }, [callback, ref, onClickOutside]);

  return ref;
};
