

import { useArcgisAttachments } from "@bratislava/react-use-arcgis";
import { useState, useEffect } from "react";
import { GEOPORTAL_LAYER_URL } from "../components/App";

const useImageUrls = (featureId: number | string | undefined, url: string) => {
    const [imageUrls, setImageUrls] = useState<Array<string>>([]);
    // TODO: generate corretly image urls, remove logs
    const basicUrl = "https://mapy.bratislava.sk/images/SSN/";

    const { data } = useArcgisAttachments(GEOPORTAL_LAYER_URL, featureId || 0);

    useEffect(() => {
        if (!featureId) return;
        console.log('data', data)

        const imageUrlList = data?.map(a => {
            return `${basicUrl}${a.name}`
        })

        setImageUrls(imageUrlList || []);

    }, [data, featureId]);

    console.log('imageUrls', imageUrls)
    return imageUrls;
};

export default useImageUrls
