"use strict";
exports.__esModule = true;
exports.DetailDataDisplay = void 0;
var React = require("react");
var react_maps_ui_1 = require("@bratislava/react-maps-ui");
var react_use_arcgis_1 = require("@bratislava/react-use-arcgis");
var react_i18next_1 = require("react-i18next");
var colors_1 = require("../../utils/colors");
var cx = require("classnames");
var ButtonLink_1 = require("../ButtonLink");
var imageicon_svg_1 = require("../../assets/icons/imageicon.svg");
var googlestreetview_svg_1 = require("../../assets/icons/googlestreetview.svg");
var react_1 = require("react");
var const_1 = require("../../utils/const");
var RoundedIconButon_1 = require("@bratislava/react-maps/src/components/Detail/RoundedIconButon");
var DetailDataDisplay = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
    var feature = _a.feature, className = _a.className, isSingleFeature = _a.isSingleFeature;
    var t = (0, react_i18next_1.useTranslation)("translation", { keyPrefix: "detail" }).t;
    var _z = (0, react_1.useState)(false), isModalOpen = _z[0], setModalOpen = _z[1];
    var occupancy = (_b = feature === null || feature === void 0 ? void 0 : feature.properties) === null || _b === void 0 ? void 0 : _b.occupancy;
    var contractLink = ((_c = feature.properties) === null || _c === void 0 ? void 0 : _c.linkNZ) || "";
    var groundPlanLink = ((_d = feature.properties) === null || _d === void 0 ? void 0 : _d.ORIGINAL_podorys) || "";
    var txtClrByOccupacy = occupancy === "forRent" ? "black" : "white";
    var emailSubjectPrefix = occupancy === "forRent"
        ? "Informácie o obchodnej súťaži: "
        : occupancy === "occupied"
            ? "Záujem o priestor: "
            : "Informácie o priestore: ";
    var featureAttachments = (0, react_use_arcgis_1.useArcgisAttachments)(const_1.GEOPORTAL_LAYER_URL, (feature === null || feature === void 0 ? void 0 : feature.id) || 0).data;
    var images = (featureAttachments === null || featureAttachments === void 0 ? void 0 : featureAttachments.length)
        ? featureAttachments.map(function (attachment) { return "".concat(const_1.GEOPORTAL_LAYER_URL, "/").concat(feature === null || feature === void 0 ? void 0 : feature.id, "/attachments/").concat(attachment.id); })
        : [((_e = feature === null || feature === void 0 ? void 0 : feature.properties) === null || _e === void 0 ? void 0 : _e.picture) || ((_f = feature === null || feature === void 0 ? void 0 : feature.properties) === null || _f === void 0 ? void 0 : _f.foto)];
    // indefinite rents have date of 1.1.2100
    var rentUntil = ((_h = (_g = feature === null || feature === void 0 ? void 0 : feature.properties) === null || _g === void 0 ? void 0 : _g.rentUntil) === null || _h === void 0 ? void 0 : _h.includes("2100"))
        ? t("indefinite")
        : (_j = feature === null || feature === void 0 ? void 0 : feature.properties) === null || _j === void 0 ? void 0 : _j.rentUntil;
    return (<div className={cx("relative flex flex-col space-y-4 p-4", className)}>
      {((_k = feature.properties) === null || _k === void 0 ? void 0 : _k.competition) && occupancy === "forRent" && isSingleFeature && (<div className="absolute -translate-y-12">
          <ButtonLink_1.ButtonLink occupancy={occupancy} href={(_l = feature.properties) === null || _l === void 0 ? void 0 : _l.competition}>
            {t("ongoingCompetition")}
          </ButtonLink_1.ButtonLink>
        </div>)}

      <div className="flex flex-wrap">
        {((_m = feature.properties) === null || _m === void 0 ? void 0 : _m.competition) && occupancy === "forRent" && !isSingleFeature && (<a href={(_o = feature.properties) === null || _o === void 0 ? void 0 : _o.competition} target="_blank" className="no-underline flex gap-2 items-center" rel="noreferrer">
            <RoundedIconButon_1["default"] bgColor={colors_1.colors[occupancy]} txtColor={txtClrByOccupacy}>
              {t("ongoingCompetition")}
            </RoundedIconButon_1["default"]>
          </a>)}

        <div style={{ backgroundColor: colors_1.colors[occupancy], color: txtClrByOccupacy }} className={"flex gap-2 text-[white] rounded-full font-semibold h-9 items-center justify-center pl-4 pr-4 mr-2 mb-2 select-none"}>
          {t(occupancy)}
        </div>

        {images[0] && (<>
            <a className="no-underline flex gap-2 items-center" rel="noreferrer" onClick={function () { return setModalOpen(true); }}>
              <RoundedIconButon_1["default"] icon={<imageicon_svg_1.ReactComponent width={20} height={20}/>} txtColor={txtClrByOccupacy} bgColor={colors_1.colors[occupancy]}>
                {t("premisePhotos")}
              </RoundedIconButon_1["default"]>
            </a>
            <react_maps_ui_1.ImageLightBox onClose={function () { return setModalOpen(false); }} isOpen={isModalOpen} images={images} initialImageIndex={0}/>
          </>)}

        {((_p = feature.properties) === null || _p === void 0 ? void 0 : _p.streetView) && (<a href={feature.properties.streetView} target="_blank" className="no-underline flex gap-2 items-center" rel="noreferrer">
            <RoundedIconButon_1["default"] icon={<googlestreetview_svg_1.ReactComponent width={20} height={20}/>} bgColor={colors_1.colors[occupancy]} txtColor={txtClrByOccupacy}>
              {t("streetView")}
            </RoundedIconButon_1["default"]>
          </a>)}
      </div>

      <react_maps_ui_1.DataDisplay label={t("locality")} text={(_q = feature === null || feature === void 0 ? void 0 : feature.properties) === null || _q === void 0 ? void 0 : _q.locality}/>
      <react_maps_ui_1.DataDisplay label={t("purpose")} text={(_r = feature === null || feature === void 0 ? void 0 : feature.properties) === null || _r === void 0 ? void 0 : _r.purpose}/>
      <react_maps_ui_1.DataDisplay label={t("lessee")} text={(_s = feature === null || feature === void 0 ? void 0 : feature.properties) === null || _s === void 0 ? void 0 : _s.lessee}/>
      <react_maps_ui_1.DataDisplay label={t("rentUntil")} text={rentUntil}/>
      <react_maps_ui_1.DataDisplay label={t("description")} text={(_t = feature === null || feature === void 0 ? void 0 : feature.properties) === null || _t === void 0 ? void 0 : _t.description}/>
      <react_maps_ui_1.DataDisplay label={t("approximateArea")} text={typeof ((_u = feature === null || feature === void 0 ? void 0 : feature.properties) === null || _u === void 0 ? void 0 : _u.approximateArea) === "number" && (<span>
              {(_v = feature === null || feature === void 0 ? void 0 : feature.properties) === null || _v === void 0 ? void 0 : _v.approximateArea.toFixed(2).replace(".", ",")} m
              <sup className="text-xs font-bold">2</sup>
            </span>)}/>
      <react_maps_ui_1.DataDisplay label={t("approximateRentPricePerYear")} text={typeof ((_w = feature === null || feature === void 0 ? void 0 : feature.properties) === null || _w === void 0 ? void 0 : _w.approximateRentPricePerYear) === "number" && (<span>
              {(Math.round(((_x = feature === null || feature === void 0 ? void 0 : feature.properties) === null || _x === void 0 ? void 0 : _x.approximateRentPricePerYear) / 10) * 10)
                .toFixed(2)
                .replace(".", ",")}{" "}
              €
            </span>)}/>
      {contractLink && (<react_maps_ui_1.DataDisplay label={t("contract")} text={<a className="flex underline" rel="noreferrer" href={contractLink} target="_blank">
              {t("rentalContract")}
            </a>}/>)}
      {groundPlanLink && (<react_maps_ui_1.DataDisplay label={t("groundPlan")} text={<a className="flex underline" rel="noreferrer" href={groundPlanLink} target="_blank">
              {t("spacePlan")}
            </a>}/>)}
      <react_maps_ui_1.Note className={"flex flex-col gap-3 !bg-[#ebebeb] dark:text-[black]"}>
        <div className="flex-1">{t("contactUs")}</div>
        <a href={"mailto: spravanehnutelnosti@bratislava.sk?subject=".concat(emailSubjectPrefix).concat(((_y = feature === null || feature === void 0 ? void 0 : feature.properties) === null || _y === void 0 ? void 0 : _y.locality) || "")} target="_blank" className="underline font-semibold" rel="noreferrer">
          spravanehnutelnosti@bratislava.sk
        </a>
      </react_maps_ui_1.Note>
    </div>);
};
exports.DetailDataDisplay = DetailDataDisplay;
