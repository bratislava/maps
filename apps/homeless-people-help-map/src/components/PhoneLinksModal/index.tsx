import { ReactComponent as HelpPhoneLinksIcon } from "./help-phone-links.svg";
import cx from "classnames";
import {
  Accordion,
  AccordionItem,
  DataDisplay,
  Divider,
  IconButton,
  Modal,
} from "@bratislava/react-maps-ui";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export interface IPhoneLinksModal {
  className?: string;
}

export const PhoneLinksModal = ({ className }: IPhoneLinksModal) => {
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
        overlayClassName="w-full max-w-xl"
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      >
        <div className="flex flex-col gap-4">
          <Accordion type="single" collapsible className="font-semibold">
            {(["womenViolence", "homelessPeople", "humanTrafficking"] as const).map(
              (type, index) => (
                <div key={type} className="flex gap-4">
                  <IconButton
                    onClick={() => window.open(`tel:${t(`helpPhoneLinks.${type}.phone`)}`, "_self")}
                    className="!bg-primary !border-primary text-foreground-lightmode !rounded-full shrink-0"
                  >
                    <HelpPhoneLinksIcon width={32} height={32} />
                  </IconButton>
                  <div className="flex flex-1 flex-col shrink font-medium">
                    <a href={`tel:${t(`helpPhoneLinks.${type}.phone`)}`} className="py-2">
                      {t(`helpPhoneLinks.${type}.phone`)}
                    </a>
                    <div>{t(`helpPhoneLinks.${type}.title`)}</div>
                    <AccordionItem
                      className="w-full"
                      headerIsTrigger
                      value={type}
                      title={<div className="underline">{t("helpPhoneLinks.labels.showMore")}</div>}
                    >
                      <div className="flex flex-col gap-3">
                        <DataDisplay
                          label={t("helpPhoneLinks.labels.description")}
                          text={t(`helpPhoneLinks.${type}.description`)}
                        />
                        <DataDisplay
                          label={t("helpPhoneLinks.labels.operator")}
                          text={t(`helpPhoneLinks.${type}.operator`)}
                        />
                        <DataDisplay
                          label={t("helpPhoneLinks.labels.operation")}
                          text={t(`helpPhoneLinks.${type}.operation`)}
                        />
                        <DataDisplay
                          label={t("helpPhoneLinks.labels.price")}
                          text={t(`helpPhoneLinks.${type}.price`)}
                        />
                      </div>
                      {index !== 2 && <Divider className="my-4 mr-6" />}
                    </AccordionItem>
                  </div>
                </div>
              ),
            )}
          </Accordion>
        </div>
      </Modal>
    </>
  );
};
