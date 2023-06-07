import { useCombinedRef } from "../hooks/useCombinedRef";
import { useResizeObserver } from "../hooks/useResizeObserver";

export function SizeObserver({
  onResize,
  children
}) {
  const resizeRef = useResizeObserver(onResize);
  const combinedRef = useCombinedRef(resizeRef);

  return children(combinedRef);
}
