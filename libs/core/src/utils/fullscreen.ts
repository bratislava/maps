export const getFullscreenElement = (): Element | null => {
  const element =
    document['fullscreenElement'] ??
    document['webkitFullscreenElement'] ??
    document['mozFullScreenElement'] ??
    document['msFullscreenElement'];
  if (element) {
    return element as Element;
  }
  return null;
};

export const exitFullscreen = () => {
  if (document['exitFullscreen']) {
    document['exitFullscreen']();
  } else if (document['webkitExitFullscreen']) {
    document['webkitExitFullscreen']();
  } else if (document['mozCancelFullScreen']) {
    document['mozCancelFullScreen']();
  } else if (document['msExitFullscreen']) {
    document['msExitFullscreen']();
  }
};

export const requestFullscreen = (element: Element) => {
  if (element['requestFullscreen']) {
    element['requestFullscreen']();
  } else if (element['webkitRequestFullscreen']) {
    element['webkitRequestFullscreen']();
  } else if (element['mozRequestFullScreen']) {
    element['mozRequestFullScreen']();
  } else if (element['msRequestFullscreen']) {
    element['msRequestFullscreen']();
  }
};
