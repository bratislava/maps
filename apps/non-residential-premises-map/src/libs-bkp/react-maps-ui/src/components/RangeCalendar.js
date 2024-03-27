"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.RangeCalendar = void 0;
var react_1 = require("react");
var calendar_1 = require("@react-stately/calendar");
var calendar_2 = require("@react-aria/calendar");
var date_1 = require("@internationalized/date");
var Button_1 = require("./Button");
var CalendarGrid_1 = require("./CalendarGrid");
var react_maps_icons_1 = require("@bratislava/react-maps-icons");
var RangeCalendar = function (props) {
    var state = (0, calendar_1.useRangeCalendarState)(__assign(__assign({}, props), { locale: "sk", createCalendar: date_1.createCalendar }));
    var ref = (0, react_1.useRef)(null);
    var _a = (0, calendar_2.useRangeCalendar)(props, state, ref), calendarProps = _a.calendarProps, prevButtonProps = _a.prevButtonProps, nextButtonProps = _a.nextButtonProps, title = _a.title;
    return (<div {...calendarProps} ref={ref} className="inline-block">
      <div className="flex items-center pb-4">
        <Button_1.Button className="p-1" {...prevButtonProps}>
          <react_maps_icons_1.Chevron direction="left"/>
        </Button_1.Button>
        <div className="flex-1 text-center font-bold text-md ml-2">{title}</div>
        <Button_1.Button className="p-1" {...nextButtonProps}>
          <react_maps_icons_1.Chevron direction="right"/>
        </Button_1.Button>
      </div>
      <CalendarGrid_1.CalendarGrid state={state}/>
    </div>);
};
exports.RangeCalendar = RangeCalendar;
