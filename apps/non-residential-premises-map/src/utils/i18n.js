"use strict";
exports.__esModule = true;
var i18next_1 = require("i18next");
var react_i18next_1 = require("react-i18next");
var en_1 = require("../translations/en");
var sk_1 = require("../translations/sk");
var react_maps_1 = require("@bratislava/react-maps");
var environment_1 = require("../../environment");
var getLangFromQuery = function () {
    var pathnameArray = window.location.pathname.split("/");
    var langUrl = pathnameArray[pathnameArray.length - 1].split(".html")[0];
    var langQuery = new URLSearchParams(window.location.search).get("lang");
    if (langUrl === "sk" || langUrl === "en") {
        return langUrl;
    }
    else if (langQuery === "sk" || langQuery === "en") {
        return langQuery;
    }
    return "sk";
};
var queryLanguage = getLangFromQuery();
i18next_1["default"]
    .use(react_i18next_1.initReactI18next) // passes i18n down to react-i18next
    .init({
    debug: environment_1.environment.nodeEnv === "development",
    resources: {
        en: {
            translation: en_1["default"]
        },
        sk: {
            translation: sk_1["default"]
        }
    },
    lng: queryLanguage,
    interpolation: {
        escapeValue: false
    }
});
react_maps_1.i18n.changeLanguage(queryLanguage);
i18next_1["default"].on("languageChanged", function (lng) {
    react_maps_1.i18n.changeLanguage(lng);
});
exports["default"] = i18next_1["default"];
