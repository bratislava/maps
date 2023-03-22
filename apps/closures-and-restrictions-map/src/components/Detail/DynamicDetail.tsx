import { ImageLightBox, Note } from '@bratislava/react-maps-ui';
import { Attachment, useArcgisAttachments } from '@bratislava/react-use-arcgis';
import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { ReactComponent as ClosureIcon } from "../../assets/icons/closure.svg";
import { ReactComponent as DigupIcon } from "../../assets/icons/digup.svg";
import { ReactComponent as DisorderIcon } from "../../assets/icons/disorder.svg";
import { ReactComponent as GoogleStreet } from "../../assets/icons/googlestreetview.svg";
import { ReactComponent as HintIcon } from "../../assets/icons/hint.svg";
import { ReactComponent as ImageIcon } from "../../assets/icons/imageicon.svg";
import { IFeatureProps } from '../../types/featureTypes';
import { DIGUPS_URL, DISORDERS_URL } from '../../utils/urls';
import { DetailValue } from './DetailValue';
import { Row } from './Row';

interface IDetail {
    featureProps: IFeatureProps;
    streetViewUrl: string;
    isMobile?: boolean;
}

export const DynamicDetail: React.FC<IDetail> = ({ featureProps, streetViewUrl, isMobile }) => {
    const [isModalOpen, setModalOpen] = useState(false);

    const {
        objectId,
        subject,
        infoForResidents,
        address,
        type,
        startTimestamp,
        endTimestamp,
        fullSize,
        investor,
        owner,
        contractor,
        length,
        width,
        layer,
        originalProperties,
        startTime,
        endTime,
        dateOfPassage
    } = featureProps;

    const {
        t,
        i18n: { language },
    } = useTranslation("translation", {
        keyPrefix: `layers.${layer as "digups" | "closures" | "disorders" | "repairs"
            }.detail`,
    });

    const { t: mainT }: { t: (key: string) => string } = useTranslation();

    const { data: attachments } = useArcgisAttachments(DIGUPS_URL, objectId || 0);

    const { data: disordersAttachments } = useArcgisAttachments(
        DISORDERS_URL,
        objectId || originalProperties?.objectid || 0,
    );

    const filterAttachments = (
        attachments: Array<Attachment> | null,
        url: string,
        attachementFilter: "fotografie_miesta_poruchy" | "dokumenty"): Array<string> => {
        const urlList: Array<string> = [];
        if (!attachments || attachments.length < 1) return urlList;
        const validAttachments = attachments.filter(a => a?.keywords === attachementFilter);

        validAttachments.forEach(a => {
            urlList.push(`${url}/${objectId || originalProperties?.objectid}/attachment/${a.id}`)
        })

        return urlList
    }

    const imageUrlList = layer === 'disorders' ? filterAttachments(disordersAttachments, DISORDERS_URL, 'fotografie_miesta_poruchy') : [];
    const documentUrlList = layer === 'disorders' ? filterAttachments(disordersAttachments, DISORDERS_URL, 'dokumenty') : filterAttachments(attachments, DIGUPS_URL, 'dokumenty');


    const displayLocaleDate = (timeStamp: number | null, time: string | null = null): string => {
        if (!timeStamp) return '';

        const dateFormat = new Date(timeStamp).toLocaleString(language, {
            day: "numeric",
            year: "numeric",
            month: "numeric",
        });

        return !time ? dateFormat : `${dateFormat} - ${time}`;
    }

    const icon = () => {
        switch (layer) {
            case 'closures':
                return <ClosureIcon width={40} height={40} className='rounded-full text-white bg-closure' />
            case 'digups':
                return <DigupIcon width={40} height={40} className='rounded-full text-white bg-digup' />
            case 'disorders':
                return <DisorderIcon width={40} height={40} className='rounded-full text-white bg-disorder' />
            default: return <></>
        }
    }

    return (
        <div className="flex flex-col justify-end w-full gap-4">
            {!isMobile &&
                <div className='flex gap-4 items-center'>
                    {icon()}
                    <DetailValue>{t("title")}</DetailValue>
                </div>
            }
            <DetailValue>{subject}</DetailValue>
            {infoForResidents &&
                <div><p>{infoForResidents}</p></div>
            }
            <Row label={t("address")} text={address} />
            {streetViewUrl &&
                <a
                    href={streetViewUrl}
                    target="_blank"
                    className="underline flex gap-2 items-center"
                    rel="noreferrer"
                >
                    Google Street View <GoogleStreet width={18} height={13} />
                </a>
            }
            {imageUrlList.length > 0 &&
                <a
                    className="underline flex gap-2 items-center cursor-pointer"
                    rel="noreferrer"
                    onClick={() => setModalOpen(true)}
                >
                    {t("photosOfPlace")} <ImageIcon width={18} height={18} />
                </a>
            }
            <Row
                label={t("category")}
                tags={type?.map((type) => mainT(`filters.type.types.${type}`)) ?? []}
            />
            <Row label={t("startDate")} text={displayLocaleDate(startTimestamp, startTime)} />
            <Row label={t('dateOfPassage')} text={displayLocaleDate(dateOfPassage || null)} />
            <Row label={t("endDate")} text={displayLocaleDate(endTimestamp, endTime)} />
            {!!fullSize && (
                <Row
                    label={t("fullSize")}
                    text={
                        <span>
                            {`${fullSize} m`}
                            <sup>2</sup>
                        </span>
                    }
                />
            )}
            {!!length && <Row label={t("length")} text={`${length} m`} />}
            {!!width && <Row label={t("width")} text={`${width} m`} />}
            <Row label={t("investor")} text={investor} />
            <Row label={t("owner")} text={owner} />
            <Row label={t("contractor")} text={contractor} />

            {documentUrlList && documentUrlList.length > 0 && (
                <div>
                    <div>{t("permission")}</div>
                    <div>
                        {documentUrlList?.map((attachment, index) => {
                            return (
                                <a
                                    className="font-bold flex underline"
                                    rel="noreferrer"
                                    href={attachment}
                                    target="_blank"
                                    key={index}
                                >
                                    {`${t("showDocument")} ${documentUrlList.length > 1 ? index + 1 : ""}`}
                                </a>
                            );
                        })}
                    </div>
                </div>
            )}

            <Note className="flex flex-col gap-3">
                <div className="flex-shrink-0">
                    <HintIcon />
                </div>
                <div className="flex-1">{t("problemHint")}</div>
                <a
                    href={t("reportProblemLink")}
                    target="_blank"
                    className="underline font-semibold"
                    rel="noreferrer"
                >
                    {t("reportProblem")}
                </a>
            </Note>

            {imageUrlList.length > 0 &&
                <ImageLightBox
                    onClose={() => setModalOpen(false)}
                    isOpen={isModalOpen}
                    images={imageUrlList}
                    initialImageIndex={0}
                />
            }
        </div>
    );
}
