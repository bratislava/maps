"use strict";
exports.__esModule = true;
exports.SearchMarker = void 0;
var react_mapbox_1 = require("@bratislava/react-mapbox");
var helpers_1 = require("@turf/helpers");
var SearchMarker = function (_a) {
    var lng = _a.lng, lat = _a.lat;
    return (<react_mapbox_1.Marker origin="bottom" feature={(0, helpers_1.point)([lng, lat])} className="relative z-10">
      <div className="flex h-12 w-8 items-center justify-center">
        <svg className="h-full w-full" width="244" height="360" viewBox="0 0 244 360" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_2676_19237)">
            <path d="M-0.000681168 121.89C-0.000675283 54.57 54.5693 7.50115e-05 121.889 8.08968e-05C189.209 8.67821e-05 243.779 54.5801 243.779 121.89C243.779 235.28 164.629 359.08 121.889 359.08C79.1493 359.08 -0.000691081 235.28 -0.000681168 121.89Z" className="fill-gray-lightmode dark:fill-white"/>
          </g>
          <defs>
            <clipPath id="clip0_2676_19237">
              <rect width="243.78" height="359.08" fill="white" transform="translate(243.779 359.08) rotate(-180)"/>
            </clipPath>
          </defs>
        </svg>
      </div>
    </react_mapbox_1.Marker>);
};
exports.SearchMarker = SearchMarker;
