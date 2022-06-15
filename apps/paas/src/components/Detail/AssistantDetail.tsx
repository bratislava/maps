import { useTranslation } from "react-i18next";
import { ReactComponent as AssistantIcon } from "../../assets/icons/assistant-active.svg";

const Row = ({ label, text }: { label: string; text: string }) => {
  if (text) {
    return (
      <div className="">
        <div>{label}</div>
        <div className="font-bold">{text}</div>
      </div>
    );
  } else {
    return null;
  }
};

export const AssistantDetail = ({
  "Rezidentská zóna": residentZone,
  location,
}) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col space-y-4">
      <div className="text-secondary">
        <AssistantIcon width={54} height={54} />
      </div>
      <div className="font-bold">
        {t("layers.assistantsLayer.detail.title")}
      </div>
      <Row
        label={t("layers.assistantsLayer.detail.residentZone")}
        text={residentZone}
      />
    </div>
  );
};
