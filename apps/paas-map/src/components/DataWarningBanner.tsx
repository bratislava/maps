import { useState } from "react";
import { useTranslation } from "react-i18next";

interface DataWarningBannerProps {
  warnings: string[];
}

export const DataWarningBanner = ({ warnings }: DataWarningBannerProps) => {
  const { t } = useTranslation();
  const [isDismissed, setIsDismissed] = useState(false);

  if (warnings.length === 0 || isDismissed) {
    return null;
  }

  const totalInvalidFeatures = warnings.length;

  return (
    <div className="fixed top-20 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-[100] max-w-md mx-auto">
      <div className="bg-primary text-white px-3 py-2 shadow-2xl rounded-md flex items-center gap-2 text-xs sm:text-sm opacity-100">
        <svg
          className="h-4 w-4 flex-shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        <div className="flex-1 min-w-0">
          <span className="font-semibold">{t("dataWarning.title")}:</span>{" "}
          <span>{t("dataWarning.messageShort", { count: totalInvalidFeatures })}</span>
          {warnings.length > 0 && (
            <details className="mt-1">
              <summary className="cursor-pointer text-[10px] sm:text-xs opacity-90 hover:opacity-100 font-medium">
                {t("dataWarning.details")}
              </summary>
              <ul className="mt-1 text-[9px] sm:text-[10px] space-y-0.5 opacity-85 max-h-32 overflow-y-auto">
                {warnings.map((warning, index) => (
                  <li key={index}>• {warning}</li>
                ))}
              </ul>
            </details>
          )}
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="flex-shrink-0 p-1 rounded hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-white transition-colors"
          aria-label={t("dataWarning.dismiss")}
        >
          <svg
            className="h-3 w-3 sm:h-4 sm:w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
