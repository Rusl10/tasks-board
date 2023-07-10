import { ICard, Point } from '../types';
import { nanoid } from 'nanoid';

export const DEFAULT_ELEMENT_SIZE = 150;

export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function createNewCard(canvasPosition: Point) {
  const maxLeftOffsetOnScreen = -canvasPosition.x + (window.innerWidth - DEFAULT_ELEMENT_SIZE);
  const maxTopOffsetOnScreen = -canvasPosition.y + (window.innerHeight - DEFAULT_ELEMENT_SIZE)
  const randomOffsetLeft = getRandomInt(-canvasPosition.x, maxLeftOffsetOnScreen);
  const randomOffsetTop = getRandomInt(-canvasPosition.y, maxTopOffsetOnScreen);
  return {
    text: '',
    id: nanoid(),
    left: randomOffsetLeft,
    top: randomOffsetTop,
    height: DEFAULT_ELEMENT_SIZE,
    width: DEFAULT_ELEMENT_SIZE,
  };
}

export function isIntersecting(cards: ICard[], newCard: ICard) {
  const result = cards.some((card) => {
    return (
      card.id !== newCard.id &&
      card.top + card.height > newCard.top &&
      card.left + card.width > newCard.left &&
      card.top < newCard.top + newCard.height &&
      card.left < newCard.left + newCard.width
    );
  });
  return result;
}

export function rafThrottle<T extends (...args: any[]) => any>(fn: T) {
  let rafId: number | null = null;

  function throttled(...args: Parameters<T>) {
    if (typeof rafId === 'number') {
      //console.log("cancel");
      return;
    }

    rafId = requestAnimationFrame(() => {
      fn.apply(null, args);
      rafId = null;
    });
  }

  throttled.cancel = () => {
    if (typeof rafId !== 'number') {
      return;
    }
    cancelAnimationFrame(rafId);
  };

  return throttled;
}
