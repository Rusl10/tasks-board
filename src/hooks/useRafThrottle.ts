import { useEffect, useMemo } from "react";
import { rafThrottle } from "../utils/index";
import { useEvent } from "./useEvent";

export function useRafThrottle<Fn extends (...args: any[]) => any>(fn: Fn) {
  const memoizedFn = useEvent(fn);

  const throttledFn = useMemo(
    () =>
      rafThrottle((...args: Parameters<Fn>) => {
        memoizedFn(...args);
      }),
    []
  );

  useEffect(
    () => () => {
      throttledFn.cancel();
    },
    [throttledFn]
  );

  return throttledFn;
}
