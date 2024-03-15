import { ReactComponent as HelpPhoneLinksIcon } from "./help-phone-links.svg";
import { useLinkyPomociQuery } from "../../../graphql";
import cx from "classnames";
import {
  Accordion,
  AccordionItem,
  DataDisplay,
  Divider,
  IconButton,
  LoadingSpinner,
  Modal,
} from "@bratislava/react-maps-ui";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { mainColors } from "../../utils/colors";

export interface IPhoneLinksModal {
  className?: string;
}

export const PhoneLinksModal = ({ className }: IPhoneLinksModal) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { data } = useLinkyPomociQuery({ locale: i18n.language });

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className={cx(
          "bg-primary rounded-lg flex w-full h-12 shadow-lg font-semibold text-sm pl-2 pr-4 text-foreground-lightmode gap-1 items-center",
          className,
        )}
      >
        <HelpPhoneLinksIcon width={32} height={32} />
        <div className="whitespace-nowrap">{t("helpPhoneLinks.title")}</div>
      </button>
      <Modal
        closeButtonInCorner
        overlayClassName="w-full max-w-xl"
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      >
        <div className="flex flex-col gap-4">
          {!data?.linkyPomocis?.data ? (
            <LoadingSpinner color={mainColors.yellow} />
          ) : (
            <Accordion type="single" collapsible className="font-semibold">
              {data.linkyPomocis?.data.map((type, index) => (
                <div key={type.id} className="flex gap-4">
                  <IconButton
                    onClick={() => window.open(`tel:${type.attributes?.Telefon}`, "_self")}
                    className="!bg-primary !border-primary text-foreground-lightmode !rounded-full shrink-0"
                  >
                    <HelpPhoneLinksIcon width={32} height={32} />
                  </IconButton>
                  <div className="flex flex-1 flex-col shrink font-medium">
                    <a href={`tel:${type.attributes?.Telefon}`} className="py-2">
                      {type.attributes?.Telefon}
                    </a>
                    <div>{type.attributes?.Nazov}</div>
                    <AccordionItem
                      className="w-full"
                      headerIsTrigger
                      value={type.attributes?.Nazov || ""}
                      title={<div className="underline">{t("helpPhoneLinks.labels.showMore")}</div>}
                    >
                      <div className="flex flex-col gap-3">
                        <DataDisplay
                          label={t("helpPhoneLinks.labels.description")}
                          text={type.attributes?.Popis}
                        />
                        <DataDisplay
                          label={t("helpPhoneLinks.labels.operator")}
                          text={type.attributes?.Prevadzkovatel}
                        />
                        <DataDisplay
                          label={t("helpPhoneLinks.labels.operation")}
                          text={type.attributes?.Prevadzka}
                        />
                        <DataDisplay
                          label={t("helpPhoneLinks.labels.price")}
                          text={type.attributes?.Cena}
                        />
                      </div>
                      {index !== 2 && <Divider className="my-4 mr-6" />}
                    </AccordionItem>
                  </div>
                </div>
              ))}
            </Accordion>
          )}
        </div>
      </Modal>
    </>
  );
};
