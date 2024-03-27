"use strict";
exports.__esModule = true;
var RoundedIconButon = function (_a) {
    var children = _a.children, onClick = _a.onClick, icon = _a.icon, _b = _a.bgColor, bgColor = _b === void 0 ? 'black' : _b, _c = _a.txtColor, txtColor = _c === void 0 ? 'black' : _c;
    return (<button style={{ backgroundColor: bgColor, color: txtColor }} className={'mr-2 mb-2 flex h-9 items-center justify-center gap-2 rounded-full px-4 font-semibold text-[white]'} onClick={onClick}>
      {icon} {children}
    </button>);
};
exports["default"] = RoundedIconButon;
