export const ELEMENT_SIZE = 150;
export const MAX_ALLOWED_OFFSET_LEFT = window.innerWidth - ELEMENT_SIZE;
export const MAX_ALLOWED_OFFSET_TOP = window.innerHeight - ELEMENT_SIZE;

export function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export function createRandomCoords() {
  const randomOffsetLeft = getRandomInt(MAX_ALLOWED_OFFSET_LEFT);
  const randomOffsetTop = getRandomInt(MAX_ALLOWED_OFFSET_TOP);
  return {
    left: randomOffsetLeft,
    right: randomOffsetLeft + ELEMENT_SIZE,
    top: randomOffsetTop,
    bottom: randomOffsetTop + ELEMENT_SIZE,
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
