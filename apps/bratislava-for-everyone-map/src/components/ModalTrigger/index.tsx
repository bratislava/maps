import { ReactComponent as HelpPhoneLinksIcon } from "./help-phone-links.svg";
import cx from "classnames";
import {
  Accordion,
  AccordionItem,
  DataDisplay,
  IconButton,
  Modal,
} from "@bratislava/react-maps-ui";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export interface IModalTrigger {
  className?: string;
}

export const ModalTrigger = ({ className }: IModalTrigger) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className={cx(
          "bg-primary-soft rounded-lg flex w-full h-12 shadow-lg font-semibold text-sm pl-2 pr-4 text-foreground-lightmode gap-1 items-center",
          className,
        )}
      >
        <HelpPhoneLinksIcon width={32} height={32} />
        <div className="whitespace-nowrap">Linky pomoci</div>
      </button>
      <Modal
        closeButtonInCorner
        overlayClassName="!p-6"
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {["first", "second", "third"].map((number) => (
            <div key={number} className="flex gap-4">
              <IconButton
                onClick={() => window.open(`tel:${t(`helpPhoneLinks.${number}.phone`)}`, "_self")}
                className="!bg-primary !border-primary text-foreground-lightmode !rounded-full shrink-0"
              >
                <HelpPhoneLinksIcon width={32} height={32} />
              </IconButton>
              <div className="flex flex-1 flex-col shrink font-medium w-52">
                <a href={`tel:${t(`helpPhoneLinks.${number}.phone`)}`} className="py-2">
                  {t(`helpPhoneLinks.${number}.phone`)}
                </a>
                <div>{t(`helpPhoneLinks.${number}.title`)}</div>
                <Accordion type="multiple" className="font-semibold">
                  <AccordionItem
                    headerIsTrigger
                    value="1"
                    title={<div className="underline">{t("helpPhoneLinks.labels.showMore")}</div>}
                  >
                    <div className="flex flex-col gap-3">
                      <DataDisplay
                        label={t("helpPhoneLinks.labels.description")}
                        text={t(`helpPhoneLinks.${number}.description`)}
                      />
                      <DataDisplay
                        label={t("helpPhoneLinks.labels.operator")}
                        text={t(`helpPhoneLinks.${number}.operator`)}
                      />
                      <DataDisplay
                        label={t("helpPhoneLinks.labels.operation")}
                        text={t(`helpPhoneLinks.${number}.operation`)}
                      />
                      <DataDisplay
                        label={t("helpPhoneLinks.labels.price")}
                        text={t(`helpPhoneLinks.${number}.price`)}
                      />
                    </div>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};
