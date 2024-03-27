"use strict";
exports.__esModule = true;
exports.Swiper = void 0;
var framer_motion_1 = require("framer-motion");
var popmotion_1 = require("popmotion");
var react_1 = require("react");
var variants = {
    enter: function (direction) {
        return {
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        };
    },
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1
    },
    exit: function (direction) {
        return {
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        };
    }
};
var swipeConfidenceThreshold = 10000;
var swipePower = function (offset, velocity) {
    return Math.abs(offset) * velocity;
};
exports.Swiper = (0, react_1.forwardRef)(function (_a, forwardedRef) {
    var pages = _a.pages, _b = _a.autoSwipeDuration, autoSwipeDuration = _b === void 0 ? 0 : _b, initialPage = _a.initialPage, _c = _a.allowKeyboardNavigation, allowKeyboardNavigation = _c === void 0 ? false : _c, Pagination = _a.pagination;
    var _d = (0, react_1.useState)([initialPage !== null && initialPage !== void 0 ? initialPage : 0, 0]), _e = _d[0], page = _e[0], direction = _e[1], setPage = _d[1];
    var _f = (0, react_1.useState)(false), isDragging = _f[0], setDragging = _f[1];
    var index = (0, popmotion_1.wrap)(0, pages.length, page);
    var paginate = (0, react_1.useCallback)(function (newDirection) {
        setPage(function (_a) {
            var currentPage = _a[0];
            return [currentPage + newDirection, newDirection];
        });
    }, []);
    var goToNext = (0, react_1.useCallback)(function () {
        paginate(1);
    }, [paginate]);
    var goToPrevious = (0, react_1.useCallback)(function () {
        paginate(-1);
    }, [paginate]);
    var dragEndHandler = (0, react_1.useCallback)(function (event, _a) {
        var offset = _a.offset, velocity = _a.velocity;
        var swipe = swipePower(offset.x, velocity.x);
        if (swipe < -swipeConfidenceThreshold) {
            goToNext();
        }
        else if (swipe > swipeConfidenceThreshold) {
            goToPrevious();
        }
        setDragging(false);
        // TODO test - keep the event, should allow mobile to open context menu
        return true;
    }, [goToNext, goToPrevious]);
    var dragStartHandler = (0, react_1.useCallback)(function () {
        setDragging(true);
        // TODO test - keep the event, should allow mobile to open context menu
        return true;
    }, []);
    (0, react_1.useEffect)(function () {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        if (!autoSwipeDuration || isDragging || pages.length < 2)
            return function () { };
        var timer = setInterval(function () {
            paginate(1);
        }, autoSwipeDuration);
        return function () { return clearInterval(timer); };
    }, [autoSwipeDuration, paginate, isDragging, pages]);
    var goToPage = (0, react_1.useCallback)(function (goToIndex) {
        var newDirection = index < goToIndex ? 1 : -1;
        setPage([goToIndex, newDirection]);
    }, [index]);
    var keyUpHandler = (0, react_1.useCallback)(function (e) {
        if (!allowKeyboardNavigation)
            return;
        if (e.code === "ArrowLeft") {
            e.preventDefault();
            e.stopPropagation();
            goToPrevious();
            return;
        }
        if (e.code === "ArrowRight") {
            e.stopPropagation();
            e.preventDefault();
            goToNext();
        }
    }, [goToNext, goToPrevious, allowKeyboardNavigation]);
    return (<div tabIndex={0} ref={forwardedRef} onKeyUp={keyUpHandler} role="application" className="relative z-0 flex h-full w-full items-center justify-center overflow-hidden outline-none">
        <framer_motion_1.AnimatePresence initial={false} custom={direction}>
          <framer_motion_1.motion.div className="absolute h-full w-full outline-none" key={page} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
        }} drag={pages.length > 1 ? "x" : undefined} dragConstraints={{ left: 0, right: 0 }} dragElastic={1} onDragStart={dragStartHandler} onDragEnd={dragEndHandler}>
            {pages[index]}
          </framer_motion_1.motion.div>
        </framer_motion_1.AnimatePresence>
        {Pagination && (<Pagination count={pages.length} activeIndex={index} goToPage={goToPage} goToNext={goToNext} goToPrevious={goToPrevious}/>)}
      </div>);
});
exports.Swiper.displayName = "Swiper";
