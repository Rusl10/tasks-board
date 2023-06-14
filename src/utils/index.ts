export const DEFAULT_ELEMENT_SIZE = 150;
export const MAX_ALLOWED_OFFSET_LEFT = window.innerWidth - DEFAULT_ELEMENT_SIZE;
export const MAX_ALLOWED_OFFSET_TOP = window.innerHeight - DEFAULT_ELEMENT_SIZE;

export function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export function newUserCoordsObj(mouseMovePageX, mouseMovePageY, diffX, diffY, id, height) {
  const calcLeftFromDiff = mouseMovePageX -  diffX;
  const calcTopFromDiff = mouseMovePageY -  diffY;
  return {
    id,
    height,
    left: calcLeftFromDiff,
    right: calcLeftFromDiff +  DEFAULT_ELEMENT_SIZE,
    top: calcTopFromDiff,
    bottom: calcTopFromDiff + height,
  }
}

export function createRandomCoords() {
  const randomOffsetLeft = getRandomInt(MAX_ALLOWED_OFFSET_LEFT);
  const randomOffsetTop = getRandomInt(MAX_ALLOWED_OFFSET_TOP);
  return {
    left: randomOffsetLeft,
    right: randomOffsetLeft + DEFAULT_ELEMENT_SIZE,
    top: randomOffsetTop,
    bottom: randomOffsetTop + DEFAULT_ELEMENT_SIZE,
    height: DEFAULT_ELEMENT_SIZE
  }
}

export function isIntersecting(coords, newElCoords) {
  const result = coords.some((coord) => {
    return coord.id !== newElCoords.id && (
      coord.bottom > newElCoords.top 
    && coord.right > newElCoords.left 
    && coord.top < newElCoords.bottom 
    && coord.left < newElCoords.right
  ); 
  });
  return result;
}

export function rafThrottle<T extends (...args: any[]) => any>(fn: T) {
  let rafId: number | null = null;

  function throttled(...args: Parameters<T>) {
    if (typeof rafId === "number") {
      //console.log("cancel");
      return;
    }

    rafId = requestAnimationFrame(() => {
      fn.apply(null, args);
      rafId = null;
    });
  }

  throttled.cancel = () => {
    if (typeof rafId !== "number") {
      return;
    }
    cancelAnimationFrame(rafId);
  };

  return throttled;
}
