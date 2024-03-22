import { ReactNode, useEffect, useRef, useState } from "react";
import cx from "classnames";

const phoneRegex = /\+?(([0-9][\s\-/]?){10,12})/g;
const emailRegex =
  /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/gi;
const urlRegex =
  /(?:(https?|ircs?):\/\/(?:www\.)?|www\.)((?:(?:[-\w]+\.)+)[-\w]+)(?::\d+)?(?:\/((?:[-a-zA-Z;./\d#:_?=&,]*)))?/gi;

const enhancePhoneNumbers = (text: string) => {
  return text.replace(
    phoneRegex,
    (tel) =>
      `<a href="tel:${tel.replaceAll(
        /[\s\-/]/g,
        ""
      )}" class="font-semibold underline">${tel}</a>`
  );
};

const enhanceEmails = (text: string) => {
  return text.replace(
    emailRegex,
    (email) =>
      `<a href="mailto:${email}" class="font-semibold underline">${email}</a>`
  );
};

const enhanceUrls = (text: string) => {
  return text.replace(
    urlRegex,
    (url) =>
      `<a href="${url}" class="font-semibold underline" target="_blank">${url
        .replace("https://", "")
        .replace("http://", "")
        .replace(/^www\./, "")}</a>`
  );
};

export const DataDisplay = ({
  label,
  text,
  enableEnhancements = false,
  switchFontWeights = false,
}: {
  label?: ReactNode | null;
  text?: ReactNode;
  enableEnhancements?: boolean;
  switchFontWeights?: boolean;
}) => {
  const textWrapperRef = useRef<HTMLDivElement>(null);
  const textWrapper = (
    <div className="hidden" ref={textWrapperRef}>
      {text}
    </div>
  );

  const [enahncedHtml, setEnhancedHtml] = useState("");

  useEffect(() => {
    let enhanced = textWrapperRef.current?.innerHTML ?? "";
    enhanced = enhancePhoneNumbers(enhanced);
    enhanced = enhanceEmails(enhanced);
    enhanced = enhanceUrls(enhanced);
    setEnhancedHtml(enhanced);
  }, [text]);

  if (!text || (text === " " && !label)) {
    return null;
  } else {
    return (
      <div>
        <div
          className={cx("text-[14px]", {
            "font-light": switchFontWeights,
            "font-semibold": !switchFontWeights,
          })}
        >
          {label}
        </div>

        <div
          className={cx({
            "font-light": !switchFontWeights,
            "font-semibold": switchFontWeights,
          })}
        >
          {enableEnhancements ? (
            <div dangerouslySetInnerHTML={{ __html: enahncedHtml }} />
          ) : (
            text
          )}
        </div>

        {textWrapper}
      </div>
    );
  }
};
