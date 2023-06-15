import { ICard } from "../types";

export const DEFAULT_ELEMENT_SIZE = 150;
export const MAX_ALLOWED_OFFSET_LEFT = window.innerWidth - DEFAULT_ELEMENT_SIZE;
export const MAX_ALLOWED_OFFSET_TOP = window.innerHeight - DEFAULT_ELEMENT_SIZE;

export function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export function createNewCard() {
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

export function isIntersecting(cards: ICard[], newCard: ICard) {
  const result = cards.some((card) => {
    return card.id !== newCard.id && (
      card.bottom > newCard.top 
    && card.right > newCard.left 
    && card.top < newCard.bottom 
    && card.left < newCard.right
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
