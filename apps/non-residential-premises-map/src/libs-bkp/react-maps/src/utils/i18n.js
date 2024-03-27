"use strict";
exports.__esModule = true;
var i18next_1 = require("i18next");
var react_i18next_1 = require("react-i18next");
var en_1 = require("../translations/en");
var sk_1 = require("../translations/sk");
var i18n = (0, i18next_1.createInstance)({
    resources: {
        en: {
            maps: en_1["default"]
        },
        sk: {
            maps: sk_1["default"]
        }
    },
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false
    }
});
i18n.use(react_i18next_1.initReactI18next).init();
exports["default"] = i18n;
