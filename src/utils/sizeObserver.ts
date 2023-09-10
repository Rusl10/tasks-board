export type ResizeFunc = (r: ResizeObserverEntry) => void;
export type DeregisterFunc = () => void;

type ObserverCallback =
  | ResizeFunc
  | {
      current: ResizeFunc;
    };

let observer: ResizeObserver | undefined;

const callBackMap = new WeakMap<Element, ObserverCallback[]>();

export function registerResizeObserverCb(
  node: Element,
  cb: ObserverCallback
): DeregisterFunc {
  if (!observer) {
    observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const maybeCallBacks = callBackMap.get(entry.target);
        const safeCallBacks = maybeCallBacks ?? [];

        if (safeCallBacks.length === 0) return;

        requestAnimationFrame(() => {
          for (const callback of safeCallBacks) {
            if (typeof callback === 'function') {
              callback(entry);
            } else {
              callback.current(entry);
            }
          }
        });
      }
    });
  }
  const callbacks = callBackMap.get(node) ?? [];

  callBackMap.set(node, callbacks.concat(cb));
  observer.observe(node);

  return () => {
    if (observer) {
      const maybeCallBacks = callBackMap.get(node);
      const safeCallBacks = maybeCallBacks ?? [];
      const newCallbacks = safeCallBacks.filter((ref) => ref !== cb);

      callBackMap.set(node, newCallbacks);

      if (newCallbacks.length === 0) {
        observer.unobserve(node);
        callBackMap.delete(node);
      }
    }
  };
}
