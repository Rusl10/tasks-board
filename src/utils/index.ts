import { nanoid } from 'nanoid';

export const DEFAULT_ELEMENT_SIZE = 150;

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export function createInitialCard() {
  const maxLeftOffsetOnScreen = window.innerWidth - DEFAULT_ELEMENT_SIZE;
  const maxTopOffsetOnScreen = window.innerHeight - DEFAULT_ELEMENT_SIZE;
  const randomOffsetLeft = getRandomInt(maxLeftOffsetOnScreen);
  const randomOffsetTop = getRandomInt(maxTopOffsetOnScreen);

  return {
    text: '',
    id: nanoid(),
    left: randomOffsetLeft,
    top: randomOffsetTop,
    height: DEFAULT_ELEMENT_SIZE,
    width: DEFAULT_ELEMENT_SIZE,
  };
}

export function rafThrottle<T extends (...args: any[]) => any>(fn: T) {
  let rafId: number | null = null;

  function throttled(...args: Parameters<T>) {
    if (typeof rafId === 'number') {
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
