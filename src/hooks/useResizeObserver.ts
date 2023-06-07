import { useRef } from "react";
import { useEvent } from "./useEvent";

export function useResizeObserver(onResize: ResizeObserverCallback) {
  const roRef = useRef<ResizeObserver | null>(null);

  const attachResizeObserver = useEvent(
    (element: HTMLElement) => {
      const resizeObserver = new ResizeObserver(onResize);
      resizeObserver.observe(element);
      roRef.current = resizeObserver;
    }
  );

  const detachResizeObserver = useEvent(() => {
    roRef.current?.disconnect();
  });

  const refCb = useEvent(
    (element: HTMLElement | null) => {
      if (element) {
        attachResizeObserver(element);
      } else {
        detachResizeObserver();
      }
    }
  );

  return refCb;
}
