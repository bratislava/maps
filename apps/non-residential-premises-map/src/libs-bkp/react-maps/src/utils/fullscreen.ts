interface ExtendedDocument extends Document {
  webkitFullscreenElement: any;
  mozFullScreenElement: any;
  msFullscreenElement: any;
  webkitExitFullscreen: any;
  mozCancelFullScreen: any;
  msExitFullscreen: any;
}

interface ExtendedElement extends Element {
  webkitRequestFullscreen: any;
  mozRequestFullScreen: any;
  msRequestFullscreen: any;
}

const DOCUMENT = document as ExtendedDocument;

export const getFullscreenElement = (): Element | null => {
  const element =
    DOCUMENT.fullscreenElement ??
    DOCUMENT.webkitFullscreenElement ??
    DOCUMENT.mozFullScreenElement ??
    DOCUMENT.msFullscreenElement;
  if (element) {
    return element as Element;
  }
  return null;
};

export const exitFullscreen = () => {
  if (DOCUMENT.exitFullscreen) {
    DOCUMENT.exitFullscreen();
  } else if (DOCUMENT.webkitExitFullscreen) {
    DOCUMENT.webkitExitFullscreen();
  } else if (DOCUMENT.mozCancelFullScreen) {
    DOCUMENT.mozCancelFullScreen();
  } else if (DOCUMENT.msExitFullscreen) {
    DOCUMENT.msExitFullscreen();
  }
};

export const requestFullscreen = (inputElement: Element) => {
  const element = inputElement as ExtendedElement;
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
};
